import { memo, useEffect, useMemo, useState } from "react";
import "aos/dist/aos.css";
import { Grid } from "@mui/material";
import InputTextfield from "components/common/inputs/InputTextfield";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faMagnifyingGlassArrowRight,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import classes from "./styles.module.scss";
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
import { faCalendarDays } from "@fortawesome/free-regular-svg-icons";
import Button, { BtnType } from "components/common/buttons/Button";
import { useTranslation } from "react-i18next";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import InputCounter from "components/common/inputs/InputCounter";
import ChildFriendlyIcon from "@mui/icons-material/ChildFriendly";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import { useRouter } from "next/router";
import moment, { Moment } from "moment";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ErrorMessage from "components/common/texts/ErrorMessage";
interface SearchHotelForm {
  stayName?: string;
  startDate?: Date;
  endDate?: Date;
  numberOfAdult?: number;
  numberOfChild?: number;
  numberOfRoom?: number;
}
// eslint-disable-next-line react/display-name
const HotelSearch = memo(() => {
  const { t, i18n } = useTranslation("common");
  const [focus, setFocus] = useState(false);
  const [keyword, setKeyword] = useState<string>("");
  const [dateStart, setDateStart] = useState<Moment>(null);
  const [dateEnd, setDateEnd] = useState<Moment>(null);
  const [numberOfAdult, setNumberOfAdult] = useState(1);
  const [numberOfChild, setNumberOfChild] = useState(0);
  const [numberOfRoom, setNumberOfRoom] = useState(2);
  const router = useRouter();

  const schema = useMemo(() => {
    return yup.object().shape({
      stayName: yup.string().notRequired(),
      startDate: yup
        .date()
        .notRequired()
        .max(
          yup.ref("endDate"),
          t(
            "stay_detail_section_stay_check_room_empty_start_time_validate_error"
          )
        ),
      endDate: yup
        .date()
        .notRequired()
        .min(
          yup.ref("startDate"),
          t("stay_detail_section_stay_check_room_empty_end_time_validate_error")
        ),
      numberOfRoom: yup
        .number()
        .nullable()
        .notRequired()
        .positive(
          t(
            "enterprise_management_section_add_or_edit_voucher_max_discount_validate_error"
          )
        )
        .transform((_, val) => (val !== "" ? Number(val) : null)),
      numberOfChild: yup
        .number()
        .nullable()
        .notRequired()
        .positive(
          t(
            "enterprise_management_section_add_or_edit_voucher_max_discount_validate_error"
          )
        )
        .transform((_, val) => (val !== "" ? Number(val) : null)),
      numberOfAdult: yup
        .number()
        .nullable()
        .notRequired()
        .positive(
          t(
            "enterprise_management_section_add_or_edit_voucher_max_discount_validate_error"
          )
        )
        .transform((_, val) => (val !== "" ? Number(val) : null)),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFocus = () => {
    setFocus(true);
  };
  const onBlur = () => {
    setFocus(false);
  };

  const yesterday = moment().subtract(1, "day");
  const disablePastDt = (current) => {
    return current.isAfter(yesterday);
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    clearErrors,
  } = useForm<SearchHotelForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmitSearch = () => {
    router.push({
      pathname: "/listHotel",
      search: `?keyword=${keyword || ""}&dateStart=${
        dateStart?.format("YYYY-MM-DD") || ""
      }&dateEnd=${dateEnd?.format("YYYY-MM-DD") || ""}&numberOfAdult=${
        numberOfAdult || ""
      }&numberOfChild=${numberOfChild || ""}&numberOfRoom=${
        numberOfRoom || ""
      }`,
    });
  };

  return (
    <>
      <Grid component="form" onSubmit={handleSubmit(onSubmitSearch)}>
        <Grid className={classes.boxItemLocation}>
          <p className={classes.titleInput}>
            {t("landing_page_section_search_stay_input_stay")}
          </p>
          <InputTextfield
            className={classes.inputSearchLocation}
            placeholder={t(
              "landing_page_section_search_stay_input_stay_placeholder"
            )}
            name="stayName"
            startAdornment={<FontAwesomeIcon icon={faLocationDot} />}
            autoComplete="off"
            value={keyword || ""}
            onChange={onSearch}
            inputRef={register("stayName")}
          />
        </Grid>
        <Grid container className={classes.boxDate}>
          <Grid container xs={12} className={classes.boxSearchDate}>
            <Grid xs={3} item className={classes.boxItem}>
              <p className={classes.titleInput}>
                {t("landing_page_section_search_stay_input_start_time")}
              </p>
              <InputDatePicker
                className={classes.inputSearchDate}
                placeholder={t(
                  "landing_page_section_search_stay_input_start_time_placeholder"
                )}
                name="startDate"
                dateFormat="DD/MM/YYYY"
                timeFormat={false}
                isValidDate={disablePastDt}
                closeOnSelect
                value={dateStart ? dateStart : ""}
                initialValue={dateStart ? dateStart : ""}
                _onChange={(e) => {
                  setDateStart(moment(e?._d));
                }}
                control={control}
                errorMessage={errors.startDate?.message}
              />
            </Grid>
            <Grid xs={3} item className={classes.boxItem}>
              <p className={classes.titleInput}>
                {t("landing_page_section_search_stay_input_end_time")}
              </p>
              <InputDatePicker
                className={classes.inputSearchDate}
                placeholder={t(
                  "landing_page_section_search_stay_input_end_time_placeholder"
                )}
                name="endDate"
                dateFormat="DD/MM/YYYY"
                timeFormat={false}
                isValidDate={disablePastDt}
                closeOnSelect
                value={dateEnd ? dateEnd : ""}
                initialValue={dateEnd ? dateEnd : ""}
                _onChange={(e) => {
                  setDateEnd(moment(e?._d));
                }}
                control={control}
                errorMessage={errors.endDate?.message}
              />
            </Grid>
            <Grid
              className={clsx(classes.boxItem, classes.boxGuest)}
              item
              xs={6}
            >
              <p className={classes.titleInput}>
                {t("landing_page_section_search_stay_input_guest_title")}
              </p>
              <InputTextfield
                className={classes.inputSearchLocation}
                placeholder="Guest and Room"
                name="people"
                startAdornment={<FamilyRestroomIcon />}
                onFocus={onFocus}
                value={`${numberOfAdult} ${t(
                  "landing_page_section_search_stay_input_adult_placeholder"
                )}, ${numberOfChild} ${t(
                  "landing_page_section_search_stay_input_child_placeholder"
                )}, ${numberOfRoom} ${t(
                  "landing_page_section_search_stay_input_room_placeholder"
                )},
                `}
              />
              {focus && (
                <Grid className={classes.containerChooseGuest}>
                  <Grid container sx={{ width: "100%" }}>
                    <Grid
                      item
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "7px",
                      }}
                      xs={12}
                    >
                      <Grid className={classes.boxTitleCounter}>
                        <PeopleAltIcon />
                        <p>
                          {t(
                            "landing_page_section_search_stay_input_adult_placeholder"
                          )}
                        </p>
                      </Grid>

                      <InputCounter
                        className={classes.inputCounter}
                        max={9999}
                        min={1}
                        onChange={(e) => setNumberOfAdult(e)}
                        value={numberOfAdult}
                      />
                    </Grid>
                    <Grid
                      item
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "7px",
                      }}
                      xs={12}
                    >
                      <Grid className={classes.boxTitleCounter}>
                        <ChildFriendlyIcon />
                        <p>
                          {t(
                            "landing_page_section_search_stay_input_child_placeholder"
                          )}
                        </p>
                      </Grid>

                      <InputCounter
                        className={classes.counter}
                        max={9999}
                        min={1}
                        onChange={(e) => setNumberOfChild(e)}
                        value={numberOfChild}
                      />
                    </Grid>
                    <Grid
                      item
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "7px",
                      }}
                      xs={12}
                    >
                      <Grid className={classes.boxTitleCounter}>
                        <MeetingRoomIcon />
                        <p>
                          {t(
                            "landing_page_section_search_stay_input_room_placeholder"
                          )}
                        </p>
                      </Grid>
                      <Grid>
                        <InputCounter
                          className={classes.inputCounter}
                          max={9999}
                          min={1}
                          onChange={(e) => setNumberOfRoom(e)}
                          value={numberOfRoom}
                        />
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                      xs={12}
                    >
                      <Button
                        btnType={BtnType.Secondary}
                        onClick={() => setFocus(!focus)}
                      >
                        {t("common_cancel")}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid className={classes.boxBtnSearch}>
          <Button
            btnType={BtnType.Secondary}
            // onClick={onSubmitSearch}
            type="submit"
            className={classes.btnSearch}
          >
            <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
            {t("common_search")}
          </Button>
        </Grid>
      </Grid>
    </>
  );
});

export default HotelSearch;
