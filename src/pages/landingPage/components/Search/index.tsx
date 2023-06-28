import { memo, useEffect, useState } from "react";
import { images } from "configs/images";
import classes from "./styles.module.scss";
import Aos from "aos";
import "aos/dist/aos.css";
import { Grid } from "@mui/material";
import InputTextfield from "components/common/inputs/InputTextfield";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHotel,
  faLocationDot,
  faSearch,
  faSignsPost,
} from "@fortawesome/free-solid-svg-icons";
import InputDatePicker from "components/common/inputs/InputDatePicker";
import { faCalendarDays } from "@fortawesome/free-regular-svg-icons";
import Button, { BtnType } from "components/common/buttons/Button";
import {
  Card,
  CardBody,
  CardTitle,
  Nav,
  NavItem,
  TabContent,
  TabPane,
} from "reactstrap";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { useMediaQuery, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import clsx from "clsx";
import Stars from "components/Stars";
import { fCurrency2 } from "utils/formatNumber";
import TourSearch from "./components/TourSearch";
import HotelSearch from "./components/HotelSearch";
import { useTranslation } from "react-i18next";

export enum EActiveNav {
  Tour_Active = 1,
  Hotel_Active = 2,
}

// eslint-disable-next-line react/display-name
const Search = memo(() => {
  const { t, i18n } = useTranslation("common");

  const { allTours } = useSelector((state: ReducerType) => state.normal);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [verticalTabs, setVerticalTabs] = useState(EActiveNav.Tour_Active);
  const listBestSeller = allTours.filter((item) => {
    return item.discount;
  });
  const onChangeTab = (type: EActiveNav) => {
    switch (type) {
      case EActiveNav.Tour_Active:
        setVerticalTabs(EActiveNav.Tour_Active);
        break;
      case EActiveNav.Hotel_Active:
        setVerticalTabs(EActiveNav.Hotel_Active);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Grid container className={classes.root}>
        <Grid className={classes.boxSearch} sx={{ width: "100%" }}>
          <Nav className={classes.boxTabControl} nav>
            <NavItem
              onClick={() => onChangeTab(EActiveNav.Tour_Active)}
              className={classes.navItem}
            >
              <Grid
                className={
                  verticalTabs === EActiveNav.Tour_Active ? classes.active : ""
                }
                translation-key="landing_page_section_search_title_tour"
              >
                <FontAwesomeIcon icon={faSignsPost}></FontAwesomeIcon>
                {t("landing_page_section_search_title_tour")}
              </Grid>
            </NavItem>
            <NavItem
              onClick={() => onChangeTab(EActiveNav.Hotel_Active)}
              className={classes.navItem}
            >
              <Grid
                sx={{
                  fontSize: "14px",
                  fontWeight: "600",
                  padding: "10px 24px",
                }}
                className={
                  verticalTabs === EActiveNav.Hotel_Active ? classes.active : ""
                }
                translation-key="landing_page_section_search_title_stay"
              >
                <FontAwesomeIcon icon={faHotel}></FontAwesomeIcon>
                {t("landing_page_section_search_title_stay")}
              </Grid>
            </NavItem>
          </Nav>
          <Grid className={classes.boxTabContent}>
            <TabContent activeTab={"verticalTabs" + verticalTabs}>
              <TabPane tabId="verticalTabs2">
                <HotelSearch />
              </TabPane>
            </TabContent>
            <TabContent activeTab={"verticalTabs" + verticalTabs}>
              <TabPane tabId="verticalTabs1">
                <TourSearch />
                <Grid>
                  {/* <Swiper
                    slidesPerView={isMobile ? 1 : 4}
                    spaceBetween={30}
                    slidesPerGroup={isMobile ? 1 : 4}
                    initialSlide={0}
                    loop={true}
                    data-aos="fade-right"
                    // onSlideChange={(e) => console.log(e.realIndex)}
                    // loopFillGroupWithBlank={true}
                    pagination={{
                      clickable: true,
                    }}
                    navigation={true}
                    modules={[Pagination, Navigation]}
                    className={clsx("mySwiper", classes.swiperBestSeller)}
                  >
                    {listBestSeller?.map((item, index) => {
                      return (
                        <SwiperSlide key={index}>
                          <Card className={clsx("card-blog", classes.card)}>
                            <div className="card-image">
                              <a href={`/listTour/:${item?.id}`}>
                                <img
                                  alt="..."
                                  className="img rounded"
                                  src={item?.images[0]}
                                ></img>
                              </a>
                            </div>
                            <CardBody>
                              <div className={classes.locationBox}>
                                <FontAwesomeIcon icon={faLocationDot} />
                                <h6
                                  className={clsx("category", classes.location)}
                                >
                                  {item?.location}
                                </h6>
                              </div>

                              <CardTitle tag="h5" className={classes.titleCard}>
                                {item?.title}
                              </CardTitle>
                              <Stars numberOfStars={item?.rate} />
                              <div className={classes.priceWrapper}>
                                <h6
                                  className={
                                    item?.discount
                                      ? classes.price
                                      : classes.priceDiscount
                                  }
                                >
                                  {fCurrency2(item?.price)} VND{" "}
                                  {!item?.discount && <span>/ person</span>}
                                </h6>
                                {item?.discount !== 0 && (
                                  <h6 className={classes.priceDiscount}>
                                    {fCurrency2(
                                      (item?.price * (100 - item?.discount)) /
                                        100
                                    )}{" "}
                                    VND<span>/ person</span>
                                  </h6>
                                )}
                              </div>
                              <p
                                className={clsx(
                                  "card-description",
                                  classes.textDesc
                                )}
                              >
                                {item?.description}
                              </p>
                            </CardBody>
                          </Card>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper> */}
                </Grid>
              </TabPane>
            </TabContent>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
});

export default Search;
