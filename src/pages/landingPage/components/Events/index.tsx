import { memo, useEffect, useMemo, useState } from "react";
import "aos/dist/aos.css";
import { Grid } from "@mui/material";
import InputTextfield from "components/common/inputs/InputTextfield";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlassArrowRight,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import classes from "./styles.module.scss";
import { images } from "configs/images";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Stars from "components/Stars";
import Aos from "aos";
import "aos/dist/aos.css";
import { useMediaQuery, useTheme } from "@mui/material";
import { clsx } from "clsx";
import { Col, Container } from "reactstrap";
import Link from "next/link";
import Button, { BtnType } from "components/common/buttons/Button";
import { useTranslation } from "react-i18next";
import { FindAll, IEvent } from "models/event";
import { DataPagination } from "models/general";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { EventService } from "services/normal/event";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

// eslint-disable-next-line react/display-name
const TourSearch = memo(() => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const { t, i18n } = useTranslation("common");
  const [data, setData] = useState<DataPagination<IEvent>>();
  const dispatch = useDispatch();
  const router = useRouter();

  const fetchData = (value?: {
    take?: number;
    page?: number;
    keyword?: string;
  }) => {
    const params: FindAll = {
      take: value?.take || data?.meta?.take || 10,
      page: value?.page || data?.meta?.page || 1,
      keyword: "",
    };
    if (value?.keyword !== undefined) {
      params.keyword = value.keyword || undefined;
    }
    dispatch(setLoading(true));
    EventService.getAllEvents(params)
      .then((res) => {
        setData({
          data: res.data,
          meta: res.meta,
        });
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Grid className={classes.root} container spacing={2}>
        <Grid item xs={6}>
          <h3 className={classes.titleEvent}>
            {t("landing_page_section_event_title")}
          </h3>
          <p className={classes.subTitleEvent}>
            {t("landing_page_section_event_sub_title")}
          </p>
          <Link href="/listEvents">
            <Button btnType={BtnType.Primary}> {t("common_view_more")}</Button>
          </Link>
        </Grid>
        <Grid item xs={6}>
          {data?.data?.length && (
            <Swiper
              slidesPerView={isMobile ? 1 : 3}
              spaceBetween={30}
              slidesPerGroup={isMobile ? 1 : 3}
              initialSlide={0}
              loop={true}
              // onSlideChange={(e) => console.log(e.realIndex)}
              // loopFillGroupWithBlank={true}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              modules={[Pagination, Navigation]}
              className={clsx("mySwiper", classes.swiper)}
            >
              {data?.data?.map((item, index) => (
                <SwiperSlide
                  key={index}
                  className={classes.slide}
                  onClick={() => {
                    router.push(`/listEvents/:${item?.id}`);
                  }}
                >
                  <Grid>
                    <img src={item?.banner} height={90} style={{borderRadius: "10px"}} alt="anh"></img>
                  </Grid>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </Grid>
      </Grid>
    </>
  );
});

export default TourSearch;
