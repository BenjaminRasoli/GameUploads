import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar/Navbar";
import Projects from "./components/Projects/Projects";
import UploadProject from "./components/UploadProject/UploadProject";
import Project from "./components/Project/Project";
import GameId from "./components/AboutGameId/AboutGameId";
import "./index.css";
import { AuthenticationGuard } from "./auth/AuthenticationGuard ";

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        limit={1}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Navbar />
      <Routes>
        <Route path="/" element={<Projects />} />
        <Route
          path="/upload"
          element={<AuthenticationGuard component={UploadProject} />}
        />
        <Route path="/project/:id" element={<Project />} />
        <Route path="/AboutGameId" element={<GameId />} />
      </Routes>
    </Router>
  );
}

export default App;
