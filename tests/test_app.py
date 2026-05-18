"""
Tests for AquaBliss Flask application.

Run with:
    pytest tests/ -v
"""

import json
import os
import pytest

# Set required env vars before importing the app so it doesn't raise on startup.
os.environ.setdefault("SECRET_KEY", "test-secret-key")
os.environ.setdefault("ADMIN_USERNAME", "testadmin")
os.environ.setdefault("ADMIN_PASSWORD", "testpass123")


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture
def client(mocker):
    """
    Return a Flask test client with the database and email calls mocked out
    so tests run without a real PostgreSQL instance or SMTP server.
    """
    # Mock init_db so the app can be imported without a live DB.
    mocker.patch("app.init_db")

    # Mock get_db_connection by default to return a mock connection and cursor
    from werkzeug.security import generate_password_hash
    hashed = generate_password_hash("testpass123")
    
    mock_conn = mocker.MagicMock()
    mock_cur = mocker.MagicMock()
    
    # fetchone returns our test user
    mock_cur.fetchone.return_value = {
        "id": 1,
        "username": "testadmin",
        "password_hash": hashed,
        "role": "admin"
    }
    mock_conn.cursor.return_value = mock_cur
    
    mocker.patch("app.get_db_connection", return_value=mock_conn)

    from app import app as flask_app

    flask_app.config["TESTING"] = True
    flask_app.config["WTF_CSRF_ENABLED"] = False

    with flask_app.test_client() as client:
        yield client


@pytest.fixture
def admin_client(client):
    """Return a test client that is already authenticated as admin."""
    client.post(
        "/login",
        data={"username": "testadmin", "password": "testpass123"},
        follow_redirects=False,
    )
    return client


# ---------------------------------------------------------------------------
# Validation helper tests (no DB / network required)
# ---------------------------------------------------------------------------

def test_validate_email_valid():
    from app import validate_email
    assert validate_email("user@example.com") is True
    assert validate_email("user.name+tag@sub.domain.org") is True


def test_validate_email_invalid():
    from app import validate_email
    assert validate_email("not-an-email") is False
    assert validate_email("missing@tld") is False
    assert validate_email("@nodomain.com") is False


def test_validate_phone_valid():
    from app import validate_phone
    assert validate_phone("+254712345678") is True
    assert validate_phone("0712 345 678") is True


def test_validate_phone_invalid():
    from app import validate_phone
    assert validate_phone("abc") is False
    assert validate_phone("123") is False  # too short


def test_sanitize_string_strips_whitespace():
    from app import sanitize_string
    assert sanitize_string("  hello  ") == "hello"


def test_sanitize_string_truncates():
    from app import sanitize_string
    long_string = "a" * 300
    assert len(sanitize_string(long_string, max_length=255)) == 255


# ---------------------------------------------------------------------------
# Route tests
# ---------------------------------------------------------------------------

def test_index_returns_200(client):
    response = client.get("/")
    assert response.status_code == 200


def test_login_page_loads(client):
    response = client.get("/login")
    assert response.status_code == 200


def test_login_with_valid_credentials(client):
    response = client.post(
        "/login",
        data={"username": "testadmin", "password": "testpass123"},
        follow_redirects=False,
    )
    # Should redirect to /orders on success.
    assert response.status_code == 302


def test_login_with_invalid_credentials(client):
    response = client.post(
        "/login",
        data={"username": "wrong", "password": "wrong"},
        follow_redirects=True,
    )
    assert response.status_code == 200
    assert b"Invalid" in response.data


def test_orders_requires_login(client):
    response = client.get("/orders", follow_redirects=False)
    assert response.status_code == 302
    assert "/login" in response.headers["Location"]


def test_submit_order_rejects_missing_fields(client, mocker):
    mocker.patch("app.get_db_connection")  # prevent real DB call
    response = client.post(
        "/submit-order",
        json={"name": "Alice"},  # missing email, address, order_type
        content_type="application/json",
    )
    data = json.loads(response.data)
    assert response.status_code == 400
    assert data["success"] is False
    assert "Missing fields" in data["message"]


def test_submit_order_rejects_invalid_email(client, mocker):
    mocker.patch("app.get_db_connection")
    response = client.post(
        "/submit-order",
        json={
            "name": "Alice",
            "email": "not-valid",
            "address": "123 Nairobi",
            "order_type": "refill",
            "liters": 10,
        },
        content_type="application/json",
    )
    data = json.loads(response.data)
    assert response.status_code == 400
    assert "email" in data["message"].lower()


def test_submit_order_rejects_invalid_order_type(client, mocker):
    mocker.patch("app.get_db_connection")
    response = client.post(
        "/submit-order",
        json={
            "name": "Alice",
            "email": "alice@example.com",
            "address": "123 Nairobi",
            "order_type": "free_water",  # not allowed
        },
        content_type="application/json",
    )
    data = json.loads(response.data)
    assert response.status_code == 400
    assert "Invalid order type" in data["message"]


def test_update_order_status_rejects_invalid_status(admin_client, mocker):
    mocker.patch("app.get_db_connection")
    response = admin_client.post(
        "/update-order-status/1",
        json={"status": "hacked"},
        content_type="application/json",
    )
    data = json.loads(response.data)
    assert response.status_code == 400
    assert data["success"] is False


def test_404_returns_json(client):
    response = client.get("/this-route-does-not-exist")
    assert response.status_code == 404
    data = json.loads(response.data)
    assert "error" in data
