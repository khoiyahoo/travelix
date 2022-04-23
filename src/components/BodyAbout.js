import React from 'react'
import './BodyAbout.css'
import Aos from 'aos'
import 'aos/dist/aos.css'
import {useEffect} from 'react'
function BodyAbout() {
    useEffect(()=>{
        Aos.init({duration:500});
    },[])

       const handelClickStory = () => {
            const btn1 = document.querySelector('.btn-select-1');
            const btn2 = document.querySelector('.btn-select-2');
            const bodyStory = document.querySelector('.body-container-story');
            const bodyTimeline = document.querySelector('.body-container-timeline');
            btn1.classList.add('active');
            btn2.classList.remove('active');
            bodyStory.classList.add('active');
            bodyTimeline.classList.remove('active');
            console.log(bodyStory);
       }
       const handelClickTimeline = () => {
            const btn1 = document.querySelector('.btn-select-1');
            const btn2 = document.querySelector('.btn-select-2');   
            const bodyStory = document.querySelector('.body-container-story');
            const bodyTimeline = document.querySelector('.body-container-timeline');
            btn2.classList.add('active');
            btn1.classList.remove('active');
            bodyTimeline.classList.add('active');
            bodyStory.classList.remove('active');
       }
    
  return (
    <div>
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
                    <button onClick={handelClickStory} className="btn-select-1 active">Our Story</button>
                    <button onClick={handelClickTimeline}className="btn-select-2" >Our Timeline</button>
                </div>
            </div>
        </div> 
      <div className="body-container-story active">
          <div className="story-heading">
              <div className="story-heading-img">
                  <img src="https://www.exotravel.com/assets/img/top-page/exo-story/about-exo-whereitallbegan.jpg" alt="anh"/>
              </div>
              <div className="story-heading-title">
                  <h1>WHERE IT ALL BEGAN</h1>
              </div>
              <div className="story-heading-para">
                  <p>The Travelix story began in Vietnam back in 1993 when four young entrepreneurs, 
                      Eric Merlin, Olivier Colomes, Denis Colonna and Thụy Khang Trần, met each other and 
                      realised that it was the perfect time and place to start a travel company. Shortly after, 
                      Exotissimo was created, and was the first foreign-owned company to receive a tourism operating
                       license in Vietnam.</p>
              </div>
          </div>
          <div className="story-body">
            <div className="col-body">
                <div className="title">
                    <h1>PUSHING BOUNDARIES</h1>
                    <p>From these modest roots, we quickly set about creating Vietnam’s most
                         innovative and exciting tours, opening the country up to curious, 
                         dynamic travellers. Before long, we had gained widespread notoriety
                          for our consistency and ingenuity, quickly becoming Vietnam’s most
                           trusted destination management company (DMC).
                        <br></br>
                        <br></br>
                        Eager to continue our pioneering role of travel innovation in Asia, we
                         began to look outside the borders of Vietnam to expand our influence.
                          In 1995, we founded a partnership with a local operator in Myanmar and
                           officially launched our second destination.
                        <br></br>
                        <br></br>
                        Utilising this stable foundation, we moved into our developmental period, 
                        building off our already substantial expertise, knowledge and connections 
                        to become even more consistent, better-organised and more innovative.
                    </p>
                  
                    
                </div>
                <div className="body-img-1">
                    <img src="https://www.exotravel.com/assets/img/top-page/exo-story/about-exo-expansion.jpg" alt="anh"/>
                </div>
            </div>
            <div className="col-body">
                <div className="body-img-2">
                    <img src="https://www.exotravel.com/assets/img/top-page/exo-story/about-exo-pushingboundries2.jpg" alt="anh"/>
                </div>
                <div className="title">
                    <h1>ASIAN EXPANSION WITH A EUROPEAN TWIST</h1>
                    <p>By the turn of the millennium, we had become one of the leading DMCs 
                        in the region, just as intense interest in travel to Indochina began 
                        to take hold. In 2000, EXO Cambodia was launched, with offices in Siem 
                        Reap and Phnom Penh. A year later, EXO Laos was established, with offices 
                        in Vientiane, Luang Prabang and Pakse.
                        <br></br>
                        <br></br>
                        Following the openings of EXO Laos and EXO Cambodia, Thailand-based tour
                         operator Hamish Keith came into the fold and, after the completion of 
                         agreements in 2003, EXO Thailand opened its doors. Seizing on increased 
                         interest in travel to Asia from European markets, sales offices were soon
                          established in France and Spain, allowing EXO to quickly become market 
                          leaders in both countries.          
                    </p>  
                </div>
            </div>
          </div>
      </div>
      <div className="body-container-timeline">
          <div className="timeline-body">
              <div className="timeline-container">
                  <div className="timeline-block-1">
                      <div className="timeline-picture-milstone-1" data-aos="zoom-in"> 
                      <span>1993</span>
                      </div>
                      <div className="timeline-content-1" data-aos="fade-right" >
                          <div className="timeline-content-img">
                              <img src="https://www.exotravel.com/assets/img/top-page/exo-story/pic-1993.jpg" alt="anh"/>
                          </div>
                          <div className="timeline-content-title">
                              <h2>1993 - Trevelix Vietnam</h2>
                              <p>Travel is established by Eric Merlin, 
                                  Denis Colonna and Olivier Colomès. We were the 
                                  first foreign company to be granted a tourism operating 
                                  license in Vietnam.
                                </p>
                          </div>
                      </div>
                  </div>
                  <div className="timeline-block-2">
                      <div className="timeline-picture-milstone-2" data-aos="zoom-in">
                      <span>1993</span>
                      </div>
                      <div className="timeline-content-2" data-aos="fade-left">
                          <div className="timeline-content-img">
                              <img src="https://www.exotravel.com/assets/img/top-page/exo-story/pic-1993.jpg" alt="anh"/>
                          </div>
                          <div className="timeline-content-title">
                              <h2>1993 - Trevelix Vietnam</h2>
                              <p>Travel is established by Eric Merlin, 
                                  Denis Colonna and Olivier Colomès. We were the 
                                  first foreign company to be granted a tourism operating 
                                  license in Vietnam.
                                </p>
                          </div>
                      </div>
                  </div>
                  <div className="timeline-block-1">
                      <div className="timeline-picture-milstone-1" data-aos="zoom-in">
                      <span>1993</span>
                      </div>
                      <div className="timeline-content-1" data-aos="fade-right">
                          <div className="timeline-content-img">
                              <img src="https://www.exotravel.com/assets/img/top-page/exo-story/pic-1993.jpg" alt="anh"/>
                          </div>
                          <div className="timeline-content-title">
                              <h2>1993 - Trevelix Vietnam</h2>
                              <p>Travel is established by Eric Merlin, 
                                  Denis Colonna and Olivier Colomès. We were the 
                                  first foreign company to be granted a tourism operating 
                                  license in Vietnam.
                                </p>
                          </div>
                      </div>
                  </div>
                  <div className="timeline-block-2">
                      <div className="timeline-picture-milstone-2" data-aos="zoom-in">
                      <span>1993</span>
                      </div>
                      <div className="timeline-content-2" data-aos="fade-left">
                          <div className="timeline-content-img">
                              <img src="https://www.exotravel.com/assets/img/top-page/exo-story/pic-1993.jpg" alt="anh"/>
                          </div>
                          <div className="timeline-content-title">
                              <h2>1993 - Trevelix Vietnam</h2>
                              <p>Travel is established by Eric Merlin, 
                                  Denis Colonna and Olivier Colomès. We were the 
                                  first foreign company to be granted a tourism operating 
                                  license in Vietnam.
                                </p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div className="sponsor-footer">           
             <img src="/src/images/sponsor-footer.png" alt=""/>
          </div>
          </div>
    </div>
  )
}

export default BodyAbout
