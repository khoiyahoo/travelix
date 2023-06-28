import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  Container,
  Row,
  Col,
  CardBody,
  CardTitle,
  CardFooter,
} from "reactstrap";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import { fCurrency2, fCurrency2VND } from "utils/formatNumber";
import Link from "next/link";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Stars from "components/Stars";
import Aos from "aos";
import "aos/dist/aos.css";
import { Card, Grid, useMediaQuery, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

// eslint-disable-next-line react/display-name
const OfferComponent = memo(() => {
  const router = useRouter();
  const theme = useTheme();
  const { t, i18n } = useTranslation("common");

  const [keyword, setKeyword] = useState("");

  return (
    <>
      <Grid className={classes.root}>
        <Grid>
          <h3 className={classes.title}>
            {t("landing_page_section_offer_title_best")}
          </h3>
          <Grid container spacing={1} className={classes.containerBoxCard}>
            <Grid item xs={5} sx={{ height: "100%", paddingBottom: "8px" }}>
              <Card
                className={clsx(classes.card6)}
                onClick={() => {
                  router.push({
                    pathname: "/listTour",
                    search: `?keyword=Phu Quôc
                    `,
                  });
                }}
              >
                {t("landing_page_section_offer_title_Phu_Quoc")}
              </Card>
            </Grid>
            <Grid item xs={7} container spacing={1} sx={{ height: "100%" }}>
              <Grid xs={4} className={classes.col4} item container spacing={1}>
                <Grid xs={8} item className={classes.col4Long}>
                  <Card
                    className={clsx(classes.card4Long)}
                    onClick={() => {
                      router.push({
                        pathname: "/listTour",
                        search: `?keyword=Đa Năng
                                      `,
                      });
                    }}
                  >
                    {t("landing_page_section_offer_title_Da_Nang")}
                  </Card>
                </Grid>
                <Grid xs={4} item className={classes.col4Short}>
                  <Card
                    className={clsx(classes.card4Short)}
                    onClick={() => {
                      router.push({
                        pathname: "/listTour",
                        search: `?keyword=Nha Trang
                        `,
                      });
                    }}
                  >
                    {t("landing_page_section_offer_title_Nha_Trang")}
                  </Card>
                </Grid>
              </Grid>
              <Grid xs={4} className={classes.col4} item container spacing={1}>
                <Grid xs={6} item className={classes.col4Long}>
                  <Card
                    className={clsx(classes.card41Equal)}
                    onClick={() => {
                      router.push({
                        pathname: "/listTour",
                        search: `?keyword=Ha Long
                        `,
                      });
                    }}
                  >
                    {t("landing_page_section_offer_title_Ha_Long_Bay")}
                  </Card>
                </Grid>
                <Grid xs={6} item className={classes.col4Short}>
                  <Card
                    className={clsx(classes.card42Equal)}
                    onClick={() => {
                      router.push({
                        pathname: "/listTour",
                        search: `?keyword=Đa Lat
                        `,
                      });
                    }}
                  >
                    {t("landing_page_section_offer_title_Da_Lat")}
                  </Card>
                </Grid>
              </Grid>
              <Grid xs={4} className={classes.col4} item container spacing={1}>
                <Grid xs={4} item className={classes.col4Long}>
                  <Card
                    className={clsx(classes.card41Short)}
                    onClick={() => {
                      router.push({
                        pathname: "/listTour",
                        search: `?keyword=Sa Pa
                        `,
                      });
                    }}
                  >
                    {t("landing_page_section_offer_title_Sa_Pa")}
                  </Card>
                </Grid>
                <Grid xs={8} item className={classes.col4Short}>
                  <Card
                    className={clsx(classes.card41Long)}
                    onClick={() => {
                      router.push({
                        pathname: "/listTour",
                        search: `?keyword=Huê
                                          `,
                      });
                    }}
                  >
                    {t("landing_page_section_offer_title_Hue")}
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid sx={{ paddingTop: "64px" }}>
          <h3 className={classes.title}>
            {t("landing_page_section_offer_title_favorite")}
          </h3>
          <Grid container spacing={1} className={classes.containerBoxCard}>
            <Grid
              item
              xs={8}
              sx={{ height: "100%", paddingBottom: "8px" }}
              container
              className={classes.col8}
              spacing={1}
            >
              <Grid
                xs={6}
                item
                className={classes.col6}
                sx={{ paddingRight: "8px" }}
              >
                <Card
                  className={clsx(classes.cardPhuYen)}
                  onClick={() => {
                    router.push({
                      pathname: "/listHotel",
                      search: `?keyword=Phu Yên
                                    `,
                    });
                  }}
                >
                  <p>{t("landing_page_section_offer_title_PhuYen")}</p>{" "}
                  <span>
                    {/* 100 {t("landing_page_section_offer_title_favorite_stay")} */}
                  </span>
                </Card>
              </Grid>
              <Grid xs={6} item container className={classes.col6} spacing={1}>
                <Grid xs={6} item>
                  <Card
                    className={clsx(classes.cardDaLat)}
                    onClick={() => {
                      router.push({
                        pathname: "/listHotel",
                        search: `?keyword=Đa Lat
                                                      `,
                      });
                    }}
                  >
                    <p>{t("landing_page_section_offer_title_Da_Lat")}</p>
                    <span>
                      {/* 100 {t("landing_page_section_offer_title_favorite_stay")} */}
                    </span>
                  </Card>
                </Grid>
                <Grid xs={6} item>
                  <Card
                    className={clsx(classes.cardQuyNhon)}
                    onClick={() => {
                      router.push({
                        pathname: "/listHotel",
                        search: `?keyword=Quy Nhơn
                                                      `,
                      });
                    }}
                  >
                    <p>{t("landing_page_section_offer_title_QuyNhon")}</p>
                    <span>
                      {/* 100 {t("landing_page_section_offer_title_favorite_stay")} */}
                    </span>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              xs={4}
              sx={{ paddingBottom: "16px", paddingLeft: "0 !important" }}
            >
              <Card
                className={clsx(classes.cardVungTau)}
                onClick={() => {
                  router.push({
                    pathname: "/listHotel",
                    search: `?keyword=Vung Tau
                                                  `,
                  });
                }}
              >
                <p>{t("landing_page_section_offer_title_VungTau")}</p>
                <span>
                  {/* 100 {t("landing_page_section_offer_title_favorite_stay")} */}
                </span>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
});

export default OfferComponent;
