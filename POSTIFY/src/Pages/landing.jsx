import { useState } from "react";
import "./landing.css";
import { useNavigate } from "react-router-dom";
import logo from "../assets/postify-logo.png";

export default function Landing() {
    const nav = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        setIsMenuOpen(false); // Close menu on navigation
    };

    return (
        <div className="landing-wrapper">
            {/* Animated Background Elements */}
            <div className="landing-bg-orb orb-1"></div>
            <div className="landing-bg-orb orb-2"></div>

            <div className="landing-content">

                {/* NAVBAR */}
                <nav className="navbar">
                    <h2 className="logo" onClick={() => scrollTo("home")}>
                        <img src={logo} alt="Postify Logo" className="logo-img" />
                        <span className="text-gradient">POSTIFY AI</span>
                    </h2>

                    <ul className={isMenuOpen ? "nav-links active" : "nav-links"}>
                        <li onClick={() => scrollTo("home")}>Home</li>
                        <li onClick={() => scrollTo("about")}>About</li>
                        <li onClick={() => scrollTo("plans")}>Subscription Plan</li>
                        <li onClick={() => scrollTo("contact")}>Contact</li>
                        <li className="mobile-only" onClick={() => { nav("/login"); setIsMenuOpen(false); }}>Login</li>
                    </ul>

                    <div className="nav-actions">
                        <button className="nav-login-btn desktop-only" onClick={() => nav("/login")}>Login</button>
                        <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? "✕" : "☰"}
                        </button>
                    </div>
                </nav>

                {/* HERO */}
                <section id="home" className="hero">
                    <div className="hero-badge">✨ AI-Powered Visuals</div>
                    <h1>Create Professional <br /><span className="text-gradient">Product Images</span> Instantly</h1>
                    <p>Transform ordinary photos into stunning, high-quality visuals in seconds without any design skills.</p>

                    <div className="hero-buttons">
                        <button className="primary-btn" onClick={() => nav("/signup")}>Get Started</button>
                        <button className="secondary-btn" onClick={() => scrollTo("about")}>Learn More</button>
                    </div>
                </section>

                {/* FEATURES */}
                <section className="features">
                    <div className="section-header">
                        <h2>Why Choose <span className="text-gradient">Postify AI?</span></h2>
                        <p>Everything you need to scale your visual content creation</p>
                    </div>

                    <div className="feature-grid">
                        <div className="feature-card">
                            <div className="feature-icon">⚡</div>
                            <h3>Instant AI Generation</h3>
                            <p>Generate high-quality images from basic inputs.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🎨</div>
                            <h3>Multiple Variations</h3>
                            <p>Get up to 5 unique design options per upload.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🔄</div>
                            <h3>Regenerate Images</h3>
                            <p>Not satisfied? Regenerate variants instantly.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">⬇</div>
                            <h3>Download HD Images</h3>
                            <p>Save your product visuals in high resolution.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💳</div>
                            <h3>Credit Based System</h3>
                            <p>Pay predictably and only for what you use.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🔐</div>
                            <h3>Secure Authentication</h3>
                            <p>Your data and generations are securely stored.</p>
                        </div>
                    </div>
                </section>

                {/* EXTRA FEATURES */}
                <section className="features alt-bg">
                    <div className="section-header">
                        <h2>Powerful Tools for <span className="text-gradient">Creators</span></h2>
                    </div>

                    <div className="feature-grid">
                        <div className="feature-card glass">
                            <div className="feature-icon">🖼</div>
                            <h3>Background Removal</h3>
                        </div>
                        <div className="feature-card glass">
                            <div className="feature-icon">✨</div>
                            <h3>Image Enhancement</h3>
                        </div>
                        <div className="feature-card glass">
                            <div className="feature-icon">📐</div>
                            <h3>Different Angles</h3>
                        </div>
                        <div className="feature-card glass">
                            <div className="feature-icon">⚡</div>
                            <h3>Fast Processing</h3>
                        </div>
                        <div className="feature-card glass">
                            <div className="feature-icon">📁</div>
                            <h3>Image History</h3>
                        </div>
                        <div className="feature-card glass">
                            <div className="feature-icon">☁</div>
                            <h3>Cloud Storage</h3>
                        </div>
                    </div>
                </section>

                {/* SUBSCRIPTION PLANS */}
                <section id="plans" className="steps">
                    <div className="section-header">
                        <h2>Subscription <span className="text-gradient">Plans</span></h2>
                        <p>Choose a plan that fits your creative needs</p>
                    </div>

                    <div className="step-grid pricing-grid">
                        <div className="pricing-card">
                            <h3>Starter Plan</h3>
                            <div className="price">₹799</div>
                            <div style={{ color: "#cbd5e1", marginBottom: "20px", fontSize: "18px" }}>120 Credits</div>
                            <ul style={{ listStyle: "none", padding: 0, margin: "20px 0", textAlign: "left" }}>
                                <li style={{ margin: "10px 0", color: "#94a3b8" }}>✓ Standard Generation</li>
                                <li style={{ margin: "10px 0", color: "#94a3b8" }}>✓ Email Support</li>
                            </ul>
                            <button className="outline-btn" onClick={() => nav("/login")}>Choose Plan</button>
                        </div>
                        <div className="pricing-card popular">
                            <div className="popular-badge">Most Popular</div>
                            <h3>Growth Plan</h3>
                            <div className="price">₹1199</div>
                            <div style={{ color: "#cbd5e1", marginBottom: "20px", fontSize: "18px" }}>250 Credits</div>
                            <ul style={{ listStyle: "none", padding: 0, margin: "20px 0", textAlign: "left" }}>
                                <li style={{ margin: "10px 0", color: "#94a3b8" }}>✓ HD Generation</li>
                                <li style={{ margin: "10px 0", color: "#94a3b8" }}>✓ Priority Support</li>
                            </ul>
                            <button className="primary-btn" onClick={() => nav("/login")}>Choose Plan</button>
                        </div>
                        <div className="pricing-card">
                            <h3>Business Plan</h3>
                            <div className="price">₹1999</div>
                            <div style={{ color: "#cbd5e1", marginBottom: "20px", fontSize: "18px" }}>450 Credits</div>
                            <ul style={{ listStyle: "none", padding: 0, margin: "20px 0", textAlign: "left" }}>
                                <li style={{ margin: "10px 0", color: "#94a3b8" }}>✓ Ultra HD</li>
                                <li style={{ margin: "10px 0", color: "#94a3b8" }}>✓ Fast Processing</li>
                                <li style={{ margin: "10px 0", color: "#94a3b8" }}>✓ Priority Queue</li>
                            </ul>
                            <button className="outline-btn" onClick={() => nav("/login")}>Choose Plan</button>
                        </div>
                    </div>
                </section>

                {/* HOW IT WORKS */}
                <section className="steps alt-bg">
                    <div className="section-header">
                        <h2>How It <span className="text-gradient">Works</span></h2>
                    </div>

                    <div className="step-grid process-grid">
                        <div className="process-card">
                            <div className="step-num">1</div>
                            <h4>Sign Up & Get Free Credits</h4>
                            <p>Instantly access the platform</p>
                        </div>
                        <div className="process-card">
                            <div className="step-num">2</div>
                            <h4>Upload Product Image</h4>
                            <p>Add your raw product photo</p>
                        </div>
                        <div className="process-card">
                            <div className="step-num">3</div>
                            <h4>Generate AI Visuals</h4>
                            <p>We work our AI magic</p>
                        </div>
                        <div className="process-card">
                            <div className="step-num">4</div>
                            <h4>Download or Regenerate</h4>
                            <p>Save your HD visuals</p>
                        </div>
                    </div>
                </section>

                {/* BUSINESS BENEFITS */}
                <section className="features">
                    <div className="section-header">
                        <h2>How Postify Helps Your <span className="text-gradient">Business</span></h2>
                    </div>

                    <div className="feature-grid benefits-grid">
                        <div className="benefit-card">
                            <h4>📈 Increase Product Visibility</h4>
                        </div>
                        <div className="benefit-card">
                            <h4>⏱ Save Design Time</h4>
                        </div>
                        <div className="benefit-card">
                            <h4>🎯 Create Professional Ads</h4>
                        </div>
                        <div className="benefit-card">
                            <h4>🛍 Boost Online Sales</h4>
                        </div>
                    </div>
                </section>

                {/* ABOUT */}
                <section id="about" className="info">
                    <div className="info-container glass-panel">
                        <h2>About <span className="text-gradient">Postify</span></h2>
                        <p>
                            Postify AI is an intelligent SaaS-based web platform designed to simplify product content creation using Artificial Intelligence. Users can sign up, log in, and upload a single product image — and the system automatically generates up to five high-quality, AI-enhanced visuals without requiring any prompts or design skills. The platform focuses on speed, simplicity, and automation, enabling users to create professional marketing assets in just a few clicks.
                        </p>
                        <p>
                            Postify AI is especially useful for e-commerce businesses, small startups, content creators, and digital marketers who need attractive product images for websites, advertisements, and social media platforms. Instead of manually designing creatives, users can instantly generate multiple variations suitable for online stores, ads, and branding campaigns.
                        </p>
                        <p>
                            The goal of Postify AI is to reduce design effort while increasing productivity by providing an easy-to-use, AI-powered solution for visual content generation. This project demonstrates how modern web technologies and artificial intelligence can be combined to build scalable, user-friendly applications that support real-world business needs.
                        </p>
                    </div>
                </section>

                {/* CONTACT */}
                <section id="contact" className="contact">
                    <div className="contact-box glass-panel">
                        <h2>Contact <span className="text-gradient">Us</span></h2>
                        <div className="contact-list">
                            <div className="contact-item">
                                <span className="contact-icon">📧</span>
                                postify.ai@gmail.com
                            </div>
                            <div className="contact-item">
                                <span className="contact-icon">📍</span>
                                Gujarat, India
                            </div>

                        </div>
                    </div>
                </section>

            </div>

            {/* FOOTER */}
            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-brand">
                        <h3 className="text-gradient footer-logo">
                            <img src={logo} alt="Postify Logo" className="footer-logo-img" />
                            POSTIFY
                        </h3>
                        <p>AI-powered product image generator for modern creators and businesses.</p>
                    </div>

                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li onClick={() => scrollTo("home")}>Home</li>
                            <li onClick={() => scrollTo("about")}>About</li>
                            <li onClick={() => scrollTo("contact")}>Contact</li>
                            <li onClick={() => nav("/login")}>Login</li>
                        </ul>
                    </div>

                    <div className="footer-contact">
                        <h4>Contact</h4>
                        <p>📧 postify.ai@gmail.com</p>
                        <p>📍 Gujarat, India</p>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="divider"></div>
                    <p>© 2026 Postify AI. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
