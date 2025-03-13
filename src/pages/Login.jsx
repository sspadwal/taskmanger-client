// Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
	const [ username, setUsername ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ error, setError ] = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await axios.post('http://localhost:5000/api/auth/login', {
				username,
				password
			});

			localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', username);
			navigate('/dashboard');
		} catch (err) {
			setError('Invalid username or password');
		}
	};

	return (
		<section className="login-section">
			<div className="auth-form">
				<h1>Login</h1>
				{error && <p className="error">{error}</p>}
				<form onSubmit={handleSubmit}>
					<div>
						<label>Username:</label>
						<input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
					</div>
					<div>
						<label>Password:</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					<button type="submit">Login</button>
				</form>
			</div>
		</section>
	);
};

export default Login;
