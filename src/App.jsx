import axios from "axios";
import { useRef, useState } from "react"
import { youtube_parser } from "./utils";
// import fileDownload from 'js-file-download'

function App() {
  const inputUrlRef = useRef();
  const [urlResultA, setUrlResultA] = useState(null);
  const [urlResultV, setUrlResultV] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [enteredUsername, setEnteredUsername] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState('');
  const [notificationType, setNotificationType] = useState('info');

  const showNotification = (message, type = 'info') => {
    setNotification(message);
    setNotificationType(type);
    setTimeout(() => {
      setNotification('');
    }, 3000);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const username = 'deep';
    const password = 'welcome';

    if (enteredUsername === username && enteredPassword === password) {
      setLoggedIn(true);
      setEnteredUsername('');
      setEnteredPassword('');
      showNotification('Welcome back! You are now logged in.', 'success');
      return;
    }

    showNotification('Invalid username or password. Please try again.', 'error');
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUrlResultA(null);
    setUrlResultV(null);
    setError('');
    showNotification('You have been logged out.', 'info');
  };

  const handleAudio = (e) => {
    e.preventDefault()

    if (!loggedIn) {
      showNotification("Please log in to use this feature.", 'error');
      return;
    }

    const youtubeID = youtube_parser(inputUrlRef.current.value);
    if (!youtubeID) {
      setError("Invalid YouTube URL. Please enter a valid URL.");
      return;
    }

    setLoading(true);
    setError('');
    setUrlResultA(null);

    const options = {
      method: 'get',
      url: 'https://youtube-mp36.p.rapidapi.com/dl',
      headers: {
        'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY_vid,
        'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
      },
      params: {
        id: youtubeID
      }
    }

    axios(options)
      .then(res => {
        setUrlResultA(res.data.link);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setError("Failed to fetch MP3. Please try again.");
        setLoading(false);
      })

    inputUrlRef.current.value = '';

  }


  const handleVideo = (e) => {
    e.preventDefault()

    if (!loggedIn) {
      showNotification("Please log in to use this feature.", 'error');
      return;
    }

    const youtubeID = youtube_parser(inputUrlRef.current.value);
    if (!youtubeID) {
      setError("Invalid YouTube URL. Please enter a valid URL.");
      return;
    }

    setLoading(true);
    setError('');
    setUrlResultV(null);

    const options = {
      method: 'GET',
      url: 'https://ytstream-download-youtube-videos.p.rapidapi.com/dl',
      params: {
        id: youtubeID
      },
      headers: {
        'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY_vid,
        'X-RapidAPI-Host': 'ytstream-download-youtube-videos.p.rapidapi.com'
      }
    };

    axios(options)
      .then((res) => {
        console.log(res.data.adaptiveFormats[0].url)
        setUrlResultV(res.data.adaptiveFormats[0].url)
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setError("Failed to fetch Video. Please try again.");
        setLoading(false);
      })

    inputUrlRef.current.value = '';

  }

  if (!loggedIn) {
    return (
      <div className="login-screen">
        {notification && (
          <div className={`notification ${notificationType}`}>
            {notification}
          </div>
        )}

        <div className="login-card">
          <div className="login-header">
            <span className="logo">Gada</span>
            <p>Log in to access the YouTube converter.</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={enteredUsername}
              onChange={(e) => setEnteredUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={enteredPassword}
              onChange={(e) => setEnteredPassword(e.target.value)}
              required
            />
            <button type="submit" className="form_button">Log In</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      {notification && (
        <div className={`notification ${notificationType}`}>
          {notification}
        </div>
      )}

      <div className="top-bar">
        <span className="logo">Gada</span>
        <button className="login-button" onClick={handleLogout}>
          Log Out
        </button>
      </div>

      <section className="content">
        <div className="hero-card">
          <div className="hero-copy">
            <p className="hero-label">Instant converter</p>
            <h1 className="content_title">YouTube to MP3 / MP4</h1>
            <p className="content_description">
              Paste a valid YouTube link, choose your output type, and download instantly.
            </p>
            <p className="hero-note">Secure, fast, and easy to use on any screen size.</p>
          </div>

          <div className="converter-card">
            <div className="converter-header">
              <span>Enter your YouTube link</span>
              <span className="status-pill">Logged in</span>
            </div>

            <form className="form">
              <input ref={inputUrlRef} placeholder="Paste the YouTube URL here..." className="form_input" type="text" />
              <div className="button-group">
                <button onClick={handleAudio} type="submit" className="form_button" disabled={loading}>Mp3(Only)</button>
                <button onClick={handleVideo} type="submit" className="form_button" disabled={loading}>Video(Only)</button>
              </div>
            </form>

            {loading && <p className="loading">Processing your request...</p>}
            {error && <p className="error">{error}</p>}

            <div className="result-group">
              {urlResultA && (
                <a target="_blank" rel="noreferrer" href={urlResultA} className="download_btn">
                  Download MP3
                </a>
              )}
              {urlResultV && (
                <a target="_blank" rel="noreferrer" href={urlResultV} className="download_btn secondary">
                  Download Video
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <h3>Fast Conversion</h3>
            <p>Get audio or video links in seconds with one click.</p>
          </div>
          <div className="feature-card">
            <h3>Mobile Friendly</h3>
            <p>Works smoothly on phones, tablets, and desktop screens.</p>
          </div>
          <div className="feature-card">
            <h3>Clean Interface</h3>
            <p>A simple workflow designed for fast downloads.</p>
          </div>
        </div>
      </section>
    </div>
  )









}

export default App