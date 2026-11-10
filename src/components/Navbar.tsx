import "./Navbar.css";
import logo from "../assets/Logo Kopiloka.png"
import { Link, useNavigate } from "react-router-dom";
import { useState, type MouseEvent, type CSSProperties, useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";

function Navbar() {
  const [mousePosition, setMousePosition] = useState ({ x:50, y: 50});
  const [user, setUser] = useState<User | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const {
      data: { subscription }, 
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
  });
     return () => subscription.unsubscribe();
}, []);

 const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
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

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error){
      console.error("Logout failed:", error.message);
      return;
    }

    navigate("/");
  };

  const displayName = 
    user?.user_metadata?.username || 
    user?.email?.split("@")[0];

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
        {user ?(
          <>
           <span className="user-name">
             Hi, {displayName}
           </span>

            <button
            className="login-nav-button"
            onClick= {handleLogout}
            onMouseMove={handleMouseMove}
            style={buttonStyle}
            >
              <span> Logout </span>
            </button>
            </>
        ) : (
           <Link 
          to= "/login" 
          className="login-nav-button"
          onMouseMove={handleMouseMove}
          style={buttonStyle}
          >
           <span> Login </span>
        </Link>
        )}
         
      <a href="#discover" className="nav-button">
        Explore Cafes
      </a>
      </div>
    </nav>
  );
}

export default Navbar;
