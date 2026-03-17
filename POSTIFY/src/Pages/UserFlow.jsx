import React, { useState } from "react";
import "./UserFlow.css";

export default function UserFlow() {

  const [image, setImage] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if(file){
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="userflow">

      <h1>POSTIFY 🚀</h1>
      <p className="credits">Credits: 5</p>

      <label className="upload-btn">
        Upload Image
        <input type="file" hidden onChange={handleUpload} />
      </label>

      {image && <img src={image} alt="preview" className="preview" />}

      {image && (
        <button className="generate" onClick={()=>setShowResult(true)}>
          Generate Image
        </button>
      )}

      {showResult && (
        <div className="generated-section">
          <h3>Generated Angles</h3>

          <div className="grid">
            <img src={image} />
            <img src={image} />
            <img src={image} />
            <img src={image} />
          </div>

          <button>Download</button>
          <button>Regenerate</button>
        </div>
      )}

    </div>
  );
}
