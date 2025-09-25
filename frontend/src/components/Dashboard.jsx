import { useEffect, useState } from "react";
import AddTask from "../components/AddTask.jsx";
import TaskList from "../components/TaskList.jsx";
import FilterTask from "../components/FilterTask.jsx";
import { useAuth } from "../helpers";
import "./Dashboard.css";

import { getDashboardData } from "../services/taskService";

const Dashboard = () => {
  const { logout } = useAuth();
  const [username, setUsername] = useState("");
  const [tasks, setTasks] = useState([{}]);
  const handleLogout = () => {
    logout();
  };
  // Le code dans useEffect est executé dés le chargement du component sur la page
  useEffect(() => {
    (async () => {
      const { username, tasks } = await getDashboardData();
      console.log(username);
      console.log(tasks);
      setTasks(tasks);
      setUsername(username);
    })();
  }, []);

  // Les etats filter doivent etre soit all, pending ou completed
  const [filter, setFilter] = useState("all");
  const addTask = (title, description, due_date) => {
    const newTask = {
      id: Date.now(),
      title,
      description: description || "",
      due_date: due_date || null,
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
    if (filter === "pending") return !t.is_completed;
    if (filter === "completed") return t.is_completed;
    return true;
  });

  // Fonction pour renvoyer les taches en retard
  const overDueTasks = () => {
    const today = new Date();
    const filter = tasks.filter((task) => today > task.updated_at);
    console.log(filter);
    return filter.length;
  };

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
              <h3>Total</h3>
              <div className="stat-number">{tasks.length}</div>
            </div>
            <div className="stat-card">
              <h3>Tâches en cours</h3>
              <div className="stat-number">
                {tasks.filter((t) => !t.is_completed).length}
              </div>
            </div>
            <div className="stat-card">
              <h3>Tâches terminées</h3>
              <div className="stat-number">
                {tasks.filter((t) => t.is_completed).length}
              </div>
            </div>
            <div className="stat-card">
              <h3>Tâches en retard</h3>
              <div className="stat-number">{overDueTasks()}</div>
            </div>
          </div>
        </div>
        <div className="tasks-section" style={{ marginTop: "40px" }}>
          <AddTask addTask={addTask} />
          <FilterTask filter={filter} setFilter={setFilter} />
          <TaskList
            tasks={filteredTasks}
            toggleTask={() => toggleTask()}
            deleteTask={deleteTask}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
