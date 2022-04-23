import React from 'react'
import '../../App.css'
import './Offer.css'
import BodyOffer from '../BodyOffer'
import Footer from '../Footer'
function Offer() {
  return (
      <>
        <div className="offer-container"> 
            <div className="offer">
                <video src="/videos/video-2.m4v" autoPlay loop muted/>
                <h1 >OUR OFFERS</h1>
            </div>
        </div>
         <BodyOffer/>
         <Footer/>
      </> 
  
  )
}

export default Offer
