import React, { memo, useEffect, useMemo, useState } from "react";
// reactstrap components
import { Container } from "reactstrap";
import classes from "./styles.module.scss";
import "aos/dist/aos.css";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { Collapse, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHotel } from "@fortawesome/free-solid-svg-icons";
import {
  Restaurant,
  Wifi,
  ReceiptLong,
  AccessTime,
  Receipt,
  Person,
  Email,
  Phone,
} from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Button, { BtnType } from "components/common/buttons/Button";
import { fCurrency2VND } from "utils/formatNumber";
import moment from "moment";
import { PAYMENT_HOTEL_SECTION } from "models/payment";
import { RoomBillConfirm } from "models/roomBill";
import { fDuration, fTime } from "utils/formatTime";
import { StayService } from "services/normal/stay";
import { Stay } from "models/stay";
import _ from "lodash";
import { RoomBillService } from "services/normal/roomBill";

interface Props {
  dataRoomBook?: RoomBillConfirm;
  handleChangeStep?: () => void;
}
const Review = memo(({ dataRoomBook, handleChangeStep }: Props) => {
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  const dispatch = useDispatch();

  const [stay, setStay] = useState<Stay>(null);
  const [open, setOpen] = useState(true);
  const [readMore, setReadMore] = useState(false);

  const policyType = useMemo(() => {
    return _.toArray(_.groupBy(stay?.stayPolicies, "policyType"));
  }, [stay]);

  useEffect(() => {
    if (router) {
      StayService.findOne(Number(router.query.hotelId.slice(1)))
        .then((res) => {
          setStay(res.data);
        })
        .catch((e) => {
          dispatch(setErrorMess(e));
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const calculatePriceOfRoom = (roomPrice, amount, discount) => {
    let price = 0;
    roomPrice?.forEach((item) => {
      price += item.price;
    });
    return (price * amount * (100 - discount)) / 100;
  };

  const onSubmit = () => {
    const rooms = [];
    dataRoomBook?.rooms?.forEach((room) => {
      room.prices.forEach((item) => {
        rooms.push({
          roomId: room.id,
          amount: room.amount,
          discount: room.discount,
          price: item.price,
          bookedDate: item.date,
        });
      });
    });
    RoomBillService.create({
      stayId: stay?.id,
      rooms: rooms,
      startDate: dataRoomBook.startDate,
      endDate: dataRoomBook.endDate,
      price: dataRoomBook.price,
      discount: dataRoomBook.discount,
      totalBill: dataRoomBook.totalBill,
      email: dataRoomBook.email,
      phoneNumber: dataRoomBook.phoneNumber,
      firstName: dataRoomBook.firstName,
      lastName: dataRoomBook.lastName,
    })
      .then((res) => {
        router.push(res?.data?.checkoutUrl);
        handleChangeStep();
      })
      .catch((err) => {
        dispatch(setErrorMess(err));
      });
  };

  return (
    <Grid component="form">
      <Container>
        <Grid
          container
          spacing={2}
          className={classes.rootContent}
          id={PAYMENT_HOTEL_SECTION.REVIEW}
        >
          <Grid xs={8} item className={classes.leftPanel}>
            <Grid container item spacing={2}>
              <Grid item xs={12}>
                <h4 className={classes.title}>
                  {t("review_page_title_review")}{" "}
                </h4>
                <p className={classes.subTitle}>
                  {t("review_page_sub_title_review")}
                </p>

                <Grid
                  sx={{
                    backgroundColor: "var(--white-color)",
                    padding: "24px 16px",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25);",
                    borderRadius: "10px",
                  }}
                >
                  <Grid
                    container
                    sx={{
                      paddingBottom: "16px",
                      borderBottom: "1px solid var(--gray-20)",
                    }}
                  >
                    <Grid item xs={3} className={classes.boxImgHotel}>
                      <img src={dataRoomBook?.stay?.images[0]} alt="anh"></img>
                    </Grid>
                    <Grid item xs={9}>
                      <Grid className={classes.boxProductName}>
                        <FontAwesomeIcon icon={faHotel}></FontAwesomeIcon>
                        <p>{dataRoomBook?.stay?.name}</p>
                      </Grid>
                      <Grid container spacing={2} sx={{ paddingTop: "16px" }}>
                        <Grid item xs={4} className={classes.boxInforTime}>
                          <p className={classes.textTitle}>
                            {t("book_page_booking_check_in")}
                          </p>
                          <p className={classes.textDate}>
                            {moment(dataRoomBook?.startDate).format(
                              "DD/MM/YYYY"
                            )}
                          </p>
                          <p className={classes.textTime}>
                            From {fTime(dataRoomBook?.stay?.checkInTime)}
                          </p>
                        </Grid>
                        <Grid item xs={4} className={classes.boxInforTime}>
                          <p className={classes.textTitle}>
                            {t("book_page_booking_check_out")}
                          </p>
                          <p className={classes.textDate}>
                            {moment(dataRoomBook?.endDate).format("DD/MM/YYYY")}
                          </p>
                          <p className={classes.textTime}>
                            Before {fTime(dataRoomBook?.stay?.checkOutTime)}
                          </p>
                        </Grid>
                        <Grid item xs={4} className={classes.boxInforTime}>
                          <p className={classes.textTitle}>
                            {t("book_page_booking_duration")}
                          </p>
                          <p className={classes.textDate}>
                            {fDuration(
                              dataRoomBook?.startDate,
                              dataRoomBook?.endDate
                            )}{" "}
                            {t("review_page_night")}
                          </p>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  {dataRoomBook?.rooms.map((room, index) => (
                    <Grid sx={{ paddingTop: "16px" }} key={index}>
                      <Grid className={classes.boxNameRoom}>
                        <p>{room?.title}</p>
                      </Grid>
                      <Grid container sx={{ paddingTop: "16px" }}>
                        <Grid xs={6} item>
                          <Grid className={classes.boxInfoPerson} container>
                            <Grid item xs={6}>
                              <p>{t("review_page_guest_per_room")}</p>
                            </Grid>
                            <Grid item xs={6}>
                              <span>
                                {room?.numberOfAdult}{" "}
                                {t("book_page_section_price_detail_adult")},{" "}
                                {room?.numberOfChildren}{" "}
                                {t("book_page_section_price_detail_child")}{" "}
                              </span>
                            </Grid>
                          </Grid>
                          <Grid className={classes.boxInfoPerson} container>
                            <Grid item xs={6}>
                              <p>
                                {t(
                                  "enterprise_management_section_add_or_edit_stay_tab_list_header_number_of_bed"
                                )}
                              </p>
                            </Grid>{" "}
                            <Grid>
                              <span>
                                {room?.numberOfBed}{" "}
                                {t(
                                  "enterprise_management_section_add_or_edit_stay_tab_list_body_bed"
                                )}
                              </span>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid xs={6} item>
                          <Grid container>
                            <Grid item xs={4} className={classes.boxImgRoom}>
                              <img src={room?.images[0]} alt="anh"></img>
                            </Grid>
                            <Grid item sx={{ paddingLeft: "14px" }} xs={8}>
                              <Grid className={classes.boxService}>
                                <Restaurant /> <p>Free breakfast</p>
                              </Grid>
                              <Grid className={classes.boxService}>
                                <Wifi /> <p>Free wifi</p>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid
                  sx={{
                    backgroundColor: "var(--white-color)",
                    padding: "24px 16px",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25);",
                    borderRadius: "10px",
                  }}
                >
                  <Grid
                    sx={{
                      paddingBottom: "6px",
                      borderBottom: "1px solid var(--gray-20)",
                    }}
                  >
                    <h5 className={classes.title}>
                      {t("review_page_hotel_policy")}
                    </h5>
                  </Grid>
                  <Grid
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingTop: "14px",
                      alignContent: "flex-end",
                      cursor: "pointer",
                    }}
                    onClick={() => setOpen(!open)}
                  >
                    <Grid className={classes.boxSubTitle}>
                      <ReceiptLong />
                      <p>{t("review_page_section_cancellation_sub_title")}</p>
                    </Grid>
                    <Grid>
                      {open ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </Grid>
                  </Grid>
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    <Grid className={classes.rootOverview}>
                      <Grid className={classes.boxTitle}>
                        <p>
                          {t(
                            "review_page_section_cancellation_tour_reschedule_refund_title"
                          )}
                        </p>
                      </Grid>
                      <Grid className={classes.boxDuration}>
                        <p className={classes.titleDetail}>
                          -{" "}
                          {t(
                            "review_page_section_cancellation_tour_reschedule_title"
                          )}
                          :{" "}
                        </p>
                        {policyType[0]?.length ? (
                          <ul>
                            {policyType[0]?.map((item, index) => (
                              <li
                                key={index}
                                className={classes.itemPolicy}
                                dangerouslySetInnerHTML={{
                                  __html: t(
                                    "review_page_section_cancellation_tour_reschedule_content",
                                    {
                                      dayRange: item?.dayRange,
                                      moneyRate: item?.moneyRate,
                                    }
                                  ),
                                }}
                              ></li>
                            ))}
                          </ul>
                        ) : (
                          <p>
                            {t(
                              "review_page_section_cancellation_tour_no_refund"
                            )}
                          </p>
                        )}

                        <p className={classes.titleDetail}>
                          -{" "}
                          {t(
                            "review_page_section_cancellation_tour_refund_title"
                          )}
                          :{" "}
                        </p>
                        {policyType[1]?.length ? (
                          <ul>
                            {policyType[1]?.map((item, index) => (
                              <li
                                className={classes.itemPolicy}
                                key={index}
                                dangerouslySetInnerHTML={{
                                  __html: t(
                                    "review_page_section_cancellation_tour_refund_content",
                                    {
                                      dayRange: item?.dayRange,
                                      moneyRate: item?.moneyRate,
                                    }
                                  ),
                                }}
                              ></li>
                            ))}
                          </ul>
                        ) : (
                          <p>
                            {t(
                              "review_page_section_cancellation_tour_no_refund"
                            )}
                          </p>
                        )}
                      </Grid>
                    </Grid>
                  </Collapse>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid
                  sx={{
                    backgroundColor: "var(--white-color)",
                    padding: "24px 16px",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25);",
                    borderRadius: "10px",
                  }}
                >
                  <Grid
                    sx={{
                      paddingBottom: "6px",
                      borderBottom: "1px solid var(--gray-20)",
                    }}
                  >
                    <h5 className={classes.title}>
                      {t("review_page_accom_policy")}
                    </h5>
                  </Grid>
                  <Grid>
                    <Grid className={classes.boxSubTitlePolicy}>
                      <AccessTime />
                      <Grid xs={8}>
                        <Grid sx={{ paddingBottom: "8px" }}>
                          <p>{t("review_page_check_in_out")}</p>
                        </Grid>
                        <Grid
                          sx={{
                            display: "flex",
                            justifyContent: "space-around",
                          }}
                        >
                          <Grid container>
                            <Grid item xs={6}>
                              <p className={classes.textCheck}>
                                {t("book_page_booking_check_in")}:
                              </p>
                            </Grid>
                            <Grid item xs={6}>
                              <p>
                                {t("stay_detail_section_stay_from_review")}{" "}
                                {fTime(dataRoomBook?.stay?.checkInTime)}
                              </p>
                            </Grid>
                          </Grid>
                          <Grid container>
                            <Grid item xs={6}>
                              <p className={classes.textCheck}>
                                {t("book_page_booking_check_out")}:
                              </p>
                            </Grid>
                            <Grid item xs={6}>
                              <p>
                                {t("book_page_booking_before")}{" "}
                                {fTime(dataRoomBook?.stay?.checkOutTime)}
                              </p>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid className={classes.boxSubTitlePolicy}>
                      <Receipt />
                      <Grid xs={11}>
                        <Grid sx={{ padding: "4px 0 8px 0" }}>
                          <p>{t("book_page_booking_required_doc")}</p>
                        </Grid>
                        <Collapse
                          in={readMore}
                          timeout="auto"
                          unmountOnExit
                          sx={{ fontWeight: "500 !important" }}
                        >
                          <Grid
                            sx={{
                              display: "flex",
                            }}
                          >
                            <p
                              className={classes.textContentPolicy}
                              dangerouslySetInnerHTML={{
                                __html: stay?.termsAndCondition,
                              }}
                            ></p>
                          </Grid>
                        </Collapse>
                      </Grid>
                    </Grid>
                    <Grid
                      className={classes.boxSeeMore}
                      onClick={() => setReadMore(!readMore)}
                    >
                      {readMore ? (
                        <p>{t("book_page_booking_read_all")}</p>
                      ) : (
                        <p>{t("book_page_booking_read_less")}</p>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <h4 className={classes.title}>
                  {t("review_page_section_price_detail_title")}
                </h4>
                <Grid
                  sx={{
                    backgroundColor: "var(--white-color)",
                    padding: "24px 16px",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25);",
                    borderRadius: "10px",
                  }}
                >
                  <Grid
                    className={classes.boxPrice}
                    sx={{ borderBottom: "1px solid Var(--gray-10)" }}
                    onClick={() => setOpen(!open)}
                  >
                    <Grid>
                      {" "}
                      <p className={classes.titlePrice}>
                        {t("review_page_section_price_detail_price_you_pay")}
                      </p>
                    </Grid>
                    <Grid className={classes.priceTotal}>
                      <h4 className={classes.price}>
                        {fCurrency2VND(dataRoomBook?.totalBill)} VND
                      </h4>
                      {open ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </Grid>
                  </Grid>
                  <Collapse in={open} timeout="auto" unmountOnExit>
                    <Grid className={classes.boxPriceDetail}>
                      {dataRoomBook?.rooms.map((room, index) => (
                        <Grid sx={{ padding: "0 0 14px 0" }} key={index}>
                          <Grid
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <p>{t("book_page_booking_room_name")}: </p>{" "}
                            <p>{room?.title}</p>
                          </Grid>{" "}
                          <Grid
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <p>{t("book_page_booking_price")}: </p>
                            <Grid>
                              {room?.prices.map((price, index) => (
                                <Grid key={index} className="d-flex">
                                  <p
                                    className="mr-2"
                                    style={{ minWidth: "84px" }}
                                  >
                                    {moment(price.date).format("DD/MM/YYYY")}:
                                  </p>
                                  <p>{fCurrency2VND(price?.price)} VND</p>
                                </Grid>
                              ))}
                            </Grid>
                          </Grid>
                          {room?.discount !== 0 && (
                            <Grid
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <p>{t("book_page_booking_discount")}: </p>{" "}
                              <p>{room?.discount}%</p>
                            </Grid>
                          )}
                          <Grid
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <p>Amount: </p> <p>{room?.amount}</p>
                          </Grid>
                          <Grid
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <p>Total: </p>{" "}
                            <p>
                              {fCurrency2VND(
                                calculatePriceOfRoom(
                                  room?.prices,
                                  room?.amount,
                                  room?.discount
                                )
                              )}{" "}
                              VND
                            </p>
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>
                  </Collapse>
                  <Grid
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      paddingTop: "14px",
                    }}
                    className={classes.btnContinue}
                  >
                    <Button btnType={BtnType.Primary} onClick={onSubmit}>
                      {t("book_page_booking_continue_to_pay")}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            xs={4}
            item
            sx={{ marginTop: "70px" }}
            className={classes.rightPanel}
          >
            <Grid sx={{ borderRadius: "10px" }}>
              <Grid className={classes.boxContactDetail}>
                <Grid
                  sx={{
                    padding: "16px",
                    borderBottom: "1px solid var(--gray-20)",
                  }}
                >
                  <h5 className={classes.title}>
                    {t("review_page_contact_detail")}
                  </h5>
                </Grid>
                <Grid sx={{ padding: "16px" }}>
                  <Grid className={classes.boxInfoPerson}>
                    <Person />
                    <p>
                      {dataRoomBook?.lastName} {dataRoomBook?.firstName}
                    </p>
                  </Grid>
                  <Grid className={classes.boxInfoPerson}>
                    <Email />
                    <p>{dataRoomBook?.email}</p>
                  </Grid>
                  <Grid className={classes.boxInfoPerson}>
                    <Phone />
                    <p>+ {dataRoomBook?.phoneNumber}</p>
                  </Grid>
                </Grid>
              </Grid>
              <Grid className={classes.boxContactDetail}>
                <Grid
                  sx={{
                    padding: "16px",
                    borderBottom: "1px solid var(--gray-20)",
                  }}
                >
                  <h5 className={classes.title}>
                    {t("review_page_guest_detail")}
                  </h5>
                </Grid>
                <Grid sx={{ padding: "16px" }}>
                  <Grid
                    className={classes.boxInfoGuest}
                    sx={{ paddingBottom: "14px" }}
                  >
                    <p className={classes.guestTitle}>
                      {t("review_page_guest_name")}
                    </p>
                    <p>
                      {dataRoomBook?.lastName} {dataRoomBook?.firstName}
                    </p>
                  </Grid>
                  <Grid className={classes.boxInfoGuest}>
                    <p className={classes.guestTitle}>
                      {t("review_page_special_request_title")}
                    </p>
                    {dataRoomBook?.specialRequest ? (
                      <p>{dataRoomBook?.specialRequest}</p>
                    ) : (
                      <p>-</p>
                    )}
                  </Grid>
                  <Grid className={classes.boxAdvice}>
                    <p>{t("review_page_special_request_sub_title")}</p>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Grid>
  );
});

export default Review;
