import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile"
import Chat from "./pages/Chat";
import Notifications from "./pages/Notifications";
import { BottomNav } from "./components/BottomNav";

function NavbarWrapper() {
  const location = useLocation();
  const hideNavbarOn = ["/", "/login", "/register", "/forgot-password",];

  if (hideNavbarOn.includes(location.pathname) ||
    location.pathname.startsWith("/reset-password")) {
    return null;
  }
  return <Navbar />;
}

function BottomNavWrapper() {
  const location = useLocation();

  const hideBottomNavOn = ["/", "/login", "/register", "/forgot-password"];

  if (hideBottomNavOn.includes(location.pathname) ||
    location.pathname.startsWith("/reset-password")) {
    return null;
  }

  return <BottomNav />;
}

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <NavbarWrapper />

        <div className="md:pb-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            <Route
              path="/feed"
              element={
                <ProtectedRoute>
                  <Feed />
                </ProtectedRoute>
              }
            />
            
            <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/chat/:id" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          </Routes>
        </div>

        <BottomNavWrapper /> 
      </Router>
    </>
  );
}

export default App;