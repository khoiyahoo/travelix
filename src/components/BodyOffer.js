import React from 'react'
import './BodyOffer.css'
import '../App.css'
import { useEffect } from 'react'
import Aos from 'aos'
import 'aos/dist/aos.css'
import {Link} from 'react-router-dom'
function BodyOffer() {
  useEffect(()=>{
    Aos.init({duration:500});
  },[])
  return (
    <div>
      <div className="heading-container-offer">
        <div className="heading-title">
            <div className="heading-title-icon">
                <img src="https://www.exotravel.com/assets/img/top-page/icon-tripandtour.png" alt="anh"/>
            </div>
            <div className="heading-title-header">
                <h1>Explore our asia</h1>
            </div>
            
            <div className="heading-title-content" data-aos="fade-up">
                <p>Home to the world's largest and most populous nations, Asia constitutes 
                    roughly 30% of earth's land area and is home to a staggering 60% of its human 
                    population.
                    <br></br>
                    <br></br>
                    Growing from humble roots in Vietnam, TRAVELIX shares the wonders of this magical
                     part of the world through transformative multi-country journeys that span most
                      of Southeast Asia (Vietnam, Thailand, Malaysia, Cambodia, Myanmar, Laos, 
                      Indonesia, Singapore) and East Asia (China and Japan). 
                    </p>
            </div>  
            <div className="heading-map">
                <img src="https://www.exotravel.com/assets/content/destinations/images/destinationmap-multicountry_1.png" alt="anh"/>
            </div>
        </div>
      </div>
      <div className="country-tour-container">
        <div className="country-tour-body">
          <div className="country-tour-icon">
            <img src="https://www.exotravel.com/assets/img/top-page/icon-tour.png" alt="anh"/>
          </div>
          <div className="country-tour-heading">
                <h1>MULTI-COUNTRY TOURS</h1>
          </div>
          <div className="country-tour-title" data-aos="fade-up">
            <blockquote>
              <p></p>
              <p>From UNESCO Heritage sites and tasty culinary outings to adventurous trekking adventures and everything in between, our Multi-country tours showcase the very best of Asia.</p>
              <p></p>
            </blockquote>
          </div>
          <div className="row">
            <div className="container-list-country">
            <div className="col-item-country">      
              <div className="item-country-body">
              <div className="item-country-background">
                <img src="https://www.exotravel.com/images/made/chrootassets/content/multiday-tours/images/720-Thailand_Bangkok_Architecture_Night_View-crop_720_720_75_c1.jpg" alt="anh"/>
              </div>
                <div className="title-destination">
                  <h1>Southeast Asia Discovery</h1>
                </div>
                <div className="title-multi-country">
                  <h1>Multicountry</h1>
                </div>
                <div className="footer-day">
                  <h1>18 days / 17nights</h1>
                </div>
              </div>
            </div>
            <div className="col-item-country">      
              <div className="item-country-body">
              <div className="item-country-background">
                <img src="https://www.exotravel.com/images/made/chrootassets/content/multiday-tours/images/720-Thailand_Bangkok_Architecture_Night_View-crop_720_720_75_c1.jpg" alt="anh"/>
              </div>
                <div className="title-destination">
                  <h1>Southeast Asia Discovery</h1>
                </div>
                <div className="title-multi-country">
                  <h1>Multicountry</h1>
                </div>
                <div className="footer-day">
                  <h1>18 days / 17nights</h1>
                </div>
              </div>
            </div>
            <div className="col-item-country">      
              <div className="item-country-body">
              <div className="item-country-background">
                <img src="https://www.exotravel.com/images/made/chrootassets/content/multiday-tours/images/720-Thailand_Bangkok_Architecture_Night_View-crop_720_720_75_c1.jpg" alt="anh"/>
              </div>
                <div className="title-destination">
                  <h1>Southeast Asia Discovery</h1>
                </div>
                <div className="title-multi-country">
                  <h1>Multicountry</h1>
                </div>
                <div className="footer-day">
                  <h1>18 days / 17nights</h1>
                </div>
              </div>
            </div>
            </div>
            <div className="offer-view-more-body">
              <div>
              <Link to="/multicountry" className="home-btn btn--primary view-more-btn-body">
                <p>View more
                <span></span>
                <span></span>
                <span></span>
                </p>   
                </Link>
              </div>
            
           </div>
          </div>
        </div>
      </div>
      <div className="country-tour-container hotel-container">
        <div className="country-tour-body">
          <div className="country-tour-icon">
            <img src="https://www.exotravel.com/assets/img/top-page/icon-hotels.png" alt="anh"/>
          </div>
          <div className="country-tour-heading">
                <h1>HOTELS</h1>
          </div>
          <div className="country-tour-title" data-aos="fade-up">
            <blockquote>
              <p></p>
              <p>Whether it's a gorgeous beachside resort, charming boutique hotel or 
                anything in between, our list of preferred hotels represent the very best options 
                across Asia for any traveller. </p>
              <p></p>
            </blockquote>
          </div>
          <div className="row">
            <div className="container-list-country">
            <div className="col-item-country">      
              <div className="item-country-body">
              <div className="item-country-background">
                <img src="https://www.exotravel.com/images/made/chrootassets/content/multiday-tours/images/720-Thailand_Bangkok_Architecture_Night_View-crop_720_720_75_c1.jpg" alt="anh"/>
              </div>
                <div className="title-destination">
                  <h1>Amanoi Vinh Hy</h1>
                </div>
                <div className="title-multi-country">
                  <h1>Phan Rang</h1>
                </div>
                <div className="footer-day">
                  <h1>Viet Nam</h1>
                </div>
              </div>
            </div>
            <div className="col-item-country">      
              <div className="item-country-body">
              <div className="item-country-background">
                <img src="https://www.exotravel.com/images/made/chrootassets/content/multiday-tours/images/720-Thailand_Bangkok_Architecture_Night_View-crop_720_720_75_c1.jpg" alt="anh"/>
              </div>
                <div className="title-destination">
                  <h1>Bayan Tree Sumui</h1>
                </div>
                <div className="title-multi-country">
                  <h1>Koh Samui</h1>
                </div>
                <div className="footer-day">
                  <h1>Thailand</h1>
                </div>
              </div>
            </div>
            <div className="col-item-country">      
              <div className="item-country-body">
              <div className="item-country-background">
                <img src="https://www.exotravel.com/images/made/chrootassets/content/multiday-tours/images/720-Thailand_Bangkok_Architecture_Night_View-crop_720_720_75_c1.jpg" alt="anh"/>
              </div>
                <div className="title-destination">
                  <h1>Kular Shafawy</h1>
                </div>
                <div className="title-multi-country">
                  <h1>Kuala Lumpur </h1>
                </div>
                <div className="footer-day">
                  <h1>Malaysia</h1>
                </div>
              </div>
            </div>
            </div>
            <div className="offer-view-more-body">
              <div>
              <Link to="/" className="home-btn btn--primary view-more-btn-body">
                <p>View more
                <span></span>
                <span></span>
                <span></span>
                </p>   
                </Link>
              </div>
            
           </div>
          </div>
        </div>
      </div>
      <div className="footer-container-body">
      <div className="country-tour-body">
          <div className="country-tour-icon">
            <img src="https://www.exotravel.com/assets/img/top-page/icon-weather.png" alt="anh"/>
          </div>
          <div className="country-tour-heading">
                <h1>WHEN TO GO AND WEATHER</h1>
          </div>
          <div className="country-tour-title" data-aos="fade-up">
            <blockquote>
              <p></p>
              <p>China and Japan, experience four seasons roughly equivalent with the western hemisphere. Throughout much of Southeast Asia, seasonal fluctuations is more about precipitation than temperature, with seasonality being divided into wet and dry seasons based on the path of the annual monsoon.</p>
              <p></p>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BodyOffer
