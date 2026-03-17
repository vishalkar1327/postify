import React, { useState } from "react";
import "./UserDashboard.css";
import PlansPayment from "./planspayment";

const Dashboard = ({ onLogout }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [activeStyle, setActiveStyle] = useState("Ecommerce");
  const [background, setBackground] = useState("Outdoor");
  const [description, setDescription] = useState("");
  const [activeVersion, setActiveVersion] = useState(0);
  const [showAfter, setShowAfter] = useState(true);
  const [versions, setVersions] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeAngle, setActiveAngle] = useState("Front");
  const [currentPage, setCurrentPage] = useState("studio");
  const [toast, setToast] = useState("");
  const [showToastFlag, setShowToastFlag] = useState(false);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [profileName, setProfileName] = useState("Vishal Sharma");
  const [profileEmail, setProfileEmail] = useState("vishal@postify.ai");
  const [profileBrand, setProfileBrand] = useState("");
  const [profileWebsite, setProfileWebsite] = useState("");

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('postify_users');
    return saved ? JSON.parse(saved) : [];
  });
  const [plans, setPlans] = useState(() => {
    const saved = localStorage.getItem('postify_plans');
    return saved ? JSON.parse(saved) : [];
  });

  const currentUser = users.find(u => u.email === profileEmail) || { credits: 0, plan: "Free" };
  const credits = currentUser.credits;

  React.useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'postify_users') setUsers(JSON.parse(e.newValue));
      if (e.key === 'postify_plans') setPlans(JSON.parse(e.newValue));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const styles = ["Ecommerce", "Instagram Ad", "Luxury Product", "White Background"];
  const backgrounds = ["Outdoor", "Studio", "Lifestyle", "Minimal", "Nature", "Urban"];
  const angles = ["Front", "Left", "Right", "Back", "Top"];

  const showToast = (msg) => {
    setToast(msg);
    setShowToastFlag(true);
    setTimeout(() => setShowToastFlag(false), 2800);
  };

  const navigate = (page) => {
    setCurrentPage(page);
  };

  const pageTitles = {
    studio: ["Creative Studio", "Transform your product shots into marketing campaigns"],
    myassets: ["My Assets", "All your uploaded product images"],
    history: ["History", "Your past generation sessions"],
    favorites: ["Favorites", "Images you have starred"],
    profile: ["Profile", "Manage your account details"],
    credits: ["Credits & Plans", "Manage your subscription"],
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const processFile = (file) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setGeneratedImage(null);
    setVersions([]);
    showToast("Image uploaded successfully!");
  };

  const handleGenerate = () => {
    if (!previewUrl || isGenerating) return;
    if (credits < 8) {
      showToast("Not enough credits! Please purchase a plan.");
      return;
    }
    
    setIsGenerating(true);
    
    const updatedUsers = users.map(u => u.email === profileEmail ? { ...u, credits: Math.max(0, u.credits - 8) } : u);
    setUsers(updatedUsers);
    localStorage.setItem('postify_users', JSON.stringify(updatedUsers));
    setTimeout(() => {
      setGeneratedImage(previewUrl);
      const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const newVersion = { url: previewUrl, label: `Version ${versions.length + 1}`, bg: background, angle: activeAngle, style: activeStyle, time, desc: description };
      setVersions((prev) => {
        const updated = [...prev, newVersion];
        setActiveVersion(updated.length - 1);
        return updated;
      });
      setHistory((prev) => [{ ...newVersion, id: Date.now() }, ...prev]);
      setIsGenerating(false);
      setShowAfter(true);
      showToast(`Image generated! ${activeStyle} · ${background}`);
    }, 3000);
  };

  const handleRegenerate = () => {
    if (!generatedImage || isGenerating) return;
    handleGenerate();
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `postify-${activeStyle.replace(" ", "-").toLowerCase()}.jpg`;
    link.click();
    showToast("Downloading...");
  };

  const handleApprove = () => {
    showToast("✓ Result approved & saved to assets!");
  };

  const toggleFav = () => {
    const newFav = !isFavorited;
    setIsFavorited(newFav);
    if (newFav && versions[activeVersion]) {
      setFavorites((prev) => [{ ...versions[activeVersion], id: Date.now() }, ...prev]);
      showToast("Added to favorites!");
    } else {
      showToast("Removed from favorites");
    }
  };

  const selectVersion = (i) => {
    setActiveVersion(i);
    setGeneratedImage(versions[i].url);
  };

  const saveProfile = () => {
    showToast("Profile saved!");
  };

  const handlePurchase = (plan) => {
    setSelectedPlan(plan);
  };

  const handlePaymentSuccess = (plan, method, details) => {
    const updatedUsers = users.map(u => 
      u.email === profileEmail ? { ...u, credits: u.credits + plan.credits, plan: plan.name } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('postify_users', JSON.stringify(updatedUsers));

    const txnsRaw = localStorage.getItem('postify_transactions');
    const txns = txnsRaw ? JSON.parse(txnsRaw) : [];
    const newTxn = {
      id: Date.now(),
      user: profileName,
      plan: plan.name,
      amount: plan.price,
      credits: plan.credits,
      paymentMethod: method,
      paymentDetails: details,
      transactionId: "TXN" + Math.floor(Math.random() * 100000000),
      status: "Success",
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    };
    
    const newTxns = [newTxn, ...txns];
    localStorage.setItem('postify_transactions', JSON.stringify(newTxns));
    
    setSelectedPlan(null);
    showToast(`Successfully purchased ${plan.name} plan! (+${plan.credits} credits)`);
  };

  const clearHistory = () => {
    setHistory([]);
    setFavorites([]);
    showToast("History cleared");
  };

  const avatarInitials = profileName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const MAX_CREDITS_APPROX = Math.max(400, credits);
  const creditsPct = (credits / MAX_CREDITS_APPROX) * 100;

  // ── ANGLE SVGs ──
  const angleSVGs = {
    Front: (<svg viewBox="0 0 60 60" fill="none"><rect x="8" y="8" width="8" height="8" rx="1.5" fill="white" opacity="0.9"/><polyline points="52,28 52,52 28,52" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/></svg>),
    Left: (<svg viewBox="0 0 60 60" fill="none"><rect x="8" y="8" width="8" height="8" rx="1.5" fill="white" opacity="0.9"/><polyline points="8,28 8,52 32,52" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/></svg>),
    Right: (<svg viewBox="0 0 60 60" fill="none"><line x1="30" y1="10" x2="30" y2="50" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.9"/><line x1="10" y1="30" x2="50" y2="30" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.9"/></svg>),
    Back: (<svg viewBox="0 0 60 60" fill="none"><rect x="44" y="8" width="8" height="8" rx="1.5" fill="white" opacity="0.9"/><polyline points="8,8 8,36 36,36" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/></svg>),
    Top: (<svg viewBox="0 0 60 60" fill="none"><line x1="40" y1="8" x2="52" y2="8" stroke="white" strokeWidth="3.5" strokeLinecap="round" opacity="0.9"/><line x1="52" y1="8" x2="52" y2="20" stroke="white" strokeWidth="3.5" strokeLinecap="round" opacity="0.9"/><rect x="44" y="44" width="8" height="8" rx="1.5" fill="white" opacity="0.9"/><line x1="8" y1="40" x2="8" y2="52" stroke="white" strokeWidth="3.5" strokeLinecap="round" opacity="0.9"/><line x1="8" y1="52" x2="20" y2="52" stroke="white" strokeWidth="3.5" strokeLinecap="round" opacity="0.9"/></svg>),
  };

  // ── PAGES ──
  const renderStudio = () => (
    <div className="dash-workspace">
      {/* LEFT CONTROLS */}
      <div className="dash-controls-panel">
        <h2 className="panel-title">Generate Controls</h2>

        <div className="control-group">
          <label className="control-label">Style</label>
          <div className="style-tags">
            {styles.map((s) => (
              <button key={s} className={`style-tag ${activeStyle === s ? "style-tag-active" : ""}`} onClick={() => setActiveStyle(s)}>{s}</button>
            ))}
          </div>
        </div>

        <div className="control-group">
          <label className="control-label">Product Image</label>
          {previewUrl ? (
            <label className="upload-btn" htmlFor="dash-file-input">
              <input type="file" id="dash-file-input" hidden accept="image/*" onChange={handleFileUpload} />
              <div className="upload-preview">
                <img src={previewUrl} alt="Uploaded" />
                <span className="upload-change">Click to change</span>
              </div>
            </label>
          ) : (
            <label className="upload-btn" htmlFor="dash-file-input" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
              <input type="file" id="dash-file-input" hidden accept="image/*" onChange={handleFileUpload} />
              <div className="upload-placeholder">
                <span className="upload-icon-dash">📤</span>
                <span>Upload Product Image</span>
                <span className="upload-hint">PNG, JPG up to 10MB · Drag & drop</span>
              </div>
            </label>
          )}
        </div>

        <div className="control-group">
          <label className="control-label">Camera Angle</label>
          <div className="angle-grid">
            {angles.map((a) => (
              <button key={a} className={`angle-btn ${activeAngle === a ? "angle-btn-active" : ""}`} onClick={() => setActiveAngle(a)}>
                <div className="angle-tile">{angleSVGs[a]}</div>
                <span className="angle-label">{a}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="control-group">
          <label className="control-label">Background</label>
          <select className="control-select" value={background} onChange={(e) => setBackground(e.target.value)}>
            {backgrounds.map((bg) => <option key={bg}>{bg}</option>)}
          </select>
        </div>

        <div className="control-group">
          <label className="control-label">Description</label>
          <textarea className="control-textarea" placeholder="Describe the scene, lighting, mood..." value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
        </div>

        <div className="control-actions">
          <button className="btn-generate" onClick={handleGenerate} disabled={!previewUrl || isGenerating}>
            {isGenerating ? <><span className="spin-icon">⟳</span> Generating...</> : <>✦ Generate Image</>}
          </button>
          <button className="btn-regenerate" onClick={handleRegenerate} disabled={!generatedImage || isGenerating}>🔄 Regen</button>
        </div>
      </div>

      {/* RIGHT PREVIEW */}
      <div className="dash-preview-panel">
        <div className="preview-header">
          <h2 className="panel-title">Image Preview</h2>
          {generatedImage && (
            <div className="preview-header-actions">
              <button className={`fav-btn ${isFavorited ? "fav-active" : ""}`} onClick={toggleFav}>{isFavorited ? "★ Favorited" : "☆ Favorite"}</button>
              <div className="before-after-toggle">
                <button className={!showAfter ? "toggle-active" : ""} onClick={() => { setShowAfter(false); }}>Before</button>
                <button className={showAfter ? "toggle-active" : ""} onClick={() => { setShowAfter(true); }}>After</button>
              </div>
            </div>
          )}
        </div>

        <div className="angle-badge-row">
          {angles.map((a) => (
            <div key={a} className={`angle-badge ${activeAngle === a ? "angle-badge-active" : ""}`} onClick={() => setActiveAngle(a)}>{a}</div>
          ))}
        </div>

        <div className="preview-image-box">
          {!previewUrl && !generatedImage && (
            <div className="preview-empty">
              <span>🖼️</span>
              <p>Your generated image will appear here</p>
              <p className="preview-empty-sub">Upload a product and click Generate</p>
            </div>
          )}
          {previewUrl && !generatedImage && !isGenerating && <img src={previewUrl} alt="Preview" className="preview-img" />}
          {isGenerating && (
            <div className="preview-generating-overlay">
              <div className="preview-spinner"></div>
              <p>Postifying your image...</p>
              <p className="generating-angle">Rendering {activeAngle} view 🎯</p>
            </div>
          )}
          {generatedImage && !isGenerating && (
            <img src={showAfter ? generatedImage : previewUrl} alt="Result" className="preview-img" />
          )}
        </div>

        {generatedImage && (
          <div className="preview-actions">
            <button className="btn-download" onClick={handleDownload}>⬇ Download</button>
            <button className="btn-approve" onClick={handleApprove}>✓ Approve Result</button>
          </div>
        )}

        {versions.length > 0 && (
          <div className="version-history">
            <div className="version-history-header">
              <span>▾ Version History</span>
              <div className="version-tabs">
                {versions.map((v, i) => (
                  <button key={i} className={`version-tab ${activeVersion === i ? "version-tab-active" : ""}`} onClick={() => selectVersion(i)}>{v.label}</button>
                ))}
              </div>
            </div>
            <div className="version-thumbnails">
              {versions.map((v, i) => (
                <div key={i} className={`version-thumb ${activeVersion === i ? "version-thumb-active" : ""}`} onClick={() => selectVersion(i)}>
                  <img src={v.url} alt={v.label} />
                </div>
              ))}
            </div>
            {versions[activeVersion] && (
              <p className="version-meta">{versions[activeVersion].bg} | {versions[activeVersion].angle} view | {versions[activeVersion].style} | {versions[activeVersion].time}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="page-content">
      <h2 className="page-h2">Generation History</h2>
      {history.length === 0 ? (
        <div className="empty-state"><span className="empty-icon">🕘</span><p className="empty-text">No history yet</p><p className="empty-sub">Generate some images to see them here</p></div>
      ) : (
        <div className="history-list">
          {history.map((h, i) => (
            <div key={i} className="history-item">
              <div className="history-thumb"><img src={h.url} alt={h.label} /></div>
              <div className="history-info">
                <p className="history-name">{h.style} — {h.bg} Background</p>
                <p className="history-meta">{h.angle} view · {h.time}{h.desc ? ` · ${h.desc.substring(0, 30)}${h.desc.length > 30 ? "..." : ""}` : ""}</p>
              </div>
              <span className="fav-star" onClick={() => { setFavorites((prev) => [{ ...h, id: Date.now() }, ...prev]); showToast("Added to favorites!"); }}>★</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderFavorites = () => (
    <div className="page-content">
      <h2 className="page-h2">Favorites</h2>
      {favorites.length === 0 ? (
        <div className="empty-state"><span className="empty-icon">⭐</span><p className="empty-text">No favorites yet</p><p className="empty-sub">Star your best generations to find them here</p></div>
      ) : (
        <div className="history-list">
          {favorites.map((h, i) => (
            <div key={i} className="history-item">
              <div className="history-thumb"><img src={h.url} alt={h.label} /></div>
              <div className="history-info">
                <p className="history-name">{h.style} — {h.bg} Background</p>
                <p className="history-meta">{h.angle} view · {h.time}</p>
              </div>
              <span className="fav-star" onClick={() => { setFavorites((prev) => prev.filter((_, idx) => idx !== i)); showToast("Removed from favorites"); }}>★</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAssets = () => (
    <div className="page-content">
      <h2 className="page-h2">My Assets</h2>
      {history.length === 0 ? (
        <div className="empty-state"><span className="empty-icon">📁</span><p className="empty-text">No assets yet</p><p className="empty-sub">Your uploaded product images will appear here</p></div>
      ) : (
        <div className="assets-grid">
          {[...new Set(history.map((h) => h.url))].map((url, i) => (
            <div key={i} className="asset-thumb" onClick={() => navigate("studio")}>
              <img src={url} alt={`Asset ${i + 1}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="page-content">
      <h2 className="page-h2">Profile</h2>
      <div className="profile-form">
        <div className="form-row"><label className="form-label">Full Name</label><input className="form-input" type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} /></div>
        <div className="form-row"><label className="form-label">Email</label><input className="form-input" type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} /></div>
        <div className="form-row"><label className="form-label">Brand / Company</label><input className="form-input" type="text" value={profileBrand} onChange={(e) => setProfileBrand(e.target.value)} placeholder="Your brand name" /></div>
        <div className="form-row"><label className="form-label">Website</label><input className="form-input" type="url" value={profileWebsite} onChange={(e) => setProfileWebsite(e.target.value)} placeholder="https://yoursite.com" /></div>
        <button className="btn-save" onClick={saveProfile}>Save Changes</button>
      </div>
    </div>
  );

  const renderCredits = () => (
    <div className="page-content">
      <h2 className="page-h2">Credits & Plans</h2>
      <div className="credits-plan-card">
        <p className="plan-name">Current Plan: <span className="gradient-text">{currentUser.plan}</span></p>
        <div className="plan-progress-label"><span>Credits Remaining</span><span>{credits}</span></div>
        <div className="plan-bar"><div className="plan-fill" style={{ width: `${Math.min(100, creditsPct)}%` }}></div></div>
      </div>
      <h3 className="plans-heading">Upgrade Your Plan</h3>
      <div className="plans-grid">
        {plans.map((plan) => (
          <div key={plan.name} className={`plan-option ${currentUser.plan === plan.name ? "plan-option-active" : ""}`} onClick={() => handlePurchase(plan)}>
            <p className="plan-cname">{plan.name}</p>
            <p className="plan-price gradient-text">₹{plan.price}</p>
            <p className="plan-period">/month</p>
            <div className="plan-action-area">
              {currentUser.plan === plan.name ? (
                <button className="plan-btn current-plan-btn" disabled>Current Plan</button>
              ) : (
                <button className="plan-btn upgrade-plan-btn">Purchase Plan</button>
              )}
            </div>
            <p className="plan-feature" style={{marginTop:"8px", color:"var(--accent2)"}}>+{plan.credits} Credits</p>
            {plan.features.split(",").map((f) => <p key={f} className="plan-feature">{f}</p>)}
          </div>
        ))}
      </div>
    </div>
  );

  const pages = { studio: renderStudio, history: renderHistory, favorites: renderFavorites, myassets: renderAssets, profile: renderProfile, credits: renderCredits };

  return (
    <div className="dash-wrapper">
      <div className="dash-orb dash-orb-1"></div>
      <div className="dash-orb dash-orb-2"></div>
      <div className={`toast ${showToastFlag ? "toast-show" : ""}`}>{toast}</div>

      {selectedPlan && (
        <PlansPayment 
          plan={selectedPlan} 
          onCancel={() => setSelectedPlan(null)} 
          onSuccess={handlePaymentSuccess} 
        />
      )}

      {/* SIDEBAR */}
      <aside className="dash-sidebar">
        <div className="dash-logo-wrap">
          <span className="dash-logo-text">Postify</span>
        </div>
        <nav className="dash-nav">
          <div className="dash-nav-group">
            <p className="dash-nav-label">WORKSPACE</p>
            {[["studio", "✦", "Studio"], ["myassets", "📁", "My Assets"], ["history", "🕘", "History"], ["favorites", "⭐", "Favorites"]].map(([page, icon, label]) => (
              <button key={page} className={`dash-nav-link ${currentPage === page ? "active" : ""}`} onClick={() => navigate(page)}><span>{icon}</span> {label}</button>
            ))}
          </div>
          <div className="dash-nav-group">
            <p className="dash-nav-label">ACCOUNT</p>
            {[["profile", "👤", "Profile"], ["credits", "💳", "Credits"]].map(([page, icon, label]) => (
              <button key={page} className={`dash-nav-link ${currentPage === page ? "active" : ""}`} onClick={() => navigate(page)}><span>{icon}</span> {label}</button>
            ))}
          </div>
        </nav>
        <div className="dash-credits-card">
          <p className="credits-label">Credits Remaining</p>
          <p className="credits-number gradient-text">{credits}</p>
          <div className="credits-bar"><div className="credits-fill" style={{ width: `${Math.min(100, Math.max(0, creditsPct))}%` }}></div></div>
          <button className="credits-upgrade" onClick={() => navigate("credits")}>Upgrade Plan →</button>
        </div>
        <button className="dash-logout" onClick={onLogout}>← Log Out</button>
      </aside>

      {/* MAIN */}
      <main className="dash-main">
        <header className="dash-topbar">
          <div>
            <h1 className="dash-topbar-title">{pageTitles[currentPage][0]}</h1>
            <p className="dash-topbar-sub">{pageTitles[currentPage][1]}</p>
          </div>
          <div className="dash-user-badge">
            <span className="dash-user-avatar">{avatarInitials}</span>
            <span className="dash-user-name">{profileName}</span>
          </div>
        </header>
        {(pages[currentPage] || renderStudio)()}
      </main>
    </div>
  );
};

export default Dashboard;