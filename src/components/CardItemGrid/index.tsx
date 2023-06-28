import React, { memo } from "react";
import Link from "next/link";
// reactstrap components
import { Col } from "reactstrap";
import clsx from "clsx";
import classes from "./styles.module.scss";
import Stars from "components/Stars";
import { fCurrency2 } from "utils/formatNumber";
import { Grid } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesRight,
  faLocationDot,
  faSignsPost,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

interface Props {
  className?: string;
  linkView: string;
  linkBook: string;
  id: number;
  src?: string;
  title: string;
  description: string;
  checkInTime?: string;
  checkOutTime?: string;
  contact?: string;
  city?: string;
  district?: string;
  commune?: string;
  rate?: number;
  price?: number;
  discount?: number;
  isTemporarilyStopWorking?: boolean;
  isDelete?: boolean;
  numberOfReviewers?: number;
  tourOnSale?: any;
  minPrice?: number;
  maxPrice?: number;
  numberOfDays?: number;
  numberOfNights?: number;
  cityStart?: string;
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
    contact,
    checkInTime,
    checkOutTime,
    city,
    district,
    commune,
    rate,
    price,
    discount,
    isTemporarilyStopWorking,
    isDelete,
    numberOfReviewers,
    tourOnSale,
    minPrice,
    maxPrice,
    cityStart,
    numberOfDays,
    numberOfNights,
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

    return (
      <>
        <Col
          xs={4}
          className={clsx(
            { [classes.stopWorking]: isTemporarilyStopWorking || isDelete },
            classes.cardItem,
            className
          )}
          key={id}
        >
          <Link href={`/${linkView}/:${id}`}>
            <a>
              <Grid
                sx={{
                  borderTopRightRadius: "10px",
                  borderTopLeftRadius: "10px",
                }}
              >
                <Grid className={classes.boxImg}>
                  <img src={src}></img>
                </Grid>
                <Grid
                  sx={{
                    padding: "10px 14px",
                    backgroundColor: "var(--white-color)",
                    borderBottomLeftRadius: "10px",
                    borderBottomRightRadius: "10px",
                    boxShadow: "var(--box-shadow-100)",
                    minHeight: "225px",
                    flexGrow: "1",
                  }}
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
                  <Grid className={classes.boxCityStart}>
                    <p>
                      {t("tour_detail_section_tour_place_start")}:{" "}
                      <span>{cityStart}</span>
                    </p>
                  </Grid>
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
                  <Grid
                    sx={{
                      display: "flex !important",
                      flexDirection: "column !important",
                      flex: "1",
                    }}
                  >
                    <Grid className={classes.boxReview}>
                      {rate !== 0 && (
                        <>
                          <FontAwesomeIcon
                            icon={faLocationDot}
                          ></FontAwesomeIcon>
                          <span>
                            {rate} {getRateComment(rate)}{" "}
                            <span className={classes.numberOfReviews}>
                              | {numberOfReviewers} {t("common_reviews")}
                            </span>
                          </span>
                        </>
                      )}
                    </Grid>

                    <Grid className={classes.boxPrice}>
                      <span>
                        {fCurrency2(minPrice)} ~ {fCurrency2(maxPrice)} VND
                      </span>

                      {discount !== 0 && (
                        <p>
                          {fCurrency2((minPrice * (100 - discount)) / 100)} ~{" "}
                          {fCurrency2((maxPrice * (100 - discount)) / 100)} VND
                        </p>
                      )}
                    </Grid>
                    <Grid className={classes.boxViewMore}>
                      <p>{t("common_view_more")}</p>
                      <FontAwesomeIcon icon={faAnglesRight}></FontAwesomeIcon>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </a>
          </Link>
        </Col>
      </>
    );
  }
);

export default ListServices;
