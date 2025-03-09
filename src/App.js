
import React, { useState } from "react";

function App() {
  const [userId, setUserId] = useState("");
  const [itemId, setItemId] = useState("");
  const [productId, setProductId] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");
  const [method, setMethod] = useState("user_based");

  const getRecommendations = async () => {
    let apiUrl = "http://localhost:5000";

    if (method === "user_based" || method === "svd") {
      if (!userId) {
        setError("❌ User ID is required!");
        return;
      }
      apiUrl += `/recommend?user_id=${userId}&method=${method}`;
    } else if (method === "item_based") {
      if (!itemId) {
        setError("❌ Item ID is required!");
        return;
      }
      apiUrl += `/recommend_item?item_id=${itemId}`;
    } else if (method === "cbf") {
      if (!productId) {
        setError("❌ Product ID is required!");
        return;
      }
      apiUrl += `/recommend_cbf?product_id=${productId}`;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok) {
        setRecommendations(data.recommendations);
        setError("");
      } else {
        setError(`⚠️ ${data.error || "Error fetching recommendations"}`);
        setRecommendations([]);
      }
    } catch (err) {
      setError("❌ Network error. Make sure Flask is running.");
      setRecommendations([]);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>📢 AI-Powered Product Recommendations</h1>

        <label style={styles.label}>Select Recommendation Method:</label>
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          style={styles.select}
        >
          <option value="user_based">👤 User-Based CF</option>
          <option value="item_based">📦 Item-Based CF</option>
          <option value="cbf">📑 Content-Based Filtering (CBF)</option>
          <option value="svd">📊 SVD-Based CF</option>
        </select>

        {method === "user_based" || method === "svd" ? (
          <input
            type="text"
            placeholder="🔍 Enter User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={styles.input}
          />
        ) : method === "item_based" ? (
          <input
            type="text"
            placeholder="📦 Enter Item ID"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            style={styles.input}
          />
        ) : (
          <input
            type="text"
            placeholder="📑 Enter Product ID"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            style={styles.input}
          />
        )}

        <button onClick={getRecommendations} style={styles.button}>
          🚀 Get Recommendations
        </button>

        {error && <p style={styles.error}>{error}</p>}
        {recommendations.length > 0 && (
          <div style={styles.result}>
            <h2>🎯 Recommended Products:</h2>
            <ul>
              {recommendations.map((item, index) => (
                <li key={index} style={styles.listItem}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(to right, #4A90E2, #6B72E1)",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    textAlign: "center",
    width: "450px",
  },
  title: {
    fontSize: "24px",
    color: "#333",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  label: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px",
    display: "block",
  },
  select: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "15px",
  },
  input: {
    padding: "10px",
    width: "100%",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    outline: "none",
  },
  button: {
    padding: "12px",
    width: "100%",
    fontSize: "18px",
    color: "#fff",
    background: "#ff6b6b",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
  error: {
    color: "red",
    fontWeight: "bold",
    marginTop: "10px",
  },
  result: {
    marginTop: "20px",
    textAlign: "left",
  },
  listItem: {
    fontSize: "16px",
    color: "#333",
    padding: "5px 0",
  },
};

export default App;
