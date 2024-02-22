import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/register', {
        name,
        email,
        password,
      });

      if (response.status === 200) {
        console.log('Registration successful');
        navigate("/home");
      } else {
        console.log('Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  const styles = {
    registerContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
    },
    registerContent: {
      maxWidth: '400px',
      width: '100%',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#f9f9f9',
    },
    registerHeading: {
      textAlign: 'center',
      color: '#333',
    },
    registerForm: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: '20px',
    },
    registerLabel: {
      marginBottom: '5px',
      color: '#555',
    },
    registerInput: {
      padding: '8px',
      marginBottom: '10px',
      border: '1px solid #ccc',
      borderRadius: '4px',
    },
    registerButton: {
      padding: '10px',
      background: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.registerContainer}>
      <div style={styles.registerContent}>
        <h2 style={styles.registerHeading}>Register</h2>
        <form style={styles.registerForm}>
          <label style={styles.registerLabel}>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={styles.registerInput} />
          <br />
          <label style={styles.registerLabel}>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.registerInput} />
          <br />
          <label style={styles.registerLabel}>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.registerInput} />
          <br />
          <button type="button" onClick={handleRegister} style={styles.registerButton}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
