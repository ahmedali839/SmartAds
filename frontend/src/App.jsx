import { BrowserRouter as Router, Route, Routes } from "react-router-dom"


import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import ProtectedWrapper from "./components/protectingWrapper";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <>

      <Router>
        <Header />
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/me" element={
            <ProtectedWrapper>
              <Dashboard />
            </ProtectedWrapper>
          }
          />

          <Route path="/create" element={
            <ProtectedWrapper>
              <CreatePost />
            </ProtectedWrapper>
          }
          />

        </Routes >
        <Footer />
      </Router >

    </>
  );
}

export default App;
