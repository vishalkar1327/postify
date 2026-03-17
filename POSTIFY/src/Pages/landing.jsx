import "./landing.css";
import { useNavigate } from "react-router-dom";

export default function Landing() {
    const nav = useNavigate();

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="landing-wrapper">

            <div className="landing-content">

                {/* NAVBAR */}
                <nav className="navbar">
                    <h2 className="logo" onClick={() => scrollTo("home")}>POSTIFY AI</h2>

                    <ul>
                        <li onClick={() => scrollTo("home")}>Home</li>
                        <li onClick={() => scrollTo("about")}>About</li>

                        {/* Subscription Plan */}
                        <li onClick={() => scrollTo("plans")}>Subscription Plan</li>

                        <li onClick={() => scrollTo("contact")}>Contact</li>
                    </ul>



                    <button onClick={() => nav("/login")}>Login</button>
                </nav>

                {/* HERO */}
                <section id="home" className="hero">
                    <h1>AI Product Image Generator</h1>
                    <p>Create professional visuals in seconds.</p>

                    <button onClick={() => nav("/signup")}>Get Started</button>
                </section>

                {/* FEATURES */}
                <section className="features">
                    <h2>Why Postify AI?</h2>

                    <div className="feature-grid">
                        <div className="feature-card">⚡ Instant AI Generation</div>
                        <div className="feature-card">🎨 Multiple Variations</div>
                        <div className="feature-card">🔄 Regenerate Images</div>
                        <div className="feature-card">⬇ Download HD Images</div>
                        <div className="feature-card">💳 Credit Based System</div>
                        <div className="feature-card">🔐 Secure Authentication</div>
                    </div>
                </section>

                {/* EXTRA FEATURES */}
                <section className="features">
                    <h2>Powerful Tools for Creators</h2>

                    <div className="feature-grid">
                        <div className="feature-card">🖼 Background Removal</div>
                        <div className="feature-card">✨ Image Enhancement</div>
                        <div className="feature-card">📐 Different Angles</div>
                        <div className="feature-card">⚡ Fast Processing</div>
                        <div className="feature-card">📁 Image History</div>
                        <div className="feature-card">☁ Cloud Storage</div>
                    </div>
                </section>

                {/* HOW IT WORKS */}
                {/* SUBSCRIPTION PLANS */}
                <section id="plans" className="steps">

                    <h2>Subscription Plans</h2>

                    <div className="step-grid">
                        <div>Starter – 120 Credits</div>
                        <div>Growth – 250 Credits</div>
                        <div>Business – 450 Credits </div>
                    </div>

                </section>

                <section className="steps">
                    <h2>How It Works</h2>

                    <div className="step-grid">
                        <div>1. Sign Up & Get Free Credits</div>
                        <div>2. Upload Product Image</div>
                        <div>3. Generate AI Visuals</div>
                        <div>4. Download or Regenerate</div>
                    </div>
                </section>

                {/* BUSINESS BENEFITS */}
                <section className="steps">
                    <h2>How Postify Helps Your Business</h2>

                    <div className="step-grid">
                        <div>Increase Product Visibility</div>
                        <div>Save Design Time</div>
                        <div>Create Professional Ads</div>
                        <div>Boost Online Sales</div>
                    </div>
                </section>

                {/* ABOUT */}
                <section id="about" className="info">
                    <h2>About Postify</h2>
                    <p>
                        Postify AI is an intelligent SaaS-based web platform designed to simplify product content creation using Artificial Intelligence. Users can sign up, log in, and upload a single product image — and the system automatically generates up to five high-quality, AI-enhanced visuals without requiring any prompts or design skills. The platform focuses on speed, simplicity, and automation, enabling users to create professional marketing assets in just a few clicks.
                        <br></br><br></br>
                        Postify AI is especially useful for e-commerce businesses, small startups, content creators, and digital marketers who need attractive product images for websites, advertisements, and social media platforms. Instead of manually designing creatives, users can instantly generate multiple variations suitable for online stores, ads, and branding campaigns.

                        <br></br><br></br>The goal of Postify AI is to reduce design effort while increasing productivity by providing an easy-to-use, AI-powered solution for visual content generation. This project demonstrates how modern web technologies and artificial intelligence can be combined to build scalable, user-friendly applications that support real-world business needs.

                    </p>
                </section>

                {/* CONTACT */}
                <section id="contact" className="contact">
                    <div className="contact-box">
                        <h2>Contact Us</h2>

                        <div className="contact-list">
                            <div>📧 postify.ai@gmail.com</div>
                            <div>📍 Gujarat, India</div>
                            <div>📞 +91 98982 21327</div>
                        </div>
                    </div>
                </section>

            </div>

            {/* FOOTER */}
            <footer className="footer">

                <div className="footer-container">

                    <div className="footer-brand">
                        <h3>POSTIFY</h3>
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
                        <p>Email: postify.ai@gmail.com</p>
                        <p>Phone: +91 98982 21327</p>
                        <p>Location: Gujarat, India</p>
                    </div>

                </div>

                <div className="footer-bottom">
                    © 2026 Postify AI. All rights reserved.
                </div>

            </footer>

        </div>
    );
}
