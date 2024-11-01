import { useState } from "react";
import "../styles/Activity.css";

const Activity = ({
  activities,
  selectedActivity,
  setSelectedActivity,
  createActivity,
}) => {
  const [newActivityName, setNewActivityName] = useState("");
  const [tasks, setTasks] = useState([]);

  const handleAddNewTask = () => {
    const newTask = { name: "", finished: false };
    setTasks([...tasks, newTask]);
  };

  const handleTaskChange = (index, newName) => {
    setTasks(tasks.map((task, i) => (i === index ? { ...task, name: newName } : task)));
  };

  const handleCheckChange = (index) => {
    setTasks(tasks.map((task, i) => (i === index ? { ...task, finished: !task.finished } : task)));
  };

  const handleDeleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleCreateActivity = () => {
    if (newActivityName.trim()) {
      createActivity(newActivityName);
      setNewActivityName("");
    }
  };

  return (
    <div className="task-box">
      <h3>Session Activity</h3>
      <select value={selectedActivity} onChange={(e) => setSelectedActivity(e.target.value)}>
        <option value="" disabled>Select an Activity</option>
        {activities.map((activity) => (
          <option key={activity._id} value={activity._id}>{activity.name}</option>
        ))}
      </select>
      <input
        type="text"
        value={newActivityName}
        placeholder="New Activity Name"
        onChange={(e) => setNewActivityName(e.target.value)}
      />
      <button onClick={handleCreateActivity} disabled={!newActivityName.trim()}>
        Create Activity
      </button>
      
      <h4>Tasks</h4>
      <ul>
        {tasks.map((task, index) => (
          <li key={index} className="task-item">
            <input
              type="text"
              value={task.name}
              onChange={(e) => handleTaskChange(index, e.target.value)}
              placeholder="Enter sub-task name"
            />
            <input
              type="checkbox"
              checked={task.finished}
              onChange={() => handleCheckChange(index)}
            />
            <button onClick={() => handleDeleteTask(index)}>Delete Task</button>
          </li>
        ))}
      </ul>
      <button onClick={handleAddNewTask}>Add New Task</button>
    </div>
  );
};

export default Activity;
