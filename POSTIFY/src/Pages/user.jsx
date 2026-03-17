import React, { useState } from "react";
import "./Dashboard.css";
import logo from "../assets/postify-logo.png";

const Dashboard = ({ onLogout, onNavigate }) => {
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

  const styles = [
    "Ecommerce",
    "Instagram Ad",
    "Luxury Product",
    "White Background",
  ];
  const backgrounds = [
    "Outdoor",
    "Studio",
    "Lifestyle",
    "Minimal",
    "Nature",
    "Urban",
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setGeneratedImage(null);
      setVersions([]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setGeneratedImage(null);
      setVersions([]);
    }
  };

  const handleGenerate = () => {
    if (!previewUrl) return;
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedImage(previewUrl);
      setVersions((prev) => {
        const newVersions = [
          ...prev,
          {
            url: previewUrl,
            label: `Version ${prev.length + 1}`,
            bg: background,
            angle: activeAngle,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ];
        setActiveVersion(newVersions.length - 1);
        return newVersions;
      });
      setIsGenerating(false);
      setShowAfter(true);
    }, 3000);
  };

  const handleRegenerate = () => {
    if (!previewUrl) return;
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedImage(previewUrl);
      setVersions((prev) => {
        const newVersions = [
          ...prev,
          {
            url: previewUrl,
            label: `Version ${prev.length + 1}`,
            bg: background,
            angle: activeAngle,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ];
        setActiveVersion(newVersions.length - 1);
        return newVersions;
      });
      setIsGenerating(false);
    }, 3000);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = "postify-result.jpg";
    link.click();
  };

  return (
    <div className="dash-wrapper">
      <div className="dash-orb dash-orb-1"></div>
      <div className="dash-orb dash-orb-2"></div>

      {/* SIDEBAR */}
      <aside className="dash-sidebar">
        <div className="dash-logo-wrap">
          <img src={logo} alt="Postify" className="dash-logo-img" />
        </div>
        <nav className="dash-nav">
          <div className="dash-nav-group">
            <p className="dash-nav-label">WORKSPACE</p>
            <button className="dash-nav-link active">
              <span>✦</span> Studio
            </button>
            <button
              className="dash-nav-link"
              onClick={() => onNavigate("myassets")}
            >
              <span>📁</span> My Assets
            </button>
            <button
              className="dash-nav-link"
              onClick={() => onNavigate("history")}
            >
              <span>🕘</span> History
            </button>
            <button
              className="dash-nav-link"
              onClick={() => onNavigate("favorites")}
            >
              <span>⭐</span> Favorites
            </button>
          </div>
          <div className="dash-nav-group">
            <p className="dash-nav-label">ACCOUNT</p>
            <button
              className="dash-nav-link"
              onClick={() => onNavigate("profile")}
            >
              <span>👤</span> Profile
            </button>
            <button
              className="dash-nav-link"
              onClick={() => onNavigate("credits")}
            >
              <span>💳</span> Credits
            </button>
            <button
              className="dash-nav-link"
              onClick={() => onNavigate("settings")}
            >
              <span>⚙️</span> Settings
            </button>
          </div>
        </nav>
        <div className="dash-credits-card">
          <p className="credits-label">Credits Remaining</p>
          <p className="credits-number gradient-text">380 / 400</p>
          <div className="credits-bar">
            <div className="credits-fill" style={{ width: "95%" }}></div>
          </div>
          <button className="credits-upgrade">Upgrade Plan →</button>
        </div>
        <button className="dash-logout" onClick={onLogout}>
          ← Log Out
        </button>
      </aside>

      {/* MAIN */}
      <main className="dash-main">
        <header className="dash-topbar">
          <div>
            <h1 className="dash-topbar-title">Creative Studio</h1>
            <p className="dash-topbar-sub">
              Transform your product shots into marketing campaigns
            </p>
          </div>
          <div className="dash-topbar-right">
            <div className="dash-user-badge">
              <span className="dash-user-avatar">MR</span>
              <span className="dash-user-name">Mahipal</span>
            </div>
          </div>
        </header>

        <div className="dash-workspace">
          {/* LEFT — GENERATE CONTROLS */}
          <div className="dash-controls-panel">
            <h2 className="panel-title">Generate Controls</h2>

            <div className="control-group">
              <label className="control-label">Style</label>
              <div className="style-tags">
                {styles.map((style) => (
                  <button
                    key={style}
                    className={`style-tag ${activeStyle === style ? "style-tag-active" : ""}`}
                    onClick={() => setActiveStyle(style)}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div className="control-group">
              <label className="control-label">Product Image</label>
              <label
                className="upload-btn"
                htmlFor="dash-file-input"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="dash-file-input"
                  hidden
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                {previewUrl ? (
                  <div className="upload-preview">
                    <img src={previewUrl} alt="Uploaded" />
                    <span className="upload-change">Click to change</span>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <span className="upload-icon-dash">📤</span>
                    <span>Upload Product Image</span>
                    <span className="upload-hint">PNG, JPG up to 10MB</span>
                  </div>
                )}
              </label>
            </div>

            {/* ANGLE SELECTOR */}
            <div className="control-group">
              <label className="control-label">Camera Angle</label>
              <div className="angle-grid">
                <button
                  className={`angle-btn ${activeAngle === "Front" ? "angle-btn-active" : ""}`}
                  onClick={() => setActiveAngle("Front")}
                >
                  <div className="angle-tile">
                    <svg
                      viewBox="0 0 60 60"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="8"
                        y="8"
                        width="8"
                        height="8"
                        rx="1.5"
                        fill="white"
                        opacity="0.9"
                      />
                      <polyline
                        points="52,28 52,52 28,52"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.9"
                      />
                    </svg>
                  </div>
                  <span className="angle-label">Front</span>
                </button>

                <button
                  className={`angle-btn ${activeAngle === "Left" ? "angle-btn-active" : ""}`}
                  onClick={() => setActiveAngle("Left")}
                >
                  <div className="angle-tile">
                    <svg
                      viewBox="0 0 60 60"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="8"
                        y="8"
                        width="8"
                        height="8"
                        rx="1.5"
                        fill="white"
                        opacity="0.9"
                      />
                      <polyline
                        points="8,28 8,52 32,52"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.9"
                      />
                    </svg>
                  </div>
                  <span className="angle-label">Left</span>
                </button>

                <button
                  className={`angle-btn ${activeAngle === "Right" ? "angle-btn-active" : ""}`}
                  onClick={() => setActiveAngle("Right")}
                >
                  <div className="angle-tile">
                    <svg
                      viewBox="0 0 60 60"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <line
                        x1="30"
                        y1="10"
                        x2="30"
                        y2="50"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                        opacity="0.9"
                      />
                      <line
                        x1="10"
                        y1="30"
                        x2="50"
                        y2="30"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                        opacity="0.9"
                      />
                    </svg>
                  </div>
                  <span className="angle-label">Right</span>
                </button>

                <button
                  className={`angle-btn ${activeAngle === "Back" ? "angle-btn-active" : ""}`}
                  onClick={() => setActiveAngle("Back")}
                >
                  <div className="angle-tile">
                    <svg
                      viewBox="0 0 60 60"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="44"
                        y="8"
                        width="8"
                        height="8"
                        rx="1.5"
                        fill="white"
                        opacity="0.9"
                      />
                      <polyline
                        points="8,8 8,36 36,36"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.9"
                      />
                    </svg>
                  </div>
                  <span className="angle-label">Back</span>
                </button>

                <button
                  className={`angle-btn ${activeAngle === "Top" ? "angle-btn-active" : ""}`}
                  onClick={() => setActiveAngle("Top")}
                >
                  <div className="angle-tile">
                    <svg
                      viewBox="0 0 60 60"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <line
                        x1="40"
                        y1="8"
                        x2="52"
                        y2="8"
                        stroke="white"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        opacity="0.9"
                      />
                      <line
                        x1="52"
                        y1="8"
                        x2="52"
                        y2="20"
                        stroke="white"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        opacity="0.9"
                      />
                      <rect
                        x="44"
                        y="44"
                        width="8"
                        height="8"
                        rx="1.5"
                        fill="white"
                        opacity="0.9"
                      />
                      <line
                        x1="8"
                        y1="40"
                        x2="8"
                        y2="52"
                        stroke="white"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        opacity="0.9"
                      />
                      <line
                        x1="8"
                        y1="52"
                        x2="20"
                        y2="52"
                        stroke="white"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        opacity="0.9"
                      />
                    </svg>
                  </div>
                  <span className="angle-label">Top</span>
                </button>
              </div>
            </div>

            <div className="control-group">
              <label className="control-label">Background</label>
              <select
                className="control-select"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
              >
                {backgrounds.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div className="control-group">
              <label className="control-label">Description</label>
              <textarea
                className="control-textarea"
                placeholder="Describe the scene, lighting, mood... e.g. Modern lifestyle setting, natural lighting, picnic scene."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="control-actions">
              <button
                className="btn-generate"
                onClick={handleGenerate}
                disabled={!previewUrl || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <span className="spin-icon">⟳</span> Generating...
                  </>
                ) : (
                  <>✦ Generate Image</>
                )}
              </button>
              <button
                className="btn-regenerate"
                onClick={handleRegenerate}
                disabled={!generatedImage || isGenerating}
              >
                🔄 Regenerate
              </button>
            </div>
          </div>

          {/* RIGHT — IMAGE PREVIEW */}
          <div className="dash-preview-panel">
            <div className="preview-header">
              <h2 className="panel-title">Image Preview</h2>
              {generatedImage && (
                <div className="preview-header-actions">
                  <button
                    className={`fav-btn ${isFavorited ? "fav-active" : ""}`}
                    onClick={() => setIsFavorited(!isFavorited)}
                  >
                    {isFavorited ? "★" : "☆"} Favorite
                  </button>
                  <div className="before-after-toggle">
                    <button
                      className={!showAfter ? "toggle-active" : ""}
                      onClick={() => setShowAfter(false)}
                    >
                      Before
                    </button>
                    <button
                      className={showAfter ? "toggle-active" : ""}
                      onClick={() => setShowAfter(true)}
                    >
                      After
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="angle-badge-row">
              {["Front", "Left", "Right", "Back", "Top"].map((a) => (
                <div
                  key={a}
                  className={`angle-badge ${activeAngle === a ? "angle-badge-active" : ""}`}
                  onClick={() => setActiveAngle(a)}
                >
                  {a}
                </div>
              ))}
            </div>

            <div className="preview-image-box">
              {!previewUrl && !generatedImage && (
                <div className="preview-empty">
                  <span>🖼️</span>
                  <p>Your generated image will appear here</p>
                  <p className="preview-empty-sub">
                    Upload a product and click Generate
                  </p>
                </div>
              )}
              {previewUrl && !generatedImage && !isGenerating && (
                <img src={previewUrl} alt="Preview" className="preview-img" />
              )}
              {isGenerating && (
                <div className="preview-generating-overlay">
                  <div className="preview-spinner"></div>
                  <p>Postifying your image...</p>
                  <p className="generating-angle">
                    Rendering {activeAngle} view 🎯
                  </p>
                </div>
              )}
              {generatedImage && !isGenerating && (
                <img
                  src={showAfter ? generatedImage : previewUrl}
                  alt="Result"
                  className="preview-img"
                />
              )}
            </div>

            {generatedImage && (
              <div className="preview-actions">
                <button className="btn-download" onClick={handleDownload}>
                  ⬇ Download
                </button>
                <button className="btn-approve">✓ Approve Result</button>
              </div>
            )}

            {versions.length > 0 && (
              <div className="version-history">
                <div className="version-history-header">
                  <span>▾ Version History</span>
                  <div className="version-tabs">
                    {versions.map((v, i) => (
                      <button
                        key={i}
                        className={`version-tab ${activeVersion === i ? "version-tab-active" : ""}`}
                        onClick={() => {
                          setActiveVersion(i);
                          setGeneratedImage(v.url);
                        }}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="version-thumbnails">
                  {versions.map((v, i) => (
                    <div
                      key={i}
                      className={`version-thumb ${activeVersion === i ? "version-thumb-active" : ""}`}
                      onClick={() => {
                        setActiveVersion(i);
                        setGeneratedImage(v.url);
                      }}
                    >
                      <img src={v.url} alt={v.label} />
                    </div>
                  ))}
                </div>
                {versions[activeVersion] && (
                  <p className="version-meta">
                    {versions[activeVersion].bg} |{" "}
                    {versions[activeVersion].angle} view |{" "}
                    {versions[activeVersion].time}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

