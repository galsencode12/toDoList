import React from "react";

const TaskItem = ({ task, toggleTask, deleteTask }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        marginBottom: "10px",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
      }}
    >
      <div>
        <h4 style={{ textDecoration: task.is_completed ? "line-through" : "none" }}>
          {task.title}
        </h4>
        {task.description && <p>{task.description}</p>}
        {task.due_date && <small>Échéance : {task.due_date}</small>}
        {task.priority === 2 && <span style={{ color: "red", marginLeft: "10px" }}>⚠ Haute</span>}
        {task.priority === 1 && <span style={{ color: "orange", marginLeft: "10px" }}>! Moyenne</span>}
        {task.priority === 0 && <span style={{ color: "green", marginLeft: "10px" }}>Basse</span>}
      </div>
      <div>
        <button onClick={() => toggleTask(task.id)} style={{ marginRight: "10px" }}>
          {task.is_completed ? "↩️" : "✔️"}
        </button>
        <button onClick={() => deleteTask(task.id)}>🗑️</button>
      </div>
    </div>
  );
};

export default TaskItem;
