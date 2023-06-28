import React, { memo } from "react";
import Link from "next/link";
// reactstrap components
import classes from "./styles.module.scss";
import Stars from "components/Stars";
import clsx from "clsx";
import { fCurrency2, fCurrency2VND } from "utils/formatNumber";
import { Badge, Grid } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesRight,
  faLocationDot,
  faSignsPost,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { ReceiptLong } from "@mui/icons-material";
import { StayType } from "models/enterprise/stay";

interface Props {
  className?: string;
  linkView: string;
  linkBook: string;
  id: number;
  src?: string;
  title: string;
  description?: string;
  businessHours?: string[];
  checkInTime?: number;
  checkOutTime?: number;
  contact?: string;
  city?: string;
  district?: string;
  commune?: string;
  price?: number;
  discount?: number;
  rate?: number;
  isTemporarilyStopWorking?: boolean;
  isDelete?: boolean;
  roomNumber?: string;
  bookDates?: string;
  isHotel?: boolean;
  numberOfReviewers?: number;
  minPrice?: number;
  maxPrice?: number;
  type?: number;
  numberOfDays?: number;
  numberOfNights?: number;
  cityStart?: string;
  convenient?: string[];
}

// eslint-disable-next-line react/display-name
const ListServices = memo(
  ({
    className,
    linkView,
    linkBook,
    id,
    src,
    title,
    description,
    businessHours,
    contact,
    price,
    discount,
    checkInTime,
    checkOutTime,
    city,
    district,
    commune,
    rate,
    isTemporarilyStopWorking,
    isDelete,
    isHotel,
    numberOfReviewers,
    minPrice,
    maxPrice,
    type,
    cityStart,
    numberOfDays,
    numberOfNights,
    convenient,
  }: Props) => {
    const { t, i18n } = useTranslation("common");

    const getRateComment = (rate: number) => {
      switch (rate) {
        case 1:
          return t("common_rate_worst");
        case 2:
          return t("common_rate_bad");
        case 3:
          return t("common_rate_normal");
        case 4:
          return t("common_rate_good");
        case 5:
          return t("common_rate_excellent");
      }
    };
    const getTypeState = (type: number) => {
      switch (type) {
        case StayType.HOTEL:
          return t("enterprise_management_section_stay_status_option_hotel");
        case StayType.HOMES_TAY:
          return t(
            "enterprise_management_section_stay_status_option_home_stay"
          );
        case StayType.RESORT:
          return t("enterprise_management_section_stay_status_option_resort");
      }
    };
    return (
      <Grid className={classes.linkView}>
        <Link href={`/${linkView}/:${id}`} className={classes.link}>
          <a>
            <Grid
              key={id}
              sx={{
                display: "flex",
                minHeight: "200px",
                minWidth: "640px",
                marginBottom: "24px",
                cursor: "pointer",
              }}
              className={clsx(
                { [classes.stopWorking]: isTemporarilyStopWorking || isDelete },
                classes.row,
                className
              )}
            >
              <Grid
                container
                sx={{
                  boxShadow: "var(--box-shadow-100)",
                  borderRadius: "10px",
                }}
                className={classes.boxGridList}
              >
                <Grid className={classes.boxImg} item xs={3}>
                  <img src={src} alt="anh"></img>
                </Grid>
                <Grid
                  sx={{
                    flex: "1",
                    padding: "14px 14px 7px 14px",
                    justifyContent: "space-between",
                    backgroundColor: "var(--white-color)",
                    boxShadow: "var(--bui-shadow-100)",
                  }}
                  item
                  xs={6}
                  className={classes.boxContent}
                >
                  <Grid className={classes.boxLocation}>
                    <FontAwesomeIcon icon={faSignsPost}></FontAwesomeIcon>
                    <div>
                      <p>
                        {commune}, {district}, {city}
                      </p>
                    </div>
                  </Grid>
                  <Grid className={classes.boxTitle}>
                    <p>{title}</p>
                  </Grid>
                  {cityStart && (
                    <Grid className={classes.boxCityStart}>
                      <p>
                        {t("tour_detail_section_tour_place_start")}:{" "}
                        <span>{cityStart}</span>
                      </p>
                    </Grid>
                  )}
                  {numberOfDays && numberOfNights && (
                    <Grid className={classes.boxCityStart}>
                      <p>
                        {t(
                          "admin_management_section_tour_bill_header_table_duration"
                        )}
                        :{" "}
                        <span>
                          {numberOfDays} {t("update_bill_section_days")}-{" "}
                          {numberOfNights} {t("update_bill_section_nights")}
                        </span>
                      </p>
                    </Grid>
                  )}
                  {rate !== 0 ? (
                    <Grid className={classes.boxRate}>
                      {isHotel ? (
                        <>
                          <Grid className={classes.badge}>
                            {getTypeState(type)}
                          </Grid>
                          <Grid className={classes.boxReview}>
                            {rate !== 0 && (
                              <Grid className={classes.boxReview}>
                                <FontAwesomeIcon
                                  icon={faLocationDot}
                                ></FontAwesomeIcon>
                                <span>
                                  {rate} {getRateComment(rate)}{" "}
                                  <span className={classes.numberOfReviews}>
                                    | {numberOfReviewers} {t("common_reviews")}
                                  </span>
                                </span>
                              </Grid>
                            )}
                          </Grid>
                        </>
                      ) : (
                        <>
                          <Grid className={classes.badge}>
                            {t("common_tour")}
                          </Grid>
                          <Grid className={classes.boxReview}>
                            {rate !== 0 && (
                              <Grid className={classes.boxReview}>
                                <FontAwesomeIcon
                                  icon={faLocationDot}
                                ></FontAwesomeIcon>
                                <span>
                                  {rate} {getRateComment(rate)}{" "}
                                  <span className={classes.numberOfReviews}>
                                    | {numberOfReviewers} {t("common_reviews")}
                                  </span>
                                </span>
                              </Grid>
                            )}
                          </Grid>
                        </>
                      )}
                    </Grid>
                  ) : (
                    <Grid className={classes.boxRate}>
                      {isHotel ? (
                        <>
                          <Grid className={classes.badge}>
                            {getTypeState(type)}
                          </Grid>
                          <Grid className={classes.boxReview}>
                            {rate !== 0 && (
                              <Grid className={classes.boxReview}>
                                <FontAwesomeIcon
                                  icon={faLocationDot}
                                ></FontAwesomeIcon>
                                <span>
                                  {rate} {getRateComment(rate)}{" "}
                                  <span className={classes.numberOfReviews}>
                                    | {numberOfReviewers} {t("common_reviews")}
                                  </span>
                                </span>
                              </Grid>
                            )}
                          </Grid>
                        </>
                      ) : (
                        <>
                          <Grid className={classes.badge}>
                            {t("common_tour")}
                          </Grid>
                          <Grid className={classes.boxReview}>
                            {rate !== 0 && (
                              <Grid className={classes.boxReview}>
                                <FontAwesomeIcon
                                  icon={faLocationDot}
                                ></FontAwesomeIcon>
                                <span>
                                  {rate} {getRateComment(rate)}{" "}
                                  <span className={classes.numberOfReviews}>
                                    | {numberOfReviewers} {t("common_reviews")}
                                  </span>
                                </span>
                              </Grid>
                            )}
                          </Grid>
                        </>
                      )}
                    </Grid>
                  )}
                  <Grid
                    sx={{ padding: "10px 0" }}
                    className={classes.boxUtility}
                  >
                    {convenient &&
                      convenient?.map((item, index) => (
                        <Badge className={classes.tag} key={index}>
                          {item}
                        </Badge>
                      ))}
                  </Grid>
                </Grid>
                <Grid item xs={3} className={classes.containerPrice} container>
                  <Grid item xs={6} className={classes.boxSave}>
                    {discount !== 0 ? (
                      <>
                        <ReceiptLong />
                        <p>
                          {t("card_list_item_save_discount", {
                            discount: discount,
                          })}{" "}
                        </p>
                      </>
                    ) : (
                      <>
                        <ReceiptLong />
                        <p>{t("card_list_item_save")}</p>
                      </>
                    )}
                  </Grid>
                  <Grid item xs={6} className={classes.wrapperPrice}>
                    <Grid className={classes.boxPrice}>
                      {discount !== 0 && discount && (
                        <span>
                          {fCurrency2((minPrice * (100 - discount)) / 100)} ~{" "}
                          {fCurrency2((maxPrice * (100 - discount)) / 100)} VND
                        </span>
                      )}
                      <p>
                        {fCurrency2(minPrice)} ~ {fCurrency2(maxPrice)} VND
                      </p>
                    </Grid>
                    <Grid className={classes.boxViewMore}>
                      <p>{t("common_view_more")}</p>
                      <FontAwesomeIcon icon={faAnglesRight}></FontAwesomeIcon>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </a>
        </Link>
      </Grid>
    );
  }
);

export default ListServices;
