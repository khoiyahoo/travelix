import React from 'react'
import './SelectStyleAbout.css'
function SelectStyleAbout() {
  return (
    <div className="style-about-container">
      <div className="style-about-body">
          <div className="style-about-icon">
              <img src="https://www.exotravel.com/assets/img/top-page/icon-exo-story-02.png" alt="anh"/>
          </div>
          <div className="style-about-title">
              <h1>TRAVELIX HISTORY(FORMERLY EXOTISSIMO)</h1>
              <div className="style-about-line"></div>
          </div>
         
          <div className="style-about-select-title">
              <h1>Select a style</h1>
          </div>
          <div className="style-about-select-btn">
              <button className="active">Our Story</button>
              <button>Our Timeline</button>
          </div>
      </div>
    </div>
  )
}

export default SelectStyleAbout
