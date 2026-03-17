import React, { useState } from "react";
import "./generate.css";

const AUDIENCES = [
  { id: "small_business", label: "Small Business" },
  { id: "seller", label: "Online Seller" },
  { id: "creator", label: "Creator" },
  { id: "designer", label: "Designer" },
  { id: "startup", label: "Startup" },
  { id: "nontech", label: "Non-technical User" },
];

const PLATFORMS = ["Instagram", "WhatsApp", "LinkedIn", "Amazon"];

const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function buildContent({ name, audience, platform }) {
  const product = name || "Your Product";

  const templates = {
    small_business: {
      Instagram: [`Buy ${product} — Limited stock!`],
      WhatsApp: [`${product} now available.`],
      LinkedIn: [`${product} for small businesses.`],
      Amazon: [`${product} — Fast delivery.`],
      bullets: ["Premium quality"],
      hashtags: ["#SmallBusiness"],
      ctas: ["Order Now"],
    },
    seller: {
      Instagram: [`Hot selling ${product}`],
      WhatsApp: [`Bulk orders ${product}`],
      LinkedIn: [`${product} marketplace ready`],
      Amazon: [`${product} best seller`],
      bullets: ["High margin"],
      hashtags: ["#Seller"],
      ctas: ["Buy Now"],
    },
    creator: {
      Instagram: [`Create with ${product}`],
      WhatsApp: [`Trending ${product}`],
      LinkedIn: [`Creator tool ${product}`],
      Amazon: [`${product} creator pick`],
      bullets: ["Reel ready"],
      hashtags: ["#Creator"],
      ctas: ["Use Now"],
    },
    designer: {
      Instagram: [`Clean design ${product}`],
      WhatsApp: [`Design product ${product}`],
      LinkedIn: [`Designer choice ${product}`],
      Amazon: [`${product} minimal`],
      bullets: ["Minimal look"],
      hashtags: ["#Design"],
      ctas: ["Download"],
    },
    startup: {
      Instagram: [`Launch ${product}`],
      WhatsApp: [`Startup offer ${product}`],
      LinkedIn: [`Startup tool ${product}`],
      Amazon: [`${product} launch pack`],
      bullets: ["Growth ready"],
      hashtags: ["#Startup"],
      ctas: ["Start Now"],
    },
    nontech: {
      Instagram: [`Easy post ${product}`],
      WhatsApp: [`Simple ${product}`],
      LinkedIn: [`Simple ${product}`],
      Amazon: [`${product} simple listing`],
      bullets: ["No skill"],
      hashtags: ["#Easy"],
      ctas: ["Copy"],
    },
  };

  const g = templates[audience];

  return {
    caption: randomPick(g[platform]),
    description: g.bullets[0],
    hashtags: g.hashtags.join(" "),
  };
}

export default function Generate() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [audience, setAudience] = useState("small_business");
  const [platform, setPlatform] = useState("Instagram");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    if (!name) return alert("Enter product name");

    setLoading(true);
    setResult(null);

    setTimeout(() => {
      setResult(buildContent({ name, audience, platform }));
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="gen-root">
      <div className="gen-shell">

        <div className="gen-left">
          <h1>POSTIFY</h1>
          <h2>Generate Content</h2>
          <p>Upload product and instantly generate ready-to-post content.</p>
        </div>

        <div className="gen-right">

          <label className="upload-box">
            {image ? <img src={image} alt="" /> : <span>Upload Product Image</span>}
            <input type="file" onChange={e=>setImage(URL.createObjectURL(e.target.files[0]))}/>
          </label>

          <input className="input" placeholder="Product name" value={name} onChange={e=>setName(e.target.value)}/>

          <div className="audience">
            {AUDIENCES.map(a=>(
              <button key={a.id} className={audience===a.id?"active":""} onClick={()=>setAudience(a.id)}>
                {a.label}
              </button>
            ))}
          </div>

          <select className="platform" value={platform} onChange={e=>setPlatform(e.target.value)}>
            {PLATFORMS.map(p=><option key={p}>{p}</option>)}
          </select>

          <button className="generate-btn" onClick={handleGenerate}>
            {loading?"Generating...":"Generate"}
          </button>

          {loading && <div className="loader"></div>}

          {result && (
            <div className="card">
              <b>{result.caption}</b>
              <p>{result.description}</p>
              <small>{result.hashtags}</small>

              <div className="result-actions">
                <button onClick={()=>navigator.clipboard.writeText(result.caption)}>Copy</button>
                <button onClick={()=>{
                  const blob=new Blob([result.caption],{type:"text/plain"});
                  const a=document.createElement("a");
                  a.href=URL.createObjectURL(blob);
                  a.download="postify.txt";
                  a.click();
                }}>Download</button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
 