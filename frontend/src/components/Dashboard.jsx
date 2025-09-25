import React, { useState } from "react";
import AddTask from "../components/AddTask.jsx";
import TaskList from "../components/TaskList.jsx";
import FilterTask from "../components/FilterTask.jsx";
import React, { useEffect } from "react";
import { useAuth } from "../helpers";
import "./Dashboard.css";
import { useState } from "react";
import { getDashboardData } from "../services/taskService";

const Dashboard = () => {
  const user = { username: "TestUser", email: "test@example.com" };
  const logout = () => alert("Déconnexion simulée");

  const [tasks, setTasks] = useState([
    { id: 1, title: "Tâche 1", completed: false },
    { id: 2, title: "Tâche 2", completed: true },
    { id: 3, title: "Tâche 3", completed: false },
  ]);
  const [filter, setFilter] = useState("all");

  const addTask = (title, description, due_date) => {
    const newTask = {
      id: Date.now(),
      title,
      description: description || "",
      due_date: due_date || "",
      completed: false,
    };
    setTasks([newTask, ...tasks]);
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "pending") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });
  const { logout } = useAuth();
  const [username, setUsername] = useState("");
  const [tasks, setTasks] = useState([]);
  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    (async () => {
      const { username, taskData } = await getDashboardData();
      console.log(username);
      console.log(taskData);
      setUsername(username);
      setTasks(taskData);
    })();
  }, []);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">✓</div>
            <h1>ToDoList</h1>
          </div>
          <div className="user-section">
            <span>Bienvenue,{username} </span>
            <button onClick={handleLogout} className="logout-button">
              Déconnexion
            </button>
          </div>
        </div>
      </header>
      <main className="dashboard-main">
        <div className="welcome-section">
          <h2>Bienvenue sur votre espace de gestion des tâches</h2>
          <p>Ajoutez, suivez et organisez vos tâches en toute simplicité !</p>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Tâches en cours</h3>
              <div className="stat-number">
                {tasks.filter((t) => !t.completed).length}
              </div>
            </div>
            <div className="stat-card">
              <h3>Tâches terminées</h3>
              <div className="stat-number">
                {tasks.filter((t) => t.completed).length}
              </div>
            </div>
            <div className="stat-card">
              <h3>Projets actifs</h3>
              <div className="stat-number">0</div>
            </div>
          </div>
        </div>
        <div className="tasks-section" style={{ marginTop: "40px" }}>
          <AddTask addTask={addTask} />
          <FilterTask filter={filter} setFilter={setFilter} />
          <TaskList
            tasks={filteredTasks}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
