import React from 'react'
import './Feedback.css'
import {Link} from 'react-router-dom'
function Feedback() {
  return (
    <div className="feedback-container">
      <div className="feedback-heading">
          <h1>WHAT OUR CLIENTS SAY ABOUT US</h1>
      </div>
      <div className="feedback-container-row">
          <div className="feedback-col-card">
              <div className="feedback-background">
                  <img src="https://technext.github.io/travelix/images/test_3.jpg" alt=""/>
                  <div className="feedback-background-icon">
                      <img src="https://technext.github.io/travelix/images/backpack.png" alt=""/>
                  </div>
              </div>
              <div className="feedback-person-date">
                      <div className="feedback-person">
                          <h1>Carla smith</h1>
                      </div>
                      <div className="feedback-date">
                          <p>May 22, 2020</p>
                      </div>
                  </div>
              <div className="feedback-des">
                  
                  <div className="feedback-des-detail">
                      <div className="feedback-detail-heading">
                          <h1>"Best holiday ever"</h1>
                      </div>
                      <div className="feedback-detail-paragraph">
                          <p>Nullam eu convallis tortor. Suspendisse potenti. 
                              In faucibus massa arcu, vitae cursus mi hendrerit nec.</p>
                      </div>
                  </div>
              </div>
          </div>
          <div className="feedback-col-card">
              <div className="feedback-background">
                  <img src="https://technext.github.io/travelix/images/test_1.jpg" alt=""/>
                  <div className="feedback-background-icon">
                      <img src="https://technext.github.io/travelix/images/island_t.png" alt=""/>
                  </div>
              </div>
              <div className="feedback-person-date">
                      <div className="feedback-person">
                          <h1>Carla smith</h1>
                      </div>
                      <div className="feedback-date">
                          <p>May 22, 2020</p>
                      </div>
                  </div>
              <div className="feedback-des">
                  
                  <div className="feedback-des-detail">
                      <div className="feedback-detail-heading">
                          <h1>"Best holiday ever"</h1>
                      </div>
                      <div className="feedback-detail-paragraph">
                          <p>Nullam eu convallis tortor. Suspendisse potenti. 
                              In faucibus massa arcu, vitae cursus mi hendrerit nec.</p>
                      </div>
                  </div>
              </div>
          </div>
          <div className="feedback-col-card">
              <div className="feedback-background">
                  <img src="https://technext.github.io/travelix/images/test_2.jpg" alt=""/>
                  <div className="feedback-background-icon">
                      <img src="https://technext.github.io/travelix/images/kayak.png" alt=""/>
                  </div>
              </div>
              <div className="feedback-person-date">
                      <div className="feedback-person">
                          <h1>Carla smith</h1>
                      </div>
                      <div className="feedback-date">
                          <p>May 22, 2020</p>
                      </div>
                  </div>
              <div className="feedback-des">
                  <div className="feedback-des-detail">
                      <div className="feedback-detail-heading">
                          <h1>"Best holiday ever"</h1>
                      </div>
                      <div className="feedback-detail-paragraph">
                          <p>Nullam eu convallis tortor. Suspendisse potenti. 
                              In faucibus massa arcu, vitae cursus mi hendrerit nec.</p>
                      </div>
                  </div>
              </div>
          </div>
         
      </div>
      <div className="sperate"></div>
    </div>
  )
}

export default Feedback
