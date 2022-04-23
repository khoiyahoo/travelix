import React from 'react'
import './ListServices.css'
function ListServices() {
  return (
    <div className="list-services-container">
        <div className="list-content">
            <ul className="list-services-items">
                <li className="list-item">
                    <div className="list-item-content">
                        <div className="list-item-icon">
                            <img src="https://tranhoangkhang1212.github.io/travelix/assets/images/hotel.webp" alt="Hotel"/>
                        </div>
                        <div className="list-item-text">
                            <h1>Hotels</h1>
                        </div>
                    </div>
                </li>
                <li className="list-item">
                    <div className="list-item-content">
                        <div className="list-item-icon">
                            <img className="car-icon"src="https://tranhoangkhang1212.github.io/travelix/assets/images/car.webp" alt="Hotel"/>
                        </div>
                        <div className="list-item-text">
                            <h1>Car rentals</h1>
                        </div>
                    </div>
                </li>
                <li className="list-item">
                    <div className="list-item-content">
                        <div className="list-item-icon">
                            <img className="flight-icon"src="https://tranhoangkhang1212.github.io/travelix/assets/images/fly.webp" alt="Hotel"/>
                        </div>
                        <div className="list-item-text">
                            <h1>Flights</h1>
                        </div>
                    </div>
                </li>
                <li className="list-item">
                    <div className="list-item-content">
                        <div className="list-item-icon">
                            <img src="https://tranhoangkhang1212.github.io/travelix/assets/images/trip.webp" alt="Hotel"/>
                        </div>
                        <div className="list-item-text">
                            <h1>trips</h1>
                        </div>
                    </div>
                </li>
                <li className="list-item">
                    <div className="list-item-content">
                        <div className="list-item-icon">
                            <img className="cuises-icon"src="https://tranhoangkhang1212.github.io/travelix/assets/images/cruises.webp" alt="Hotel"/>
                        </div>
                        <div className="list-item-text">
                            <h1>cuises</h1>
                        </div>
                    </div>
                </li>
                <li className="list-item">
                    <div className="list-item-content">
                        <div className="list-item-icon">
                            <img src="https://tranhoangkhang1212.github.io/travelix/assets/images/activities.webp" alt="Hotel"/>
                        </div>
                        <div className="list-item-text">
                            <h1>activities</h1>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
  )
}

export default ListServices
