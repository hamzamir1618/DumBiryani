import { createRoot } from 'react-dom/client';
import App from './App';
import { expose, startRide } from './lib/dum';
import './styles/tokens.css';
import './styles/base.css';
import './styles/home.css';
import './styles/views.css';

startRide();
expose();

// No StrictMode: double-mounted effects would run the one-shot choreography twice.
createRoot(document.getElementById('root')!).render(<App />);
