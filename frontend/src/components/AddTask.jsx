import React, { useState } from "react";
import "./Dashboard.css";

const AddTask = ({ addTask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;

    addTask(title, description, dueDate, priority);

    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority(0);
  };

  return (
    <form className="add-task-container" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Titre"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <select
        value={priority}
        onChange={(e) => setPriority(Number(e.target.value))}
      >
        <option value={0}>Basse</option>
        <option value={1}>Moyenne</option>
        <option value={2}>Haute</option>
      </select>
      <button type="submit">Ajouter</button>
    </form>
  );
};

export default AddTask;
