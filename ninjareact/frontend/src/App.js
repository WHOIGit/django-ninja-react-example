import React, { useState, useEffect } from 'react';
import axios from 'axios';

const getCsrfToken = () => {
  const name = 'csrftoken=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return '';
};

const axiosInstance = axios.create({
  headers: {
    'X-CSRFToken': getCsrfToken(),
  },
  withCredentials: true,
});

const App = () => {
  const [message, setMessage] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetchMessage();
    checkAuthStatus();
  }, []);

  const fetchMessage = async () => {
    try {
      const response = await axiosInstance.get('/api/message');
      setMessage(response.data.content);
    } catch (error) {
      console.error('Error fetching message:', error);
    }
  };

  const updateMessage = async () => {
    try {
      const response = await axiosInstance.put('/api/message', { new_message: newMessage });
      setMessage(response.data.message);
      setNewMessage('');
    } catch (error) {
      console.error('Error updating message:', error);
      if (error.response) {
        if (error.response.status === 401) {
          alert('Authentication failed. Please log in again.');
          setIsAuthenticated(false);
        } else if (error.response.status === 403) {
          alert('You do not have permission to perform this action.');
        } else if (error.response.status === 422) {
          alert('Invalid data format. Please check your input.');
        } else {
          alert('An error occurred. Please try again.');
        }
      }
    }
  };

  const checkAuthStatus = async () => {
    try {
      const response = await axiosInstance.get('/api/auth_status');
      setIsAuthenticated(response.data.is_authenticated);
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    }
  };

  return (
    <div>
      <h1>Hello World API</h1>
      <p>Current message: {message}</p>
      {isAuthenticated ? (
        <div>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Enter new message"
          />
          <button onClick={updateMessage}>Update Message</button>
        </div>
      ) : (
        <p>Please log in to edit the message. <a href="/admin/">Admin Login</a></p>
      )}
    </div>
  );
};

export default App;