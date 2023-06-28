import React, { memo, useEffect, useState } from "react";
import { Container, Row, Col, Badge } from "reactstrap";
import classes from "./styles.module.scss";
import Button, { BtnType } from "components/common/buttons/Button";
import { HOTEL_SECTION, ICreateHotel, IHotel } from "models/hotel";
import useAuth from "hooks/useAuth";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import Stars from "components/Stars";
import PopupModalImages from "components/Popup/PopupModalImages";
import { Grid } from "@mui/material";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import PoolIcon from "@mui/icons-material/Pool";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import ElevatorIcon from "@mui/icons-material/Elevator";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import { Stay } from "models/stay";
import { StayType } from "models/enterprise/stay";
import { useTranslation } from "react-i18next";
import { fCurrency2VND } from "utils/formatNumber";
import { useRouter } from "next/router";
interface Props {
  stay: Stay;
}

// eslint-disable-next-line react/display-name
const SectionTour = memo(({ stay }: Props) => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation("common");
  const router = useRouter();

  const [openPopupModalImages, setOpenPopupModalImages] = useState(false);

  const onOpenPopupModalImages = () =>
    setOpenPopupModalImages(!openPopupModalImages);

  const scrollToElement = () => {
    var scrollDiv = document.getElementById(
      HOTEL_SECTION.section_check_room
    ).offsetTop;
    window.scrollTo({ top: scrollDiv - 90, behavior: "smooth" });
  };

  const getTypeState = (type: number) => {
    switch (type) {
      case StayType.HOTEL:
        return t("enterprise_management_section_stay_status_option_hotel");
      case StayType.HOMES_TAY:
        return t("enterprise_management_section_stay_status_option_home_stay");
      case StayType.RESORT:
        return t("enterprise_management_section_stay_status_option_resort");
    }
  };

  return (
    <>
      <div
        className={clsx({["section"]: router.query?.hotelId}, classes.root)}
        id={HOTEL_SECTION.section_overview}
      >
        <Container className={classes.container}>
          <Grid>
            <Col className={classes.rootImg}>
              <h2 className={`title ${classes.nameHotel}`}>
                {stay?.name} - {stay?.city.name}
              </h2>
              <div className={classes.subProduct}>
                <div className={classes.tags}>
                  <Badge pill className={classes.badgeTags}>
                    {getTypeState(stay?.type)}
                  </Badge>
                </div>
                <div className={classes.locationRate}>
                  {stay?.rate !== 0 && (
                    <Stars
                      numberOfStars={Math.floor(stay?.rate)}
                      className={classes.starRating}
                    />
                  )}
                </div>
              </div>
              <Grid className={classes.boxLocation}>
                <FontAwesomeIcon icon={faLocationDot}></FontAwesomeIcon>
                <p>
                  {stay?.commune.name}, {stay?.district.name}, {stay?.city.name}
                </p>
              </Grid>
              <Row
                className={classes.containerImg}
                onClick={onOpenPopupModalImages}
              >
                <Col
                  className={clsx(classes.wrapperImg, classes.mobileImg)}
                  md="8"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={stay?.images[0]} alt="anh" />
                </Col>
                <Col
                  className={clsx(classes.wrapperImg, classes.wrapperImg1)}
                  md="4"
                >
                  <div className={clsx(classes.rowImg, classes.mobileImg)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={stay?.images[1]} alt="anh" />
                  </div>
                  <div className={clsx(classes.rowImg, classes.moreImg)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={stay?.images[2]} alt="anh" />
                    <div className={classes.modalImg}>
                      <p>{t("common_see_all")}</p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Grid>
          <Grid
            sx={{
              padding: "24px 24px 0 24px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Grid className={classes.boxReview}>
              <h5>Travelix</h5>
              <Grid className={classes.review}>
                <FontAwesomeIcon icon={faLocationDot}></FontAwesomeIcon>
                <p>
                  {stay?.rate.toFixed(2)}{" "}
                  {t("stay_detail_section_stay_from_review")}{" "}
                  {stay?.numberOfReviewer}{" "}
                  {t("stay_detail_section_stay_reviews")}
                </p>
              </Grid>
            </Grid>
            <Grid className={classes.boxPrice}>
              <p>{t("stay_detail_section_stay_price_room_night")}</p>
              <h5>
                {fCurrency2VND(stay?.minPrice)} ~{" "}
                {fCurrency2VND(stay?.maxPrice)} VND
              </h5>
              <Button btnType={BtnType.Primary} onClick={scrollToElement}>
                {t("stay_detail_section_stay_select_room")}
              </Button>
            </Grid>
          </Grid>
          <Grid sx={{ padding: "24px 24px 0 24px" }}>
            <h5>{t("stay_detail_section_stay_select_des")}</h5>

            <p
              dangerouslySetInnerHTML={{ __html: stay?.description }}
              className={classes.text}
            ></p>
          </Grid>
          <Grid className={classes.boxFacilities}>
            <h5>{t("stay_detail_section_stay_select_facilities")}</h5>
            <Grid>
              <ul>
                {stay?.convenient?.map((item, index) => (
                  <li key={index} className={classes.text}>
                    {item}
                  </li>
                ))}
              </ul>
            </Grid>
          </Grid>
          <PopupModalImages
            isOpen={openPopupModalImages}
            toggle={onOpenPopupModalImages}
            images={stay?.images}
          />
        </Container>
      </div>
    </>
  );
});

export default SectionTour;
