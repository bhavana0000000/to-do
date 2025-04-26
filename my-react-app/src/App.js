import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '',
    taskTitle: ''
  });

  // Fetch tasks when authenticated
  useEffect(() => {
    if (token) {
      axios.get(`${API_BASE}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setTasks(res.data))
      .catch(() => setToken(''));
    }
  }, [token]);

  const handleRegister = async e => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/register`, formData);
      alert('Registration successful! Please login.');
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    }
  };

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/login`, {
        email: formData.email,
        password: formData.password
      });
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
    } catch (err) {
      alert('Invalid credentials');
    }
  };

  const handleAddTask = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/tasks`, 
        { title: formData.taskTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([...tasks, res.data]);
      setFormData({ ...formData, taskTitle: '' });
    } catch (err) {
      alert('Failed to add task');
    }
  };

  if (!token) {
    return (
      <div className="auth-container">
        <h1>Task Manager</h1>
        
        <form onSubmit={handleRegister} className="auth-form">
          <h2>Register</h2>
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={e => setFormData({ ...formData, username: e.target.value })}
            aria-label="Username"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            aria-label="Email"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            aria-label="Password"
            required
          />
          <button type="submit">Register</button>
        </form>

        <form onSubmit={handleLogin} className="auth-form">
          <h2>Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            aria-label="Login Email"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            aria-label="Login Password"
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header>
        <h1>Task Manager</h1>
        <button 
          onClick={() => {
            setToken('');
            localStorage.removeItem('token');
          }}
          aria-label="Logout"
        >
          Logout
        </button>
      </header>

      <main>
        <form onSubmit={handleAddTask} className="task-form">
          <input
            type="text"
            placeholder="New task"
            value={formData.taskTitle}
            onChange={e => setFormData({ ...formData, taskTitle: e.target.value })}
            aria-label="Task input"
            required
          />
          <button type="submit">Add Task</button>
        </form>

        <ul className="task-list">
          {tasks.map(task => (
            <li key={task._id} className="task-item">
              <span>{task.title}</span>
              <button 
                onClick={async () => {
                  try {
                    await axios.delete(`${API_BASE}/tasks/${task._id}`, {
                      headers: { Authorization: `Bearer ${token}` }
                    });
                    setTasks(tasks.filter(t => t._id !== task._id));
                  } catch (err) {
                    alert('Failed to delete task');
                  }
                }}
                aria-label={`Delete task: ${task.title}`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
