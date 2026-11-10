import {useState} from "react";
import { AnimatePresence, motion } from "motion/react";
import "./Discover.css";

const cafes = [
    {
        name: "Zus Coffee",
        location: "Kuala Lumpur,Malaysia",
        description: "A cozy little corner for your favourite coffee moments.",
        image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=1200",
    },
    {
        name: "Monsterbytes Cafe ",
        location: "Batu Caves,Malaysia",
        description: "A cozy little corner for your favourite coffee moments.",
        image: "https://tse1.mm.bing.net/th/id/OIP.dmrsKtTLOCaG8De5hIrJFwHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    },
    {
        name: "AfterHours",
        location: "Kuala Lumpur,Malaysia",
        description: "A cozy little corner for your favourite coffee moments.",
        image: "https://scontent.fkul8-3.fna.fbcdn.net/v/t39.30808-6/786930149_1036417985852422_8235795144973380567_n.jpg?stp=dst-jpg_tt6&cstp=mx1200x1200&ctp=s1200x1200&_nc_cat=105&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_ohc=2N2b8nN-_w0Q7kNvwG5DZuY&_nc_oc=AdowMdDSbDw3v8l-e0u63LvfGy7ZSGX_JeVGafd__Iq5GWxqUFVCFCaMuYnA-2YACZY&_nc_zt=23&_nc_ht=scontent.fkul8-3.fna&_nc_gid=q5x_00Xd39j90rCbs92Bfw&_nc_ss=7b2a8&oh=00_AQRqq6AXc_ctAD-ZXDeIOkOeccIu6foQ0eJnGpwwwI5BXQ&oe=6AF6333D",
    },
]; 

function Discover () {
    const [activeIndex, setActiveIndex] = useState(0);

    const nextSlide = () => {
        setActiveIndex((current) => (current + 1) % cafes.length);
    };

    const prevSlide = () => {
        setActiveIndex((current) =>
        (current - 1 + cafes.length) % cafes.length
        );
    };

    const activeCafe = cafes[activeIndex]; 

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

            <div className="carousel">

                <button className="carousel-arrow prev" onClick={prevSlide}>
                   ☜
                </button>

                <div className="carousel-main">
                    <AnimatePresence mode= "wait">
                        <motion.div 
                          key={activeIndex}
                          className="carousel-featured"
                          style={{ 
                            backgroundImage: `url("${activeCafe.image}")`,
                          }}
                          initial= {{ opacity: 0, scale: 1.05 }}
                          animate= {{ opacity: 1, scale: 1}}
                          exit= {{ opacity: 0, x: -40}}
                          transition={{ duration: 0.5}}
                          >
                            <motion.div 
                                className="cafe-content"
                                initial={{ opacity:0, y:25 }}
                                animate={{ opacity: 1, y:0 }}
                                transition={{ duration: 0.6, delay:0.2 }}
                                >
                                <span>{activeCafe.location}</span>
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

                <button className="carousel-arrow next" onClick={nextSlide}>
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
                         style={{backgroundImage: `url(${cafe.image})`}}
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
                         />
                    ))}
                </div>

            </div>
        </section>
    );
}

export default Discover;