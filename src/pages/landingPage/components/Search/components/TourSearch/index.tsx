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
import { Col } from "reactstrap";
import InputDatePicker from "components/common/inputs/InputDatePicker";
import Button, { BtnType } from "components/common/buttons/Button";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { DataPagination } from "models/general";
import { NormalGetTours, Tour } from "models/tour";
import { useDispatch } from "react-redux";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { TourService } from "services/normal/tour";
import { Moment } from "moment";
import useDebounce from "hooks/useDebounce";
import { useRouter } from "next/router";
interface SearchForm {
  location?: string;
  startDate?: Date;
}
// eslint-disable-next-line react/display-name
const TourSearch = memo(() => {
  const { t, i18n } = useTranslation("common");
  const theme = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();

  const schema = useMemo(() => {
    return yup.object().shape({
      location: yup.string().notRequired(),
      startDate: yup.date().notRequired(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    clearErrors,
  } = useForm<SearchForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [keyword, setKeyword] = useState<string>("");
  const [dateStart, setDateStart] = useState<Moment>(null);

  const yesterday = moment().subtract(1, "day");
  const disablePastDt = (current) => {
    return current.isAfter(yesterday);
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const onSearchDate = (e) => {
    setDateStart(moment(e?._d));
  };

  const onSubmitSearch = () => {
    router.push({
      pathname: "/listTour",
      search: `?keyword=${keyword || ""}&dateSearch=${
        dateStart?.format("YYYY-MM-DD") || ""
      }`,
    });
  };

  return (
    <>
      <Grid component="form" onSubmit={handleSubmit(onSubmitSearch)}>
        <Grid container className={classes.root}>
          <Grid item xs={6} className={classes.boxItem}>
            <p className={classes.titleInput}>
              {t("landing_page_section_search_tour_input_location")}
            </p>
            <InputTextfield
              className={classes.inputSearch}
              placeholder={t(
                "landing_page_section_search_tour_input_location_placeholder"
              )}
              name="tour"
              startAdornment={<FontAwesomeIcon icon={faSearch} />}
              autoComplete="off"
              value={keyword || ""}
              onChange={onSearch}
              inputRef={register("location")}
            />
          </Grid>
          <Grid xs={6} item className={classes.boxItem}>
            <p className={classes.titleInput}>
              {t("landing_page_section_search_tour_input_start_time")}
            </p>
            <InputDatePicker
              className={classes.inputSearchDate}
              placeholder={t(
                "landing_page_section_search_tour_input_start_time"
              )}
              dateFormat="DD/MM/YYYY"
              timeFormat={false}
              closeOnSelect
              isValidDate={disablePastDt}
              value={dateStart ? dateStart : ""}
              initialValue={dateStart ? dateStart : ""}
              _onChange={(e) => onSearchDate(e)}
              control={control}
              name="startDate"
              errorMessage={errors.startDate?.message}
            />
          </Grid>
        </Grid>
        <Grid className={classes.boxItemButton}>
          <Button btnType={BtnType.Secondary} type="submit">
            <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
            {t("common_search")}
          </Button>
        </Grid>
        {/* {focus && (
          <Grid className={classes.recentSearchBox}>
            <Grid
              className={classes.recentSearch}
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "10px 16px",
                backgroundColor: "var(--gray-10)",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              <FontAwesomeIcon
                icon={faMagnifyingGlassArrowRight}
              ></FontAwesomeIcon>
              <div>
                <p>Vinhome</p>
                <span>Recent Searchs</span>
              </div>
            </Grid>
          </Grid>
        )} */}
      </Grid>
    </>
  );
});

export default TourSearch;
