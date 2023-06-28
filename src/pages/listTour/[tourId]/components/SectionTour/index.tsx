import React, { memo, useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Badge } from "reactstrap";
// import { Carousel } from 'react-responsive-carousel'
// import {images} from "configs/images";
import classes from "./styles.module.scss";
import Button, { BtnType } from "components/common/buttons/Button";
import Link from "next/link";
import { Schedule, Tour } from "models/tour";
import { fCurrency2, fCurrency2VND } from "utils/formatNumber";
import clsx from "clsx";
import useAuth from "hooks/useAuth";
import Stars from "components/Stars";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBusinessTime,
  faCalendar,
  faClock,
  faLocationDot,
  faPhone,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { faFaceSmile } from "@fortawesome/free-regular-svg-icons";
import Box from "@mui/material/Box";

import PopupModalImages from "components/Popup/PopupModalImages";
import { Grid, Tab, Tabs } from "@mui/material";
import InputDatePicker from "components/common/inputs/InputDatePicker";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import InputSelect from "components/common/inputs/InputSelect";
import InputCounter from "components/common/inputs/InputCounter";

import TourSchedule from "./components/TourSchedule";
import _ from "lodash";
import { TabContext, TabList } from "@material-ui/lab";
import GoogleMapReact from "google-map-react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import moment from "moment";
import Geocode from "react-geocode";
import PopupDetailTour from "./components/PopupDetailTour";
import { setConfirmBookTourReducer } from "redux/reducers/Normal/actionTypes";
import { useRouter } from "next/router";
import { OptionItem } from "models/general";
import { useDispatch } from "react-redux";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useTranslation } from "react-i18next";
const AnyReactComponent = ({ text, lat, lng }) => <div>{text}</div>;
export interface FormBookData {
  startDate: Date;
  numberOfAdult?: number;
  numberOfChild?: number;
}

interface PriceAndAge {
  tourOnSaleId: number;
  childrenAgeMin: number;
  childrenAgeMax: number;
  priceChildren: number;
  adultPrice: number;
  discount: number;
  quantity: number;
  quantityOrdered: number;
}
interface Props {
  tour: Tour;
  tourSchedule?: any[];
  isLoading: boolean;
}

const languageOptions = [
  { id: 1, name: "English", value: "English" },
  { id: 2, name: "VietNamese", value: "VietNamese" },
];

