import React from "react";
import "./ExperimentCard.css";

function ExperimentCard({ experiment }) {
  return (
    <div className="experiment-card">
      <h3>{experiment.Title}</h3>
      <p>
        <strong>Organism:</strong> {experiment.Organism || "N/A"}
      </p>
      <p>
        <strong>Category:</strong> {experiment.Category || "N/A"}
      </p>
      <p>
        <strong>Impact:</strong> {experiment.Impact || "N/A"}
      </p>
      <a href={experiment.URL} target="_blank" rel="noopener noreferrer">
        🔗 Read Full Publication
      </a>
    </div>
  );
}

export default ExperimentCard;
