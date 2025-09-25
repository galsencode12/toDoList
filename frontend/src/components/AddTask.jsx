import React, { useState } from "react";

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
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Titre"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ marginRight: "10px" }}
        required
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ marginRight: "10px" }}
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        style={{ marginRight: "10px" }}
      />
      <select value={priority} onChange={(e) => setPriority(Number(e.target.value))} style={{ marginRight: "10px" }}>
        <option value={0}>Basse</option>
        <option value={1}>Moyenne</option>
        <option value={2}>Haute</option>
      </select>
      <button type="submit">Ajouter</button>
    </form>
  );
};

export default AddTask;