// eslint-disable-next-line react/display-name
const SectionTour = memo(({ tour, tourSchedule, isLoading }: Props) => {
  const { user } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation("common");

  Geocode.setApiKey("AIzaSyAcGL6oQZ3hqBsLQ8h-vLQc6cy7vLzrQmA");

  const daySchedule = useMemo(() => {
    return _.chain(tourSchedule)
      .groupBy((item) => item?.day)
      .map((value) => ({ day: value[0].day, schedule: value }))
      .value();
  }, [tourSchedule]);

  const dayValid = useMemo(() => {
    return tour?.tourOnSales?.map((item) => {
      return moment(item.startDate).format("DD/MM/YYYY");
    });
  }, [tour]);

  const yesterday = moment().subtract(1, "day");

  const [openPopupModalImages, setOpenPopupModalImages] = useState(false);
  const [openPopupDetailTour, setOpenPopupDetailTour] = useState(false);
  const [tab, setTab] = React.useState("1");
  const [coords, setCoords] = useState(null);
  const [priceAndAge, setPriceAndAge] = useState<PriceAndAge>({
    tourOnSaleId: null,
    childrenAgeMin: null,
    childrenAgeMax: null,
    priceChildren: null,
    adultPrice: null,
    discount: null,
    quantity: null,
    quantityOrdered: null,
  });
  const [totalPrice, setTotalPrice] = useState(null);

  const schema = useMemo(() => {
    return yup.object().shape({
      numberOfAdult: yup
        .number()
        .transform((value) => (isNaN(value) ? undefined : value))
        .typeError("Number must be a number")
        .notRequired(),
      numberOfChild: yup
        .number()
        .transform((value) => (isNaN(value) ? undefined : value))
        .typeError("Number must be a number")
        .notRequired(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    control,
  } = useForm<FormBookData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      numberOfAdult: 1,
      numberOfChild: 0,
    },
  });

  const onOpenPopupModalImages = () =>
    setOpenPopupModalImages(!openPopupModalImages);

  const onOpenPopupDetailTour = () =>
    setOpenPopupDetailTour(!openPopupDetailTour);

  const handleChangeDaySchedule = (event: any, newValue: string) => {
    setTab(newValue);
  };

  const disableCustomDt = (current) => {
    return (
      dayValid?.includes(current.format("DD/MM/YYYY")) &&
      current.isAfter(yesterday)
    );
  };

  const _numberOfChild = Number(watch("numberOfChild"));
  const _numberOfAdult = Number(watch("numberOfAdult"));

  const handleChangeStartDate = (e) => {
    tour?.tourOnSales.forEach((item) => {
      if (
        moment(item.startDate).format("DD/MM/YYYY") ===
        moment(e._d).format("DD/MM/YYYY")
      ) {
        setPriceAndAge({
          tourOnSaleId: item?.id,
          childrenAgeMin: item.childrenAgeMin,
          childrenAgeMax: item.childrenAgeMax,
          priceChildren: item.childrenPrice,
          adultPrice: item.adultPrice,
          discount: item.discount,
          quantity: item.quantity,
          quantityOrdered: item.quantityOrdered,
        });
      }
    });
  };

  const _onSubmit = (data: FormBookData) => {
    dispatch(
      setConfirmBookTourReducer({
        tourId: tour?.id,
        tourOnSaleId: priceAndAge?.tourOnSaleId,
        amountAdult: data?.numberOfAdult,
        amountChildren: data?.numberOfChild,
        startDate: data?.startDate,
        totalPrice: totalPrice,
        priceAdult: priceAndAge.adultPrice,
        priceChildren: priceAndAge.priceChildren,
        discount: priceAndAge?.discount,
        owner: tour?.owner,
      })
    );
    router.push(`/book/tour/:${tour?.id}/booking`);
    // console.log(totalPrice);
  };

  useEffect(() => {
    for (var i = 0; i < tour?.tourOnSales?.length; i++) {
      if (moment(tour?.tourOnSales[i]?.startDate) > yesterday) {
        reset({
          startDate: new Date(tour?.tourOnSales[i]?.startDate),
          numberOfAdult: 1,
          numberOfChild: 0,
        });
        setPriceAndAge({
          tourOnSaleId: tour?.tourOnSales[i]?.id,
          childrenAgeMin: tour?.tourOnSales[i]?.childrenAgeMin,
          childrenAgeMax: tour?.tourOnSales[i]?.childrenAgeMax,
          priceChildren: tour?.tourOnSales[i]?.childrenPrice,
          adultPrice: tour?.tourOnSales[i]?.adultPrice,
          discount: tour?.tourOnSales[i]?.discount,
          quantity: tour?.tourOnSales[i]?.quantity,
          quantityOrdered: tour?.tourOnSales[i]?.quantityOrdered,
        });
        break;
      }
    }
  }, [tour]);

  useEffect(() => {
    setTotalPrice(
      priceAndAge?.adultPrice * _numberOfAdult +
        priceAndAge?.priceChildren * _numberOfChild
    );
  }, [priceAndAge, _numberOfAdult, _numberOfChild]);

  useEffect(() => {
    Geocode.fromAddress(
      `${tour?.moreLocation}, ${tour?.commune.name}, ${tour?.district.name}, ${tour?.city.name}`
    ).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        setCoords({ lat, lng });
      },
      (error) => {
        // console.error(error);
      }
    );
  }, [tour]);

  console.log(coords);

  return (
    <>
      <Grid
        component="form"
        className={clsx("section", classes.root)}
        onSubmit={handleSubmit(_onSubmit)}
      >
        <Container className={classes.container}>
          <Row>
            <Col>
              {isLoading ? (
                <Skeleton style={{ marginTop: "16px" }} />
              ) : (
                <h2 className={`title ${classes.nameTour}`}>
                  {tour?.title} - {tour?.city.name}
                </h2>
              )}
              <div className={classes.subProduct}>
                <div className={classes.tags}>
                  <Badge pill className={classes.badgeTags}>
                    {t("common_tour")}
                  </Badge>
                </div>
                {isLoading ? (
                  <Skeleton width={100} className={classes.locationRate} />
                ) : (
                  <div className={classes.locationRate}>
                    <FontAwesomeIcon icon={faLocationDot}></FontAwesomeIcon>
                    <p>
                      {tour?.commune.name}, {tour?.district.name},{" "}
                      {tour?.city.name}
                    </p>
                    {tour?.rate !== 0 && (
                      <Stars
                        numberOfStars={Math.floor(tour?.rate)}
                        className={classes.starRating}
                      />
                    )}
                  </div>
                )}
              </div>
              <div className={classes.subPlaceStart}>
                <div className={classes.locationStart}>
                  <p>{t("tour_detail_section_tour_place_start")}&nbsp;</p>
                  <span>{tour?.cityStart.name}</span>
                </div>
              </div>
              <Row
                className={classes.containerImg}
                onClick={onOpenPopupModalImages}
              >
                <Col
                  className={clsx(classes.wrapperImg, classes.mobileImg)}
                  md="8"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={tour?.images[0]} alt="anh" />
                </Col>
                <Col
                  className={clsx(classes.wrapperImg, classes.wrapperImg1)}
                  md="4"
                >
                  <div className={clsx(classes.rowImg, classes.mobileImg)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={tour?.images[1]} alt="anh" />
                  </div>
                  <div className={clsx(classes.rowImg, classes.moreImg)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={tour?.images[2]} alt="anh" />
                    <div className={classes.modalImg}>
                      <p> {t("common_see_all")}</p>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className={classes.content}>
            <Col xs={8} className={classes.leftContent}>
              <h2 className={classes.leftTextTitle}>
                {" "}
                {t("tour_detail_section_product_detail")}
              </h2>
              <h5 className={classes.leftTextPanel}>
                {t("tour_detail_section_highlight")}
              </h5>
              {isLoading ? (
                <Skeleton className={classes.highlightContent} />
              ) : (
                <div className={classes.highlightContent}>
                  <p dangerouslySetInnerHTML={{ __html: tour?.highlight }}></p>
                </div>
              )}
              {isLoading ? (
                <Skeleton className={classes.goodWrapper} />
              ) : (
                <div className={classes.goodWrapper}>
                  <FontAwesomeIcon icon={faFaceSmile}></FontAwesomeIcon>
                  <p>
                    <span>{t("tour_detail_section_good_for")}:</span>{" "}
                    {tour?.suitablePerson}
                  </p>
                </div>
              )}
              <div className={classes.itineraryBox}>
                <h5 className={classes.leftTextPanel}>
                  {t("tour_detail_section_tour_itinerary")}
                </h5>
                <Box sx={{ width: "100%" }}>
                  <TabContext value={tab}>
                    <Box>
                      <TabList onChange={handleChangeDaySchedule}>
                        {daySchedule?.map((item, index) => (
                          <Tab
                            key={index}
                            label={t("tour_detail_section_tour_day", {
                              day: item?.day,
                            })}
                            value={`${item?.day}`}
                          />
                        ))}
                      </TabList>
                    </Box>
                    {daySchedule?.map((item, index) => (
                      <TourSchedule
                        key={index}
                        tourSchedule={(daySchedule || [])[index]?.schedule}
                        value={`${index + 1}`}
                      />
                    ))}
                  </TabContext>
                </Box>
              </div>
              <Grid sx={{ marginBottom: "24px" }}>
                <h5 className={classes.leftTextPanel}>
                  {t("tour_detail_section_des")}
                </h5>
                {isLoading ? (
                  <Skeleton width={100} className={classes.textDescription} />
                ) : (
                  <p
                    className={classes.textDescription}
                    dangerouslySetInnerHTML={{ __html: tour?.description }}
                  ></p>
                )}
              </Grid>
              <div className={classes.mapBox}>
                <h5 className={classes.leftTextPanel}>
                  {" "}
                  {t("tour_detail_section_location")}
                </h5>
                <Grid
                  sx={{
                    padding: "18px",
                    backgroundColor: "#F6F2F2",
                    borderRadius: "10px",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                  }}
                >
                  <p className={classes.locationDetail}>
                    {tour?.moreLocation}, {tour?.commune.name},
                    {tour?.district.name}, {tour?.city.name}
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
                        text={
                          <LocationOnIcon
                            sx={{ color: "var(--danger-color)" }}
                          />
                        }
                      />
                    </GoogleMapReact>
                  </div>
                  <div className={classes.contactBox}>
                    <FontAwesomeIcon icon={faPhone}></FontAwesomeIcon>
                    <p> {t("tour_detail_section_contact")}: </p>
                    {isLoading ? (
                      <Skeleton width={100} />
                    ) : (
                      <a href={`tel: ${tour?.contact}`}>{tour?.contact}</a>
                    )}
                  </div>
                </Grid>
              </div>
              {/* <div className="mt-4">
                <h5 className={classes.leftTextPanel}>
                  {" "}
                  Additional Information
                </h5>
                <p className={classes.textDescription} dangerouslySetInnerHTML={{ __html: tour?. }}></p>
              </div> */}
            </Col>
            <Col xs={4} className={classes.rightContent}>
              <Grid className={classes.boxSelect}>
                <p>{t("tour_detail_section_when")}</p>
                <Grid sx={{ padding: "14px 0" }}>
                  <InputDatePicker
                    control={control}
                    name="startDate"
                    placeholder="Check-out"
                    closeOnSelect={true}
                    timeFormat={false}
                    className={classes.inputStartDate}
                    isValidDate={disableCustomDt}
                    inputRef={register("startDate")}
                    _onChange={(e) => handleChangeStartDate(e)}
                    errorMessage={errors.startDate?.message}
                  />
                </Grid>
                {/* <Grid className={classes.boxTime}>
                  <FontAwesomeIcon icon={faClock}></FontAwesomeIcon>
                  <p>7:30</p>
                </Grid> */}
              </Grid>
              <Grid className={classes.boxSelect}>
                <p>{t("tour_detail_section_many_ticket")}</p>
                <Grid className={classes.boxNumberTickets}>
                  <Grid>
                    <p>
                      {t("tour_detail_section_adult")} (
                      {t("tour_detail_section_age")} &gt;{" "}
                      {priceAndAge?.childrenAgeMax})
                    </p>
                    <span>{fCurrency2(priceAndAge?.adultPrice)} VND</span>
                  </Grid>
                  <Grid>
                    <Controller
                      name="numberOfAdult"
                      control={control}
                      render={({ field }) => (
                        <InputCounter
                          className={classes.inputCounter}
                          max={
                            priceAndAge?.quantity - priceAndAge.quantityOrdered
                          }
                          min={
                            priceAndAge?.quantity -
                              priceAndAge.quantityOrdered ===
                            0
                              ? 0
                              : 1
                          }
                          onChange={field.onChange}
                          value={field.value}
                          valueDisable={
                            watch("numberOfAdult") + watch("numberOfChild") >
                            priceAndAge?.quantity - priceAndAge.quantityOrdered
                          }
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid className={classes.boxNumberTickets}>
                  <Grid>
                    <p>
                      {t("tour_detail_section_child")} (
                      {t("tour_detail_section_age")}{" "}
                      {priceAndAge?.childrenAgeMin}-
                      {priceAndAge?.childrenAgeMax})
                    </p>
                    <span>{fCurrency2(priceAndAge?.priceChildren)} VND</span>
                  </Grid>
                  <Grid>
                    <Controller
                      name="numberOfChild"
                      control={control}
                      render={({ field }) => (
                        <InputCounter
                          className={classes.inputCounter}
                          max={
                            priceAndAge?.quantity - priceAndAge.quantityOrdered
                          }
                          min={0}
                          onChange={field.onChange}
                          value={field.value}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                <Grid className={classes.boxNumberTickets}>
                  <Grid>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: t("tour_detail_section_age_free", {
                          number: priceAndAge?.childrenAgeMin,
                        }),
                      }}
                    ></p>
                  </Grid>
                </Grid>
              </Grid>
              <div className={classes.priceWrapper}>
                <Grid>
                  <p
                    className={classes.discount}
                    dangerouslySetInnerHTML={{
                      __html: t("tour_detail_section_number_ticket_left", {
                        number:
                          priceAndAge?.quantity - priceAndAge.quantityOrdered,
                      }),
                    }}
                  ></p>
                </Grid>
                <Grid
                  sx={{
                    paddingTop: "10px",
                  }}
                >
                  {priceAndAge?.discount !== 0 && (
                    <p className={classes.discount}>
                      {t("tour_detail_section_discount")}:{" "}
                      <span>{priceAndAge?.discount} %</span>
                    </p>
                  )}
                </Grid>
                <Grid
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    paddingTop: "10px",
                  }}
                >
                  <p>{t("tour_detail_section_total_price")} &nbsp;</p>
                  <p className={classes.price}>
                    {fCurrency2VND(totalPrice)} VND
                  </p>
                </Grid>
              </div>
              {user ? (
                <Button
                  btnType={BtnType.Primary}
                  isDot={true}
                  className={classes.btnBookNow}
                  type="submit"
                  disabled={totalPrice === 0}
                >
                  {t("common_book_now")}
                </Button>
              ) : (
                <Link href={"/auth/login"}>
                  <a>
                    <Button
                      btnType={BtnType.Primary}
                      isDot={true}
                      className={classes.btnBookNow}
                      type="submit"
                      disabled={
                        totalPrice === 0 &&
                        priceAndAge?.quantity - priceAndAge.quantityOrdered ===
                          0
                      }
                    >
                      {t("common_book_now")}
                    </Button>
                  </a>
                </Link>
              )}
              <div className={classes.tipWrapper}>
                <div className={classes.serviceTip}>
                  <FontAwesomeIcon icon={faClock}></FontAwesomeIcon>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: t("tour_detail_section_tour_duration", {
                        day: tour?.numberOfDays,
                        night: tour?.numberOfNights,
                      }),
                    }}
                  ></p>
                </div>
                <div className={classes.serviceTip}>
                  <FontAwesomeIcon icon={faCalendar}></FontAwesomeIcon>
                  <p>{t("tour_detail_section_available")}</p>
                </div>
                <div className={classes.serviceTip}>
                  <FontAwesomeIcon icon={faBusinessTime}></FontAwesomeIcon>
                  <p>{t("tour_detail_section_service_available")}</p>
                </div>
              </div>
              <div className={classes.featureWrapper}>
                <p className={classes.featureTitle}>
                  {t("tour_detail_section_feature")}
                </p>
                <Button
                  btnType={BtnType.Outlined}
                  onClick={onOpenPopupDetailTour}
                  className={classes.btnSeeDetail}
                >
                  {t("common_terms_and_conditions")}
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </Grid>
      <PopupModalImages
        isOpen={openPopupModalImages}
        toggle={onOpenPopupModalImages}
        images={tour?.images}
      />
      <PopupDetailTour
        isOpen={openPopupDetailTour}
        toggle={onOpenPopupDetailTour}
        tour={tour}
      />
    </>
  );
});

export default SectionTour;
