import React, { useState, useEffect } from "react";
import ExperimentCard from "./components/ExperimentCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "./app.css";

function App() {
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  useEffect(() => {
    fetch("https://biospace-backend.onrender.com/api/experiments")
      .then((res) => res.json())
      .then((data) => {
        setExperiments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching experiments:", err);
        setLoading(false);
      });
  }, []);

  // Filter logic
  const filteredExperiments = experiments.filter((exp) => {
    const matchesSearch =
      exp.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.Organism?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || exp.Category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Chart data
  const categoryData = Object.values(
    experiments.reduce((acc, exp) => {
      if (!exp.Category) return acc;
      acc[exp.Category] = acc[exp.Category] || {
        category: exp.Category,
        count: 0,
      };
      acc[exp.Category].count += 1;
      return acc;
    }, {})
  );

  return (
    <div className="app-container">
      {/* Scrolling Prototype Message */}
      <div className="marquee-container">
        <marquee behavior="scroll" direction="left" scrollamount="6">
          ⚠️ This project is a prototype (for demonstration purposes only) — data summaries may not be fully accurate. ⚠️
        </marquee>
      </div>

      <h1>🧬 BioSpace Explorer</h1>
      <p className="subtitle">Exploring 608 NASA Bioscience Publications 🚀</p>

      {/* Search + Filter */}
      <div className="controls">
        <input
          type="text"
          placeholder="🔍 Search by Title or Organism..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="filter-dropdown"
        >
          <option value="All">All Categories</option>
          {[...new Set(experiments.map((e) => e.Category))].map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Experiment Cards */}
      <div className="cards-container">
        {loading ? (
          <p>Loading experiments...</p>
        ) : filteredExperiments.length === 0 ? (
          <p>No experiments found.</p>
        ) : (
          filteredExperiments.map((exp) => (
            <ExperimentCard key={exp._id} experiment={exp} />
          ))
        )}
      </div>

      {/* Chart Section */}
      {!loading && experiments.length > 0 && (
        <div className="chart-container">
          <h2>Publication Categories Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#007bff" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default App;
