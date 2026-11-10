import { motion } from "motion/react";
import "./About.css";

function About () {
    return (
        <section className="about" id="about">
            <div className="about-container">

                <motion.div 
                  className="about-image"
                  initial={{ opacity: 0, x: -40}}
                  whileInView={{ opacity: 1, x: 0}}
                  viewport={{ once: true}}
                  transition={{ duration: 0.8}}
                  >
                    <img
                      src="https://images.openai.com/static-rsc-4/jHTOJqIPqmUP3Kq8KkPvrN_VSB0b-PyQMieiWgEAMmnfdQhFdhdeWXQ3PR_oGRttdRxmLgyWysQ3rCMLUXohRRxKKQdbI1S84MjCE1_ByuH_gDPCmU5uOwci89_m2GUAr7RIWdLDVXwVfZ6eJeRoV3IxlXrJ3B4cAb2IqdFyxQPfF44wkEgGiWE7iWz6Wmcr?purpose=fullsize"
                      alt="Cozy cafe interior"
                      />
                  </motion.div>

                  <motion.div
                    className="about-content"
                    initial= {{ opacity: 0, x:40}}
                    whileInView={{opacity: 1, x:0}}
                    viewport={{ once: true}}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <span> OUR STORY </span>

                        <h2>More than just a cup of coffee</h2>

                        <p>
                            Kopiloka is all about discovering charming cafes, 
                            hidden gems and little spaces worth visiting across Malaysia.
                            Because sometimes, the best moments begin with a cup of coffee.
                        </p>

                        <button className= "about-button">
                            Discover More
                        </button>
                    </motion.div>
                    
            </div>
        </section>
    );

}

export default About;