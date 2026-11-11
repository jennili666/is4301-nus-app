import "./App.css";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import { NotificationProvider } from "./components/Notification";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Academics from "./pages/Academics";
import Admission from "./pages/Admission";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <div className="app">
      <Router>
        <NotificationProvider>
          <NavBar />
          <main className="page">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/academics"
                element={
                  <ProtectedRoute pageName="Academics">
                    <Academics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admission"
                element={
                  <ProtectedRoute pageName="Admission">
                    <Admission />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </NotificationProvider>
      </Router>
    </div>
  );
}

export default App;
