import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import cafePin from "../assets/cafe-pin.png";
import "./Map.css";

const cafeIcon = L.divIcon({
  className: "cafe-image-marker",
  html: `
    <div class="cafe-image-pin">
      <img src="${cafePin}" alt="Cafe marker" />
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [29, 29],
  popupAnchor: [0, -30],
});

const cafes = [
  {
    name: "ZUS Coffee",
    location: "Kuala Lumpur",
    description: "A cozy spot for your favourite coffee moments.",
    image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=1200",
    position: [3.139, 101.686] as [number, number],
    googleMapsUrl: "https://www.google.com/maps/place/ZUS+Coffee+%E2%80%A2+Taman+Danau+Desa/@3.1000208,101.6874339,17z/data=!3m1!4b1!4m6!3m5!1s0x31cc4bba3411cca3:0xbbad5e279fbf0349!8m2!3d3.1000208!4d101.6874339!16s%2Fg%2F11jwx97fvm?entry=ttu&g_ep=EgoyMDI2MTEwOC4wIKXMDSoASAFQAw%3D%3D",
  },
  {
    name: "Monsterbytes Cafe",
    location: "Batu Caves, Selangor",
    description: "A little place to enjoy good coffee and good vibes.",
    image: "https://tse1.mm.bing.net/th/id/OIP.dmrsKtTLOCaG8De5hIrJFwHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    position: [3.237, 101.683] as [number, number],
    googleMapsUrl: "https://www.google.com/maps/place/Afterhours+Coffee+Bar/@3.2157421,101.7168413,17z/data=!4m17!1m10!3m9!1s0x31cc3900092d5a7f:0xb7876b2bedd6d2ae!2sAfterhours+Coffee+Bar!8m2!3d3.2155034!4d101.7168806!10e5!14m1!1BCgIgAQ!16s%2Fg%2F11ygxr_nmq!3m5!1s0x31cc3900092d5a7f:0xb7876b2bedd6d2ae!8m2!3d3.2155034!4d101.7168806!16s%2Fg%2F11ygxr_nmq?entry=ttu&g_ep=EgoyMDI2MTEwOC4wIKXMDSoASAFQAw%3D%3D",
  },
  {
    name: "AfterHours",
    location: "Kuala Lumpur",
    description: "Discover a new place for your coffee break.",
     image: "https://scontent.fkul8-3.fna.fbcdn.net/v/t39.30808-6/786930149_1036417985852422_8235795144973380567_n.jpg?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1200x1200&_nc_cat=105&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_ohc=2N2b8nN-_w0Q7kNvwG5DZuY&_nc_oc=AdowMdDSbDw3v8l-e0u63LvfGy7ZSGX_JeVGafd__Iq5GWxqUFVCFCaMuYnA-2YACZY&_nc_zt=23&_nc_ht=scontent.fkul8-3.fna&_nc_gid=q5x_00Xd39j90rCbs92Bfw&_nc_ss=7b2a8&oh=00_AQRqq6AXc_ctAD-ZXDeIOkOeccIu6foQ0eJnGpwwwI5BXQ&oe=6AF6333D",
    position: [3.147, 101.695] as [number, number],
    googleMapsUrl: "https://www.google.com/maps/place/Monsterbytes+Cafe/@3.2374637,101.6757477,17z/data=!3m1!4b1!4m6!3m5!1s0x31cc475d775fdb21:0x11712b38d53e4f60!8m2!3d3.2374637!4d101.6757477!16s%2Fg%2F11p00xk2_j?entry=ttu&g_ep=EgoyMDI2MTEwOC4wIKXMDSoASAFQAw%3D%3D",
  },
];


function Map() {
  return (
    <section className="map-section" id="map">
      <div className="map-heading">
        <span>FIND YOUR NEXT SPOT</span>
        <h2>Explore Cafes Across Malaysia</h2>
        <p>Discover little coffee spots wherever your journey takes you.</p>
      </div>

      <div className="map-container">
        <MapContainer
          center={[4.2105, 101.9758]}
          zoom={6}
          scrollWheelZoom={true}
          className="cafe-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {cafes.map((cafe, index) => (
            <Marker 
             key={index} 
             position={cafe.position} 
             icon={cafeIcon}
             >
              <Popup>
                 <div className="cafe-popup">
              <img src={cafe.image} alt={cafe.name} />

              <span>CAFE SPOT</span>
              <h3>{cafe.name}</h3>
              <p className="popup-location">{cafe.location}</p>
              <p className="popup-description">{cafe.description}</p>

              <a
                 href={
                  cafe.googleMapsUrl ||
                  `https://www.google.com/maps/search/?api=1&query=${cafe.position[0]},${cafe.position[1]}`}
                 target="_blank"
                 rel="noopener noreferrer"
                 >
                  View Location
                 </a>
            </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}

export default Map;
