import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import "./dashboard.css";
import postifyLogo from "../assets/postify-logo.png";

/* ─────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────── */
const INIT_USERS = [
  { id: 1, name: "Vishal Sharma", email: "vishal@postify.ai", plan: "Business", credits: 420, images: 38, status: "Active", joined: "2024-11-10" },
  { id: 2, name: "Rahul Mehta", email: "rahul@postify.ai", plan: "Free", credits: 25, images: 6, status: "Active", joined: "2024-12-01" },
  { id: 3, name: "Amit Verma", email: "amit@postify.ai", plan: "Growth", credits: 180, images: 21, status: "Blocked", joined: "2024-10-22" },
  { id: 4, name: "Priya Kapoor", email: "priya@postify.ai", plan: "Starter", credits: 90, images: 14, status: "Active", joined: "2025-01-05" },
  { id: 5, name: "Sneha Joshi", email: "sneha@postify.ai", plan: "Business", credits: 390, images: 45, status: "Active", joined: "2025-01-18" },
];

const INIT_TRANSACTIONS = [
  { id: 1001, user: "Vishal Sharma", plan: "Business", amount: 1999, credits: 450, paymentMethod: "UPI", upiId: "vishal@upi", bank: "HDFC", transactionId: "TXN83920012", status: "Success", date: "2025-03-10", time: "10:32 AM" },
  { id: 1002, user: "Priya Kapoor", plan: "Starter", amount: 799, credits: 120, paymentMethod: "Card", upiId: "—", bank: "ICICI", transactionId: "TXN73812911", status: "Success", date: "2025-03-08", time: "3:15 PM" },
  { id: 1003, user: "Rahul Mehta", plan: "Growth", amount: 1199, credits: 250, paymentMethod: "UPI", upiId: "rahul@upi", bank: "SBI", transactionId: "TXN62719833", status: "Failed", date: "2025-03-06", time: "7:44 PM" },
  { id: 1004, user: "Sneha Joshi", plan: "Business", amount: 1999, credits: 450, paymentMethod: "UPI", upiId: "sneha@upi", bank: "Axis", transactionId: "TXN59283710", status: "Success", date: "2025-03-04", time: "11:00 AM" },
];

const REVENUE_DATA = [
  { day: "Mar 5", revenue: 3200 }, { day: "Mar 6", revenue: 1800 },
  { day: "Mar 7", revenue: 4500 }, { day: "Mar 8", revenue: 2900 },
  { day: "Mar 9", revenue: 5100 }, { day: "Mar 10", revenue: 6800 },
  { day: "Mar 11", revenue: 4200 },
];

const GEN_DATA = [
  { day: "Mar 5", gens: 18 }, { day: "Mar 6", gens: 32 },
  { day: "Mar 7", gens: 27 }, { day: "Mar 8", gens: 41 },
  { day: "Mar 9", gens: 55 }, { day: "Mar 10", gens: 48 },
  { day: "Mar 11", gens: 63 },
];

const INIT_PLANS = [
  { name: "Starter", price: 799, credits: 120, features: "Standard Generation,Email Support" },
  { name: "Growth", price: 1199, credits: 250, features: "HD Generation,Priority Support" },
  { name: "Business", price: 1999, credits: 450, features: "Ultra HD,Fast Processing,Priority Queue" },
];

const INIT_NOTIFS = [
  { id: 1, type: "signup", msg: "New user Sneha Joshi signed up", time: "2 min ago", read: false },
  { id: 2, type: "payment", msg: "Payment ₹1999 received from Vishal", time: "1 hr ago", read: false },
  { id: 3, type: "alert", msg: "Admin API credits below 200", time: "3 hr ago", read: false },
  { id: 4, type: "fail", msg: "Transaction TXN62719833 failed", time: "Yesterday", read: true },
  { id: 5, type: "signup", msg: "New user Priya Kapoor signed up", time: "Yesterday", read: true },
];

const INIT_GEN_HISTORY = [
  { id: "GEN001", user: "Vishal Sharma", date: "2025-03-11", time: "10:15 AM", preset: "Ecommerce", background: "Studio", description: "Clean white background product shot", angle: "Center", creditsUsed: 8, status: "Success", thumbnail: null },
  { id: "GEN002", user: "Sneha Joshi", date: "2025-03-10", time: "3:45 PM", preset: "Instagram", background: "Luxury", description: "Luxury feel with golden accents", angle: "Top Center", creditsUsed: 8, status: "Success", thumbnail: null },
  { id: "GEN003", user: "Priya Kapoor", date: "2025-03-09", time: "11:00 AM", preset: "White BG", background: "Minimal", description: "Minimal clean look for social", angle: "Center Right", creditsUsed: 8, status: "Success", thumbnail: null },
];

