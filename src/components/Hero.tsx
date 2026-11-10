import { useEffect, useRef } from "react";
import { motion } from "motion/react";

import gsap from "gsap";
import "./Hero.css";
import coffeeVideo from "../assets/CoffeeCupAnim.webm";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

useEffect(() => {
  const hero = heroRef.current;
  const video = videoRef.current;

  if (!hero || !video) return;

  let ctx: gsap.Context | undefined;

  video.pause();

  const createAnimation = () => {
    if (ctx) return;

    if (!Number.isFinite(video.duration) || video.duration <= 0) {
      return;
    }

    video.currentTime = 0;

    ctx = gsap.context(() => {
      gsap.to(video, {
        currentTime: video.duration,
        ease: "none",

        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          markers: false,
        },
      });
    }, hero);

    ScrollTrigger.refresh();

    console.log("Video duration:", video.duration);
    console.log("ScrollTrigger initialized!");
  };

  video.addEventListener("loadedmetadata", createAnimation);

  if (video.readyState >= 1) {
    createAnimation();
  }

  return () => {
    video.removeEventListener("loadedmetadata", createAnimation);
    ctx?.revert();
  };
}, []);

  return (
    <section className="hero" id="home" ref={heroRef}>
      <div className="hero-stage">

        <div className="hero-content">
          <motion.span
            className="hero-label"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            FIND YOUR LITTLE ESCAPE
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 35, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Your next favourite spot is here.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Discover charming cafes, hidden gems and little places worth
            visiting around Malaysia.
          </motion.p>

          <motion.a
            href="#discover"
            className="hero-button"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Explore Cafes <span>☕</span>
          </motion.a>
        </div>

        <div className="hero-visual">
          <video
            ref={videoRef}
            className="coffee-video"
            muted
            playsInline
            autoPlay
            preload="auto"
          >
            <source src ={coffeeVideo} type="video/webm" />
          </video>
        </div>

      </div>
    </section>
  );
}

export default Hero;
