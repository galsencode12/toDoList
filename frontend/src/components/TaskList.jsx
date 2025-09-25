import React from "react";
import TaskItem from "./TaskItem.jsx";

const TaskList = ({ tasks, toggleTask, deleteTask }) => {
  if (tasks.length === 0) return <p>Aucune tâche pour le moment.</p>;

  return (
    <div>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
        />
      ))}
    </div>
  );
};

export default TaskList;
