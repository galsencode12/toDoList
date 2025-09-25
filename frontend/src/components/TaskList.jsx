import React from "react";
import TaskItem from "./TaskItem.jsx";

const TaskList = ({ tasks, onToggle, deleteTask }) => {
  if (tasks.length === 0) return <p>Aucune tâche pour le moment.</p>;

  return (
    <div>
      {tasks.map((task, index) => (
        <TaskItem
          key={index}
          task={task}
          onToggle={onToggle}
          deleteTask={deleteTask}
        />
      ))}
    </div>
  );
};

export default TaskList;
