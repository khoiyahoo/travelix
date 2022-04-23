import React from 'react'
import './HeroSection.css'
import {Link} from 'react-router-dom'
import '../App.css'
function HeroSection() {
  return (
    <div className="hero-container">
        <video src="/videos/video-1.mp4" autoPlay loop muted/>
        <div className="hero-container-content">
        <h1>Discover</h1>
        <h2>the world</h2>
        <Link to="/multicountry" className="home-btn btn--primary section-home-btn">
            <p>Explore now
            <span></span>
            <span></span>
            <span></span>
            </p>   
        </Link>
        </div>
        
    </div>
  )
}

export default HeroSection;
