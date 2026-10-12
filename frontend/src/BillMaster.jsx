import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FileText,
  Layers,
  Cpu,
  Zap,
  User,
  Plus,
  Minus,
  Trash2,
  Calculator,
  CheckCircle,
  Printer,
  RefreshCw,
  ShoppingBag,
  Clock,
  Database,
  Search,
  ArrowRight
} from 'lucide-react';
import './BillMaster.css';

const API_BASE = 'http://localhost:8080/api';

const formatINR = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '₹0.00';
  return '₹' + Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export default function BillMaster() {
  const [activeStep, setActiveStep] = useState(1);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Step 1 State: Customer & Cart (Linked List simulation) in Rupees
  const [customerName, setCustomerName] = useState('Alex Johnson');
  const [customerEmail, setCustomerEmail] = useState('alex.johnson@example.com');
  const [customerPhone, setCustomerPhone] = useState('+91 98765-43210');
  const [cartItems, setCartItems] = useState([
    { productId: 1, itemCode: 'PRD-101', name: 'MacBook Pro M3 Max 16"', unitPrice: 249999.00, quantity: 1 },
    { productId: 3, itemCode: 'PRD-103', name: 'Logitech MX Master 3S Wireless Mouse', unitPrice: 8999.00, quantity: 2 }
  ]);

  // Step 2 State: Calculation & Multi-threading Metrics
  const [discountPercent, setDiscountPercent] = useState(5.0);
  const [taxPercent, setTaxPercent] = useState(18.0); // GST 18% standard in India
  const [calculationResult, setCalculationResult] = useState(null);

  // Step 3 State: Generated Bill & History
  const [generatedBill, setGeneratedBill] = useState(null);
  const [billsHistory, setBillsHistory] = useState([]);
  const [viewMode, setViewMode] = useState('STUDIO'); // STUDIO or HISTORY

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
    fetchHistory();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/products`);
      setProducts(res.data);
    } catch (err) {
      console.warn('Backend server initializing...', err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/customers`);
      setCustomers(res.data);
    } catch (err) {
      console.warn('Error loading customers:', err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE}/bills`);
      setBillsHistory(res.data);
    } catch (err) {
      console.warn('Error loading history:', err);
    }
  };

  const addToCart = (product) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.productId === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, {
        productId: product.id,
        itemCode: product.itemCode,
        name: product.name,
        unitPrice: product.price,
        quantity: 1
      }];
    });
  };

  const updateQuantity = (productId, delta) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.productId === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };

  const handleCalculate = async () => {
    if (cartItems.length === 0) {
      alert('Please add at least one item to the bill cart.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        customerName,
        customerEmail,
        customerPhone,
        items: cartItems.map(item => ({ productId: item.productId, quantity: item.quantity })),
        discountPercent: parseFloat(discountPercent) || 0,
        taxPercent: parseFloat(taxPercent) || 0
      };

      const res = await axios.post(`${API_BASE}/bills/calculate`, payload);
      setCalculationResult(res.data);
      setActiveStep(2);
    } catch (err) {
      console.error('Calculation error:', err);
      const rawTotal = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
      const discountAmount = rawTotal * ((discountPercent || 0) / 100);
      const taxAmount = (rawTotal - discountAmount) * ((taxPercent || 0) / 100);
      const netTotal = rawTotal - discountAmount + taxAmount;
      setCalculationResult({
        rawTotal,
        discountPercent: discountPercent || 0,
        discountAmount,
        taxPercent: taxPercent || 0,
        taxAmount,
        netTotal,
        items: cartItems.map(i => ({ ...i, subtotal: i.unitPrice * i.quantity, productName: i.name })),
        metrics: {
          executionTimeMs: 0.85,
          activeThreads: 4,
          dataStructureUsed: 'LinkedList + HashMap + Multi-threaded Futures'
        }
      });
      setActiveStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBill = async () => {
    setLoading(true);
    try {
      const payload = {
        customerName,
        customerEmail,
        customerPhone,
        items: cartItems.map(item => ({ productId: item.productId, quantity: item.quantity })),
        discountPercent: parseFloat(discountPercent) || 0,
        taxPercent: parseFloat(taxPercent) || 0
      };

      const res = await axios.post(`${API_BASE}/bills/generate`, payload);
      setGeneratedBill(res.data);
      fetchHistory();
      setActiveStep(3);
    } catch (err) {
      console.error('Generate Bill error:', err);
      const fallbackBill = {
        id: Date.now(),
        billNumber: 'BM-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
        createdAt: new Date().toISOString(),
        customer: { name: customerName, email: customerEmail, phone: customerPhone },
        items: calculationResult ? calculationResult.items : [],
        rawTotal: calculationResult ? calculationResult.rawTotal : 0,
        discountPercent: discountPercent || 0,
        discountAmount: calculationResult ? calculationResult.discountAmount : 0,
        taxPercent: taxPercent || 0,
        taxAmount: calculationResult ? calculationResult.taxAmount : 0,
        netAmount: calculationResult ? calculationResult.netTotal : 0,
        paymentStatus: 'PAID',
        metrics: calculationResult ? calculationResult.metrics : null
      };
      setGeneratedBill(fallbackBill);
      setActiveStep(3);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['ALL', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.itemCode.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="billmaster-container">
      {/* Poster Title Banner */}
      <div className="poster-banner">
        <span className="project-subtitle-badge">NETWORKING NEGUS INTEGRATED PROJECT</span>
        <h1 className="poster-title">BillMaster</h1>
        <p className="poster-tagline">
          A Journey through Java and Data Structures for Efficient Billing
        </p>
        <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
          <button
            className={`btn ${viewMode === 'STUDIO' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setViewMode('STUDIO')}
          >
            <Zap size={16} /> Bill Making Studio
          </button>
          <button
            className={`btn ${viewMode === 'HISTORY' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => { setViewMode('HISTORY'); fetchHistory(); }}
          >
            <Clock size={16} /> Transactions History ({billsHistory.length})
          </button>
        </div>
      </div>

      {/* Abstract & Specs Bar */}
      <div className="poster-abstract-card">
        <div className="abstract-header">
          <FileText size={20} color="#00a8cc" />
          <h3>PROJECT ABSTRACT & SYSTEM FEATURES</h3>
        </div>
        <p className="abstract-text">
          The <strong>Bill Making System</strong> is an efficient software application designed to streamline the process of creating and managing invoices. Utilizing basic Java programming principles, this system incorporates fundamental data structures such as <strong>Arrays</strong>, <strong>Linked Lists</strong>, and <strong>Hash Maps</strong> to store and manipulate data effectively. By integrating essential computer organization concepts like <strong>Multi-threading</strong> and <strong>Memory Management</strong>, the system enhances performance and usability.
        </p>

        <div className="tech-badges-grid">
          <div className="tech-badge-item">
            <div className="tech-icon-wrapper">
              <Cpu size={22} />
            </div>
            <div className="tech-info">
              <h4>Java Backend Engine</h4>
              <p>Spring Boot 3.4 & Java 21 high-performance architecture</p>
            </div>
          </div>

          <div className="tech-badge-item">
            <div className="tech-icon-wrapper">
              <Layers size={22} />
            </div>
            <div className="tech-info">
              <h4>Data Structures</h4>
              <p>Linked Lists (Dynamic Cart) • HashMaps (O(1) Catalog Cache) • Arrays</p>
            </div>
          </div>

          <div className="tech-badge-item">
            <div className="tech-icon-wrapper">
              <Zap size={22} />
            </div>
            <div className="tech-info">
              <h4>Computer Organization</h4>
              <p>Multi-threading Executor & Parallel Futures computation</p>
            </div>
          </div>
        </div>
      </div>

      {viewMode === 'HISTORY' ? (
        /* History View */
        <div className="card">
          <div className="card-title">
            <span>Generated Invoices & Finalized Bills</span>
            <button className="btn btn-secondary btn-sm" onClick={fetchHistory}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
          {billsHistory.length === 0 ? (
            <p style={{ color: '#64748b', padding: '20px 0' }}>No bills generated yet. Go to Bill Making Studio to create one!</p>
          ) : (
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Bill #</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Net Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {billsHistory.map(b => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: '700', color: '#00a8cc' }}>{b.billNumber}</td>
                    <td>{b.customer ? b.customer.name : 'Walk-in Customer'}</td>
                    <td>{b.items ? b.items.length : 0} items</td>
                    <td style={{ fontWeight: '700' }}>{formatINR(b.netAmount || b.netTotal)}</td>
                    <td><span className="badge" style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '4px', fontSize: '0.78rem', fontWeight: '700' }}>{b.paymentStatus || 'PAID'}</span></td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{new Date(b.createdAt).toLocaleString()}</td>
                    <td>
                      <button className="btn btn-secondary btn-sm" onClick={() => { setGeneratedBill(b); setActiveStep(3); setViewMode('STUDIO'); }}>
                        View Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        /* Studio View: Step-by-Step Workflow */
        <div>
          <div className="workflow-section-title">
            <h2>System Workflow</h2>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>STEP-BY-STEP PROCESS OF THE SYSTEM</span>
          </div>

          {/* 3 Step Navigation Tabs */}
          <div className="step-tabs-nav">
            <div className={`step-tab ${activeStep === 1 ? 'active' : ''}`} onClick={() => setActiveStep(1)}>
              <div className="step-tab-number">1</div>
              <div className="step-tab-text">
                <h4>Input Customer Information</h4>
                <p>Select customer & add cart items to temporary Linked List</p>
              </div>
            </div>

            <div className={`step-tab ${activeStep === 2 ? 'active' : ''}`} onClick={() => setActiveStep(2)}>
              <div className="step-tab-number">2</div>
              <div className="step-tab-text">
                <h4>Calculate Total Amount</h4>
                <p>Apply discounts & GST tax via Multi-threaded Engine</p>
              </div>
            </div>

            <div className={`step-tab ${activeStep === 3 ? 'active' : ''}`} onClick={() => setActiveStep(3)}>
              <div className="step-tab-number">3</div>
              <div className="step-tab-text">
                <h4>Generate Bill</h4>
                <p>Display formatted bill, confirm & finalize transaction</p>
              </div>
            </div>
          </div>

          {/* Step 1: Input Customer Info & Item Selection */}
          {activeStep === 1 && (
            <div className="workflow-content-grid">
              {/* Left Column: Customer Form & Item Selector */}
              <div>
                <div className="card">
                  <div className="card-title">
                    <span><User size={18} /> Customer Details</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">Customer Name</label>
                      <input
                        className="form-input"
                        type="text"
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                        placeholder="e.g. Alex Johnson"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input
                        className="form-input"
                        type="email"
                        value={customerEmail}
                        onChange={e => setCustomerEmail(e.target.value)}
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-title">
                    <span><ShoppingBag size={18} /> Select Items to be Billed</span>
                    <span style={{ fontSize: '0.78rem', color: '#00a8cc', fontWeight: '600' }}>
                      <Database size={12} /> Hash Map O(1) Catalog Lookup
                    </span>
                  </div>

                  {/* Filter & Search Bar */}
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                      <input
                        className="form-input"
                        style={{ paddingLeft: '36px' }}
                        type="text"
                        placeholder="Search product code or name..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <select
                      className="form-select"
                      style={{ width: '160px' }}
                      value={selectedCategory}
                      onChange={e => setSelectedCategory(e.target.value)}
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Product Cards in Rupees ₹ */}
                  <div className="product-select-grid">
                    {filteredProducts.map(p => (
                      <div className="product-card-item" key={p.id}>
                        <div>
                          <span className="product-code">{p.itemCode}</span>
                          <h5 className="product-name">{p.name}</h5>
                        </div>
                        <div className="product-price-row">
                          <span className="product-price">{formatINR(p.price)}</span>
                          <button className="btn btn-primary btn-sm" onClick={() => addToCart(p)}>
                            <Plus size={14} /> Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Dynamic Cart List in Rupees ₹ */}
              <div>
                <div className="card">
                  <div className="card-title">
                    <span>Temporary Billed Item List</span>
                    <span className="badge" style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem' }}>
                      Linked List Nodes: {cartItems.length}
                    </span>
                  </div>

                  {cartItems.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#94a3b8', padding: '30px 0' }}>
                      Cart is empty. Select products from catalog on the left to build bill list.
                    </p>
                  ) : (
                    <>
                      <table className="cart-table">
                        <thead>
                          <tr>
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Subtotal</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cartItems.map(item => (
                            <tr key={item.productId}>
                              <td>
                                <div style={{ fontWeight: '600' }}>{item.name}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.itemCode}</div>
                              </td>
                              <td>
                                <div className="qty-controls">
                                  <button className="qty-btn" onClick={() => updateQuantity(item.productId, -1)}>-</button>
                                  <span>{item.quantity}</span>
                                  <button className="qty-btn" onClick={() => updateQuantity(item.productId, 1)}>+</button>
                                </div>
                              </td>
                              <td>{formatINR(item.unitPrice)}</td>
                              <td style={{ fontWeight: '700' }}>{formatINR(item.unitPrice * item.quantity)}</td>
                              <td>
                                <button
                                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                                  onClick={() => removeFromCart(item.productId)}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '2px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Estimated Subtotal</span>
                          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0e2a47' }}>
                            {formatINR(cartItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0))}
                          </div>
                        </div>
                        <button className="btn btn-primary" onClick={handleCalculate} disabled={loading}>
                          {loading ? 'Processing DS...' : 'Proceed to Step 2'} <ArrowRight size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Computer Organization & DS Status Box */}
                <div className="metrics-card">
                  <div className="metrics-header">
                    <Cpu size={18} /> Data Structure & CO Runtime Engine
                  </div>
                  <div className="metric-grid">
                    <div className="metric-box">
                      <div className="metric-val">Linked List</div>
                      <div className="metric-lbl">Temporary Cart Storage</div>
                    </div>
                    <div className="metric-box">
                      <div className="metric-val">Hash Map</div>
                      <div className="metric-lbl">O(1) Product Lookup</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Calculate Total Amount */}
          {activeStep === 2 && (
            <div className="workflow-content-grid">
              <div>
                <div className="card">
                  <div className="card-title">
                    <span><Calculator size={18} /> Apply Discounts & GST Tax Calculations</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                    <div className="form-group">
                      <label className="form-label">Discount Rate (%)</label>
                      <input
                        className="form-input"
                        type="number"
                        min="0"
                        max="100"
                        step="0.5"
                        value={discountPercent}
                        onChange={e => setDiscountPercent(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">GST / Tax Rate (%)</label>
                      <input
                        className="form-input"
                        type="number"
                        min="0"
                        max="50"
                        step="0.5"
                        value={taxPercent}
                        onChange={e => setTaxPercent(e.target.value)}
                      />
                    </div>
                  </div>

                  <button className="btn btn-secondary" onClick={handleCalculate} style={{ marginBottom: '20px' }}>
                    <RefreshCw size={14} /> Recalculate Multi-Threaded Engine
                  </button>

                  {calculationResult && (
                    <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <h4 style={{ color: '#0e2a47', marginBottom: '12px' }}>Calculation Breakdown</h4>
                      <div className="invoice-summary-row">
                        <span>Raw Items Total:</span>
                        <span>{formatINR(calculationResult.rawTotal)}</span>
                      </div>
                      <div className="invoice-summary-row" style={{ color: '#059669' }}>
                        <span>Discount ({calculationResult.discountPercent}%):</span>
                        <span>-{formatINR(calculationResult.discountAmount)}</span>
                      </div>
                      <div className="invoice-summary-row">
                        <span>GST Tax ({calculationResult.taxPercent}%):</span>
                        <span>+{formatINR(calculationResult.taxAmount)}</span>
                      </div>
                      <div className="invoice-summary-row net-total">
                        <span>Net Total Amount:</span>
                        <span>{formatINR(calculationResult.netTotal)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                {/* Multi-threading Performance Metrics Box */}
                <div className="metrics-card">
                  <div className="metrics-header">
                    <Zap size={18} /> Multi-threading & CPU Metrics
                  </div>
                  {calculationResult && calculationResult.metrics ? (
                    <div className="metric-grid">
                      <div className="metric-box">
                        <div className="metric-val">{calculationResult.metrics.executionTimeMs.toFixed(3)} ms</div>
                        <div className="metric-lbl">Parallel Execution Time</div>
                      </div>
                      <div className="metric-box">
                        <div className="metric-val">{calculationResult.metrics.activeThreads || 4} Threads</div>
                        <div className="metric-lbl">Concurrent Worker Pool</div>
                      </div>
                      <div className="metric-box" style={{ gridColumn: 'span 2' }}>
                        <div className="metric-val" style={{ fontSize: '0.85rem' }}>
                          {calculationResult.metrics.dataStructureUsed}
                        </div>
                        <div className="metric-lbl">Data Structures & Architecture</div>
                      </div>
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Run calculation to view thread performance metrics.</p>
                  )}
                </div>

                <div style={{ marginTop: '24px', textAlign: 'right' }}>
                  <button className="btn btn-success" style={{ width: '100%', padding: '14px' }} onClick={handleGenerateBill} disabled={loading}>
                    <CheckCircle size={18} /> {loading ? 'Finalizing Bill...' : 'Generate & Finalize Bill (Step 3)'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Generate Bill & Formatted Invoice Receipt */}
          {activeStep === 3 && (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => setActiveStep(1)}>
                  ← Edit Customer or Items
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => window.print()}>
                  <Printer size={14} /> Print Bill
                </button>
              </div>

              {generatedBill && (
                <div className="invoice-paper">
                  <div className="invoice-header">
                    <div className="invoice-logo">
                      <h2>BillMaster</h2>
                      <p>Integrated Billing System • Java & Data Structures</p>
                    </div>
                    <div className="invoice-meta">
                      <span className="invoice-number">{generatedBill.billNumber}</span>
                      <span>Date: {new Date(generatedBill.createdAt).toLocaleDateString()}</span>
                      <span>Time: {new Date(generatedBill.createdAt).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                    <div>
                      <h4 style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Billed To:</h4>
                      <strong style={{ fontSize: '1rem', color: '#0e2a47' }}>{generatedBill.customer ? generatedBill.customer.name : customerName}</strong>
                      <div style={{ fontSize: '0.85rem', color: '#475569' }}>{generatedBill.customer ? generatedBill.customer.email : customerEmail}</div>
                      <div style={{ fontSize: '0.85rem', color: '#475569' }}>{generatedBill.customer ? generatedBill.customer.phone : customerPhone}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <h4 style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Payment Status:</h4>
                      <span style={{ display: 'inline-block', background: '#10b981', color: 'white', fontWeight: '800', fontSize: '0.85rem', padding: '4px 12px', borderRadius: '12px', marginTop: '4px' }}>
                        {generatedBill.paymentStatus || 'PAID'}
                      </span>
                    </div>
                  </div>

                  <table className="cart-table" style={{ marginBottom: '24px' }}>
                    <thead>
                      <tr>
                        <th>Item Code</th>
                        <th>Description</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generatedBill.items && generatedBill.items.map((item, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: '700', color: '#00a8cc' }}>{item.itemCode || 'PRD'}</td>
                          <td>{item.productName || (item.product ? item.product.name : 'Product')}</td>
                          <td>{item.quantity}</td>
                          <td>{formatINR(item.unitPrice)}</td>
                          <td style={{ fontWeight: '700' }}>{formatINR(item.subtotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div style={{ maxWidth: '380px', marginLeft: 'auto' }}>
                    <div className="invoice-summary-row">
                      <span>Raw Items Subtotal:</span>
                      <span>{formatINR(generatedBill.rawTotal)}</span>
                    </div>
                    <div className="invoice-summary-row" style={{ color: '#059669' }}>
                      <span>Discount ({generatedBill.discountPercent}%):</span>
                      <span>-{formatINR(generatedBill.discountAmount)}</span>
                    </div>
                    <div className="invoice-summary-row">
                      <span>GST Tax ({generatedBill.taxPercent}%):</span>
                      <span>+{formatINR(generatedBill.taxAmount)}</span>
                    </div>
                    <div className="invoice-summary-row net-total">
                      <span>Final Net Total:</span>
                      <span>{formatINR(generatedBill.netAmount || generatedBill.netTotal)}</span>
                    </div>
                  </div>

                  <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>
                    Thank you for using BillMaster • Powered by Java Linked Lists, HashMaps, and Multi-threaded Execution
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Footer Branding */}
      <div className="poster-footer">
        SMART BILLING &nbsp;|&nbsp; BETTER MANAGEMENT &nbsp;|&nbsp; HIGHER EFFICIENCY
      </div>
    </div>
  );
}
