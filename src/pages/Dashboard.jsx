import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TaskForm from './TaskForm';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/tasks', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTasks(response.data);
            } catch (err) {
                setError('Error fetching tasks');
            }
        };
        fetchTasks();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleEdit = (task) => {
        setSelectedTask(task);
    };

    const handleDelete = async (taskId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(tasks.filter((task) => task._id !== taskId));
        } catch (err) {
            setError('Error deleting task');
        }
    };

    const onTaskCreated = (task, isUpdate = false) => {
        if (isUpdate) {
            setTasks(tasks.map((t) => (t._id === task._id ? task : t)));
        } else {
            setTasks([...tasks, task]);
        }
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                
            </div>
            {error && <p className="error">{error}</p>}

            <div className="dashboard-container">
                {/* Task Form (Horizontal) */}
                <div className="task-form-container">
                    <TaskForm
                        selectedTask={selectedTask}
                        setSelectedTask={setSelectedTask}
                        onTaskCreated={onTaskCreated}
                    />
                </div>

                {/* Task List (Vertical) */}
                <div className="task-list-container">
                    <h2>Your Tasks</h2>
                    <ul className="task-list">
                        {tasks.map((task) => (
                            <li key={task._id} className="task-item">
                                <h3>{task.title}</h3>
                                <p>{task.description}</p>
                                <p>Priority: {task.priority}</p>
                                <p>Status: {task.completed ? 'Completed' : 'Pending'}</p>
                                <button onClick={() => handleEdit(task)}>Edit</button>
                                <button onClick={() => handleDelete(task._id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;