/* ─────────────────────────────────────────
   STYLES — FONTS UPDATED
───────────────────────────────────────── */
const injectStyles = () => {
  if (document.getElementById("postify-admin-styles")) return;
  const style = document.createElement("style");
  style.id = "postify-admin-styles";
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&family=Sora:wght@400;500;600;700;800&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg:#080b12; --surface:#0e1420; --surface2:#141c2e; --surface3:#1a2540;
      --border:rgba(99,140,255,0.10); --border2:rgba(99,140,255,0.18);
      --accent:#4f8eff; --accent2:#00e5b0; --warn:#ffb547; --danger:#ff4d6d;
      --text:#e8edf8; --muted:#5a6a8a; --muted2:#8494b8;
      --font:'Plus Jakarta Sans',sans-serif;
      --mono:'JetBrains Mono',monospace;
      --display:'Sora',sans-serif;
    }
    body { background:var(--bg); color:var(--text); font-family:var(--font); -webkit-font-smoothing:antialiased; }
    .pa-layout { display:flex; min-height:100vh; }
    .pa-sidebar { width:220px; min-height:100vh; background:var(--surface); border-right:1px solid var(--border); display:flex; flex-direction:column; position:fixed; left:0; top:0; z-index:100; padding-bottom:24px; transition: transform 0.3s ease; }
    .pa-sidebar-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); backdrop-filter:blur(4px); z-index:95; }
    .pa-mobile-toggle { display:none; background:var(--surface2); border:1px solid var(--border2); color:white; width:40px; height:40px; border-radius:10px; cursor:pointer; align-items:center; justify-content:center; font-size:18px; }
    .pa-logo { padding:24px 20px; display:flex; align-items:center; gap:10px; cursor:pointer; }
    .pa-logo-mark { height:48px; width:auto; display:flex; align-items:center; justify-content:center; flex-shrink:0; pointer-events: none; filter: drop-shadow(0 0 8px rgba(79,142,255,0.15)); }
    .pa-logo-text { font-family:var(--display); font-weight:800; font-size:24px; letter-spacing:0.8px; line-height:1; background:linear-gradient(to right, #fff, #8494b8); -webkit-background-clip:text; -webkit-text-fill-color:transparent; pointer-events: none; }
    .pa-nav { flex:1; padding:16px 10px; display:flex; flex-direction:column; gap:2px; overflow-y:auto; }
    .pa-nav-section { font-family:var(--font); font-size:10px; font-weight:700; letter-spacing:0.12em; color:var(--muted); text-transform:uppercase; padding:10px 10px 4px; }
    .pa-nav-item { display:flex; align-items:center; gap:10px; padding:9px 10px; border-radius:8px; cursor:pointer; font-family:var(--font); font-size:13px; font-weight:500; color:var(--muted2); transition:all 0.18s; border:1px solid transparent; }
    .pa-nav-item:hover { background:var(--surface2); color:var(--text); }
    .pa-nav-item.active { background:rgba(79,142,255,0.12); color:var(--accent); border-color:rgba(79,142,255,0.2); font-weight:600; }
    .pa-nav-item .ni { font-size:15px; width:18px; text-align:center; }
    .pa-nav-badge { margin-left:auto; background:var(--danger); color:white; font-size:10px; font-weight:700; padding:1px 6px; border-radius:20px; font-family:var(--mono); }
    .pa-nav-badge.green { background:var(--accent2); color:#000; }
    .pa-sidebar-bottom { padding:12px 10px 0; border-top:1px solid var(--border); display:flex; flex-direction:column; gap:6px; }
    .pa-user-row { display:flex; align-items:center; gap:10px; padding:8px 10px; border-radius:8px; cursor:pointer; transition:background 0.18s; }
    .pa-user-row:hover { background:var(--surface2); }
    .pa-avatar { width:32px; height:32px; border-radius:50%; background:linear-gradient(135deg,var(--accent),var(--accent2)); display:flex; align-items:center; justify-content:center; font-family:var(--display); font-size:12px; font-weight:800; color:white; flex-shrink:0; }
    .pa-user-name { font-family:var(--font); font-size:13px; font-weight:700; }
    .pa-user-role { font-family:var(--mono); font-size:10px; color:var(--accent2); letter-spacing:0.05em; }
    .pa-logout { display:flex; align-items:center; gap:8px; padding:8px 10px; border-radius:8px; cursor:pointer; font-family:var(--font); font-size:13px; font-weight:500; color:var(--danger); transition:background 0.18s; border:none; background:transparent; width:100%; }
    .pa-logout:hover { background:rgba(255,77,109,0.1); }
    .pa-main { margin-left:220px; flex:1; min-height:100vh; transition: margin-left 0.3s ease; }
    .pa-topbar { padding:16px 28px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--border); position:sticky; top:0; background:rgba(8,11,18,0.88); backdrop-filter:blur(14px); z-index:50; gap:12px; }
    .pa-topbar-left { display:flex; align-items:center; gap:12px; }
    .pa-page-title { font-family:var(--display); font-size:24px; font-weight:800; letter-spacing:-0.02em; }
    .pa-topbar-right { display:flex; align-items:center; gap:10px; }
    .pa-notif-btn { position:relative; width:40px; height:40px; background:var(--accent); border:none; border-radius:10px; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:17px; color:#fff; }
    .pa-notif-dot { position:absolute; top:6px; right:6px; width:8px; height:8px; border-radius:50%; background:var(--danger); border:2px solid var(--bg); }
    .pa-api-pill { display:flex; align-items:center; gap:8px; background:var(--surface2); border:1px solid var(--border2); padding:8px 16px; border-radius:10px; font-family:var(--font); font-size:13px; font-weight:500; }
    .pa-api-dot { width:8px; height:8px; border-radius:50%; background:var(--accent2); animation:blink 2s infinite; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
    .pa-api-val { font-family:var(--mono); font-weight:700; font-size:14px; color:var(--accent2); }
    .pa-content { padding:28px; }
    .pa-section-hd { font-family:var(--display); font-size:18px; font-weight:700; letter-spacing:-0.02em; margin-bottom:18px; display:flex; align-items:center; gap:10px; color:var(--text); }
    .pa-section-hd::after { content:''; flex:1; height:1px; background:var(--border); }
    .pa-filter-row { display:flex; gap:10px; margin-bottom:22px; }
    .pa-filter-btn { padding:10px 22px; border-radius:12px; font-family:var(--font); font-size:13px; font-weight:700; cursor:pointer; border:2px solid var(--border2); background:var(--surface2); color:var(--muted2); transition:all 0.18s; }
    .pa-filter-btn:hover,.pa-filter-btn.active { background:var(--surface3); color:var(--text); border-color:var(--border2); }
    .pa-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:24px; }
    .pa-stat { background:var(--surface2); border:1px solid var(--border); border-radius:14px; padding:20px 22px; position:relative; overflow:hidden; transition:border-color 0.2s; }
    .pa-stat:hover { border-color:var(--border2); }
    .pa-stat::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; }
    .pa-stat.c1::before{background:var(--accent)} .pa-stat.c2::before{background:var(--accent2)} .pa-stat.c3::before{background:var(--warn)} .pa-stat.c4::before{background:var(--danger)} .pa-stat.c5::before{background:#a78bfa} .pa-stat.c6::before{background:#f472b6}
    .pa-stat-label { font-family:var(--font); font-size:10.5px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--muted2); margin-bottom:12px; }
    .pa-stat-val { font-family:var(--display); font-size:38px; font-weight:800; letter-spacing:-0.03em; line-height:1; margin-bottom:8px; }
    .pa-stat-sub { font-family:var(--font); font-size:12px; font-weight:500; color:var(--muted); }
    .pa-stat-sub .up{color:var(--accent2)} .pa-stat-sub .dn{color:var(--danger)}
    .pa-charts { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:24px; }
    .pa-chart-card { background:var(--surface2); border:1px solid var(--border); border-radius:14px; padding:22px; }
    .pa-chart-title { font-family:var(--display); font-size:14px; font-weight:700; letter-spacing:-0.01em; margin-bottom:18px; }
    .custom-tooltip { background:var(--surface3); border:1px solid var(--border2); border-radius:8px; padding:10px 14px; font-family:var(--mono); font-size:12px; }
    .pa-quick { display:flex; gap:10px; margin-bottom:24px; flex-wrap:wrap; }
    .pa-quick-btn { display:flex; align-items:center; gap:7px; padding:10px 18px; border-radius:10px; font-family:var(--font); font-size:13px; font-weight:600; cursor:pointer; border:1px solid var(--border2); background:var(--surface2); color:var(--text); transition:all 0.2s; }
    .pa-quick-btn:hover { background:var(--surface3); border-color:var(--accent); color:var(--accent); transform:translateY(-1px); }
    .pa-system { display:flex; gap:12px; flex-wrap:wrap; }
    .pa-sys-pill { display:flex; align-items:center; gap:7px; background:var(--surface2); border:1px solid var(--border); padding:9px 15px; border-radius:10px; font-family:var(--font); font-size:12.5px; font-weight:500; color:var(--muted2); }
    .pa-sys-dot { width:7px; height:7px; border-radius:50%; }
    .pa-sys-dot.green{background:var(--accent2)} .pa-sys-dot.blue{background:var(--accent)} .pa-sys-dot.warn{background:var(--warn)}
    .pa-activity { background:var(--surface2); border:1px solid var(--border); border-radius:14px; padding:22px; margin-top:22px; }
    .pa-activity-item { display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid var(--border); }
    .pa-activity-item:last-child { border-bottom:none; }
    .pa-activity-dot { width:8px; height:8px; border-radius:50%; background:var(--accent); flex-shrink:0; }
    .pa-activity-text { flex:1; font-family:var(--font); font-size:13px; }
    .pa-activity-time { font-family:var(--mono); font-size:11px; color:var(--muted); }
    .pa-table-wrap { background:var(--surface2); border:1px solid var(--border); border-radius:14px; overflow-x:auto; }
    .pa-table-toolbar { padding:16px 20px; display:flex; align-items:center; gap:12px; border-bottom:1px solid var(--border); flex-wrap:wrap; }
    .pa-search { flex:1; min-width:200px; background:var(--surface3); border:1px solid var(--border2); border-radius:10px; padding:10px 16px; font-family:var(--font); font-size:13.5px; font-weight:500; color:var(--text); outline:none; transition:border-color 0.18s; }
    .pa-search:focus { border-color:var(--accent); }
    .pa-search::placeholder { color:var(--muted); }
    .pa-btn { padding:10px 18px; border-radius:10px; font-family:var(--font); font-size:13px; font-weight:700; cursor:pointer; border:2px solid var(--border2); background:var(--surface3); color:var(--text); transition:all 0.18s; display:flex; align-items:center; gap:6px; }
    .pa-btn:hover { border-color:var(--accent); color:var(--accent); }
    .pa-btn.primary { background:var(--surface3); border-color:var(--border2); color:var(--text); }
    .pa-btn.primary:hover { border-color:var(--accent2); color:var(--accent2); }
    .pa-btn.danger { border-color:var(--danger); color:var(--danger); }
    .pa-btn.danger:hover { background:rgba(255,77,109,0.1); }
    .pa-btn.success { border-color:var(--accent2); color:var(--accent2); }
    .pa-btn.success:hover { background:rgba(0,229,176,0.1); }
    table { width:100%; border-collapse:collapse; }
    thead tr { border-bottom:1px solid var(--border); }
    th { padding:13px 20px; text-align:left; font-family:var(--font); font-size:10.5px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--muted2); }
    tbody tr { border-bottom:1px solid var(--border); transition:background 0.15s; cursor:pointer; }
    tbody tr:last-child { border-bottom:none; }
    tbody tr:hover { background:var(--surface3); }
    td { padding:14px 20px; font-family:var(--font); font-size:14px; font-weight:500; }
    .pa-badge { padding:4px 12px; border-radius:20px; font-family:var(--mono); font-size:11px; font-weight:600; display:inline-block; letter-spacing:0.02em; }
    .pa-badge.active{background:rgba(0,229,176,0.15);color:var(--accent2)} .pa-badge.blocked{background:rgba(255,77,109,0.15);color:var(--danger)}
    .pa-badge.success{background:rgba(0,229,176,0.15);color:var(--accent2)} .pa-badge.failed{background:rgba(255,77,109,0.15);color:var(--danger)}
    .pa-badge.free{background:rgba(90,106,138,0.25);color:var(--muted2)} .pa-badge.starter{background:rgba(79,142,255,0.15);color:var(--accent)}
    .pa-badge.growth{background:rgba(255,181,71,0.15);color:var(--warn)} .pa-badge.business{background:rgba(167,139,250,0.15);color:#a78bfa}
    .pa-plans-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:26px; }
    .pa-plan-card { background:var(--surface2); border:1px solid var(--border); border-radius:14px; padding:24px; transition:all 0.2s; position:relative; }
    .pa-plan-card:hover { border-color:var(--border2); }
    .pa-plan-card.featured { border-color:rgba(79,142,255,0.4); }
    .pa-plan-name { font-family:var(--display); font-size:19px; font-weight:800; letter-spacing:-0.02em; margin-bottom:4px; }
    .pa-plan-price { font-family:var(--mono); font-size:30px; font-weight:700; color:var(--accent); margin-bottom:16px; }
    .pa-plan-price span { font-family:var(--font); font-size:13px; font-weight:400; color:var(--muted); }
    .pa-plan-feat { list-style:none; margin-bottom:18px; display:flex; flex-direction:column; gap:8px; }
    .pa-plan-feat li { font-family:var(--font); font-size:13px; font-weight:400; color:var(--muted2); display:flex; align-items:center; gap:8px; }
    .pa-plan-feat li::before { content:'✓'; color:var(--accent2); font-weight:700; }
    .pa-plan-users { font-family:var(--mono); font-size:11px; color:var(--muted); margin-bottom:14px; }
    .pa-popular-tag { position:absolute; top:-1px; right:16px; background:var(--accent); color:white; font-family:var(--mono); font-size:10px; font-weight:700; padding:4px 12px; border-radius:0 0 10px 10px; letter-spacing:0.06em; }
    .pa-plan-form { background:var(--surface2); border:1px solid var(--border); border-radius:14px; padding:24px; margin-bottom:26px; }
    .pa-form-title { font-family:var(--display); font-size:16px; font-weight:700; letter-spacing:-0.02em; margin-bottom:18px; }
    .pa-form-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; margin-bottom:14px; }
    .pa-input { background:var(--surface3); border:1px solid var(--border2); border-radius:10px; padding:10px 14px; font-family:var(--font); font-size:13px; font-weight:500; color:var(--text); outline:none; width:100%; transition:border-color 0.18s; }
    .pa-input:focus { border-color:var(--accent); }
    .pa-input::placeholder { color:var(--muted); }
    .pa-input-label { font-family:var(--font); font-size:10.5px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--muted2); margin-bottom:6px; }
    .pa-credits-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:26px; }
    .pa-credit-card { background:var(--surface2); border:1px solid var(--border); border-radius:14px; padding:24px; }
    .pa-credit-title { font-family:var(--display); font-size:16px; font-weight:700; letter-spacing:-0.02em; margin-bottom:18px; }
    .pa-progress-bg { height:8px; background:var(--surface3); border-radius:4px; overflow:hidden; margin:12px 0; }
    .pa-progress-fill { height:100%; border-radius:4px; transition:width 0.5s ease; }
    .pa-progress-fill.blue{background:linear-gradient(90deg,var(--accent),#7bb8ff)} .pa-progress-fill.green{background:linear-gradient(90deg,var(--accent2),#7fffdf)}
    .pa-credit-stats { display:flex; justify-content:space-between; font-family:var(--mono); font-size:12px; color:var(--muted2); }
    .pa-credit-big { font-family:var(--display); font-size:48px; font-weight:800; letter-spacing:-0.03em; color:var(--accent2); line-height:1; margin-bottom:4px; }
    .pa-notif-list { display:flex; flex-direction:column; gap:10px; }
    .pa-notif-item { display:flex; align-items:flex-start; gap:14px; background:var(--surface2); border:1px solid var(--border); border-radius:12px; padding:15px 18px; transition:all 0.18s; cursor:pointer; }
    .pa-notif-item.unread { border-left:3px solid var(--accent); }
    .pa-notif-item:hover { background:var(--surface3); }
    .pa-notif-icon { font-size:20px; flex-shrink:0; margin-top:1px; }
    .pa-notif-content { flex:1; }
    .pa-notif-msg { font-family:var(--font); font-size:13.5px; font-weight:500; margin-bottom:4px; line-height:1.5; }
    .pa-notif-time { font-family:var(--mono); font-size:11px; color:var(--muted); }
    .pa-unread-dot { width:8px; height:8px; border-radius:50%; background:var(--accent); flex-shrink:0; margin-top:6px; }
    .pa-modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.78); backdrop-filter:blur(10px); z-index:200; display:flex; align-items:center; justify-content:center; }
    .pa-modal { background:var(--surface2); border:1px solid var(--border2); border-radius:16px; padding:30px; width:500px; max-width:94vw; position:relative; animation:modalIn 0.28s cubic-bezier(0.34,1.56,0.64,1); max-height:90vh; overflow-y:auto; }
    @keyframes modalIn { from{transform:scale(0.92);opacity:0} }
    .pa-modal-title { font-family:var(--display); font-size:22px; font-weight:800; letter-spacing:-0.02em; margin-bottom:6px; }
    .pa-modal-sub { font-family:var(--font); font-size:13.5px; font-weight:400; color:var(--muted2); margin-bottom:24px; }
    .pa-modal-close { position:absolute; top:16px; right:16px; width:32px; height:32px; border-radius:8px; background:var(--surface3); border:none; cursor:pointer; color:var(--muted2); font-size:16px; display:flex; align-items:center; justify-content:center; transition:all 0.18s; }
    .pa-modal-close:hover { color:var(--text); }
    .pa-form-row { display:flex; flex-direction:column; gap:14px; }
    .pa-form-field { display:flex; flex-direction:column; gap:6px; }
    .pa-settings-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
    .pa-settings-card { background:var(--surface2); border:1px solid var(--border); border-radius:14px; padding:22px; transition:all 0.2s; }
    .pa-settings-card:hover { border-color:var(--border2); }
    .pa-settings-icon { font-size:24px; margin-bottom:10px; }
    .pa-settings-title { font-family:var(--display); font-size:15px; font-weight:700; letter-spacing:-0.01em; margin-bottom:5px; }
    .pa-settings-desc { font-family:var(--font); font-size:12.5px; font-weight:400; color:var(--muted2); margin-bottom:14px; line-height:1.6; }
    .pa-toast { position:fixed; bottom:24px; right:24px; background:var(--surface2); border:1px solid var(--accent2); border-radius:12px; padding:14px 20px; display:flex; align-items:center; gap:10px; font-family:var(--font); font-size:13.5px; font-weight:500; z-index:999; transform:translateY(60px); opacity:0; transition:all 0.32s cubic-bezier(0.34,1.56,0.64,1); max-width:320px; }
    .pa-toast.show { transform:translateY(0); opacity:1; }
    ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px}
    .pa-select { background:var(--surface2); border:1px solid var(--border2); border-radius:10px; padding:9px 13px; font-family:var(--font); font-size:13px; font-weight:500; color:var(--text); outline:none; cursor:pointer; }
    .pa-select:focus { border-color:var(--accent); }
    .pa-textarea { background:var(--surface2); border:1px solid var(--border2); border-radius:10px; padding:12px 14px; font-family:var(--font); font-size:13.5px; font-weight:400; color:var(--text); outline:none; width:100%; resize:none; height:100px; transition:border-color 0.18s; }
    .pa-textarea:focus { border-color:var(--accent); }
    .pa-textarea::placeholder { color:var(--muted); }
    .pa-topup-targets { display:flex; flex-direction:column; gap:10px; max-height:200px; overflow-y:auto; margin-bottom:14px; }
    .pa-topup-user { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:10px; border:1px solid var(--border); background:var(--surface2); cursor:pointer; transition:all 0.18s; }
    .pa-topup-user:hover,.pa-topup-user.selected { border-color:var(--accent); background:rgba(79,142,255,0.07); }
    .pa-topup-name { font-family:var(--font); font-size:13px; font-weight:600; flex:1; }
    .pa-topup-credits { font-family:var(--mono); font-size:12px; color:var(--muted2); }
    .pa-gen-layout { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
    .pa-gen-card { background:var(--surface2); border:1px solid var(--border); border-radius:14px; padding:22px; }
    .pa-preset-row { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:16px; }
    .pa-preset { padding:6px 12px; border-radius:6px; font-family:var(--font); font-size:12px; font-weight:500; cursor:pointer; border:1px solid var(--border2); background:var(--surface2); color:var(--muted2); transition:all 0.18s; }
    .pa-preset:hover,.pa-preset.active { border-color:var(--accent); color:var(--accent); background:rgba(79,142,255,0.1); }
    .pa-upload-label { display:flex; align-items:center; justify-content:center; gap:8px; border:2px dashed var(--border2); border-radius:10px; padding:22px; cursor:pointer; font-family:var(--font); font-size:14px; font-weight:500; color:var(--muted2); transition:all 0.2s; margin-bottom:14px; }
    .pa-upload-label:hover { border-color:var(--accent); color:var(--accent); background:rgba(79,142,255,0.04); }
    .pa-angle-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:6px; margin-bottom:14px; }
    .pa-angle-btn { padding:8px; border-radius:6px; font-family:var(--font); font-size:12px; font-weight:500; cursor:pointer; border:1px solid var(--border2); background:var(--surface2); color:var(--muted2); transition:all 0.18s; text-align:center; }
    .pa-angle-btn:hover,.pa-angle-btn.active { border-color:var(--accent); color:var(--accent); background:rgba(79,142,255,0.1); }
    .pa-preview-box { width:100%; aspect-ratio:1; border-radius:12px; overflow:hidden; background:var(--surface2); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; color:var(--muted); font-size:14px; margin-bottom:12px; position:relative; }
    .pa-preview-box img { width:100%; height:100%; object-fit:cover; }
    .pa-gen-shimmer { position:absolute; inset:0; background:linear-gradient(135deg,var(--surface2) 0%,var(--surface3) 25%,rgba(79,142,255,0.15) 50%,var(--surface3) 75%,var(--surface2) 100%); background-size:400% 400%; animation:shimmerAnim 1.5s ease infinite; }
    @keyframes shimmerAnim { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
    .pa-gen-shimmer-text { position:absolute; bottom:16px; left:0; right:0; text-align:center; font-family:var(--mono); font-size:13px; color:var(--accent); animation:pulse 1.5s ease infinite; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
    .pa-gen-progress { position:absolute; bottom:0; left:0; height:3px; background:linear-gradient(90deg,var(--accent),var(--accent2)); border-radius:0 0 12px 12px; animation:progressBar 1.8s ease-in-out forwards; }
    @keyframes progressBar { from{width:0%} to{width:100%} }
    .pa-gen-result { animation:resultReveal 0.5s cubic-bezier(0.34,1.4,0.64,1); }
    @keyframes resultReveal { from{transform:scale(0.95);opacity:0} }
    .pa-thumbs { display:flex; gap:8px; }
    .pa-thumb { width:64px; height:64px; border-radius:8px; overflow:hidden; border:1px solid var(--border); cursor:pointer; transition:all 0.18s; position:relative; }
    .pa-thumb:hover { border-color:var(--accent); transform:scale(1.05); }
    .pa-thumb img { width:100%; height:100%; object-fit:cover; }
    .pa-thumb-shimmer { width:100%; height:100%; background:linear-gradient(135deg,var(--surface2),var(--surface3),rgba(79,142,255,0.2)); background-size:200% 200%; animation:shimmerAnim 1.5s ease infinite; }
    .pa-thumb-shimmer-delay1{animation-delay:0.1s} .pa-thumb-shimmer-delay2{animation-delay:0.2s} .pa-thumb-shimmer-delay3{animation-delay:0.3s}
    .pa-history-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:16px; margin-bottom:24px; }
    .pa-history-card { background:var(--surface2); border:1px solid var(--border); border-radius:14px; overflow:hidden; transition:all 0.2s; cursor:pointer; }
    .pa-history-card:hover { border-color:var(--border2); transform:translateY(-2px); }
    .pa-history-img { width:100%; aspect-ratio:1; background:var(--surface2); display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; }
    .pa-history-img img { width:100%; height:100%; object-fit:cover; }
    .pa-history-img-placeholder { width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,var(--surface2),var(--surface3)); font-size:32px; }
    .pa-history-body { padding:14px; }
    .pa-history-user { font-family:var(--font); font-size:13.5px; font-weight:700; margin-bottom:6px; }
    .pa-history-meta { display:flex; flex-direction:column; gap:4px; }
    .pa-history-row { display:flex; gap:6px; align-items:center; font-family:var(--font); font-size:12px; color:var(--muted2); }
    .pa-history-row b { color:var(--text); }
    .pa-history-footer { padding:10px 14px; border-top:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; font-family:var(--mono); font-size:11px; }
    .pa-history-detail { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:18px; }
    .pa-detail-field { background:var(--surface3); border:1px solid var(--border); border-radius:10px; padding:12px 14px; }
    .pa-detail-label { font-family:var(--font); font-size:10px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--muted); margin-bottom:4px; }
    .pa-detail-val { font-family:var(--mono); font-size:13.5px; font-weight:500; }
    .pa-detail-full { grid-column:1/-1; background:var(--surface3); border:1px solid var(--border); border-radius:10px; padding:12px 14px; }
    @media(max-width:900px){
      .pa-stats{grid-template-columns:repeat(2,1fr)} .pa-charts{grid-template-columns:1fr}
      .pa-plans-grid{grid-template-columns:1fr} .pa-credits-grid{grid-template-columns:1fr}
      .pa-settings-grid{grid-template-columns:1fr 1fr} .pa-gen-layout{grid-template-columns:1fr}
      .pa-form-grid{grid-template-columns:1fr 1fr}
    }
    @media(max-width:768px){
      .pa-sidebar { transform: translateX(-220px); }
      .pa-sidebar.open { transform: translateX(0); }
      .pa-sidebar-overlay.show { display: block; }
      .pa-mobile-toggle { display: flex; }
      .pa-main { margin-left: 0; }
      .pa-topbar { padding: 12px 16px; }
      .pa-page-title { font-size: 18px; }
      .pa-content { padding: 16px; }
      .pa-stats { grid-template-columns: 1fr; }
      .pa-api-pill span:not(.pa-api-val) { display: none; }
      .pa-table-toolbar { flex-direction: column; align-items: stretch; }
      .pa-search { width: 100%; }
      .pa-gen-layout { grid-template-columns: 1fr; }
      .pa-history-grid { grid-template-columns: 1fr; }
    }
    @media(max-width:480px){
      .pa-settings-grid { grid-template-columns: 1fr; }
      .pa-form-grid { grid-template-columns: 1fr; }
      .pa-topbar-right { gap: 6px; }
    }
  `;
  document.head.appendChild(style);
};

const CustomTooltip = ({ active, payload, label, prefix = "" }) => {
  if (active && payload && payload.length)
    return (
      <div className="custom-tooltip">
        <div style={{ color: "var(--muted2)", marginBottom: 4, fontSize: 11 }}>{label}</div>
        <div style={{ fontFamily: "var(--mono)", fontWeight: 600, color: "var(--accent2)" }}>{prefix}{payload[0].value}</div>
      </div>
    );
  return null;
};

export default function PostifyAdmin() {
  injectStyles();

  const adminUser = { name: "Admin", role: "SUPER ADMIN" };

  const [view, setView] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('postify_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Failed to parse users", e);
      }
    }
    // Only set mock data if no real data exists
    localStorage.setItem('postify_users', JSON.stringify(INIT_USERS));
    return INIT_USERS;
  });
  const [plans, setPlans] = useState(() => {
    const saved = localStorage.getItem('postify_plans');
    if (saved) return JSON.parse(saved);
    localStorage.setItem('postify_plans', JSON.stringify(INIT_PLANS));
    return INIT_PLANS;
  });
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('postify_transactions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) { }
    }
    return INIT_TRANSACTIONS;
  });
  const [notifs, setNotifs] = useState(() => {
    const saved = localStorage.getItem('postify_notifications');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) { }
    }
    return INIT_NOTIFS;
  });
  const [adminCredits, setAdminCredits] = useState(1080);
  const [search, setSearch] = useState("");
  const [txFilter, setTxFilter] = useState("All");
  const [filterDay, setFilterDay] = useState("7 Days");
  const [toast, setToast] = useState({ show: false, msg: "" });
  const [modal, setModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [preview, setPreview] = useState(null);
  const [desc, setDesc] = useState("");
  const [bg, setBg] = useState("Studio");
  const [angle, setAngle] = useState("Center");
  const [generating, setGenerating] = useState(false);
  const [genDone, setGenDone] = useState(false);
  const [topupUser, setTopupUser] = useState(null);
  const [topupAmt, setTopupAmt] = useState("");
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [genHistory, setGenHistory] = useState(() => {
    const saved = localStorage.getItem('postify_generations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) { }
    }
    return INIT_GEN_HISTORY;
  });
  const [historyFilter, setHistoryFilter] = useState("All");
  const [newUser, setNewUser] = useState({ name: "", email: "", plan: "Free", credits: 20 });
  const [newPlan, setNewPlan] = useState({ name: "", price: "", credits: "", features: "" });
  const [editingPlan, setEditingPlan] = useState(null);

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

  const styles = ["Ecommerce", "Instagram Ad", "Luxury Product", "White Background"];
  const backgrounds = ["Outdoor", "Studio", "Lifestyle", "Minimal", "Nature", "Urban"];
  const angles = ["Front", "Left", "Right", "Back", "Top"];

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
  const handleGenerateStudio = () => {
    if (!previewUrl || isGenerating) return;
    setIsGenerating(true);
    setAdminCredits((c) => Math.max(0, c - 8));
    setTimeout(() => {
      setGeneratedImage(previewUrl);
      const time = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
      const date = new Date().toISOString().split("T")[0];
      const newVersion = { url: previewUrl, label: `Version ${versions.length + 1}`, bg: background, angle: activeAngle, style: activeStyle, time, desc: description };
      setVersions((prev) => {
        const updated = [...prev, newVersion];
        setActiveVersion(updated.length - 1);
        return updated;
      });
      setGenHistory(prev => [{
        id: "GEN" + Date.now(), user: adminUser.name,
        date, time,
        preset: activeStyle, background,
        description: description || "(No description)", angle: activeAngle,
        creditsUsed: 8, status: "Success", thumbnail: previewUrl,
      }, ...prev]);
      setIsGenerating(false);
      setShowAfter(true);
      showToast(`Image generated! ${activeStyle} · ${background}`);
    }, 3000);
  };
  const handleRegenerate = () => { if (!generatedImage || isGenerating) return; handleGenerateStudio(); };
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `postify-${activeStyle.replace(" ", "-").toLowerCase()}.jpg`;
    link.click();
    showToast("Downloading...");
  };
  const handleApprove = () => { showToast("✓ Result approved & saved to assets!"); };
  const toggleFav = () => { const newFav = !isFavorited; setIsFavorited(newFav); showToast(newFav ? "Added to favorites!" : "Removed from favorites"); };
  const selectVersion = (i) => { setActiveVersion(i); setGeneratedImage(versions[i].url); };

  const angleSVGs = {
    Front: (<svg viewBox="0 0 60 60" fill="none"><rect x="8" y="8" width="8" height="8" rx="1.5" fill="white" opacity="0.9" /><polyline points="52,28 52,52 28,52" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" /></svg>),
    Left: (<svg viewBox="0 0 60 60" fill="none"><rect x="8" y="8" width="8" height="8" rx="1.5" fill="white" opacity="0.9" /><polyline points="8,28 8,52 32,52" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" /></svg>),
    Right: (<svg viewBox="0 0 60 60" fill="none"><line x1="30" y1="10" x2="30" y2="50" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.9" /><line x1="10" y1="30" x2="50" y2="30" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.9" /></svg>),
    Back: (<svg viewBox="0 0 60 60" fill="none"><rect x="44" y="8" width="8" height="8" rx="1.5" fill="white" opacity="0.9" /><polyline points="8,8 8,36 36,36" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" /></svg>),
    Top: (<svg viewBox="0 0 60 60" fill="none"><line x1="40" y1="8" x2="52" y2="8" stroke="white" strokeWidth="3.5" strokeLinecap="round" opacity="0.9" /><line x1="52" y1="8" x2="52" y2="20" stroke="white" strokeWidth="3.5" strokeLinecap="round" opacity="0.9" /><rect x="44" y="44" width="8" height="8" rx="1.5" fill="white" opacity="0.9" /><line x1="8" y1="40" x2="8" y2="52" stroke="white" strokeWidth="3.5" strokeLinecap="round" opacity="0.9" /><line x1="8" y1="52" x2="20" y2="52" stroke="white" strokeWidth="3.5" strokeLinecap="round" opacity="0.9" /></svg>),
  };

  const unreadCount = notifs.filter(n => !n.read).length;
  const showToast = (msg) => { setToast({ show: true, msg }); setTimeout(() => setToast({ show: false, msg: "" }), 3000); };
  const handleLogout = () => { localStorage.removeItem("isAuth"); localStorage.removeItem("role"); localStorage.removeItem("currentUser"); window.location.href = "/login"; };

  const totalRevenue = transactions.filter(t => t.status === "Success").reduce((s, t) => s + Number(t.amount || 0), 0);
  const planUserCount = (n) => users.filter(u => u.plan.toLowerCase() === n.toLowerCase()).length;
  const mostPopularPlan = () => { const c = {}; users.forEach(u => { c[u.plan] = (c[u.plan] || 0) + 1 }); return Object.entries(c).sort((a, b) => b[1] - a[1])[0]?.[0] || ""; };

  const exportCSV = (data, filename) => {
    if (!data.length) return;
    const keys = Object.keys(data[0]);
    const csv = [keys.join(","), ...data.map(r => keys.map(k => `"${r[k]}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
    showToast("CSV exported!");
  };

  const handleToggleUser = (id) => { const updated = users.map(u => u.id === id ? { ...u, status: u.status === "Active" ? "Blocked" : "Active" } : u); setUsers(updated); localStorage.setItem('postify_users', JSON.stringify(updated)); showToast("User status updated!"); };
  const handleAddUser = () => { if (!newUser.name || !newUser.email) { showToast("Fill all fields!"); return; } const updated = [...users, { ...newUser, id: Date.now(), images: 0, joined: new Date().toISOString().split("T")[0] }]; setUsers(updated); localStorage.setItem('postify_users', JSON.stringify(updated)); setNewUser({ name: "", email: "", plan: "Free", credits: 20 }); setModal(null); showToast("User added!"); };
  const handleUpdateCredits = (action) => {
    if (!topupUser || !topupAmt) {
      showToast("Please select a user and enter amount");
      return;
    }
    const amount = Number(topupAmt);
    const updated = users.map(u => {
      if (u.id === topupUser) {
        const newCredits = action === 'add' ? u.credits + amount : Math.max(0, u.credits - amount);
        return { ...u, credits: newCredits };
      }
      return u;
    });
    setUsers(updated);
    localStorage.setItem('postify_users', JSON.stringify(updated));
    setModal(null);
    setTopupUser(null);
    setTopupAmt("");
    showToast(action === 'add' ? `Added ${amount} credits!` : `Deducted ${amount} credits!`);
  };
  const handleAddPlan = () => { if (!newPlan.name || !newPlan.price || !newPlan.credits) { showToast("Fill all fields!"); return; } const updated = [...plans, { ...newPlan, price: Number(newPlan.price), credits: Number(newPlan.credits) }]; setPlans(updated); localStorage.setItem('postify_plans', JSON.stringify(updated)); setNewPlan({ name: "", price: "", credits: "", features: "" }); showToast("Plan added!"); };
  const handleSaveEditPlan = () => { const updated = plans.map((p, i) => i === editingPlan.index ? { ...editingPlan.data, price: Number(editingPlan.data.price), credits: Number(editingPlan.data.credits) } : p); setPlans(updated); localStorage.setItem('postify_plans', JSON.stringify(updated)); setModal(null); showToast("Plan updated!"); };
  const handleDeletePlan = (i) => { const updated = plans.filter((_, idx) => idx !== i); setPlans(updated); localStorage.setItem('postify_plans', JSON.stringify(updated)); showToast("Plan deleted!"); };
  const markAllRead = () => {
    const updated = notifs.map(n => ({ ...n, read: true }));
    setNotifs(updated);
    localStorage.setItem('postify_notifications', JSON.stringify(updated));
    showToast("All read!");
  };

  useEffect(() => {
    const handleStorageChange = (e) => {
      try {
        if (e.key === 'postify_users') { const p = JSON.parse(e.newValue); if (Array.isArray(p)) setUsers(p); }
        if (e.key === 'postify_plans') { const p = JSON.parse(e.newValue); if (Array.isArray(p)) setPlans(p); }
        if (e.key === 'postify_transactions') { const p = JSON.parse(e.newValue); if (Array.isArray(p)) setTransactions(p); }
        if (e.key === 'postify_notifications') { const p = JSON.parse(e.newValue); if (Array.isArray(p)) setNotifs(p); }
        if (e.key === 'postify_generations') { const p = JSON.parse(e.newValue); if (Array.isArray(p)) setGenHistory(p); }
      } catch (err) { console.error("Storage sync failed", err); }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleGenerate = () => {
    if (!preview) { showToast("Upload image first!"); return; }
    if (adminCredits < 8) { showToast("Admin credits low!"); return; }
    setGenerating(true); setGenDone(false);
    setTimeout(() => {
      const now = new Date();
      setGenHistory(prev => [{ id: "GEN" + Date.now(), user: adminUser.name, date: now.toISOString().split("T")[0], time: now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }), preset: selectedPreset || "Custom", background: bg, description: desc || "(No description)", angle, creditsUsed: 8, status: "Success", thumbnail: preview }, ...prev]);
      setAdminCredits(c => c - 8); setGenerating(false); setGenDone(true);
      showToast("Image generated! (−8 credits) ✨");
    }, 2000);
  };

  const navItems = [
    { id: "dashboard", icon: "⚡", label: "Dashboard" },
    { id: "generate", icon: "✦", label: "AI Generate" },
    { id: "history", icon: "🕓", label: "Gen History", badge: genHistory.length, badgeColor: "green" },
    { id: "users", icon: "👥", label: "Users", badge: users.filter(u => u.status === "Active").length, badgeColor: "green" },
    { id: "transactions", icon: "💳", label: "Transactions" },
    { id: "credits", icon: "⬡", label: "Credits" },
    { id: "plans", icon: "💎", label: "Plans" },
    { id: "notifications", icon: "🔔", label: "Notifications", badge: unreadCount, badgeColor: "red" },
  ];

  const pageTitles = { dashboard: "Admin Dashboard", generate: "AI Generator", history: "Generation History", users: "User Management", transactions: "Transactions", credits: "Credits", plans: "Plan Management", notifications: "Notifications" };
  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
  const filteredTx = transactions.filter(t => txFilter === "All" || t.status === txFilter);
  const filteredHistory = genHistory.filter(h => h && (historyFilter === "All" || h.user === historyFilter));
  const planBadgeClass = (plan) => { const p = plan?.toLowerCase(); if (p === "free") return "free"; if (p === "starter") return "starter"; if (p === "growth") return "growth"; return "business"; };

  const ThumbItem = ({ delay, src }) => (
    <div className="pa-thumb">
      {generating ? <div className={`pa-thumb-shimmer pa-thumb-shimmer-delay${delay}`} /> : src ? <img src={src} alt="" /> : <div className="pa-thumb-shimmer" />}
    </div>
  );

  return (
    <div className="pa-layout">
      {/* OVERLAY */}
      <div className={`pa-sidebar-overlay ${isSidebarOpen ? "show" : ""}`} onClick={() => setIsSidebarOpen(false)} />

      <aside className={`pa-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="pa-logo" onClick={() => setView("dashboard")} style={{ cursor: "pointer" }}>
          <img src={postifyLogo} alt="Logo" className="pa-logo-mark" />
          <div className="pa-logo-text">POSTIFY</div>
        </div>
        <nav className="pa-nav">
          <div className="pa-nav-section">Menu</div>
          {navItems.slice(0, 2).map(n => (
            <div key={n.id} className={`pa-nav-item ${view === n.id ? "active" : ""}`} onClick={() => { setView(n.id); setIsSidebarOpen(false); }}>
              <span className="ni">{n.icon}</span>{n.label}
            </div>
          ))}
          <div className="pa-nav-section">Manage</div>
          {navItems.slice(2, 8).map(n => (
            <div key={n.id} className={`pa-nav-item ${view === n.id ? "active" : ""}`} onClick={() => { setView(n.id); setIsSidebarOpen(false); }}>
              <span className="ni">{n.icon}</span>{n.label}
              {n.badge ? <span className={`pa-nav-badge ${n.badgeColor === "green" ? "green" : ""}`}>{n.badge}</span> : null}
            </div>
          ))}
          <div className="pa-nav-section">System</div>
          {navItems.slice(8).map(n => (
            <div key={n.id} className={`pa-nav-item ${view === n.id ? "active" : ""}`} onClick={() => setView(n.id)}>
              <span className="ni">{n.icon}</span>{n.label}
            </div>
          ))}
        </nav>
        <div className="pa-sidebar-bottom">
          <div className="pa-user-row">
            <div className="pa-avatar">AD</div>
            <div><div className="pa-user-name">{adminUser.name}</div><div className="pa-user-role">{adminUser.role}</div></div>
          </div>
          <button className="pa-logout" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </aside>

      <main className="pa-main">
        <div className="pa-topbar">
          <div className="pa-topbar-left">
            <button className="pa-mobile-toggle" onClick={() => setIsSidebarOpen(true)}>☰</button>
            <div className="pa-page-title">{pageTitles[view]}</div>
          </div>
          <div className="pa-topbar-right">
            <div className="pa-api-pill">
              <div className="pa-api-dot" />
              <span style={{ color: "var(--muted2)", fontSize: 13 }}>API Credits</span>
              <span className="pa-api-val">{adminCredits}</span>
            </div>
            <button className="pa-notif-btn" onClick={() => setView("notifications")}>
              🔔{unreadCount > 0 && <div className="pa-notif-dot" />}
            </button>
          </div>
        </div>

        <div className="pa-content">

          {view === "dashboard" && (
            <>
              <div className="pa-filter-row">
                {["Today", "7 Days", "30 Days"].map(f => <button key={f} className={`pa-filter-btn ${filterDay === f ? "active" : ""}`} onClick={() => setFilterDay(f)}>{f}</button>)}
              </div>
              <div className="pa-stats">
                <div className="pa-stat c1"><div className="pa-stat-label">Total Users</div><div className="pa-stat-val">{users.length}</div><div className="pa-stat-sub"><span className="up">+12%</span> this week</div></div>
                <div className="pa-stat c2"><div className="pa-stat-label">Active Users</div><div className="pa-stat-val">{users.filter(u => u.status === "Active").length}</div><div className="pa-stat-sub"><span className="up">+5 new</span></div></div>
                <div className="pa-stat c3"><div className="pa-stat-label">Monthly Revenue</div><div className="pa-stat-val">₹{totalRevenue.toLocaleString()}</div><div className="pa-stat-sub"><span className="up">+18%</span> vs last month</div></div>
                <div className="pa-stat c4"><div className="pa-stat-label">Blocked Users</div><div className="pa-stat-val">{users.filter(u => u.status === "Blocked").length}</div><div className="pa-stat-sub"><span className="dn">Review needed</span></div></div>
                <div className="pa-stat c5"><div className="pa-stat-label">Images Generated</div><div className="pa-stat-val">{users.reduce((s, u) => s + u.images, 0) + genHistory.length}</div><div className="pa-stat-sub">All users</div></div>
                <div className="pa-stat c6"><div className="pa-stat-label">API Credits Left</div><div className="pa-stat-val">{adminCredits}</div><div className="pa-stat-sub">of 1080 total</div></div>
              </div>
              <div className="pa-charts">
                <div className="pa-chart-card">
                  <div className="pa-chart-title">Revenue — Dynamic Analytics</div>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={(() => {
                      const last7Days = [...Array(7)].map((_, i) => {
                        const d = new Date();
                        d.setDate(d.getDate() - (6 - i));
                        return d.toISOString().split('T')[0];
                      });
                      return last7Days.map(date => ({
                        day: date.split('-').slice(1).join('/'),
                        revenue: transactions
                          .filter(t => t.status === "Success" && t.date === date)
                          .reduce((sum, t) => sum + Number(t.amount || 0), 0)
                      }));
                    })()} barSize={28}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,140,255,0.07)" />
                      <XAxis dataKey="day" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip prefix="₹" />} />
                      <Bar dataKey="revenue" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="pa-chart-card">
                  <div className="pa-chart-title">Generations — Dynamic Analytics</div>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={(() => {
                      const last7Days = [...Array(7)].map((_, i) => {
                        const d = new Date();
                        d.setDate(d.getDate() - (6 - i));
                        return d.toISOString().split('T')[0];
                      });
                      return last7Days.map(date => ({
                        day: date.split('-').slice(1).join('/'),
                        gens: genHistory.filter(h => h && h.date === date).length
                      }));
                    })()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,140,255,0.07)" />
                      <XAxis dataKey="day" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="gens" stroke="var(--accent2)" strokeWidth={2.5} dot={{ fill: "var(--accent2)", r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="pa-quick">
                {[["👥", "Users", "users"], ["💎", "Plans", "plans"], ["💳", "Transactions", "transactions"], ["🔔", "Notifications", "notifications"], ["🕓", "Gen History", "history"], ["✦", "AI Generate", "generate"]].map(([icon, label, target]) => (
                  <button key={target} className="pa-quick-btn" onClick={() => setView(target)}>{icon} {label}</button>
                ))}
              </div>
              <div className="pa-section-hd">System Status</div>
              <div className="pa-system">
                <div className="pa-sys-pill"><div className="pa-sys-dot green" /> Server: Online</div>
                <div className="pa-sys-pill"><div className="pa-sys-dot blue" /> AI Status: Stable</div>
                <div className="pa-sys-pill"><div className="pa-sys-dot warn" /> Avg Response: 1.2s</div>
                <div className="pa-sys-pill"><div className="pa-sys-dot green" /> DB: Connected</div>
              </div>
              <div className="pa-activity">
                <div className="pa-section-hd">Recent Generations</div>
                {genHistory.filter(Boolean).slice(0, 5).map((g, i) => (
                  <div key={i} className="pa-activity-item">
                    <div className="pa-activity-dot" style={{ background: "var(--accent2)" }} />
                    <div className="pa-activity-text"><b>{g.user}</b> — {g.preset} · {g.background} · {g.angle}</div>
                    <div className="pa-activity-time">{g.date} {g.time}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {view === "generate" && (
            <div className="dash-workspace">
              <div className="dash-controls-panel">
                <h2 className="panel-title">Generate Controls</h2>
                <div className="control-group">
                  <label className="control-label">Style</label>
                  <div className="style-tags">
                    {styles.map((s) => (<button key={s} className={`style-tag ${activeStyle === s ? "style-tag-active" : ""}`} onClick={() => setActiveStyle(s)}>{s}</button>))}
                  </div>
                </div>
                <div className="control-group">
                  <label className="control-label">Product Image</label>
                  {previewUrl ? (
                    <label className="upload-btn" htmlFor="dash-file-input">
                      <input type="file" id="dash-file-input" hidden accept="image/*" onChange={handleFileUpload} />
                      <div className="upload-preview"><img src={previewUrl} alt="Uploaded" /><span className="upload-change">Click to change</span></div>
                    </label>
                  ) : (
                    <label className="upload-btn" htmlFor="dash-file-input" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
                      <input type="file" id="dash-file-input" hidden accept="image/*" onChange={handleFileUpload} />
                      <div className="upload-placeholder"><span className="upload-icon-dash">📤</span><span>Upload Product Image</span><span className="upload-hint">PNG, JPG up to 10MB · Drag & drop</span></div>
                    </label>
                  )}
                </div>
                <div className="control-group">
                  <label className="control-label">Camera Angle</label>
                  <div className="angle-grid">
                    {angles.map((a) => (<button key={a} className={`angle-btn ${activeAngle === a ? "angle-btn-active" : ""}`} onClick={() => setActiveAngle(a)}><div className="angle-tile">{angleSVGs[a]}</div><span className="angle-label">{a}</span></button>))}
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
                  <textarea className="control-textarea" placeholder="Describe the scene, lighting, mood..." value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
                </div>
                <div className="control-actions">
                  <button className="btn-generate" onClick={handleGenerateStudio} disabled={!previewUrl || isGenerating}>
                    {isGenerating ? <><span className="spin-icon">⟳</span> Generating...</> : <>✦ Generate Image</>}
                  </button>
                  <button className="btn-regenerate" onClick={handleRegenerate} disabled={!generatedImage || isGenerating}>🔄 Regen</button>
                </div>
              </div>
              <div className="dash-preview-panel">
                <div className="preview-header">
                  <h2 className="panel-title">Image Preview</h2>
                  {generatedImage && (
                    <div className="preview-header-actions">
                      <button className={`fav-btn ${isFavorited ? "fav-active" : ""}`} onClick={toggleFav}>{isFavorited ? "★ Favorited" : "☆ Favorite"}</button>
                      <div className="before-after-toggle">
                        <button className={!showAfter ? "toggle-active" : ""} onClick={() => setShowAfter(false)}>Before</button>
                        <button className={showAfter ? "toggle-active" : ""} onClick={() => setShowAfter(true)}>After</button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="angle-badge-row">
                  {angles.map((a) => (<div key={a} className={`angle-badge ${activeAngle === a ? "angle-badge-active" : ""}`} onClick={() => setActiveAngle(a)}>{a}</div>))}
                </div>
                <div className="preview-image-box">
                  {!previewUrl && !generatedImage && (<div className="preview-empty"><span>🖼️</span><p>Your generated image will appear here</p><p className="preview-empty-sub">Upload a product and click Generate</p></div>)}
                  {previewUrl && !generatedImage && !isGenerating && <img src={previewUrl} alt="Preview" className="preview-img" />}
                  {isGenerating && (<div className="preview-generating-overlay"><div className="preview-spinner"></div><p>Postifying your image...</p><p className="generating-angle">Rendering {activeAngle} view 🎯</p></div>)}
                  {generatedImage && !isGenerating && (<img src={showAfter ? generatedImage : previewUrl} alt="Result" className="preview-img" />)}
                </div>
                {generatedImage && (<div className="preview-actions"><button className="btn-download" onClick={handleDownload}>⬇ Download</button><button className="btn-approve" onClick={handleApprove}>✓ Approve Result</button></div>)}
                {versions.length > 0 && (
                  <div className="version-history">
                    <div className="version-history-header">
                      <span>▾ Version History</span>
                      <div className="version-tabs">{versions.map((v, i) => (<button key={i} className={`version-tab ${activeVersion === i ? "version-tab-active" : ""}`} onClick={() => selectVersion(i)}>{v.label}</button>))}</div>
                    </div>
                    <div className="version-thumbnails">{versions.map((v, i) => (<div key={i} className={`version-thumb ${activeVersion === i ? "version-thumb-active" : ""}`} onClick={() => selectVersion(i)}><img src={v.url} alt={v.label} /></div>))}</div>
                    {versions[activeVersion] && (<p className="version-meta">{versions[activeVersion].bg} | {versions[activeVersion].angle} view | {versions[activeVersion].style} | {versions[activeVersion].time}</p>)}
                  </div>
                )}
              </div>
            </div>
          )}

          {view === "history" && (
            <>
              <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
                <select className="pa-select" value={historyFilter} onChange={e => setHistoryFilter(e.target.value)}>
                  <option value="All">All Users</option>
                  {[...new Set(genHistory.filter(h => h && h.user).map(h => h.user))].map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                <div style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted2)" }}>{filteredHistory.length} generations</div>
                <button className="pa-btn" onClick={() => exportCSV(filteredHistory.map(h => ({ ...h, thumbnail: "[img]" })), "gen-history.csv")}>↓ Export CSV</button>
              </div>
              {filteredHistory.length === 0
                ? <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--muted)" }}>No generations found</div>
                : <div className="pa-history-grid">
                  {filteredHistory.filter(Boolean).map(g => (
                    <div key={g.id} className="pa-history-card" onClick={() => { setModalData(g); setModal("historyDetail"); }}>
                      <div className="pa-history-img">{g.thumbnail ? <img src={g.thumbnail} alt="" /> : <div className="pa-history-img-placeholder">🖼️</div>}</div>
                      <div className="pa-history-body">
                        <div className="pa-history-user">👤 {g.user}</div>
                        <div className="pa-history-meta">
                          <div className="pa-history-row">📅 <b>{g.date}</b> at {g.time}</div>
                          <div className="pa-history-row">🎨 Preset: <b>{g.preset}</b></div>
                          <div className="pa-history-row">🖼 BG: <b>{g.background}</b></div>
                          <div className="pa-history-row">📐 Angle: <b>{g.angle}</b></div>
                          <div className="pa-history-row" style={{ flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
                            <span style={{ color: "var(--muted)" }}>Desc:</span>
                            <span style={{ color: "var(--muted2)", fontSize: 12, lineHeight: 1.3 }}>{g.description && g.description !== "(No description)" ? g.description : "-"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="pa-history-footer">
                        <span className="pa-badge success">{g.status}</span>
                        <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--warn)" }}>−{g.creditsUsed} cr</span>
                        <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>#{String(g.id).slice(-6)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              }
            </>
          )}

          {view === "users" && (
            <div className="pa-table-wrap">
              <div className="pa-table-toolbar">
                <input className="pa-search" placeholder="🔍  Search users..." value={search} onChange={e => setSearch(e.target.value)} />
                <button className="pa-btn" onClick={() => exportCSV(users, "users.csv")}>↓ Export CSV</button>
                <button className="pa-btn primary" onClick={() => setModal("addUser")}>+ Add User</button>
                <button className="pa-btn" onClick={() => setModal("topup")}>⬡ Manage Credits</button>
              </div>
              <table>
                <thead><tr><th>Name</th><th>Email</th><th>Plan</th><th>Credits</th><th>Images</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u.id} onClick={() => { setModalData(u); setModal("userDetail"); }}>
                      <td style={{ fontWeight: 600 }}>{u.name}</td>
                      <td style={{ color: "var(--muted2)", fontFamily: "var(--mono)", fontSize: 12 }}>{u.email}</td>
                      <td><span className={`pa-badge ${planBadgeClass(u.plan)}`}>{u.plan}</span></td>
                      <td style={{ fontFamily: "var(--mono)" }}>{u.credits}</td>
                      <td>{u.images}</td>
                      <td style={{ fontSize: 12, color: "var(--muted)", fontFamily: "var(--mono)" }}>{u.joined}</td>
                      <td><span className={`pa-badge ${u.status === "Active" ? "active" : "blocked"}`}>{u.status}</span></td>
                      <td onClick={e => e.stopPropagation()}>
                        <button className={`pa-btn ${u.status === "Active" ? "danger" : "success"}`} style={{ fontSize: 12, padding: "6px 12px" }} onClick={() => handleToggleUser(u.id)}>
                          {u.status === "Active" ? "Block" : "Unblock"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {view === "transactions" && (
            <div className="pa-table-wrap">
              <div className="pa-table-toolbar">
                <input className="pa-search" placeholder="🔍  Search..." value={search} onChange={e => setSearch(e.target.value)} />
                <select className="pa-select" value={txFilter} onChange={e => setTxFilter(e.target.value)}>
                  <option>All</option><option>Success</option><option>Failed</option>
                </select>
                <button className="pa-btn" onClick={() => exportCSV(filteredTx, "transactions.csv")}>↓ Export</button>
                <div style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: 13, color: "var(--accent2)" }}>Total: ₹{transactions.filter(t => t.status === "Success").reduce((s, t) => s + Number(t.amount || 0), 0).toLocaleString()}</div>
              </div>
              <table>
                <thead><tr><th>TXN ID</th><th>User</th><th>Plan</th><th>Amount</th><th>Credits</th><th>Payment Details</th><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {filteredTx.filter(t => !search || t.user.toLowerCase().includes(search.toLowerCase())).map(t => (
                    <tr key={t.id}>
                      <td style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)" }}>{t.transactionId}</td>
                      <td style={{ fontWeight: 600 }}>{t.user}</td>
                      <td><span className={`pa-badge ${planBadgeClass(t.plan)}`}>{t.plan}</span></td>
                      <td style={{ fontFamily: "var(--mono)", color: "var(--accent2)" }}>₹{t.amount}</td>
                      <td style={{ fontFamily: "var(--mono)" }}>{t.credits}</td>
                      <td style={{ fontSize: 11, color: "var(--muted2)" }}>
                        <div style={{ fontWeight: 700, color: "var(--text)", textTransform: "uppercase", fontSize: 10, marginBottom: 2 }}>{t.paymentMethod}</div>
                        {/* New Object Format */}
                        {t.paymentDetails && typeof t.paymentDetails === 'object' && (
                          <div style={{ lineHeight: 1.3 }}>
                            {t.paymentMethod === 'upi' && <div style={{ color: "var(--accent)" }}>ID: {t.paymentDetails.upiId}</div>}
                            {t.paymentMethod === 'bank' && (
                              <>
                                <div>Name: {t.paymentDetails.accHolder}</div>
                                <div>A/c: {t.paymentDetails.accNumber}</div>
                                <div>IFSC: {t.paymentDetails.ifsc}</div>
                              </>
                            )}
                            {t.paymentMethod === 'card' && <div style={{ color: "var(--warn)" }}>Card: {t.paymentDetails.cardNumber}</div>}
                          </div>
                        )}
                        {/* Legacy String Format from UserDashboard */}
                        {t.paymentDetails && typeof t.paymentDetails === 'string' && (
                          <div style={{ color: "var(--muted)" }}>{t.paymentDetails}</div>
                        )}
                        {/* Initial Mock Data Format */}
                        {!t.paymentDetails && (
                          <div style={{ lineHeight: 1.3 }}>
                            {t.upiId && t.upiId !== "—" && <div style={{ color: "var(--accent)" }}>ID: {t.upiId}</div>}
                            {t.bank && <div>Bank: {t.bank}</div>}
                          </div>
                        )}
                      </td>
                      <td style={{ fontSize: 12, color: "var(--muted)", fontFamily: "var(--mono)" }}>{t.date}</td>
                      <td><span className={`pa-badge ${t.status === "Success" ? "success" : "failed"}`}>{t.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {view === "credits" && (
            <div className="pa-credits-grid">
              <div className="pa-credit-card">
                <div className="pa-credit-title">Admin API Wallet</div>
                <div className="pa-credit-big">{adminCredits}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>of 1080 total credits</div>
                <div className="pa-progress-bg"><div className="pa-progress-fill green" style={{ width: `${(adminCredits / 1080) * 100}%` }} /></div>
                <div className="pa-credit-stats"><span>Used: {1080 - adminCredits}</span><span>Left: {adminCredits}</span></div>
                <div style={{ marginTop: 14, fontSize: 12.5, color: "var(--muted2)" }}>Each image = <b style={{ color: "var(--warn)" }}>8 credits</b></div>
                <button className="pa-btn primary" style={{ marginTop: 14, width: "100%", justifyContent: "center" }} onClick={() => { setAdminCredits(1080); showToast("Credits recharged!"); }}>⚡ Recharge to 1080</button>
              </div>
              <div className="pa-credit-card">
                <div className="pa-credit-title">User Credits Overview</div>
                {users.map(u => (
                  <div key={u.id} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                      <span style={{ fontWeight: 600 }}>{u.name}</span>
                      <span style={{ fontFamily: "var(--mono)", color: "var(--accent2)" }}>{u.credits}</span>
                    </div>
                    <div className="pa-progress-bg" style={{ height: 5, margin: 0 }}>
                      <div className="pa-progress-fill blue" style={{ width: `${Math.min((u.credits / 450) * 100, 100)}%` }} />
                    </div>
                  </div>
                ))}
                <button className="pa-btn" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} onClick={() => setModal("topup")}>⬡ Manage User Credits</button>
              </div>
            </div>
          )}

          {view === "plans" && (
            <>
              <div className="pa-plans-grid">
                {plans.map((p, i) => (
                  <div key={i} className={`pa-plan-card ${mostPopularPlan() === p.name ? "featured" : ""}`}>
                    {mostPopularPlan() === p.name && <div className="pa-popular-tag">POPULAR</div>}
                    <div className="pa-plan-name">{p.name}</div>
                    <div className="pa-plan-price">₹{p.price}<span>/month</span></div>
                    <div className="pa-plan-users">👤 {planUserCount(p.name)} users</div>
                    <ul className="pa-plan-feat">
                      <li>{p.credits} Image Credits</li>
                      {p.features.split(",").map((f, fi) => <li key={fi}>{f.trim()}</li>)}
                    </ul>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="pa-btn" style={{ flex: 1, justifyContent: "center", fontSize: 12 }} onClick={() => { setEditingPlan({ index: i, data: { ...p } }); setModal("editPlan"); }}>✏️ Edit</button>
                      <button className="pa-btn danger" style={{ fontSize: 12, padding: "7px 12px" }} onClick={() => handleDeletePlan(i)}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pa-plan-form">
                <div className="pa-form-title">+ Add New Plan</div>
                <div className="pa-form-grid">
                  <div className="pa-form-field"><div className="pa-input-label">Plan Name</div><input className="pa-input" placeholder="e.g. Pro" value={newPlan.name} onChange={e => setNewPlan({ ...newPlan, name: e.target.value })} /></div>
                  <div className="pa-form-field"><div className="pa-input-label">Price ₹</div><input className="pa-input" type="number" placeholder="1499" value={newPlan.price} onChange={e => setNewPlan({ ...newPlan, price: e.target.value })} /></div>
                  <div className="pa-form-field"><div className="pa-input-label">Credits</div><input className="pa-input" type="number" placeholder="300" value={newPlan.credits} onChange={e => setNewPlan({ ...newPlan, credits: e.target.value })} /></div>
                </div>
                <div className="pa-form-field" style={{ marginBottom: 14 }}>
                  <div className="pa-input-label">Features (comma separated)</div>
                  <input className="pa-input" placeholder="HD Generation, Priority Support..." value={newPlan.features} onChange={e => setNewPlan({ ...newPlan, features: e.target.value })} />
                </div>
                <button className="pa-btn primary" onClick={handleAddPlan}>+ Add Plan</button>
              </div>
            </>
          )}

          {view === "notifications" && (
            <>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                <button className="pa-btn" onClick={markAllRead}>✓ Mark all read</button>
              </div>
              <div className="pa-notif-list">
                {notifs.map(n => {
                  const icons = { signup: "👤", payment: "💳", alert: "⚠️", fail: "❌" };
                  return (
                    <div key={n.id} className={`pa-notif-item ${!n.read ? "unread" : ""}`} onClick={() => {
                      const updated = notifs.map(x => x.id === n.id ? { ...x, read: true } : x);
                      setNotifs(updated);
                      localStorage.setItem('postify_notifications', JSON.stringify(updated));
                    }}>
                      <span className="pa-notif-icon">{icons[n.type]}</span>
                      <div className="pa-notif-content"><div className="pa-notif-msg">{n.msg}</div><div className="pa-notif-time">{n.time}</div></div>
                      {!n.read && <div className="pa-unread-dot" />}
                    </div>
                  );
                })}
              </div>
            </>
          )}

        </div>
      </main>

      {modal === "addUser" && (
        <div className="pa-modal-overlay" onClick={() => setModal(null)}>
          <div className="pa-modal" onClick={e => e.stopPropagation()}>
            <button className="pa-modal-close" onClick={() => setModal(null)}>✕</button>
            <div className="pa-modal-title">Add New User</div>
            <div className="pa-modal-sub">Create a user account manually</div>
            <div className="pa-form-row">
              <div className="pa-form-field"><div className="pa-input-label">Full Name</div><input className="pa-input" placeholder="Rahul Sharma" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} /></div>
              <div className="pa-form-field"><div className="pa-input-label">Email</div><input className="pa-input" placeholder="rahul@example.com" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} /></div>
              <div className="pa-form-field"><div className="pa-input-label">Plan</div>
                <select className="pa-input" value={newUser.plan} onChange={e => setNewUser({ ...newUser, plan: e.target.value })}>
                  <option>Free</option><option>Starter</option><option>Growth</option><option>Business</option>
                </select>
              </div>
              <div className="pa-form-field"><div className="pa-input-label">Starting Credits</div><input className="pa-input" type="number" value={newUser.credits} onChange={e => setNewUser({ ...newUser, credits: Number(e.target.value) })} /></div>
              <button className="pa-btn primary" style={{ justifyContent: "center" }} onClick={handleAddUser}>+ Add User</button>
            </div>
          </div>
        </div>
      )}

      {modal === "topup" && (
        <div className="pa-modal-overlay" onClick={() => setModal(null)}>
          <div className="pa-modal" onClick={e => e.stopPropagation()}>
            <button className="pa-modal-close" onClick={() => setModal(null)}>✕</button>
            <div className="pa-modal-title">Manual Credit Top-up</div>
            <div className="pa-modal-sub">Select user and add credits</div>
            <div className="pa-topup-targets">
              {users.map(u => (
                <div key={u.id} className={`pa-topup-user ${topupUser === u.id ? "selected" : ""}`} onClick={() => setTopupUser(u.id)}>
                  <div className="pa-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>{u.name[0]}</div>
                  <div className="pa-topup-name">{u.name}</div>
                  <div className="pa-topup-credits">{u.credits} credits</div>
                </div>
              ))}
            </div>
            <div className="pa-form-field" style={{ marginBottom: 14 }}>
              <div className="pa-input-label">Credits to Add</div>
              <input className="pa-input" type="number" placeholder="50" value={topupAmt} onChange={e => setTopupAmt(e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="pa-btn success" style={{ flex: 1, justifyContent: "center" }} onClick={() => handleUpdateCredits('add')}>+ Add Credits</button>
              <button className="pa-btn danger" style={{ flex: 1, justifyContent: "center" }} onClick={() => handleUpdateCredits('deduct')}>- Deduct Credits</button>
            </div>
          </div>
        </div>
      )}

      {modal === "editPlan" && editingPlan && (
        <div className="pa-modal-overlay" onClick={() => setModal(null)}>
          <div className="pa-modal" onClick={e => e.stopPropagation()}>
            <button className="pa-modal-close" onClick={() => setModal(null)}>✕</button>
            <div className="pa-modal-title">Edit Plan</div>
            <div className="pa-modal-sub">Modify plan details</div>
            <div className="pa-form-row">
              {[["Plan Name", "name", "text"], ["Price ₹", "price", "number"], ["Credits", "credits", "number"]].map(([label, key, type]) => (
                <div key={key} className="pa-form-field">
                  <div className="pa-input-label">{label}</div>
                  <input className="pa-input" type={type} value={editingPlan.data[key]} onChange={e => setEditingPlan({ ...editingPlan, data: { ...editingPlan.data, [key]: e.target.value } })} />
                </div>
              ))}
              <div className="pa-form-field"><div className="pa-input-label">Features</div><input className="pa-input" value={editingPlan.data.features} onChange={e => setEditingPlan({ ...editingPlan, data: { ...editingPlan.data, features: e.target.value } })} /></div>
              <button className="pa-btn primary" style={{ justifyContent: "center" }} onClick={handleSaveEditPlan}>✓ Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {modal === "userDetail" && modalData && (
        <div className="pa-modal-overlay" onClick={() => setModal(null)}>
          <div className="pa-modal" onClick={e => e.stopPropagation()}>
            <button className="pa-modal-close" onClick={() => setModal(null)}>✕</button>
            <div className="pa-modal-title">{modalData.name}</div>
            <div className="pa-modal-sub">{modalData.email}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
              {[["Plan", modalData.plan], ["Credits", modalData.credits], ["Images", modalData.images], ["Joined", modalData.joined], ["Status", modalData.status]].map(([k, v]) => (
                <div key={k} style={{ background: "var(--surface3)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px" }}>
                  <div style={{ fontSize: 10.5, color: "var(--muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.8px", fontFamily: "var(--font)", fontWeight: 700 }}>{k}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 14, fontWeight: 500 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8, fontFamily: "var(--font)" }}>
                Gen History ({genHistory.filter(g => g && g.user === modalData.name).length})
              </div>
              {genHistory.filter(g => g && g.user === modalData.name).length === 0
                ? <div style={{ fontSize: 13, color: "var(--muted)" }}>No generations yet</div>
                : genHistory.filter(g => g && g.user === modalData.name).slice(0, 3).map((g, i) => (
                  <div key={i} style={{ background: "var(--surface3)", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 12px", fontSize: 12, marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <b style={{ fontFamily: "var(--mono)", color: "var(--accent)" }}>#{String(g.id).slice(-6)}</b>
                      <span style={{ color: "var(--muted)", fontFamily: "var(--mono)" }}>{g.date} {g.time}</span>
                    </div>
                    <div style={{ color: "var(--muted2)" }}>{g.preset} · {g.background} · {g.angle}</div>
                  </div>
                ))
              }
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="pa-btn" style={{ flex: 1, justifyContent: "center" }} onClick={() => { setModal("topup"); setTopupUser(modalData.id); }}>⬡ Manage Credits</button>
              <button className={`pa-btn ${modalData.status === "Active" ? "danger" : "success"}`} style={{ flex: 1, justifyContent: "center" }} onClick={() => { handleToggleUser(modalData.id); setModal(null); }}>
                {modalData.status === "Active" ? "Block User" : "Unblock User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modal === "historyDetail" && modalData && (
        <div className="pa-modal-overlay" onClick={() => setModal(null)}>
          <div className="pa-modal" style={{ width: 560 }} onClick={e => e.stopPropagation()}>
            <button className="pa-modal-close" onClick={() => setModal(null)}>✕</button>
            <div className="pa-modal-title">Generation Detail</div>
            <div className="pa-modal-sub">#{modalData.id}</div>
            {modalData.thumbnail && (
              <div style={{ width: "100%", aspectRatio: "2/1", borderRadius: 10, overflow: "hidden", marginBottom: 18, border: "1px solid var(--border)" }}>
                <img src={modalData.thumbnail} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}
            <div className="pa-history-detail">
              <div className="pa-detail-field"><div className="pa-detail-label">User</div><div className="pa-detail-val">{modalData.user}</div></div>
              <div className="pa-detail-field"><div className="pa-detail-label">Date & Time</div><div className="pa-detail-val">{modalData.date} · {modalData.time}</div></div>
              <div className="pa-detail-field"><div className="pa-detail-label">Preset</div><div className="pa-detail-val">{modalData.preset}</div></div>
              <div className="pa-detail-field"><div className="pa-detail-label">Background</div><div className="pa-detail-val">{modalData.background}</div></div>
              <div className="pa-detail-field"><div className="pa-detail-label">Camera Angle</div><div className="pa-detail-val">{modalData.angle}</div></div>
              <div className="pa-detail-field"><div className="pa-detail-label">Credits Used</div><div className="pa-detail-val" style={{ color: "var(--warn)" }}>{modalData.creditsUsed}</div></div>
              <div className="pa-detail-full"><div className="pa-detail-label">Description</div><div style={{ fontSize: 13.5, marginTop: 4, color: "var(--muted2)", lineHeight: 1.5 }}>{modalData.description}</div></div>
              <div className="pa-detail-field"><div className="pa-detail-label">Status</div><div><span className={`pa-badge ${modalData.status === "Success" ? "success" : "failed"}`}>{modalData.status}</span></div></div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="pa-btn" style={{ flex: 1, justifyContent: "center" }}>↓ Download</button>
              <button className="pa-btn danger" style={{ flex: 1, justifyContent: "center" }} onClick={() => { setGenHistory(prev => prev.filter(g => g.id !== modalData.id)); setModal(null); showToast("Deleted!"); }}>🗑️ Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className={`pa-toast ${toast.show ? "show" : ""}`}><span>✓</span> {toast.msg}</div>
    </div>
  );
}