import { BASE_URL, getCSRFToken } from "../helpers";

export async function getDashboardData() {
  const token = await getCSRFToken();
  // requete vers /api/tasks/
  const response = await fetch(`${BASE_URL}/tasks/`, {
    credentials: "include",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": token,
    },
  });
  // username est le nom de l'utilisateur , tasks est un tableau (array) avec les données des taches
  //{ username, tasks }
  return await response.json();
}
export async function createTask(newTask) {
  const token = await getCSRFToken();
  const response = await fetch(`${BASE_URL}/tasks/`, {
    method: "POST",
    // credentials :include permet d'include le session_id dans les cookies ,
    // Important pour l'authentification coté backend
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      //ajout du token csrf dans les headers
      "X-CSRFToken": token,
    },
    body: JSON.stringify(newTask),
  });

  const data = await response.json();
  console.log(response.status);
  console.log(data);

  if (!response.ok) {
    throw new Error(data.message || "Erreur lors de la creation de tache");
  }
}
export async function deleteTask(id) {
  const token = await getCSRFToken();
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE",
    // credentials :include permet d'include le session_id dans les cookies ,
    // Important pour l'authentification coté backend
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      //ajout du token csrf dans les headers
      "X-CSRFToken": token,
    },
  });

  console.log(response.status);

  if (!response.ok) {
    throw new Error("Erreur lors de la suppression de tache");
  }
}

async function editTask(task) {
  const token = await getCSRFToken();
  const response = await fetch(`${BASE_URL}/tasks/${task.id}`, {
    method: "PUT",
    // credentials :include permet d'include le session_id dans les cookies ,
    // Important pour l'authentification coté backend
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      //ajout du token csrf dans les headers
      "X-CSRFToken": token,
    },
    body: JSON.stringify(task),
  });

  const data = await response.json();
  console.log(response.status);
  console.log(data);

  if (!response.ok) {
    throw new Error(data.message || "Erreur lors de la modification de tache");
  }
}
// Marquer une tache complete ou en progression
export async function toggleTaskState(task) {
  try {
    // Inverser is_completed
    task.is_completed = !task.is_completed;
    await editTask(task);
  } catch (error) {
    console.error(error);
  }
}

export async function getCompletedTasks() {
  const token = await getCSRFToken();
  // requete vers /api/tasks/filter?state=done
  const response = await fetch(`${BASE_URL}/tasks/filter?state=done`, {
    credentials: "include",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": token,
    },
  });
  const data = await response.json();
  return data;
}
export async function getActiveTasks() {
  const token = await getCSRFToken();
  // requete vers /api/tasks/filter?state=done
  const response = await fetch(`${BASE_URL}/tasks/filter?state=active`, {
    credentials: "include",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": token,
    },
  });
  const data = await response.json();
  return data;
}
