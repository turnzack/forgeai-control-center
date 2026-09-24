import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const mode = import.meta.env.VITE_STORAGE_MODE ?? 'local';
function App() { return <main><h1>ForgeAI SaaS</h1><p>Fullstack production scaffold · storage: {mode}</p></main>; }
createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
