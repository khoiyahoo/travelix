import React from 'react'
import './About.css'
import {Link} from 'react-router-dom'
function About() {
  return (
    <div className="about-container">
        <div className="about-title-container">
             <h1 className="about-title">about us</h1>
        </div>
        <div className="about-content-container">
            <div className="about-content">
                <div className="about-content-heading">
                    <h1>WE HAVE THE BEST TOURS</h1>
                </div>
                <div className="about-content-text">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Vivamus quis vulputate eros, iaculis consequat nisl. 
                        Nunc et suscipit urna. Integer elementum orci eu vehicula pretium. 
                        Donec bibendum tristique condimentum. Aenean in lacus ligula. 
                        Phasellus euismod gravida eros. Aenean nec ipsum aliquet, pharetra magna id, 
                        interdum sapien. Etiam id lorem eu nisl pellentesque semper. 
                        Nullam tincidunt metus placerat, suscipit leo ut, tempus nulla. 
                        Fusce at eleifend tellus. Ut eleifend dui nunc, non fermentum quam placerat non. 
                        Etiam venenatis nibh augue, sed eleifend justo tristique eu.
                        </p>
                </div>
                <Link to="/" className="home-btn btn--primary section-home-btn">
                <p>Explore now
                <span></span>
                <span></span>
                <span></span>
                </p>   
                </Link>
                
            </div>
            <div className="about-content-image">
                 <img src="https://technext.github.io/travelix/images/intro.png" alt="Hinh anh"/>
            </div>
        </div>
        <div className="about-intro">
            <div className="about-intro-content">
                <div>
                <h1>YEARS STATISTICS</h1>
                </div>
                <div>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Vivamus quis vulputate eros, iaculis consequat nisl. Nunc et suscipit urna. 
                    Integer elementum orci eu vehicula pretium. Donec bibendum tristique condimentum. 
                    Aenean in lacus ligula.</p>
                </div>
                
            </div>
            <div className="about-intro-image">
                <div className="about-intro-image-des">
                    <h1>thailand</h1>
                    <h2>From 990$</h2>
                </div>
                <div className="about-intro-background">
                    <img src="https://technext.github.io/travelix/images/add.jpg" alt=""/>
                </div>
                <div className="about-intro-btn">
                <Link to="/" className="home-btn btn--primary section-home-btn">
                <p>Explore now
                <span></span>
                <span></span>
                <span></span>
                </p>   
                </Link>
                </div>
               
            </div>
            <div className="about-intro-data">
                <div className="col-data">
                    <div className="col-data-icon">
                        <img src="https://technext.github.io/travelix/images/milestone_1.png" alt="hinh anh"/>
                    </div>
                    <div className="col-data-number">255</div>
                    <div className="col-data-des">Destination</div>
                </div>
                <div className="col-data">
                    <div className="col-data-icon">
                        <img src="https://technext.github.io/travelix/images/milestone_2.png" alt="hinh anh"/>
                    </div>
                    <div className="col-data-number col-data-number-activites">1176</div>
                    <div className="col-data-des col-data-des-activites">Activities</div>
                </div>
                <div className="col-data">
                    <div className="col-data-icon">
                        <img src="https://technext.github.io/travelix/images/milestone_3.png" alt="hinh anh"/>
                    </div>
                    <div className="col-data-number">39</div>
                    <div className="col-data-des ">Countries</div>
                </div>
                <div className="col-data">
                    <div className="col-data-icon">
                        <img src="https://technext.github.io/travelix/images/milestone_4.png" alt="hinh anh"/>
                    </div>
                    <div className="col-data-number">1190</div>
                    <div className="col-data-des col-data-des-satisfied">Satisfied</div>
                </div>
            </div>
            <div className="about-intro-sperate">
                <img src="https://technext.github.io/travelix/images/cta.jpg" alt="hinhanh"/>
            </div>
        </div>
    </div>
  )
}

export default About
