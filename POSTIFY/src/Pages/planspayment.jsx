import React, { useState } from "react";
import "./planspayment.css";

const PlansPayment = ({ plan, onCancel, onSuccess }) => {
  const [method, setMethod] = useState("upi");
  
  // Form States
  const [upiId, setUpiId] = useState("");
  
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  
  const [accHolder, setAccHolder] = useState("");
  const [accNumber, setAccNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [ifsc, setIfsc] = useState("");

  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    // UPI Validation
    if (method === "upi") {
      const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
      if (!upiRegex.test(upiId)) return alert("Please enter a valid UPI ID (e.g. username@okbank)");
    }
    
    // Card Validation
    if (method === "card") {
      const cardRegex = /^\d{16}$/;
      if (!cardRegex.test(cardNumber.replace(/\s/g, ''))) return alert("Please enter a valid 16-digit Card Number");
      
      const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
      if (!expiryRegex.test(cardExpiry)) return alert("Please enter a valid Expiry Date (MM/YY)");
      
      const cvvRegex = /^\d{3,4}$/;
      if (!cvvRegex.test(cardCvv)) return alert("Please enter a valid 3 or 4 digit CVV");
    }

    // Bank Validation
    if (method === "bank") {
      if (accHolder.trim().length < 3) return alert("Please enter the Account Holder Name");
      
      const accNumRegex = /^\d{9,18}$/;
      if (!accNumRegex.test(accNumber)) return alert("Please enter a valid Account Number (9-18 digits)");
      
      if (bankName.trim().length < 2) return alert("Please enter the Bank Name");
      
      const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
      if (!ifscRegex.test(ifsc.toUpperCase())) return alert("Please enter a valid 11-character IFSC Code (e.g. SBIN0001234)");
    }
    
    setProcessing(true);
    setTimeout(() => {
      let details = {};
      if (method === "upi") {
        details = { upiId };
      } else if (method === "card") {
        details = { cardNumber, cardExpiry, cardCvv };
      } else if (method === "bank") {
        details = { accHolder, accNumber, bankName, ifsc };
      }
      
      onSuccess(plan, method, details);
    }, 2500);
  };

  return (
    <div className="payment-overlay">
      <div className="payment-modal">
        <button className="payment-close" onClick={onCancel} disabled={processing}>×</button>
        
        <h2 className="payment-title">Complete Your Purchase</h2>
        <div className="payment-summary">
          <div className="summary-row">
            <span>Selected Plan</span>
            <strong>{plan.name}</strong>
          </div>
          <div className="summary-row">
            <span>Credits Added</span>
            <strong className="text-accent">+{plan.credits}</strong>
          </div>
          <div className="summary-row total">
            <span>Total Amount</span>
            <strong>₹{plan.price}</strong>
          </div>
        </div>

        <h3 className="payment-subtitle">Select Payment Method</h3>
        <div className="payment-methods">
          <div className={`method-card ${method === "upi" ? "active" : ""}`} onClick={() => setMethod("upi")}>
            <div className="method-icon upi">UPI</div>
            <span>GPay/PhonePe</span>
          </div>
          <div className={`method-card ${method === "bank" ? "active" : ""}`} onClick={() => setMethod("bank")}>
            <div className="method-icon bank">🏦</div>
            <span>Bank Transfer</span>
          </div>
          <div className={`method-card ${method === "card" ? "active" : ""}`} onClick={() => setMethod("card")}>
            <div className="method-icon card">💳</div>
            <span>Card</span>
          </div>
        </div>

        <div className="payment-form">
          {method === "upi" && (
            <div className="form-group">
              <label>UPI ID (Google Pay, PhonePe, Paytm, etc.)</label>
              <input 
                type="text" 
                placeholder="e.g. username@okicici" 
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
            </div>
          )}

          {method === "card" && (
            <>
              <div className="form-group">
                <label>Card Number</label>
                <input 
                  type="text" 
                  maxLength="19"
                  placeholder="0000 0000 0000 0000" 
                  value={cardNumber}
                  onChange={(e) => {
                    // Basic formatting
                    let val = e.target.value.replace(/\D/g, '');
                    val = val.replace(/(.{4})/g, '$1 ').trim();
                    setCardNumber(val);
                  }}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input 
                    type="text" 
                    placeholder="MM/YY" 
                    maxLength="5"
                    value={cardExpiry}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '');
                      if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2, 4);
                      setCardExpiry(val);
                    }}
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input 
                    type="password" 
                    placeholder="123" 
                    maxLength="4"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>
            </>
          )}

          {method === "bank" && (
            <>
              <div className="form-group">
                <label>Account Holder Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. John Doe" 
                  value={accHolder}
                  onChange={(e) => setAccHolder(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Account Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. 123456789012" 
                  maxLength="18"
                  value={accNumber}
                  onChange={(e) => setAccNumber(e.target.value.replace(/\D/g, ''))}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Bank Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. HDFC Bank" 
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>IFSC Code</label>
                  <input 
                    type="text" 
                    placeholder="e.g. HDFC0001234" 
                    maxLength="11"
                    style={{ textTransform: 'uppercase' }}
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <button 
          className="payment-btn" 
          onClick={handlePay} 
          disabled={processing}
        >
          {processing ? "Processing Securely..." : `Pay ₹${plan.price} Securely`}
        </button>
        
        <p className="payment-secure-text">🔒 Payments are 100% secure and encrypted</p>
      </div>
    </div>
  );
};

export default PlansPayment;
