import React, { memo, useEffect, useMemo, useState } from "react";
// reactstrap components
import { Container } from "reactstrap";
import classes from "./styles.module.scss";
import "aos/dist/aos.css";
import { ReducerType } from "redux/reducers";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { Collapse, Grid } from "@mui/material";
import { ReceiptLong, Person, Email, Phone } from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Button, { BtnType } from "components/common/buttons/Button";
import { fCurrency2VND } from "utils/formatNumber";
import moment from "moment";
import { PAYMENT_HOTEL_SECTION } from "models/payment";
import { TourService } from "services/normal/tour";
import { Tour } from "models/tour";
import AttractionsIcon from "@mui/icons-material/Attractions";
import _ from "lodash";
import { TourBillService } from "services/normal/tourBill";
import { useTranslation } from "react-i18next";
interface Props {
  handleChangeStep?: () => void;
}
const Review = memo(({ handleChangeStep }: Props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation("common");

  const { confirmBookTourReview } = useSelector(
    (state: ReducerType) => state.normal
  );

  const [open, setOpen] = useState(true);
  const [tour, setTour] = useState<Tour>();

  const policyType = useMemo(() => {
    return _.toArray(_.groupBy(tour?.tourPolicies, "policyType"));
  }, [tour]);

  const onSubmit = () => {
    TourBillService.create({
      tourId: confirmBookTourReview?.tourId,
      tourOnSaleId: confirmBookTourReview?.tourOnSaleId,
      amountChild: confirmBookTourReview.numberOfChild,
      amountAdult: confirmBookTourReview.numberOfAdult,
      price: confirmBookTourReview?.price,
      discount: confirmBookTourReview?.discount,
      totalBill: confirmBookTourReview?.totalBill,
      email: confirmBookTourReview?.email,
      phoneNumber: confirmBookTourReview?.phoneNumber,
      firstName: confirmBookTourReview?.firstName,
      lastName: confirmBookTourReview?.lastName,
    })
      .then((res) => {
        router.push(res?.data?.checkoutUrl);
        handleChangeStep();
      })
      .catch((err) => {
        if(err?.detail === "Not enough quantity") {
          dispatch(setErrorMess({
            detail: t("tour_not_enough_quantity")
          }));
        } else {
          dispatch(setErrorMess(err));
        }
      });
  };

  useEffect(() => {
    if (router) {
      TourService.getTour(Number(router.query.tourId.slice(1)))
        .then((res) => {
          setTour(res.data);
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

  useEffect(() => {
    if (!confirmBookTourReview) {
      router.push(`/listTour/:${tour?.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, confirmBookTourReview]);

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
                  {t("review_page_title_review")}
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
                    }}
                  >
                    <Grid item xs={3} className={classes.boxImgHotel}>
                      <img src={tour?.images[0]} alt="anh"></img>
                    </Grid>
                    <Grid item xs={9}>
                      <Grid className={classes.boxProductName}>
                        <AttractionsIcon />
                        <p>{tour?.title}</p>
                      </Grid>
                      <Grid className={classes.boxLocation}>
                        <p>
                          {tour?.moreLocation}, {tour?.commune?.name},{" "}
                          {tour?.district?.name}, {tour?.city?.name}
                        </p>
                      </Grid>
                      <Grid container spacing={2} sx={{ paddingTop: "16px" }}>
                        <Grid item xs={4} className={classes.boxInforTime}>
                          <p className={classes.textTitle}>
                            {t("review_page_section_tour_start_date")}
                          </p>
                          <p className={classes.textDate}>
                            {moment(confirmBookTourReview?.startDate).format(
                              "DD/MM/YYYY"
                            )}
                          </p>
                        </Grid>
                        <Grid item xs={4} className={classes.boxInforTime}>
                          <p className={classes.textTitle}>
                            {t("review_page_section_tour_duration")}
                          </p>
                          <p className={classes.textDate}>
                            {tour?.numberOfDays} Days - {tour?.numberOfNights}{" "}
                            Nights
                          </p>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
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
                      {t("review_page_section_cancellation_title")}
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
                      <p> {t("review_page_section_cancellation_sub_title")}</p>
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
                            "review_page_section_cancellation_tour_terms_title"
                          )}
                        </p>
                      </Grid>
                      <Grid className={classes.boxDuration}>
                        <p className={classes.titleDetail}>
                          -{" "}
                          {t(
                            "review_page_section_cancellation_tour_info_title"
                          )}
                          :{" "}
                        </p>
                        <p
                          dangerouslySetInnerHTML={{
                            __html: tour?.termsAndCondition,
                          }}
                        ></p>
                      </Grid>
                    </Grid>
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
                  >
                    <Grid>
                      {" "}
                      <p className={classes.titlePrice}>
                        {t("review_page_section_price_detail_price_you_pay")}{" "}
                        {confirmBookTourReview?.discount !== 0 && (
                          <span>
                            (
                            {t(
                              "review_page_section_price_detail_price_apply_discount"
                            )}
                            )
                          </span>
                        )}
                      </p>
                    </Grid>
                    <Grid className={classes.priceTotal}>
                      <h4 className={classes.price}>
                        {fCurrency2VND(confirmBookTourReview?.totalBill)} VND
                      </h4>
                    </Grid>
                  </Grid>
                  <Grid
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    className={classes.boxPriceDetail}
                  >
                    <p>
                      {t("review_page_section_price_detail_adult")} (
                      {confirmBookTourReview?.numberOfAdult}x)
                    </p>
                    <p>
                      {" "}
                      {fCurrency2VND(confirmBookTourReview?.priceOfAdult)} VND
                    </p>
                  </Grid>
                  {confirmBookTourReview?.numberOfChild !== 0 && (
                    <Grid
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                      className={classes.boxPriceDetail}
                    >
                      <p>
                        {t("review_page_section_price_detail_child")} (
                        {confirmBookTourReview?.numberOfChild}x)
                      </p>
                      <p>
                        {" "}
                        {fCurrency2VND(confirmBookTourReview?.priceOfChild)} VND
                      </p>
                    </Grid>
                  )}
                  <Grid
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    className={classes.boxPriceDetail}
                  >
                    <p>
                      {t("review_page_section_price_detail_price_discount")}
                    </p>
                    <p style={{ fontWeight: 600 }}>
                      {" "}
                      {fCurrency2VND(confirmBookTourReview?.discount)} VND
                    </p>
                  </Grid>
                  <Grid
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      paddingTop: "14px",
                    }}
                    className={classes.btnContinue}
                  >
                    <Button btnType={BtnType.Primary} onClick={onSubmit}>
                      {t("review_page_continue_payment")}
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
                      {confirmBookTourReview?.lastName}{" "}
                      {confirmBookTourReview?.firstName}
                    </p>
                  </Grid>
                  <Grid className={classes.boxInfoPerson}>
                    <Email />
                    <p>{confirmBookTourReview?.email}</p>
                  </Grid>
                  <Grid className={classes.boxInfoPerson}>
                    <Phone />
                    <p>+ {confirmBookTourReview?.phoneNumber}</p>
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
                      {confirmBookTourReview?.lastName}{" "}
                      {confirmBookTourReview?.firstName}
                    </p>
                  </Grid>
                  <Grid className={classes.boxInfoGuest}>
                    <p className={classes.guestTitle}>
                      {t("review_page_special_request_title")}
                    </p>
                    {confirmBookTourReview?.specialRequest ? (
                      <p>{confirmBookTourReview?.specialRequest}</p>
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
