import React from 'react'
import './Modal.css'
import '../App.css'
function Modal() {
  return (
    <div className="modal">
      <div className="modal-container">
          <div className="modal-close"> 
          <button className="btn-close"> <i class="fas fa-times"></i></button>
         
          </div>
          <header className="modal-header">
                <div className="modal-primary-header"><button>Register</button></div>
                <div className="modal-sup-header"><button>Login</button></div>
          </header>
          <div className="modal-body">
            <form action="" method="POST" className="form" id="form-register">
              <div className="modal-body-input">
                <input className="modal-input" placeholder="Your email"/>
              </div>
              <div className="modal-body-input">
                 <input className="modal-input" placeholder="Password"/>
              </div>
              <div className="modal-body-input">
                 <input className="modal-input" placeholder="Confirm password"/>
              </div> 
              <div className="modal-body-policy">
                  <p>By registration, you agree to Travelix about <a>Terms of Service</a> &  <a>Prvacy Policy</a></p>
              </div>
              <div className="modal-btn">
                  <button className="btn modal-btn-auth btn-return">Return</button>
                  <button className="btn modal-btn-auth btn-action">Register</button>
              </div>
              </form>
          </div>
          <div className="modal-footer">
              <div className="modal-footer-container">
                  <button className="btn btn-social btn-facebook">
                  <i class="fab fa-facebook-square"></i>
                     <p> Connect Facebook</p>
                    </button>
                    <button className="btn btn-social btn-google">
                    <i class="fab fa-google"></i>
                    <p>Connect Google</p>
                    </button>
              </div>
          </div>
      </div>
    </div>
  )
}

export default Modal
