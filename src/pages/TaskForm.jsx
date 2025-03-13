import React, { useState, useEffect } from 'react';

const TaskForm = ({ selectedTask, setSelectedTask, onTaskCreated }) => {
    const [task, setTask] = useState({
        title: '',
        description: '',
        priority: 'low',
        completed: false,
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (selectedTask) {
            setTask(selectedTask);
        } else {
            setTask({ title: '', description: '', priority: 'low', completed: false });
        }
    }, [selectedTask]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setTask((prevTask) => ({
            ...prevTask,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!task.title || !task.description) {
            setMessage('Title and description are required.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessage('No authentication token found. Please log in.');
                return;
            }

            let response;
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };

            if (selectedTask) {
                response = await fetch(
                    `https://taskmanager-server-1-frwy.onrender.com/api/tasks/${selectedTask._id}`,
                    {
                        method: 'PUT',
                        ...config,
                        body: JSON.stringify(task),
                    }
                );
            } else {
                response = await fetch(
                    'https://taskmanager-server-1-frwy.onrender.com/api/tasks',
                    {
                        method: 'POST',
                        ...config,
                        body: JSON.stringify(task),
                    }
                );
            }

            const data = await response.json();

            if (response.ok) {
                setMessage(selectedTask ? 'Task updated successfully!' : 'Task created successfully!');
                if (typeof onTaskCreated === 'function') {
                    onTaskCreated(data.task || data, !!selectedTask);
                } else {
                    console.warn('onTaskCreated is not a function or not provided');
                }
                setTask({ title: '', description: '', priority: 'low', completed: false });
                setSelectedTask(null);
            } else {
                setMessage(data.message || 'Error saving task');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setMessage('Error saving task: ' + error.message);
        }
    };

    // Rest of the component (form JSX) remains unchanged...
    return (
        <div className="task-form-container">
            <form onSubmit={handleSubmit} className="task-form-inline">
                <div className="form-field">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={task.title}
                        onChange={handleChange}
                        placeholder="Task title"
                        required
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={task.description}
                        onChange={handleChange}
                        placeholder="Task description"
                        required
                        rows="4"
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="priority">Priority:</label>
                    <select id="priority" name="priority" value={task.priority} onChange={handleChange} required>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                <div className="form-field checkbox-field">
                    <label htmlFor="completed">Completed:</label>
                    <input
                        type="checkbox"
                        id="completed"
                        name="completed"
                        checked={task.completed}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-field">
                    <button type="submit" className="create-btn">
                        {selectedTask ? 'Update' : 'Create'}
                    </button>
                </div>
            </form>
            {message && <div className="message">{message}</div>}
        </div>
    );
};

export default TaskForm;