import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log('🔵 Script loaded');

// Register service worker for ultra-fast API caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('⚡ SW registered for 5G-speed caching');
      })
      .catch(error => {
        console.log('SW registration failed:', error);
      });
  });
}

// Wait for DOM to be ready
const initApp = () => {
  console.log('🔵 DOM Content Loaded');
  const rootElement = document.getElementById("root");
  console.log('🔵 Root element found:', rootElement);
  
  if (!rootElement) {
    console.error('🔴 Root element not found');
    return;
  }

  try {
    console.log('🔵 React rendering...');
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log('🟢 React rendered successfully');
  } catch (error) {
    console.error('🔴 Failed to render app:', error);
    // Fallback: show basic error message
    rootElement.innerHTML = '<div style="padding: 20px; text-align: center; background: orange; color: black; font-size: 18px;">⚠️ REACT FAILED TO LOAD ⚠️<br>Check console for errors</div>';
  }
};

// Ensure DOM is loaded
if (document.readyState === 'loading') {
  console.log('🔵 Waiting for DOM...');
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  console.log('🔵 DOM already ready');
  initApp();
}
