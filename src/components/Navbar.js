import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import './Navbar.css'
import './Modal.css'
import {Validator} from '../Lib/validator'
function Navbar() {
    const [click, setClick] = useState(false);
    const handleClick = () => setClick(!click);
    const closeMobileMenu =() =>setClick(false);
    useEffect(()=>{
        const navbar = document.querySelector('.navbar-container');
        window.addEventListener('scroll', function() {
            const x = this.pageYOffset;
            if(x>80)
            {
                navbar.classList.add('active');
            }else {
                navbar.classList.remove('active');
            }
        })
    },[])
   
        const handleClickRegister = () =>{
        const modal = document.querySelector('.modal-register-container');
         modal.classList.add('active');  
        }
        const handleClickClose = () => {
            const modalRegister = document.querySelector('.modal-register-container');
            const modalLogin = document.querySelector('.modal-login-container')
            modalRegister.classList.remove('active');
            modalLogin.classList.remove('active');

        }
        const handleClickLogin = () =>{
            const modal = document.querySelector('.modal-login-container');
            modal.classList.add('active');
        }
        const handleClickChangeRegister = () => {
            const modalRegister = document.querySelector('.modal-register-container');
            const modalLogin = document.querySelector('.modal-login-container');
            modalLogin.classList.remove('active');
            modalRegister.classList.add('active');
        }
        const handleClickChangeLogin =() =>{
            const modalRegister = document.querySelector('.modal-register-container');
            const modalLogin = document.querySelector('.modal-login-container');
            modalLogin.classList.add('active');
            modalRegister.classList.remove('active');
        }
        useEffect(()=>{
            const $ = document.querySelector.bind(document);
            const $$ = document.querySelectorAll.bind(document);
            const navActive = $('.nav-links.active');
            const navs = $$('.nav-links');
            const line = $('.line');
            line.style.left = navActive.offsetLeft + 'px'
            line.style.width = navActive.offsetWidth + 'px'
            navs.forEach((nav,index) => {
                nav.onclick = function() {
                    $('.nav-links.active').classList.remove('active');
                    this.classList.add('active');
                    line.style.left = this.offsetLeft + 'px'
                    line.style.width = this.offsetWidth + 'px'
                
                }
        })  
        },[]);
        // function validator(formSelector) {
        //     var formElement = document.querySelector(formSelector);
        //     if(formElement){
        //         var inputs = formElement.querySelectorAll('[name][rules]');
        //         console.log(inputs);
        //     }
        // }
       useEffect(()=>{
        Validator({
            form: '#register-form',
            formGroupSelector: '.modal-body-input',
            errorSelector: '.form-message',
            rules: [
               Validator.isRequired('#email'),
               Validator.isEmail('#email'),
               Validator.isRequired('#password'),
               Validator.minLength('#password',6),
               Validator.isRequired('#password_confirmation'),
               Validator.isConfirmed('#password_confirmation', function(){
              return document.querySelector('#register-form #password').value;
            }, 'Confirmation password is not correct')
        ],
        onSubmit: function(data){
            console.log(data);
        }
        });
       },[])
  return (
    <>
       <nav className="navbar">
        <div className="navbar-topbar">
            <div className="navbar-topbar-contacts">
                <Link to="tel:+84 954 000 917" className="navbar-topbar-number">+84 954 000 917</Link>
                <Link to="/"><i className="navbar-topbar-icon fab fa-pinterest"></i></Link>
                <Link to="/"><i class="navbar-topbar-icon fab fa-facebook-f"></i></Link>
                <Link to="/"><i class="navbar-topbar-icon fab fa-twitter"></i></Link>
                <Link to="/"><i class="navbar-topbar-icon fab fa-instagram"></i></Link>
            </div>
            <div className="navbar-topbar-auth">
                <button onClick={handleClickLogin} className="navbar-topbar-auth-login">Login</button>
                <span className="navbar-topbar-auth-sperate">|</span>
                <button onClick={handleClickRegister} className="navbar-topbar-auth-register">Register</button>
            </div>
        </div>
        <div className="navbar-container scroll">
          
            <Link to="/" className="navbar-logo">
            <img className="navbar-logo-img" src="images/logo.png" alt="Logo"/>
            <h1 className="navbar-logo-text">TRAVELIX</h1>             
             </Link>
                <div className="menu-icon" onClick={handleClick}>
                    <i className={click ? 'fas fa-times' : 'fas fa-bars'}/>
                </div>
                <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                    <li className="nav-item">
                        <Link to="/" className="nav-links active" onClick={closeMobileMenu}>Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/about" className="nav-links" onClick={closeMobileMenu}>About</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/offers" className="nav-links" onClick={closeMobileMenu}>Offers</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/feedbacks" className="nav-links" onClick={closeMobileMenu}>Feedbacks</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/contact" className="nav-links" onClick={closeMobileMenu}>Contact</Link>
                    </li> 
                    <li className="nav-item btn-mobile">
                       <button className="nav-button-signup">Sign Up</button>
                    </li>
                    <div className="line"></div>
                </ul>
                <div className="nav-search">
                   <label for="nav-search-toggle">
                   <i className="fas fa-search" id="toggle-search"></i></label>
                  <input type="checkbox" id="nav-search-toggle"/>
                  <div className="side__bar">
                        <input type="text"className="nav-search-input" placeholder="Search..."/>
                    </div>
                </div>
            
        </div>   
        </nav> 
    <div className="modal modal-register-container">
      <div className="modal-container">
          <div className="modal-close"> 
          <button onClick={handleClickClose} className="btn-close"> <i class="fas fa-times"></i></button>
         
          </div>
          <header className="modal-header">
                <div className="modal-primary-header"><button>Register</button></div>
                <div className="modal-sup-header"><button onClick={handleClickChangeLogin}>Login</button></div>
          </header>
          <div className="modal-body">
            <form action="" method="POST" className="form" id="register-form">
              <div className="modal-body-input">
                <input id="email"className="modal-input" name="email" rules="required|email" type="text" placeholder="Your email"/>
                <span className="form-message"></span>
              </div>
              <div className="modal-body-input">
                 <input id="password"className="modal-input"name="password" rules="required|min:6" type="password" placeholder="Password"/>
                 <span className="form-message"></span>
              </div>
              <div className="modal-body-input">
                 <input id="password_confirmation"className="modal-input" name="password_confirmation" rules="required|min:6" type="password" placeholder="Confirm password"/>
                 <span className="form-message"></span>
              </div> 
              <div className="modal-body-support">
                  <p>By registration, you agree to Travelix about <a href="/">Terms of Service</a> &  <a href="/">Prvacy Policy</a></p>
              </div>
              <div className="modal-btn">
                  {/* <button onClick={handleClickChangeLogin} className="btn modal-btn-auth btn-return">Return</button> */}
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
    <div className="modal modal-login-container">
      <div className="modal-container">
          <div className="modal-close"> 
          <button onClick={handleClickClose} className="btn-close"> <i class="fas fa-times"></i></button>
         
          </div>
          <header className="modal-header">
                <div className="modal-primary-header"><button>Login</button></div>
                <div className="modal-sup-header"><button onClick={handleClickChangeRegister}>Register</button></div>
          </header>
          <div className="modal-body">
          <form action="" method="POST" className="form" id="login-form">
              <div className="modal-body-input">
                <input className="modal-input" name="email"rules="required|email" type="text"placeholder="Your email"/>
                <span className="form-message"></span>
              </div>
              <div className="modal-body-input">
                 <input className="modal-input" name="password" rules="required|min:6" type="password" placeholder="Password"/>
                 <span className="form-message"></span>
              </div> 
              <div className="modal-body-support">
                  <a href="/" className="link-support">Forgot password</a> 
                  <a href="/" className="link-support">Need help?</a><span></span> 
              </div>
              <div className="modal-btn">
                  {/* <button onClick={handleClickChangeRegister} className="btn modal-btn-auth btn-return">Return</button> */}
                  <button className="btn modal-btn-auth btn-action">Login</button>
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
    </>
  )
}

export default Navbar
