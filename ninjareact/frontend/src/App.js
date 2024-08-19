import React, { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

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
      const response = await axios.get('/api/message');
      setMessage(response.data.content);
    } catch (error) {
      console.error('Error fetching message:', error);
    }
  };

  const updateMessage = async () => {
    try {
      const response = await axios.put('/api/message', { new_message: newMessage });
      setMessage(response.data.message);
      setNewMessage('');
    } catch (error) {
      console.error('Error updating message:', error);
      if (error.response && error.response.status === 403) {
        alert('You are not authenticated. Please log in to update the message.');
      } else if (error.response && error.response.status === 422) {
        alert('Invalid data format. Please check your input.');
      }
    }
  };

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('/api/auth_status');
      setIsAuthenticated(response.data.is_authenticated);
    } catch (error) {
      console.error('Error checking auth status:', error);
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