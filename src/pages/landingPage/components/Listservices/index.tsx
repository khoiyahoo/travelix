/*eslint-disable*/
import React, { memo } from "react";
import { Row } from "reactstrap";
import classes from "./styles.module.scss";
import { images } from "configs/images";

const ListServices = memo(() => {
  const listServices = [
    {
      service: "Hotels",
      image: images.hotel.src,
    },
    {
      service: "Car Rentals",
      image: images.car.src,
    },
    {
      service: "Flights",
      image: images.fly.src,
    },
    {
      service: "Trips",
      image: images.trip.src,
    },
    {
      service: "Cruises",
      image: images.cruises.src,
    },
    {
      service: "Activities",
      image: images.activities.src,
    },
  ];
  return (
    <>
      <Row className={classes.root}>
        <ul className={classes.wrapper}>
          {listServices.map((item, index) => (
            <li key={index} className={classes.itemService}>
              <img src={item.image} alt="hotel" />
              <span>{item.service}</span>
            </li>
          ))}
        </ul>
      </Row>
    </>
  );
});

export default ListServices;
