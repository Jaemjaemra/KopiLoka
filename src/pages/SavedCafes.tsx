import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "./SavedCafes.css";
import Navbar from "../components/Navbar";

type Cafe = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  description: string;
  image_url: string;
};

function SavedCafes() {
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSavedCafes = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("saved_cafes")
        .select(`
          cafes (
            id,
            name,
            address,
            city,
            state,
            description,
            image_url
          )
        `)
        .eq("user_id", user.id);

      if (error) {
        setError(error.message);
      } else {
        const saved = (data ?? [])
          .flatMap ((item) => item.cafes ?? []);

        setCafes(saved);
      }

      setLoading(false);
    };

    fetchSavedCafes();
  }, []);

  const handleRemove = async (cafeId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("saved_cafes")
      .delete()
      .eq("user_id", user.id)
      .eq("cafe_id", cafeId);

    if (error) {
      console.error("Failed to remove cafe:", error.message);
      return;
    }

    setCafes((current) =>
      current.filter((cafe) => cafe.id !== cafeId)
    );
  };

  return (
    <>
      <Navbar />
    <section className="saved-cafes">
      <div className="saved-heading">
        <span>YOUR PERSONAL COLLECTION</span>
        <h1>Saved Cafes</h1>
        <p>Your little collection of places worth visiting.</p>
      </div>

      {loading ? (
        <p>Loading your saved cafes...</p>
      ) : error ? (
        <p>Failed to load cafes: {error}</p>
      ) : cafes.length === 0 ? (
        <p>You haven't saved any cafes yet.</p>
      ) : (
        <div className="saved-grid">
          {cafes.map((cafe) => (
            <div className="saved-card" key={cafe.id}>
              <img src={cafe.image_url} alt={cafe.name} />

              <div className="saved-card-content">
                <span>
                  {cafe.city}, {cafe.state}
                </span>

                <h3>{cafe.name}</h3>
                <p>{cafe.description}</p>

                <button
                  type="button"
                  onClick={() => handleRemove(cafe.id)}
                >
                  Remove from saved
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
    </>
  );
}

export default SavedCafes;
