import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './components/pages/Home';
import About from './components/pages/About';
import Offer from './components/pages/Offer';
import ListOffer from './components/pages/ListOffer';
function App() {
  return (
    <>
    <Router>
     <Navbar/>
     <Routes>
       <Route path="/" element={<Home/>}/>
       <Route path="/about" element={<About/>}/>
       <Route path="/offers" element={<Offer/>}/>
       <Route path="/multicountry" element={<ListOffer/>}/>
     </Routes> 
    </Router>
  </>
  );
}

export default App;
