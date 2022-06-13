import React from 'react'
import './ListOffer.css'
import '../../App.css'
import Aos from 'aos'
import 'aos/dist/aos.css'
import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import Footer from '../Footer';
import ReactPaginate from 'react-paginate'

function ListOffer() {
    useEffect(()=>{
        Aos.init({duration:500});
      },[]);

      //pagination
      const [items, setItems] = useState([]);
      const [pageCount, setPageCount] = useState(0);
      let limit = 10;
      useEffect(()=>{
          const getTours = async()=>{
            const res = await fetch(`https://jsonplaceholder.typicode.com/photos?_page=1&_limit=9`);
            const data = await res.json();
            const total = res.headers.get('x-total-count');
            setPageCount(Math.ceil(total / limit));
            setItems(data);
          };
          getTours();
      },[limit]);
      const fetchTours = async (currentPage) =>{
        const res = await fetch(`https://jsonplaceholder.typicode.com/photos?_page=${currentPage}&_limit=9`);
        const data = await res.json();
        return data;
    }
      const handelPageClick = async(data) =>{
          console.log(data.selected);
          let currentPage = data.selected + 1;
          const toursFormServer = await fetchTours(currentPage);
          setItems(toursFormServer);
      }
      //search
      const [search, setSearch] = useState('');
      const searchText = (event) =>{
        setSearch(event.target.value);
      }
      let searchData = items.filter(item => {
          return Object.keys(item).some(key => item[key]
          .toString()
          .toLowerCase()
          .includes(search.toString().toLowerCase()));})
      //change view
      const handleChangeGridView = () => {
        const btnGridView = document.querySelector('.btn-grid-view');
        const btnListView = document.querySelector('.btn-list-view');
        const layoutGridView = document.querySelector('.grid-view');
        const layoutListView = document.querySelector('.list-view');
        btnListView.classList.add('active');
        btnGridView.classList.remove('active');
        layoutListView.classList.add('layout-active');
        layoutGridView.classList.remove('layout-active');

      }
      const handleChangeListView = () =>{
        const btnGridView = document.querySelector('.btn-grid-view');
        const btnListView = document.querySelector('.btn-list-view');
        const layoutGridView = document.querySelector('.grid-view');
        const layoutListView = document.querySelector('.list-view');
        btnGridView.classList.add('active');
        btnListView.classList.remove('active');
        layoutGridView.classList.add('layout-active');
        layoutListView.classList.remove('layout-active');
      }
      
      //btn-sort-by
      const handleClickSortBy = () => {
          
          const dropDown = document.querySelector('.btn-sort-by-dropdown');
          const iconSortDown = document.querySelector('.icon-sort-down');
          const iconSortUp = document.querySelector('.icon-sort-up');
          iconSortDown.classList.toggle('hide');
          iconSortUp.classList.toggle('hide');
          dropDown.classList.toggle('active');
      }
  return (
    <div>
      <div className="list-offer-container"> 
        <div className="list-offer"><h1 >MULTI-COUNTRY TOURS</h1></div>
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
                  <button className="btn-layout btn-grid-view active"onClick={handleChangeListView}>
                  <i class="fas fa-th"></i>
                    Gird view
                  </button>
                </div>
             <div class="grid__colum-2">
                  <button className="btn-layout btn-list-view" onClick={handleChangeGridView}>          
                    <i class="fas fa-list"></i>
                     List view
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
                  <div onClick={handleClickSortBy} className="btn-sort-by">
                      <span>SORT BY <i class="fas fa-caret-down icon-sort-down"></i>
                      <i class="fas fa-caret-up icon-sort-up hide"></i></span>
                      <div className="btn-sort-by-dropdown">
                          <ul className="list-dropdown">
                              <li className="item-dropdown"><Link to="/" className="item-dropdown-link">A to Z</Link></li>
                              <li className="item-dropdown"><Link to="/"className="item-dropdown-link">Z to A</Link></li>
                              <li className="item-dropdown active"><Link to="/"className="item-dropdown-link">Most Popular</Link></li>
                          </ul>
                      </div>
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
                            <input name="tour-name"placeholder="Type Tour Name" 
                            value={search}
                            onChange={searchText.bind(this)}/>
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
                  {/* LIST-VIEW */}
                  <div className="row list-view ">
                      {searchData
                            .map((item,index) => {
                          return ( <div key={item.id}className="list-view-item-container list-group-item">
                          <Link to="/detail" className="list-view-heading-link">
                          <div className="tour-item-img">
                                <img src={item.url} alt="anh"/>
                                <button className="tour-item-cart">
                                        <i class="fas fa-shopping-cart"></i>
                                </button>
                          </div>
                          <div className="tour-item-title">
                              <h1>{item.title}</h1>
                              <h2>{item.title}</h2>
                          </div>
                          </Link>
                          <div className="tour-item-detail">
                              <ul className="list-content-detail">
                                  <li className="item-content-detail">
                                  {item.title}
                                  </li>
                                  <li className="item-content-detail">
                                  {item.title}
                                  </li>
                                  <li className="item-content-detail">
                                  {item.title}
                                  </li>
                                  <li className="item-content-detail">
                                  {item.title}
                                  </li>
                                  <li className="item-content-detail">
                                  {item.title}
                                  </li>
                              </ul>
                          </div>
                          <div className="list-view-btns">
                             <div className="btn-tour btn-link-detail btn-list-view"><Link to="/" className="btn-link-view">View Tour</Link></div>
                             <div> <button className="btn-tour btn-book btn-list-view">Book now</button></div>
                          </div>
                      </div>)
                      })}
                  </div>
                  {/* GRID-VIEW */}
                  <div className="row grid-view layout-active">
                      {items.filter(item => {return Object.keys(item).some(key => item[key].toString().toLowerCase().includes(search.toString().toLowerCase()));})
                            .map((item, index) => {
                          return (<div key={item.id} className="grid__colum-3">
                          <div className="item-tour">
                              <div className="item-tour-heading"> 
                              <Link to="/detail">   
                                <div className="item-tour-img">                              
                                    <img src={item.url} alt=""/>                    
                                    <div className="item-tour-title">
                                        <h3>{item.title}</h3>
                                    </div>
                                    <button className="item-tour-cart">
                                        <i class="fas fa-shopping-cart"></i>
                                    </button>
                                </div>
                                </Link>       
                              </div> 
                              <div className="item-tour-day">
                                  <h3>{item.title}</h3>
                              </div>
                              <div className="item-tour-content">
                                  <ul className="list-content-tour-details">
                                      <li className="item-content-tour-details">{item.title}</li>
                                      <li className="item-content-tour-details">{item.title}</li>
                                      <li className="item-content-tour-details">{item.title}</li>
                                      <li className="item-content-tour-details">{item.title}</li>
                                      <li className="item-content-tour-details">{item.title}</li>
                                  </ul>
                              </div>
                              <div className="grid-view-btn">
                                  <Link to="/" className="btn-tour btn-link-detail">View Tour</Link>
                                  <button className="btn-tour btn-book">Book now</button>
                                </div> 
                          </div>
                      </div>)
                      })}
                  </div>
                  <div className="row pagination-row">
                        <ReactPaginate
                        previousLabel ={'previous'}
                        nextLabel ={'next'}
                        breakLabel={'...'}
                        pageCount ={pageCount}
                        marginPagesDisplayed={3}
                        pageRangeDisplayed={3}
                        onPageChange={handelPageClick}
                        containerClassName={'pagination'}
                        pageClassName={'page-item'}
                        pageLinkClassName={'page-link'}
                        previousClassName={'previous-page'}
                        nextClassName={'next-page'}
                        breakClassName={'page-item'}
                        breakLinkClassName={'page-link'}
                        activeClassName={'active-page'}
                        />
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
