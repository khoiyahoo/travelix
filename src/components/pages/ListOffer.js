import React from 'react'
import './ListOffer.css'
import '../../App.css'
import Aos from 'aos'
import 'aos/dist/aos.css'
import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import Footer from '../Footer';
import axios from 'axios';
function ListOffer() {
    useEffect(()=>{
        Aos.init({duration:500});
      },[])
    //rest API
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);

    useEffect(()=>{
        const fetchPosts = async () =>{
            setLoading(true);
            const res = await axios.get('http://localhost:8000/item');
            setPosts(res.data);
            setLoading(false);
        }

        fetchPosts();
    }, []);
    console.log(posts);
  return (
    <div>
      <div className="list-offer-container"> 
        <div class="list-offer"><h1 >MULTI-COUNTRY TOURS</h1></div>
        <div className="search">
          <div className="row">
                <ul className="search-content">
                    <li className="search-item">
                        <div className="search-item-label">
                            <i className="fas fa-map-signs"></i>
                            <h3>destination</h3>
                        </div>
                        <input className="search-input" placeholder='Destination...'/>
                    </li>
                    <li className="search-item">
                        <div className="search-item-label">
                            <i class="fas fa-calendar-alt"></i>
                            <h3>Check in</h3>
                        </div>
                        <input className="search-input input-check"placeholder='YYYY/MM/DD'/>
                    </li>
                    <li className="search-item">
                        <div className="search-item-label">
                            <i class="fas fa-calendar-alt"></i>
                            <h3>check out</h3>
                        </div>
                        <input className="search-input input-check"placeholder='YYYY/MM/DD'/>
                    </li>
                    <li className="search-item">
                        <div className="search-item-label">
                             <i class="fas fa-user-check"></i>
                            <h3>adults</h3>
                        </div>
                        <input className="search-input input-person"placeholder='0'/>
                    </li>
                    <li className="search-item">
                        <div className="search-item-label">
                            <i class="fas fa-user-check"></i>
                            <h3>chlidren</h3>
                        </div>
                        <input className="search-input input-person"placeholder='0'/>
                    </li>
                    <li className="search-item">
                        <button className="extra-btn btn--extra search-btn">
                            <p>Search  
                        <span></span>
                        <span></span>
                        <span></span></p>
                        </button>
                    </li>
                </ul>
          </div>
      </div>
      <div className="section-offer-icon">
          <img src="https://www.exotravel.com/assets/img/top-page/icon-search-catalogue.png" alt="anh"/>
      </div>
      <div className="section-offer-heading">
          <h1>BROWSE OUR MULTI-COUNTRY TOURS</h1>
      </div>
      <div className="section-offer-title" data-aos="fade-up">
          <p>Choose from our portfolio of unforgettable multi-country tours of Asia and embark
               on the journey of a lifetime. Each private tour is tailor-made to show the very 
               best that Asia has to offer.</p>
      </div>
      <div className="filter">
          <div className="row">
              <div class="grid__colum-2">
                  <button className="btn-layout active">
                    <i class="fas fa-list"></i>
                     List view
                  </button>
                </div>
             <div class="grid__colum-2">
                  <button className="btn-layout">
                    <i class="fas fa-th"></i>
                    Gird view
                  </button>
            </div>
            <div className="grid__colum-8">
              <div className="filter-box-center">
                  <div className="group-result">
                      <span>results found: </span>
                      <span>32</span>
                  </div>
                  <div className="group-view">
                      <span>view:</span>
                      <div className="dropdown-toggle">
                          <span>09 <i class="fas fa-caret-down"></i></span>
                      </div>
                      <span>per page</span>
                  </div>
                  <div className="btn-sort-by">
                      <span>sort by <i class="fas fa-caret-down"></i></span>
                  </div>
              </div>
              </div>
          </div>
          <div className="row">
              <div className="grid__colum-2">
                    <div className="left-search-box">
                        <div className="search-box-title">
                            <h1>Search Tours</h1>
                        </div>
                        <div className="search-box-input">
                            <input name="tour-name"placeholder="Type Tour Name"/>
                            <span className="search-icon"><i class="fas fa-search"></i></span>
                        </div>
                    </div>
                    <div className="left-search-box left-box-destination">
                        <div className="search-box-title">
                            <h1>Destination</h1>
                        </div>
                        <div className="checkbox-container">
                            <div className="input-checkbox">
                                <input type="checkbox"name="tour-name"/>
                                Viet Nam (15)
                            </div>
                            <div className="input-checkbox">
                                <input type="checkbox"name="tour-name"/>
                                Malaysia (10)
                            </div>
                            <div className="input-checkbox">
                                <input type="checkbox"name="tour-name"/>
                                Thailand (20)
                            </div>
                            <div className="input-checkbox">
                                <input type="checkbox"name="tour-name"/>
                                Cambodia (9)
                            </div>
                            <div className="input-checkbox">
                                <input type="checkbox"name="tour-name"/>
                                Indonesia (10)
                            </div>
                        </div>
                    </div>
                    <div className="left-search-box left-box-style">
                        <div className="search-box-title">
                            <h1>Style</h1>
                        </div>
                        <div className="checkbox-container">
                            <div className="input-checkbox">
                                <input type="checkbox"name="tour-name"/>
                                Adventure (15)
                            </div>
                            <div className="input-checkbox">
                                <input type="checkbox"name="tour-name"/>
                                Beach (10)
                            </div>
                            <div className="input-checkbox">
                                <input type="checkbox"name="tour-name"/>
                                Luxury (20)
                            </div>
                            <div className="input-checkbox">
                                <input type="checkbox"name="tour-name"/>
                                Nature & Wildlife (9)
                            </div>
                            <div className="input-checkbox">
                                <input type="checkbox"name="tour-name"/>
                                Cruising (10)
                            </div>
                        </div>
                    </div>
              </div>
              <div className="grid__colum-10">
                  <div className="row list-items">
                      <div className="grid__colum-3">
                          <div className="item-tour">
                              <div className="item-tour-heading"> 
                              <Link to="/detail">   
                                <div className="item-tour-img">                              
                                    <img src="https://www.exotravel.com/cdn-cgi/image/fit=scale-down,width=1700,quality=70,format=auto/https://www.exotravel.com/images/made/chrootassets/content/multiday-tours/images/exo-travel-laos-vietnam-multi-country-trekking---luang-prabang-to-hanoi-main_720_450_75_c1.jpg" alt=""/>                     
                                    <div className="item-tour-title">
                                        <h3>Trekking Luang Prabang to Hanoi</h3>
                                    </div>
                                    <button className="item-tour-cart">
                                        <i class="fas fa-shopping-cart"></i>
                                    </button>
                                </div>
                                </Link>       
                              </div> 
                              <div className="item-tour-day">
                                  <h3>13 days / 12 nights</h3>
                              </div>
                              <div className="item-tour-content">
                                  <ul className="list-content-tour-details">
                                      <li className="item-content-tour-details">Learn about hill tribe cultures</li>
                                      <li className="item-content-tour-details">Hike scenic Mai Chau Valley</li>
                                      <li className="item-content-tour-details">Sleep in local homestays</li>
                                      <li className="item-content-tour-details">Trek along the Ho Chi Minh Trail</li>
                                      <li className="item-content-tour-details">Visit Vieng Xay’s historic caves</li>
                                  </ul>
                              </div>
                              <div className="grid-view-btn">
                                  <Link to="/" className="btn-tour btn-link-detail">View Tour</Link>
                                  <button className="btn-tour btn-book">Book now</button>
                                </div> 
                          </div>
                      </div>       
                  </div>
                  <div className="row">
                      <div className="pagination-container">
                        <div className="pagination">
                                <li className="page-item previous-page disable"><a className="page-link"href="#"><i class="fas fa-chevron-left"></i>Previous</a></li>
                                <li className="page-item current-page active-page"><a className="page-link"href="#">1</a></li>
                                <li className="page-item dots"><a className="page-link"href="#">...</a></li>
                                <li className="page-item current-page"><a className="page-link"href="#">5</a></li>
                                <li className="page-item current-page"><a className="page-link"href="#">6</a></li>
                                <li className="page-item dots"><a className="page-link"href="#">...</a></li>
                                <li className="page-item current-page"><a className="page-link"href="#">10</a></li>
                                <li className="page-item next-page"><a className="page-link"href="#">Next<i class="fas fa-chevron-right"></i></a></li>
                        </div>
                        </div>
                  </div>
              </div>
          </div>
      </div>
      </div>
      <Footer/>
    </div>
  )
}

export default ListOffer
