import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Discover from "./components/Discover";
import About from "./components/About";
import Map from "./components/Maps";
import Login, { Register} from "./pages/Login";

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
    </Routes>
  );
}

export default App;