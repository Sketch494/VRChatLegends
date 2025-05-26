import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faDiscord, faHome } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const clientId = process.env.REACT_APP_DISCORD_CLIENT_ID || 'YOUR_DISCORD_CLIENT_ID';
  const redirectUri = encodeURIComponent('https://your-vercel-app.vercel.app/api/auth/discord/callback');
  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify`;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      axios.get(`https://your-vercel-app.vercel.app/api/auth/discord/callback?code=${code}`)
        .then(response => {
          setUser(response.data.user);
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .catch(err => {
          setError('Failed to authenticate with Discord');
          console.error(err);
        });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card p-6 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold text-purple-400 mb-4">
          <FontAwesomeIcon icon={faSignInAlt} className="fa-icon mr-2" />
          Login to VRChat Legends
        </h2>
        {user ? (
          <div className="text-gray-300">
            <p>Welcome, {user.username}#{user.discriminator}!</p>
            <p className="mt-2">You are now logged in.</p>
            <a href="/" className="cta-button mt-4">
              <FontAwesomeIcon icon={faHome} className="fa-icon" />
              Go to Home
            </a>
          </div>
        ) : (
          <div>
            <p className="text-gray-300 mb-4">Sign in with your Discord account to contribute to VRChat Legends.</p>
            <a href={discordAuthUrl} className="cta-button">
              <FontAwesomeIcon icon={faDiscord} className="fa-icon" />
              Login with Discord
            </a>
            {error && <p className="text-red-400 mt-4">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
