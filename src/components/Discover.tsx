import {useEffect, useState} from "react";
import { AnimatePresence, motion } from "motion/react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import "./Discover.css";

type Cafe = {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    description: string;
    image_url: string;
};

function Discover () {
    const [cafes, setCafes] = useState<Cafe[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [savedCafes, setSavedCafes] = useState<string[]>([]);

    useEffect(() => {
        const fetchCafes = async () => {
            const { data, error } = await supabase
              .from("cafes")
              .select("id, name, address, city, state, description, image_url")
              .eq("status", "approved")
              .order("created_at", { ascending: true });

              if (error) {
                setError(error.message);
              } else {
                setCafes(data ?? []);
              }

              setLoading(false);
        };

        fetchCafes();
    }, []);

    useEffect(() => {
        const fetchSavedCafes = async (userId: string) => {
            const { data, error } = await supabase
            .from ("saved_cafes")
            .select ("cafe_id")
            .eq("user_id", userId);

            if (error) {
                console.error("Failed to fetch favourites:", error.message);
                return;
            }

            setSavedCafes(data.map((item ) => item.cafe_id));
        };

        const checkUser = async () => {
            const {data: { session} } = await supabase.auth.getSession();

            if(session) {
                await fetchSavedCafes(session.user.id);
            } else {
                setSavedCafes([]);
            }
        };

        checkUser(); 

        const {
            data: { subscription }, 
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                fetchSavedCafes(session.user.id); 
            } else {
                setSavedCafes([]);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const nextSlide = () => {
        setActiveIndex((current) => (current + 1) % cafes.length);
    };

    const prevSlide = () => {
        setActiveIndex((current) =>
        (current - 1 + cafes.length) % cafes.length
        );
    };

    const activeCafe = cafes[activeIndex]; 

    const handleSaveCafe = async (cafeId: string) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    navigate("/login");
    return;
  }

  const isSaved = savedCafes.includes(cafeId);

  if (isSaved) {
    const { error } = await supabase
      .from("saved_cafes")
      .delete()
      .eq("user_id", session.user.id)
      .eq("cafe_id", cafeId);

    if (error) {
      console.error("Failed to remove favourite:", error.message);
      return;
    }

    setSavedCafes((current) =>
      current.filter((id) => id !== cafeId)
    );
  } else {
    const { error } = await supabase
      .from("saved_cafes")
      .insert({
        user_id: session.user.id,
        cafe_id: cafeId,
      });

    if (error) {
      console.error("Failed to save cafe:", error.message);
      return;
    }

    setSavedCafes((current) => [...current, cafeId]);
  }
};

    return (
        <section className="discover" id="discover">

            <motion.div 
                className="discover-heading"
                initial= {{ opacity: 0, y:30 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: "easeOut"}}
                >
                <span> EXPLORE THE NEIGHBOURHOOD </span>
                <h2> Find your next favourite cafe. </h2>
                <p>
                    From cozy corners to aesthetic hideaways,
                    discover places worth your next visit. 
                </p>
            </motion.div>

              {loading ? (
                <p className="discover-message"> Loading cafes...</p>
              ) : error ? (
                 <p className="discover-message">
                    Failed to load cafes: {error}
                 </p>
              ): cafes.length === 0 ? (
                <p className="discover-message">
                    No cafes available yet. Check back soon!
                </p>
              ):(

            <div className="carousel">

                <button 
                className="carousel-arrow prev" 
                onClick={prevSlide}
                type="button"
                >
                   ☜
                </button>

                <div className="carousel-main">
                    <AnimatePresence mode= "wait">
                        <motion.div 
                        
                          key={activeIndex}
                          className="carousel-featured"
                          style={{ 
                            backgroundImage: `url("${activeCafe.image_url}")`,
                          }}
                          initial= {{ opacity: 0, scale: 1.05 }}
                          animate= {{ opacity: 1, scale: 1}}
                          exit= {{ opacity: 0, x: -40}}
                          transition={{ duration: 0.5}}
                          >
                            <button
                            type="button"
                            className={`favorite-button ${
                                savedCafes.includes(activeCafe.id) ? "saved" : ""
                              }`}
                              onClick={() => handleSaveCafe(activeCafe.id)}
  aria-label={
    savedCafes.includes(activeCafe.id)
      ? "Remove from favourites"
      : "Save to favourites"
  }
  aria-pressed={savedCafes.includes(activeCafe.id)}
>
  {savedCafes.includes(activeCafe.id) ? "♥" : "♡"}
</button>
                            <motion.div 
                                className="cafe-content"
                                initial={{ opacity:0, y:25 }}
                                animate={{ opacity: 1, y:0 }}
                                transition={{ duration: 0.6, delay:0.2 }}
                                >
                                <span>
                                    {activeCafe.city}, {activeCafe.state}
                                    </span>
                                <h3>{activeCafe.name}</h3>
                                <p>{activeCafe.description}</p>
                                <motion.button 
                                className="cafe-button"
                                whileHover={{ scale: 1.05, x:5 }}
                                whileTap={{ scale: 0.95}}
                                transition={{ duration: 0.25}}
                                >
                                    Explore Cafe 𑄝੭
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <button 
                  className="carousel-arrow next" 
                  onClick={nextSlide}
                  type="button"
                  >
                  ☞
                </button>

                <div className="carousel-thumbnails">
                    {cafes.map((cafe,index) =>(
                        <motion.button
                         key={index}
                         className= {`thumbnail ${
                            index === activeIndex ? "active" : ""
                         }`}
                         onClick={() => setActiveIndex(index)}
                         style={{
                            backgroundImage: `url(${cafe.image_url})`,
                        }}
                         aria-label = {`View ${cafe.name}`}
                         initial= {{ opacity:0, x:25 }}
                         whileInView={{ opacity: 1, x:0}}
                         whileHover={{ scale: 1.06, y:-4 }}
                         whileTap= {{ scale: 0.96}}
                         viewport={{once: true }}
                         transition={{
                            duration: 0.5, 
                            delay: index * 0.12,
                         }}
                         type ="button"
                         />
                    ))}
                </div>

            </div>
              )}
        </section>
    );
}

export default Discover;