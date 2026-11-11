import "./Navbar.css";
import logo from "../assets/Logo Kopiloka.png"
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, type MouseEvent, type CSSProperties, useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";

function Navbar() {
  const [mousePosition, setMousePosition] = useState ({ x:50, y: 50});
  const [user, setUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  

  const navigate = useNavigate();

  const location = useLocation();

  
  // Detect active section
  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection("");
      return;
    }

    const sections = ["discover", "about", "map"];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px",
      }
    );

    sections.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  // Detect navbar scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.substring(1);

      requestAnimationFrame(() => {
        document.getElementById(sectionId)?.scrollIntoView({
          behavior: "smooth",
        });
      });
    }
  }, [location.pathname, location.hash]);

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
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="nav-links">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Kopiloka Logo" />
        </Link>

        <Link 
           to="#discover"
           className={activeSection === "discover"? "active" : ""}
           >
             Discover
           </Link>

        <Link 
          to="#about"
          className={activeSection === "about" ? "active" : ""}
          >
            About
            </Link>

        <Link 
          to="/#map"
          className={activeSection === "map" ? "active" : ""}
            >
              Map
              </Link>
      </div>

      <div className="nav-actions">
        {user ?(
          <>
           <span className="user-name">
             Hi, {displayName}
           </span>

           <Link to="/saved-cafes" className="nav-button">
             Saved Cafes 
           </Link>

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
         
      <Link to="#discover" className="nav-button">
        Explore Cafes
      </Link>
      </div>
    </nav>
  );
}

export default Navbar;
