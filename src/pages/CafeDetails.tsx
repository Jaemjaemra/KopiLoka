
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate} from "react-router-dom";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import "./CafeDetails.css";

type Cafe = {
 id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  description: string;
  image_url: string;
  google_maps_url: string | null;
};

function CafeDetails() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const [isSaved, setIsSaved] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [cafe, setCafe] = useState<Cafe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCafe = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("cafes")
        .select("id, name, address, city, state, description, image_url, google_maps_url")
        .eq("id", id)
        .eq("status", "approved")
        .single();

      if (error) {
        console.error("Cafe fetch error:", error);
        setError(error.message);
      } else {
        setCafe(data);
      }

      setLoading(false);
    };

    fetchCafe();
  }, [id]);


useEffect(() => {
  const checkSavedStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      setUserId(null);
      setIsSaved(false);
      return;
    }

    setUserId(session.user.id);

    if (!id) return;

    const { data, error } = await supabase
      .from("saved_cafes")
      .select("cafe_id")
      .eq("user_id", session.user.id)
      .eq("cafe_id", id)
      .maybeSingle();

    if (error) {
      console.error("Error checking saved cafe:", error);
      return;
    }

    setIsSaved(!!data);
  };

  checkSavedStatus();
}, [id]);

const handleSaveCafe = async () => {
    if(!userId) {
        navigate("/login");
        return;
    }

    if (!id) return;

    if (isSaved) {
        const { error } = await supabase
         .from("saved_cafes")
         .delete()
         .eq("user_id", userId)
         .eq("cafe_id", id);

         if(error) {
            console.error("Error removing saved cafe:", error)
            return;
         }

         setIsSaved(false);
        }else {
            const {error} = await supabase
            .from("saved_cafes")
            .insert({
             user_id: userId,
             cafe_id: id,
            });
            if (error) {
              console.error("Error saving cafe:", error);
              return;
            }

            setIsSaved(true);
    }
};
  return (
    <>
      <Navbar />

      <main className="cafe-details-page">
        {loading ? (
          <p className="details-message">Loading cafe details...</p>
        ) : error || !cafe ? (
          <div className="details-message">
            <p>{error || "Cafe not found."}</p>
            <Link to="/">Back to Home</Link>
          </div>
        ) : (
          <section className="cafe-details-container">
            <Link to="/#discover" className="back-link">
              ← Back to Discover
            </Link>

            <div className="details-image">
              <img src={cafe.image_url} alt={cafe.name} />

              <button 
                className= {`details-favourite-button ${isSaved ? "saved" : ""}`}
                onClick={handleSaveCafe}
                aria-label={isSaved ? "Remove from favourites":"Save to favourites"}
                >
                    {isSaved ? "♥" : "♡"}
                </button>
            </div>

            <div className="details-content">
              <p className="details-location">
                {cafe.city}, {cafe.state}
              </p>

              <h1>{cafe.name}</h1>

              <p className="details-description">
                {cafe.description}
              </p>

              <div className="details-address">
                <h3>Location</h3>
                <p>{cafe.address}</p>

                  {cafe.google_maps_url && (
                    <a 
                     href={cafe.google_maps_url}
                      target="_blank"
                   rel="noopener noreferrer"
                   className="google-maps-button"
                   >
                    View on Google Maps ↗
                   </a>
                  )}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}

export default CafeDetails;
