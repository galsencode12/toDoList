import { useCallback, useEffect, useState } from "react";
import AddTask from "../components/AddTask.jsx";
import TaskList from "../components/TaskList.jsx";
import FilterTask from "../components/FilterTask.jsx";
import { useAuth } from "../helpers";

import "./Dashboard.css";

import {
  createTask,
  deleteTask,
  getActiveTasks,
  getCompletedTasks,
  getDashboardData,
  toggleTaskState,
} from "../services/taskService";

const Dashboard = () => {
  const { logout } = useAuth();
  const [username, setUsername] = useState("");
  const [tasks, setTasks] = useState([]); // source of truth: tasks list from server
  const [filter, setFilter] = useState("all"); // filter state: all | pending | completed

  // Charger les dopnnées utilisateur + toutes les tâches au premier rendu
  useEffect(() => {
    (async () => {
      const { username, tasks } = await getDashboardData();
      setUsername(username);
      setTasks(tasks);
    })();
  }, []);

  // Fonction réutilisable pour rafraîchir les tâches selon le filtre actif
  // useCallback empêche de recréer la fonction à chaque rendu inutilement
  const refreshTasks = useCallback(async () => {
    if (filter === "all") {
      const { tasks } = await getDashboardData(); // toutes les tâches
      setTasks(tasks);
    } else if (filter === "pending") {
      setTasks(await getActiveTasks()); // uniquement les tâches en cours
    } else if (filter === "completed") {
      setTasks(await getCompletedTasks()); // uniquement les tâches terminées
    }
  }, [filter]);

  // Recharger les tâches à chaque changement de filtre
  useEffect(() => {
    refreshTasks();
  }, [filter, refreshTasks]);

  // Supprimer une tâche et rafraîchir la liste
  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
    await refreshTasks();
  };

  // Ajouter une nouvelle tâche puis rafraîchir la liste
  const addTask = async (title, description, due_date) => {
    const newTask = {
      id: Date.now(),
      title,
      description: description || "",
      due_date: due_date || null,
      priority: 0,
      completed: false,
    };
    await createTask(newTask);
    await refreshTasks();
  };

  // Basculer l’état (terminée/en cours) puis rafraîchir la liste
  const handleToggle = async (task) => {
    await toggleTaskState(task);
    await refreshTasks();
  };

  // Compter le nombre de tâches en retard (échéance passée et non terminées)
  const overDueTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // comparaison à la date du jour uniquement
    return tasks.filter(
      (task) =>
        task.due_date &&
        new Date(task.due_date).setHours(0, 0, 0, 0) < today &&
        !task.is_completed
    ).length;
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
            <span>Bienvenue, {username} </span>
            <button onClick={() => logout()} className="logout-button">
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
            tasks={tasks}
            onToggle={handleToggle}
            deleteTask={handleDeleteTask}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
