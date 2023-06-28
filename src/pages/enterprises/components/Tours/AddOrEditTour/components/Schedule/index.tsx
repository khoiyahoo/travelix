import React, { useMemo, memo, useEffect, useState } from "react";
import classes from "./styles.module.scss";
import "aos/dist/aos.css";
import * as yup from "yup";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ETour } from "models/enterprise";
import "react-quill/dist/quill.snow.css";
import { Grid, IconButton, OutlinedInput } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Button, { BtnType } from "components/common/buttons/Button";
import TableAddMileStone from "./components/TableAddMileStone";
import { DeleteOutlineOutlined } from "@mui/icons-material";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import _ from "lodash";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { useDispatch } from "react-redux";
import { TourScheduleService } from "services/enterprise/tourSchedule";
import PopupConfirmDelete from "components/Popup/PopupConfirmDelete";
import { useTranslation } from "react-i18next";

function containsArray(memberArray, member) {
  return memberArray.find((m) => m.day === member.day);
}
export interface ScheduleForm {
  schedule: {
    day: number;
  }[];
}

interface Props {
  value?: number;
  index?: number;
  tour?: ETour;
  lang?: string;
  handleNextStep?: () => void;
}

// eslint-disable-next-line react/display-name
const ScheduleComponent = memo((props: Props) => {
  const { value, index, tour, lang, handleNextStep } = props;
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation("common");

  const [schedule, setSchedule] = useState([]);
  const [scheduleDelete, setScheduleDelete] = useState(null);

  const dayCategory = useMemo(() => {
    return _.toArray(_.groupBy(schedule, "day"));
  }, [schedule]);

  const _dayCategoryObject = useMemo(() => {
    return _.chain(schedule)
      .groupBy((item) => item?.day)
      .map((value) => ({ day: value[0].day, schedule: value }))
      .value();
  }, [schedule]);

  const uniqueSchedule = useMemo(() => {
    return [];
  }, [schedule]);

  const schema = useMemo(() => {
    return yup.object().shape({
      schedule: yup.array(
        yup.object({
          day: yup
            .number()
            .typeError("Day is required.")
            .positive("Day must be a positive number")
            .required("Day is required."),
        })
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const {
    reset,
    formState: { errors },
    control,
  } = useForm<ScheduleForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const {
    fields: fieldsSchedule,
    append: appendSchedule,
    remove: removeSchedule,
  } = useFieldArray({
    control,
    name: "schedule",
  });

  const onAddSchedule = () => {
    appendSchedule({
      day: null,
    });
  };

  const onGetAllSchedule = () => {
    TourScheduleService.findAll({
      tourId: tour.id,
      language: lang,
    })
      .then((res) => {
        if (res?.success) {
          setSchedule(res.data);
        }
      })
      .catch((err) => setErrorMess(err))
      .finally(() => dispatch(setLoading(false)));
  };

  const onDeleteSchedule = (schedule, index) => () => {
    console.log(schedule);
    if (schedule?.id) {
      onOpenPopupConfirmDelete(index, schedule);
    } else {
      removeSchedule(index);
    }
  };

  const onOpenPopupConfirmDelete = (e, itemAction) => {
    setScheduleDelete(itemAction);
  };

  const onClosePopupConfirmDelete = () => {
    if (!scheduleDelete) return;
    setScheduleDelete(null);
  };

  const onYesDeleteSchedule = () => {
    if (!scheduleDelete) return;
    dispatch(setLoading(true));
    TourScheduleService.deleteSchedule(tour?.id, scheduleDelete?.day + 1)
      .then(() => {
        onGetAllSchedule();
        onClosePopupConfirmDelete();
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  useEffect(() => {
    onAddSchedule();
  }, [appendSchedule]);

  useEffect(() => {
    if (tour) {
      dispatch(setLoading(true));
      TourScheduleService.findAll({
        tourId: tour.id,
        language: lang,
      })
        .then((res) => {
          if (res?.success) {
            setSchedule(res.data);
          }
        })
        .catch((err) => setErrorMess(err))
        .finally(() => dispatch(setLoading(false)));
    }
  }, [tour]);

  useEffect(() => {
    const dayMax = (dayCategory[dayCategory.length - 1] || [])[0]?.day;
    for (var i = 0; i < dayMax - 1; i++) {
      if (dayCategory?.length < dayMax) {
        if ((dayCategory[i] || [])[0]?.day !== i + 1) {
          _dayCategoryObject.push({ day: i + 1, schedule: [] });
        }
      }
    }
    _dayCategoryObject.sort((a, b) => a.day - b.day);
    for (const item of _dayCategoryObject.sort((a, b) => a.day - b.day)) {
      if (!containsArray(uniqueSchedule, item)) {
        uniqueSchedule.push(item);
      }
    }
  }, [dayCategory, _dayCategoryObject, schedule]);

  useEffect(() => {
    if (tour) {
      reset({
        schedule: uniqueSchedule?.map((item, index) => ({
          day: index,
        })),
      });
    }
  }, [schedule, handleNextStep]);

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Grid className={classes.root}>
          <h3 className={classes.title}>
            {t(
              "enterprise_management_section_tour_tab_schedule_day_title_setup"
            )}
          </h3>
          {!!fieldsSchedule?.length &&
            fieldsSchedule?.map((field, index) => (
              <Grid key={index}>
                <Grid sx={{ display: "flex", alignItems: "center" }}>
                  <Grid className={classes.boxDateTitle}>
                    <p>
                      {t(
                        "enterprise_management_section_tour_tab_schedule_day_title"
                      )}{" "}
                      {index + 1}
                    </p>
                  </Grid>
                  <IconButton
                    onClick={onDeleteSchedule(field, index)}
                    disabled={
                      !(uniqueSchedule || [])[index]?.schedule?.length
                        ? true
                        : false
                    }
                  >
                    <DeleteOutlineOutlined
                      sx={{ marginRight: "0.25rem" }}
                      className={classes.iconDelete}
                      color={
                        !(uniqueSchedule || [])[index]?.schedule?.length
                          ? "disabled"
                          : "error"
                      }
                      fontSize="small"
                    />
                  </IconButton>
                </Grid>
                <Grid sx={{ paddingTop: "16px" }}>
                  <TableAddMileStone
                    day={index + 1}
                    tour={tour}
                    lang={lang}
                    scheduleEdit={(uniqueSchedule || [])[index]?.schedule}
                    onGetAllSchedule={onGetAllSchedule}
                  />
                </Grid>
              </Grid>
            ))}
          <Grid className={classes.boxAddDay}>
            <Button btnType={BtnType.Outlined} onClick={onAddSchedule}>
              <AddCircleIcon />{" "}
              {t("enterprise_management_section_tour_tab_schedule_add")}
            </Button>
          </Grid>
          <Grid className={classes.boxNextBtn}>
            <Button btnType={BtnType.Primary} onClick={handleNextStep}>
              {t("enterprise_management_section_tour_tab_schedule_next_range")}
              <ArrowRightAltIcon />
            </Button>
          </Grid>
          <PopupConfirmDelete
            title="Are you sure delete this schedule?"
            isOpen={!!scheduleDelete}
            onClose={onClosePopupConfirmDelete}
            toggle={onClosePopupConfirmDelete}
            onYes={onYesDeleteSchedule}
          />
        </Grid>
      )}
    </div>
  );
});

export default ScheduleComponent;
