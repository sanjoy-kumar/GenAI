import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export default function FileUploader() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Select a PDF first");

    const formData = new FormData();
    formData.append("file", file);

    setStatus("Uploading & processing...");
    try {
      const res = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus(`✅ ${res.data.message} — chunks: ${res.data.chunks}`);
    } catch (err) {
      console.error(err);
      setStatus("❌ Upload failed");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="uploader">
      <form onSubmit={handleUpload}>
        <label className="file-label">
          <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
          <span>Choose PDF</span>
        </label>
        <button className="btn" type="submit">Upload</button>
      </form>
      <label className="file-label">
        {status && <p className="status">{status}</p>}
      </label>
      
    </motion.div>
  );
}
