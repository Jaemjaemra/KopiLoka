import "./Navbar.css";
import logo from "../assets/Logo Kopiloka.png"
import { Link } from "react-router-dom";
import { useState, type MouseEvent, type CSSProperties } from "react";

function Navbar() {
  const [mousePosition, setMousePosition] = useState ({ x:50, y: 50});

  const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const buttonStyle ={ 
     "--mouse-x": `${mousePosition.x}%`,
     "--mouse-y": `${mousePosition.y}%`,
  } as CSSProperties;

  return (
    <nav className="navbar">
      <div className="nav-links">
        <a href="#home" className="navbar-logo">
          <img src={logo} alt="Kopiloka Logo" />
        </a>

        <a href="#discover">Discover</a>
        <a href="#about">About</a>
      </div>

      <div className="nav-actions">
        <Link 
          to= "/login" 
          className="login-nav-button"
          onMouseMove={handleMouseMove}
          style={buttonStyle}
          >
           <span> Login </span>
        </Link>

      <a href="#discover" className="nav-button">
        Explore Cafes
      </a>
      </div>
    </nav>
  );
}

export default Navbar;
