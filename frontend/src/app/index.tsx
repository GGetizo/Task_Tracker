//index.tsx
"use client"

import React from 'react';
import ReactDOM from 'react-dom/client';
import './global.css'; // Importing global styles
import App from './page'; // Importing the main App component
import { AuthProvider } from '@/context/authProvider'; // Importing AuthProvider

const container = document.getElementById('root'); // Getting the root container
const root = ReactDOM.createRoot(container as HTMLElement); // Creating the root

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);

