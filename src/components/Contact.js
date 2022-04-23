import React from 'react'
import './Contact.css'
import {Link} from 'react-router-dom'
function Contact() {
  return (
    <div className="contact-container">
      <div className="contact-heading">
          <h1>contact</h1>
      </div>
      <div className="contact-body">
          <div className="contact-body-heading">
              <h1>get in touch</h1>
          </div>
          <div className="contact-body-input">
              <div className="contact-input-info">
                  <input placeholder="Name" required="required" type="text"/>
                  <input placeholder="Email"/>
              </div>
              <div className="contact-input-subject">
                <input placeholder="Subject"required="required" type="text"/>
              </div>
              <div className="contact-input-mess">
                <input placeholder="Message"required="required" type="text"/>
              </div>
          </div>
          <div class="send-btn">
          <Link to="/" class="extra-btn btn--extra send-mess-btn">                          
               <p>Send 
                  <span></span>
                  <span></span>
                  <span></span>
               </p>                           
           </Link>
          </div>
      </div>
    </div>
  )
}

export default Contact
