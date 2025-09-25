import React from "react";

export default function TaskItem({ task, onToggle, deleteTask }) {
  return (
    <div className={`task-item ${task.completed ? "completed" : ""}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="task-checkbox"
      />

      <div className="task-info">
        <span className="task-title">{task.title}</span>
        {task.description && (
          <span className="task-desc">Description: {task.description}</span>
        )}
        {task.due_date && (
          <span className="task-date">Échéance: {task.due_date}</span>
        )}
        <span className="task-priority">
          Priorité: {["Basse", "Moyenne", "Haute"][task.priority]}
        </span>
      </div>

      <button
        className="delete"
        onClick={() => deleteTask(task.id)}
        title="Supprimer la tâche"
      >
        Supprimer
      </button>
    </div>
  );
}
