import React from "react";

const FilterTask = ({ filter, setFilter }) => {
  return (
    <div style={{ marginBottom: "20px" }}>
      <button
        onClick={() => setFilter("all")}
        style={{ marginRight: "10px" }}
        className={filter === "all" ? "active-filter" : ""}
      >
        Toutes
      </button>
      <button
        onClick={() => setFilter("pending")}
        style={{ marginRight: "10px" }}
        className={filter === "pending" ? "active-filter" : ""}
      >
        En cours
      </button>
      <button
        onClick={() => setFilter("completed")}
        className={filter === "completed" ? "active-filter" : ""}
      >
        Terminées
      </button>
    </div>
  );
};

export default FilterTask;
