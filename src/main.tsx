import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { disableConsoleInProduction } from './utils/logger'

// Disable console logs in production for security and performance
disableConsoleInProduction()

// Determine basename based on whether we're running standalone or embedded
const getBasename = () => {
  // Always use empty basename for Docker deployment
  // This ensures consistent routing behavior when refreshing pages
  return '';
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename={getBasename()}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
) 