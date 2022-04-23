import React from 'react'
import HeroSection from '../HeroSection'
import ListServices from '../ListServices'
import About from '../About'
import Offer from '../Offer'
import Feedback from '../Feedback'
import Contact from '../Contact'
import Information from '../Information'
import Footer from '../Footer'
import '../../App.css'
function Home() {
  return (
    <>
      <HeroSection/>
      <ListServices/>
      <About/>
      <Offer/>
      <Feedback/>
      <Contact/>
      <Information/>
      <Footer/>
    </>
  )
}

export default Home
