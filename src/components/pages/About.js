import React from 'react'
import '../../App.css'
import './About.css'
import SelectStyleAbout from'../SelectStyleAbout'
import BodyAbout from '../BodyAbout'
import Footer from '../Footer'
function About() {
  return (
    <>
    <div className="about-container"> 
        <div class="about"><h1 >ABOUT US</h1></div>
    </div>
    
    <BodyAbout/>
    <Footer/>
    </> 
  )
}

export default About
