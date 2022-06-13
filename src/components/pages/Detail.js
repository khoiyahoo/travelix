import React from 'react'
import './Detail.css'
import '../../App.css'
import {Link} from 'react-router-dom'
import Aos from 'aos'
import 'aos/dist/aos.css'
import {useState,useEffect} from 'react'
import '../../App.css'
import BestOffer from '../BestOffer'
import Footer from '../Footer'
function Detail() {
  useEffect(()=>{
    Aos.init({duration:500});
  },[]);
 var counter = 1;
 setInterval(function() {
   document.getElementById('radio' + counter).checked = true;
   counter++;
   if(counter > 4){
     counter =1;
   }
 },5000);
  return (
    <div>
      <div className="detail-container">
        <div className="detail-slide-header-title"><h1>OVER VIEW</h1></div>
        <div className="detail-slide-header">
        <div className="slider">
        {/* <div className="slide-icon slide-icon-left"><i class="fas fa-angle-left"></i></div> */}

          <div className="slides">
            <input type="radio" name="radio-btn" id="radio1"/>
            <input type="radio" name="radio-btn" id="radio2"/>
            <input type="radio" name="radio-btn" id="radio3"/>
            <input type="radio" name="radio-btn" id="radio4"/>
              <div className="slide slide1 first">
                <img src="https://www.exotravel.com/blog/wp-content/uploads/2022/02/EXO-TRAVEL-BLOG-HEADER-1.jpg" alt=""/>
              </div>
                <div className="slide slide2">
                  <img src="https://www.exotravel.com/blog/wp-content/uploads/2021/12/EXO-TRAVEL-BLOG-HEADER-1.jpg" alt=""/>
                  </div>           
                <div className="slide slide3">
                  <img src="https://www.exotravel.com/blog/wp-content/uploads/2021/10/EXO-TRAVEL-BLOG-HEADER-3.png" alt=""/>
                </div>           
                <div className="slide slide4">
                  <img src="https://www.exotravel.com/blog/wp-content/uploads/2022/02/EXO-TRAVEL-BLOG-HEADER-2.jpg" alt=""/>
                </div>
              <div className="navigation-auto">
                <div className="auto-btn1"></div>
                <div className="auto-btn2"></div>
                <div className="auto-btn3"></div>
                <div className="auto-btn4"></div>
              </div> 
          </div>
          {/* <div className="slide-icon slide-icon-right" ><i class="fas fa-angle-right"></i></div> */}
          <div className="navigation-manual">
            <label for="radio1" className="manual-btn"></label>
            <label for="radio2" className="manual-btn"></label>
            <label for="radio3" className="manual-btn"></label>
            <label for="radio4" className="manual-btn"></label>
          </div> 
        </div>
        </div>
        <div className="detail-promotion" >
          <h3>We have negotiated many promotions for 2021/22. For special discounts, please ask your travel consultant</h3>
        </div>
        <div className="detail-over-view-heading">
          <div className="over-view-heading-img">
            <img src="https://www.exotravel.com/assets/img/top-page/icon-overview.png" alt="anh"/>
          </div>
          <div className="over-view-heading-header">
            <h1>Over view
            
            <div className="over-view-heading-line"></div>
            </h1>
          
          </div>
          <div className="over-view-heading-title" data-aos="fade-up">
            <h3>For inspiring experiences, real-time updates, the latest trends or casual conversation, explore our social networks for all things travel.</h3>
          </div>
        </div>
        <div className="detail-body">
          <div className="row">
            <div className="grid__colum-8">
              <div className="detail-body-heading">
                <div className="heading-body-place">
                  <h3>Champs-Elysées, Brazil</h3>
                </div>
                <div className="heading-body-days">
                    <h1>8 DAYS OF VACATION AT RESORTS</h1>
                </div>
                <div className="heading-rates">
                  <div className="rates-rating-stars">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                  </div>
                  <div className="rates-view">
                    <p>489 Reviews</p>
                  </div>
                </div>
                
               </div>
               </div>
            <div className="grid__colum-3">
             <div className ="heading-prices">
                 <h1>PRICE FROM</h1>  <h1>$500</h1> <h1>/TOUR</h1>
             </div>
            </div>
          </div>
          <div className="row">
            <div className="grid__colum-8">
              <div className="images-detail-tour">
                <div className="detail-tour-img-1">
                  <img src="https://www.exotravel.com/assets/img/products/exo-travel-tour-highlight-thailand.jpg" alt="anh"/>
                </div>
                <div className="detail-tour-img-small">
                  <div className="detail-tour-img-2">
                    <img src="https://www.exotravel.com/assets/content/multiday-tours/images/exo-travel-thailand-beach-escapes-at-koh-lipe-gallery-7300157.jpg" alt="anh"/>
                  </div>
                  <div className="detail-tour-img-3">
                    <img src="https://cdn.kimkim.com/files/a/content_articles/featured_photos/dd6ddfda2f79e54577a7586f0e0e64f8f2dd6b22/big-be78cf32de7dd606fb7545f2a1a3edc4.jpg" alt="anh"/>
                  </div>
                </div>
              </div>
              <div className="block-information" >
                  <h3 data-aos="fade-up">GENERAL INFORMATION ABOUT TOUR</h3>
                  <p data-aos="fade-up">Pellentesque ac turpis egestas, varius justo et, condimentum augue. Praesent 
                    aliquam, nisl feugiat vehicula condimentum, justo tellus scelerisque metus. 
                    Pellentesque ac turpis egestas, varius justo et, condimentum augue. Lorem ipsum 
                    dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut 
                    labore et dolore magna aliqua.</p>
                    <h4 data-aos="fade-up">INTERESTING FOR YOU</h4>
                  <p data-aos="fade-up">Pellentesque ac turpis egestas, varius justo et, condimentum augue. Praesent 
                    aliquam, nisl feugiat vehicula condimentum, justo tellus scelerisque metus. 
                    Pellentesque varius justo et, condimentum augue.</p>
                    <h4 data-aos="fade-up">MY LISTING DEACTIVATED</h4>
                  <p data-aos="fade-up">Pellentesque ac turpis egestas, varius justo et, condimentum augue. Praesent 
                    aliquam, nisl feugiat vehicula condimentum, justo tellus scelerisque metus. 
                    Pellentesque varius justo et, condimentum augue. Lorem ipsum dolor sit amet, 
                    consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore 
                    magna aliqua.</p>
                    <h3 data-aos="fade-up">YOU NEED TO KNOW</h3>
                  <p data-aos="fade-up">Pellentesque ac turpis egestas, varius justo et, condimentum augue. Praesent 
                    aliquam, nisl feugiat vehicula condimentum, justo tellus scelerisque metus. 
                    Pellentesque ac turpis egestas, varius justo et, condimentum augue. Lorem ipsum 
                    dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut 
                    labore et dolore magna aliqua.</p>
                
              </div>
              <div className="block-table-information">
                  <table className="table-information">
                    <thead className="title-info-table">
                      <tr>
                        <th>Tours</th>
                        <th>flights</th>
                        <th>hotels</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="name-tour border-color-2">
                          sea tours
                        </td>
                        <td className="name-tour name-tour-flight">
                          <span><i class="fas fa-check"></i></span>
                        </td>
                        <td className="name-tour">
                          Hilton Hotel 
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                        </td>
                      </tr>
                      <tr>
                        <td className="name-tour border-color-2">
                          sea tours
                        </td>
                        <td className="name-tour name-tour-flight">
                          <span><i class="fas fa-check"></i></span>
                        </td>
                        <td className="name-tour">
                          Hilton Hotel 
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                        </td>
                      </tr>
                      <tr>
                        <td className="name-tour border-color-2">
                          sea tours
                        </td>
                        <td className="name-tour name-tour-flight">
                          <span><i class="fas fa-check"></i></span>
                        </td>
                        <td className="name-tour">
                          Hilton Hotel 
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                        </td>
                      </tr>
                      <tr>
                        <td className="name-tour border-color-2">
                          sea tours
                        </td>
                        <td className="name-tour name-tour-flight">
                          <span><i class="fas fa-check"></i></span>
                        </td>
                        <td className="name-tour">
                          Hilton Hotel 
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                          <i class="fas fa-star"></i>
                        </td>
                      </tr>
                    </tbody>
                    
                  </table>
              </div>
            </div>
            <div className="grid__colum-3">
              <div className="detail-tour-information">
                <div className="body-information">
                <div className="tour-info-heading">
                  <h1>Details</h1>
                </div>
                <ul className="list-info-body">
                  <li className="item-info-body">
                    <p>AREA:</p> <span>AMERICA</span>
                  </li>
                  <li className="item-info-body">
                    <p>PRICE:</p> <span>$500 /PERSON</span>
                  </li>
                  <li className="item-info-body">
                    <p>LOCATION:</p> <span>RIO DE JANERO, BRAZIL</span>
                  </li>
                  <li className="item-info-body">
                    <p>DATE:</p> <span>JULY 19TH TO JULY 29TH</span>
                  </li>
                  <li className="item-info-body">
                    <p>RATE:</p> 
                    <span> 
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      </span>
                  </li>
                  <li className="item-info-body">
                    <p>NUMBER OF PEOPLE:</p> <span>2 ADULT, 2 CHILDREN</span>
                  </li>
                  <li className="item-info-body">
                    <p>HOTEL:</p> <span>BRISTOL PARIS HOTEL</span>
                  </li>
                  <li className="item-info-body">
                    <p>KIND OF TRANSPORT:</p> <span>TOURIST BUS</span>
                  </li>
                  <li className="item-info-body">
                    <p>DISCOUNT:</p> <span>20%</span>
                  </li>
                </ul>
                <div className="book-btn">
                  <Link to="/" className="extra-btn btn--extra book-now">
                    BOOK NOW
                  </Link>
                </div>
              </div>
              </div>
              <div className="body-offers">
                <div className="body-offers-heading"><h1>POPULAR TOURS</h1></div>
                <div className="item-offer-container">
                    <Link to="/" className="item-offer-img">
                      <img src="https://www.exotravel.com/assets/img/products/exo-travel-tour-highlight-thailand.jpg" alt=""/>
                    </Link>
                    <ul className="list-info-offer">
                      <li><h3>FROM <span>$273</span> / TOUR</h3></li>
                      <li><h3>ITALY, ROME</h3></li>
                      <li><h3>Date:</h3><span> July 19th to July 29th</span></li>  
                    </ul>
                </div>
                <div className="item-offer-container">
                    <Link to="/" className="item-offer-img">
                      <img src="https://www.exotravel.com/assets/img/products/exo-travel-tour-highlight-thailand.jpg" alt=""/>
                    </Link>
                    <ul className="list-info-offer">
                      <li><h3>FROM <span>$273</span> / TOUR</h3></li>
                      <li><h3>ITALY, ROME</h3></li>
                      <li><h3>Date:</h3><span> July 19th to July 29th</span></li>  
                    </ul>
                </div>
                <div className="item-offer-container">
                    <Link to="/" className="item-offer-img">
                      <img src="https://www.exotravel.com/assets/img/products/exo-travel-tour-highlight-thailand.jpg" alt=""/>
                    </Link>
                    <ul className="list-info-offer">
                      <li><h3>FROM <span>$273</span> / TOUR</h3></li>
                      <li><h3>ITALY, ROME</h3></li>
                      <li><h3>Date:</h3><span> July 19th to July 29th</span></li>  
                    </ul>
                </div>
                <div className="item-offer-container">
                    <Link to="/" className="item-offer-img">
                      <img src="https://www.exotravel.com/assets/img/products/exo-travel-tour-highlight-thailand.jpg" alt=""/>
                    </Link>
                    <ul className="list-info-offer">
                      <li><h3>FROM <span>$273</span> / TOUR</h3></li>
                      <li><h3>ITALY, ROME</h3></li>
                      <li><h3>Date:</h3><span> July 19th to July 29th</span></li>  
                    </ul>
                </div>   
              </div>
              <div className="block-help">
                <div className="help-heading">
                  <h1> Need help ?</h1>
                </div>
                <div className="help-body">
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
                    eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </div>
                <div className="help-contacts-block">
                  <div className="help-contact">
                    <i class="fas fa-phone-square-alt"></i>
                    <a href="tel:0209 00 59 00">0209 00 59 00</a>
                  </div>
                  <div className="help-contact help-mail">
                    <div><i class="fas fa-envelope"></i></div>
                    <a href="mailto:travelix@gmail.com">travelix@gmail.com</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <BestOffer/>
        </div>
        <Footer/>
      </div> 
      
    </div>
  )
}

export default Detail
