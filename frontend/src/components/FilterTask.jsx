import React from "react";

const FilterTask = ({ filter, setFilter }) => {
  return (
    <div style={{ marginBottom: "20px" }}>
      <button onClick={() => setFilter("all")} style={{ marginRight: "10px" }}>
        Toutes
      </button>
      <button onClick={() => setFilter("pending")} style={{ marginRight: "10px" }}>
        En cours
      </button>
      <button onClick={() => setFilter("completed")}>
        Terminées
      </button>
    </div>
  );
};

export default FilterTask;
