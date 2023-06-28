import React, { memo, useEffect, useState } from "react";
import Link from "next/link";
// reactstrap components
import { Container, Row, Col, Input, Media } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faPhone,
  faPlus,
  faSignsPost,
} from "@fortawesome/free-solid-svg-icons";
import classes from "./styles.module.scss";
import "aos/dist/aos.css";
import Button, { BtnType } from "components/common/buttons/Button";
import { Comment } from "models/comment";
import CardComment from "../CardComments";
import PopupAddComment from "components/Popup/PopupAddComment";
import { HOTEL_SECTION, IHotel } from "models/hotel";
import PopupConfirmDelete from "components/Popup/PopupConfirmDelete";
import { CommentService } from "services/normal/comment";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { ReducerType } from "redux/reducers";
import PopupAddHotelComment from "../PopupAddHotelComment";
import Warning from "components/common/warning";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import clsx from "clsx";
import { Grid, useMediaQuery, useTheme } from "@mui/material";
import { Stay } from "models/stay";
import Geocode from "react-geocode";
import GoogleMapReact from "google-map-react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import { useTranslation } from "react-i18next";
const AnyReactComponent = ({ text, lat, lng }) => <div>{text}</div>;

interface Props {
  stay: Stay;
}

// eslint-disable-next-line react/display-name
const Comments = memo(({ stay }: Props) => {
  Geocode.setApiKey("AIzaSyAcGL6oQZ3hqBsLQ8h-vLQc6cy7vLzrQmA");
  const [coords, setCoords] = useState(null);
  const { t, i18n } = useTranslation("common");

  useEffect(() => {
    Geocode.fromAddress(
      `${stay?.moreLocation}, ${stay?.commune.name}, ${stay?.district.name}, ${stay?.city.name}`
    ).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        setCoords({ lat, lng });
      },
      (error) => {
        // console.error(error);
      }
    );
  }, [stay]);

  return (
    <Grid
      sx={{ backgroundColor: "#f6f2f2", paddingBottom: "8px" }}
      id={HOTEL_SECTION.section_location}
    >
      <Container className={classes.root}>
        <h5> {t("tour_detail_section_location")}</h5>
        <Grid
          sx={{
            padding: "18px",
            backgroundColor: "var(--white-color)",
            borderRadius: "10px",
            boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          }}
        >
          <p className={classes.locationDetail}>
            {stay?.moreLocation}, {stay?.commune.name},{stay?.district.name},{" "}
            {stay?.city.name}
          </p>
          <div style={{ height: "30vh", width: "100%" }}>
            <GoogleMapReact
              bootstrapURLKeys={{
                key: "AIzaSyAcGL6oQZ3hqBsLQ8h-vLQc6cy7vLzrQmA",
              }}
              defaultCenter={coords}
              defaultZoom={11}
              center={coords}
            >
              <AnyReactComponent
                lat={coords?.lat}
                lng={coords?.lng}
                text={<LocationOnIcon sx={{ color: "var(--danger-color)" }} />}
              />
            </GoogleMapReact>
          </div>
          <div className={classes.contactBox}>
            <FontAwesomeIcon icon={faPhone}></FontAwesomeIcon>
            <p> {t("tour_detail_section_contact")}: </p>
            <a href={`tel: ${stay?.contact}`}>{stay?.contact}</a>
          </div>
        </Grid>
      </Container>
    </Grid>
  );
});

export default Comments;
