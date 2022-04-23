import React from 'react'
import './Footer.css'
import {Link} from 'react-router-dom'
function Footer() {

  return (
    <div className="footer-container">
      <div className="footer-body">
          <div className="footer-body-col">
              <div className="footer-img-app">
                  <img src="https://binvan789.github.io/luxstay/assets/img/home-02.png" alt="hinhanh"/>
              </div>
          </div>
          <div className="footer-body-col">
              <div className="footer-heading-log">
                  <h1>Blog post</h1>
              </div>
              <ul className="footer-list-post">
                  <li className="footer-item-post">
                      <div className="footer-item-img">
                          <img src="https://technext.github.io/travelix/images/footer_blog_1.jpg" alt=""/>
                      </div>
                      <div className="footer-item-title">
                          <p>Travel with us this year</p>
                          <p>Dec 23, 2022</p>
                      </div>
                  </li>
                  <li className="footer-item-post">
                      <div className="footer-item-img">
                          <img src="https://technext.github.io/travelix/images/footer_blog_2.jpg" alt=""/>
                      </div>
                      <div className="footer-item-title">
                          <p>Travel with us this year</p>
                          <p>Dec 23, 2022</p>
                      </div>
                  </li>
                  <li className="footer-item-post">
                      <div className="footer-item-img">
                          <img src="https://technext.github.io/travelix/images/footer_blog_3.jpg" alt=""/>
                      </div>
                      <div className="footer-item-title">
                          <p>Travel with us this year</p>
                          <p>Dec 23, 2022</p>
                      </div>
                  </li>
              </ul>
          </div>
          <div className="footer-body-col">
            <ul className="footer-contact-list">
                <li className="footer-contact-item">
                        <i class="fas fa-map-marked"></i>   
                        <p>4127 Raoul Wallenber 45b-c Gibraltar</p>
                </li>
                <li className="footer-contact-item">
                        <i class="fas fa-phone-alt"></i>
                         <a href="tel:+84 954 000 917" className="contact-link-footer"><p>84 954 000 917</p></a>
                </li>
                <li className="footer-contact-item">
                        <i class="fas fa-envelope-open-text"></i>
                        <a href="mailto:mail@mail.com" className="contact-link-footer"><p>travelix@gmail.com</p></a>
                </li>
                <li className="footer-contact-item">
                        <i class="fas fa-globe-americas"></i>
                        <Link to="/"className="contact-link-footer"><p>www.colorlib.com</p></Link>
                </li>
            </ul>
          </div>
          <div className="footer-body-col">
              <div className="footer-heading-app">
                  <h1>download app</h1>
              </div>
              <div className="footer-download">
                  <div className="footer-download-qr">
                      <img src="https://binvan789.github.io/luxstay/assets/img/qr-code.png" alt=""/>
                  </div>
                  <ul className="list-app">
                      <li className="item-app">
                          <Link to="/"><img src="https://binvan789.github.io/luxstay/assets/img/apple-store.svg" alt=""/></Link>
                      </li>
                      <li className="item-app">
                          <Link to="/"><img src="https://binvan789.github.io/luxstay/assets/img/google-play.svg" alt=""/></Link>
                      </li>
                      <li className="item-app">
                          <Link to="/"><img src="https://binvan789.github.io/luxstay/assets/img/huawei.svg" alt=""/></Link>
                      </li>
                  </ul>
                  
              </div>
              <div className="footer-download-remind">
                      <p>Acsses our's website to have more new destination information around the world.</p>
                  </div>
          </div>
          
      </div>
      <div className="footer-copyright">
              <p>Copyright ©2021 All rights reserved | This template is made with by
                  <Link to="/">Colorlib</Link>
              </p>
          </div>
    </div>
  )
}

export default Footer
