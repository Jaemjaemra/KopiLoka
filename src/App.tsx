import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Discover from "./components/Discover";
import About from "./components/About";
import Map from "./components/Maps";
import Login, { Register } from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import SavedCafes from "./pages/SavedCafes";

import "./App.css";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Discover />
      <About />
      <Map />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/saved-cafes" element={<SavedCafes />} />
      </Route>
    </Routes>
  );
}

export default App;
