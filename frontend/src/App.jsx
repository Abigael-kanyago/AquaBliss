import React, { useState, useEffect, useRef } from 'react';
import AdminPortal from './components/AdminPortal';
import AquaBlissLogo from './components/AquaBlissLogo';
import bannerImg from './assets/banner.jpg';
import whatsappImg from './assets/whatsapp.png';

export default function App() {
  // Prices state (with live sync from backend)
  const [prices, setPrices] = useState({
    refill_price_per_liter: 10,
    bottle_cost: 180,
    pump_cost: 250,
    packaged_price_20l: 180,
    branding_cost: 100,
  });

  // Active form ('refill', 'packaged', or null)
  const [activeForm, setActiveForm] = useState(null);

  // Refill Form State
  const [refillName, setRefillName] = useState('');
  const [refillEmail, setRefillEmail] = useState('');
  const [refillBottle, setRefillBottle] = useState('no');
  const [refillPump, setRefillPump] = useState('no');
  const [refillAddress, setRefillAddress] = useState('');
  const [refillPhone, setRefillPhone] = useState('');
  const [refillLiters, setRefillLiters] = useState(1);
  const [refillSubmitting, setRefillSubmitting] = useState(false);

  // Packaged Form State
  const [pkgName, setPkgName] = useState('');
  const [pkgEmail, setPkgEmail] = useState('');
  const [pkgBrand, setPkgBrand] = useState('no');
  const [pkgAddress, setPkgAddress] = useState('');
  const [pkgPhone, setPkgPhone] = useState('');
  const [pkgQuantity, setPkgQuantity] = useState(1);
  const [pkgSubmitting, setPkgSubmitting] = useState(false);

  // Modals
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);

  const refillFormRef = useRef(null);
  const pkgFormRef = useRef(null);

  // Fetch prices from backend
  const fetchPrices = async () => {
    try {
      const res = await fetch('/get-prices');
      const data = await res.json();
      if (data.success && Array.isArray(data.prices)) {
        const pObj = {};
        data.prices.forEach((item) => {
          pObj[item.key] = parseFloat(item.value);
        });
        setPrices((prev) => ({ ...prev, ...pObj }));
      }
    } catch (err) {
      console.error('Failed to fetch prices:', err);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  // Compute live prices
  const refillTotalPrice =
    (parseInt(refillLiters) || 0) * (prices.refill_price_per_liter || 10) +
    (refillBottle === 'yes' ? prices.bottle_cost || 180 : 0) +
    (refillPump === 'yes' ? prices.pump_cost || 250 : 0);

  const packagedTotalPrice =
    (parseInt(pkgQuantity) || 0) * (prices.packaged_price_20l || 180) +
    (pkgBrand === 'yes' ? prices.branding_cost || 100 : 0);

  // Toggle Form Visibility
  const toggleForm = (type) => {
    if (activeForm === type) {
      setActiveForm(null);
    } else {
      setActiveForm(type);
      setTimeout(() => {
        const targetRef = type === 'refill' ? refillFormRef : pkgFormRef;
        if (targetRef.current) {
          targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    }
  };

  // Handle Refill Submit
  const handleRefillSubmit = async (e) => {
    e.preventDefault();
    setRefillSubmitting(true);

    const payload = {
      name: refillName,
      email: refillEmail,
      address: refillAddress,
      phone: String(refillPhone),
      order_type: 'refill',
      liters: parseInt(refillLiters) || 1,
      bottle: refillBottle,
      pump: refillPump,
      total_price: refillTotalPrice,
    };

    try {
      const res = await fetch('/submit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShowSuccessModal(true);
        // Reset form
        setRefillName('');
        setRefillEmail('');
        setRefillBottle('no');
        setRefillPump('no');
        setRefillAddress('');
        setRefillPhone('');
        setRefillLiters(1);
        setActiveForm(null);
      } else {
        alert('Error: ' + (data.message || 'Could not place order.'));
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again or contact us via WhatsApp.');
    } finally {
      setRefillSubmitting(false);
    }
  };

  // Handle Packaged Submit
  const handlePackagedSubmit = async (e) => {
    e.preventDefault();
    setPkgSubmitting(true);

    const payload = {
      name: pkgName,
      email: pkgEmail,
      address: pkgAddress,
      phone: String(pkgPhone),
      order_type: 'packaged',
      quantity: parseInt(pkgQuantity) || 1,
      brand: pkgBrand,
      total_price: packagedTotalPrice,
    };

    try {
      const res = await fetch('/submit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShowSuccessModal(true);
        // Reset form
        setPkgName('');
        setPkgEmail('');
        setPkgBrand('no');
        setPkgAddress('');
        setPkgPhone('');
        setPkgQuantity(1);
        setActiveForm(null);
      } else {
        alert('Error: ' + (data.message || 'Could not place order.'));
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again or contact us via WhatsApp.');
    } finally {
      setPkgSubmitting(false);
    }
  };

  return (
    <div>
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="success-modal" onClick={(e) => e.stopPropagation()}>
            <span className="success-icon">✅</span>
            <h2>Order Successful!</h2>
            <p>
              Thank you for choosing AquaBliss. We have received your order and will contact you shortly to confirm delivery.
            </p>
            <button className="modal-btn" onClick={() => setShowSuccessModal(false)}>
              Great!
            </button>
          </div>
        </div>
      )}


      {/* Clean Static Header */}
      <header className="main-header">
        <div className="header-container">
          <a href="#" className="header-brand">
            <AquaBlissLogo size={42} />
            <div className="header-brand-text">
              <h1>AquaBliss</h1>
              <p>Pure Water, Pure Bliss</p>
            </div>
          </a>
          <nav className="header-nav">
            <button className="header-btn" onClick={() => toggleForm('refill')}>
              Order Refill
            </button>
            <button className="header-btn header-btn-outline" onClick={() => toggleForm('packaged')}>
              Packaged Water
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Banner with New Visual */}
      <section className="hero-banner" id="home">
        <div className="banner-wrapper">
          <img
            src={bannerImg}
            alt="Order Your Water for an Instant Doorstep Delivery - AquaBliss"
            className="banner-image"
          />
          {/* Interactive hotspot over the 'Order Now' button in the banner */}
          <button
            type="button"
            className="banner-order-hotspot"
            onClick={() => toggleForm('refill')}
            title="Order Water Now"
            aria-label="Order Water Now"
          >
            <span className="sr-only">Order Now</span>
          </button>
        </div>
      </section>

      {/* Dynamic Water Wave Transition */}
      <div className="wave-separator">
        <svg
          className="waves"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g className="parallax-waves">
            <use href="#gentle-wave" x="48" y="0" fill="rgba(0, 150, 255, 0.12)" />
            <use href="#gentle-wave" x="48" y="3" fill="rgba(72, 202, 228, 0.28)" />
            <use href="#gentle-wave" x="48" y="5" fill="rgba(0, 119, 204, 0.2)" />
            <use href="#gentle-wave" x="48" y="7" fill="#f0f8ff" />
          </g>
        </svg>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/254743970594"
        target="_blank"
        rel="noreferrer"
        className="whatsapp-float"
        title="Chat with us on WhatsApp"
      >
        <img src={whatsappImg} alt="WhatsApp Chat" />
      </a>

      {/* Services Section */}
      <section id="services" className="services">
        <div className="card">
          <h3>Water Refilling</h3>
          <p>We deliver clean refilled water to your home or office.</p>
          <button className="btn" onClick={() => toggleForm('refill')}>
            Order Now
          </button>
        </div>
        <div className="card">
          <h3>Packaged Water</h3>
          <p>Buy sealed, labeled bottled water with optional branding.</p>
          <button className="btn" onClick={() => toggleForm('packaged')}>
            Order Now
          </button>
        </div>
      </section>

      {/* Refill Form */}
      {activeForm === 'refill' && (
        <div id="refill-form" className="form-section show" ref={refillFormRef}>
          <h2>Water Refilling Order</h2>
          <form onSubmit={handleRefillSubmit}>
            <label htmlFor="name">Full Name:</label>
            <input
              type="text"
              id="name"
              required
              value={refillName}
              onChange={(e) => setRefillName(e.target.value)}
            />

            <label htmlFor="email">Email Address:</label>
            <input
              type="email"
              id="email"
              required
              value={refillEmail}
              onChange={(e) => setRefillEmail(e.target.value)}
            />

            <label htmlFor="bottle">Do you need a bottle?</label>
            <select
              id="bottle"
              value={refillBottle}
              onChange={(e) => setRefillBottle(e.target.value)}
            >
              <option value="no">No, I have my own</option>
              <option value="yes">Yes (+KSh {prices.bottle_cost || 180})</option>
            </select>

            <label htmlFor="pump">Do you need a pump?</label>
            <select
              id="pump"
              value={refillPump}
              onChange={(e) => setRefillPump(e.target.value)}
            >
              <option value="no">No</option>
              <option value="yes">Yes (+KSh {prices.pump_cost || 250})</option>
            </select>

            <label htmlFor="address">Delivery Address:</label>
            <input
              type="text"
              id="address"
              required
              value={refillAddress}
              onChange={(e) => setRefillAddress(e.target.value)}
            />

            <label htmlFor="phone">Phone Number:</label>
            <input
              type="tel"
              id="phone"
              required
              value={refillPhone}
              onChange={(e) => setRefillPhone(e.target.value)}
            />

            <label htmlFor="liters">Liters of water:</label>
            <input
              type="number"
              id="liters"
              min="1"
              required
              value={refillLiters}
              onChange={(e) => setRefillLiters(Math.max(1, parseInt(e.target.value) || 1))}
            />

            <p className="price-box">
              <strong>Total Price: KSh <span>{refillTotalPrice}</span></strong>
            </p>

            <button type="submit" className="btn full" disabled={refillSubmitting}>
              {refillSubmitting ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
      )}

      {/* Packaged Form */}
      {activeForm === 'packaged' && (
        <div id="packaged-form" className="form-section show" ref={pkgFormRef}>
          <h2>Packaged Water Order</h2>
          <form onSubmit={handlePackagedSubmit}>
            <label htmlFor="name-p">Full Name:</label>
            <input
              type="text"
              id="name-p"
              required
              value={pkgName}
              onChange={(e) => setPkgName(e.target.value)}
            />

            <label htmlFor="email-p">Email Address:</label>
            <input
              type="email"
              id="email-p"
              required
              value={pkgEmail}
              onChange={(e) => setPkgEmail(e.target.value)}
            />

            <label htmlFor="brand">Do you want it branded?</label>
            <select
              id="brand"
              value={pkgBrand}
              onChange={(e) => setPkgBrand(e.target.value)}
            >
              <option value="no">No</option>
              <option value="yes">Yes (+KSh {prices.branding_cost || 100})</option>
            </select>

            <label htmlFor="address-p">Delivery Address:</label>
            <input
              type="text"
              id="address-p"
              required
              value={pkgAddress}
              onChange={(e) => setPkgAddress(e.target.value)}
            />

            <label htmlFor="phone-p">Phone Number:</label>
            <input
              type="tel"
              id="phone-p"
              required
              value={pkgPhone}
              onChange={(e) => setPkgPhone(e.target.value)}
            />

            <label htmlFor="quantity">Quantity of 20L bottles:</label>
            <input
              type="number"
              id="quantity"
              min="1"
              required
              value={pkgQuantity}
              onChange={(e) => setPkgQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            />

            <p className="price-box">
              <strong>Total Price: KSh <span>{packagedTotalPrice}</span></strong>
            </p>

            <button type="submit" className="btn full" disabled={pkgSubmitting}>
              {pkgSubmitting ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          {/* Column 1 */}
          <div className="footer-col">
            <h2 className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AquaBlissLogo size={32} />
              <span>AquaBliss</span>
            </h2>
            <p>
              Refresh your life with clean, pure water. Delivered with care and commitment every day.
            </p>
            <ul className="footer-checks">
              <li>Free Delivery</li>
              <li>Secure Payment Options</li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="footer-col">
            <h3>Locations</h3>
            <p>
              Along garissa road<br />
              oryx makongeni<br />
              Email: aquabliss217@gmail.com<br />
              0743970594/0708045932
            </p>
          </div>

          {/* Column 3 */}
          <div className="footer-col">
            <h3>Business Hours</h3>
            <p>Sunday - Friday: 09:00 am to 9:30 pm</p>
            <p>Welcome to your perfect water spot</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} AquaBliss. All Rights Reserved.</p>
          <p>
            <a href="#">Terms & Conditions</a> |{' '}
            <a href="#">Privacy Policy</a> |{' '}
            <a href="#">Sitemap</a>
          </p>
          <button
            onClick={() => setShowAdminModal(true)}
            className="admin-link"
          >
            Admin Portal
          </button>
        </div>
      </footer>

      {/* Admin Portal Modal */}
      <AdminPortal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        onPricesUpdated={fetchPrices}
      />
    </div>
  );
}
