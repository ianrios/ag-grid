import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeBuilder } from './ThemeBuilder';
import './main.scss';

const root = ReactDOM.createRoot(document.getElementById('theme-builder-root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ThemeBuilder />
  </React.StrictMode>,
);
