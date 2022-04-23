import React from 'react'
import {Link} from 'react-router-dom'
import './Information.css'
function Information() {
  return (
    <div className="info-container">
        <div className="info-body">
            <div className="info-body-col ">
                <div className="info-body-img">
                    <img src="https://technext.github.io/travelix/images/man.png" alt="hinhanh"/>
                </div>
            </div>
            <div className="info-body-col">
                <div className="info-heading">
                    <div className="info-heading-logo">
                        <img src="images/logo.png" alt="hinhanh"/>
                    </div>
                    <div className="info-heading-title">
                        <h1>travelix</h1>
                    </div>
                </div>
                <div className="info-detail">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Vivamus quis vu lputate eros, iaculis consequat nisl.
                         Nunc et suscipit urna. Integer eleme ntum orci eu vehicula
                          iaculis consequat nisl. Nunc et suscipit urna pretium.</p>
                </div>
                <ul className="info-social">
                    <li className="info-social-link">
                        <Link to="/" className="social-link"><i class="fab fa-pinterest-p"></i></Link>
                    </li>
                    <li className="info-social-link">
                        <Link to="/" className="social-link"><i className="fab fa-facebook-f"></i></Link>
                    </li>
                    <li className="info-social-link">
                        <Link to="/" className="social-link"><i className="fab fa-twitter"></i></Link>
                    </li>
                    <li className="info-social-link">
                        <Link to="/" className="social-link"><i className="fab fa-instagram"></i></Link>
                    </li>
                </ul>
            </div>
            <div className="info-body-col">
                <ul className="info-body-list-contact">
                    <li className="info-contact">      
                        <i class="fas fa-map-marked"></i>   
                        <p>4127 Raoul Wallenber 45b-c Gibraltar</p>
                    </li>
                    <li className="info-contact">
                         <i class="fas fa-phone-alt"></i>
                         <a href="tel:+84 954 000 917" className="contact-link-info"><p>84 954 000 917</p></a>
                    </li>
                    <li className="info-contact">
                        <i class="fas fa-envelope-open-text"></i>
                        <a href="mailto:mail@mail.com" className="contact-link-info"><p>travelix@gmail.com</p></a>
                    </li>
                    <li className="info-contact">
                        <i class="fas fa-globe-americas"></i>
                        <Link to="/"className="contact-link-info"><p>www.colorlib.com</p></Link>
                    </li>
                </ul>
            </div>
        </div>
    </div>
  )
}

export default Information
