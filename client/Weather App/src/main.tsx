import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App.tsx'
import './index.css'
import HomePage from './HomePage.tsx';
import SavedLocationsPage from './SavedLocationsPage.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // The App component is our layout
    children: [
      { index: true, element: <HomePage /> }, // Render HomePage at "/"
      { path: "saved", element: <SavedLocationsPage /> }, // Render SavedLocationsPage at "/saved"
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
