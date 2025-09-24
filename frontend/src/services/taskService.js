import { BASE_URL, getCSRFToken } from "../helpers";

export async function getDashboardData() {
  const token = await getCSRFToken();
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
// /api/tasks/ renvoie une réponse comme ici
/*
{
  "username": "antoniodelacruz",
  "tasks": [
    {
      "id": 27,
      "title": "Likely success fast event.",
      "description": "Explain consider several bank full skill six. Financial enough soon leg.\nHere the nice wait. Bank piece financial area from. Garden among unit last little.",
      "is_completed": true,
      "due_date": "2025-09-20",
      "priority": 1,
      "created_at": "2025-09-24T12:25:00.219688Z",
      "updated_at": "2025-09-24T12:25:00.219697Z"
    },
    ...
    ...
*/
