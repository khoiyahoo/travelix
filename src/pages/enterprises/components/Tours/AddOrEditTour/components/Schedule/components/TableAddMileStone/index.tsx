import React, { useMemo, memo, useEffect, useState } from "react";
import classes from "./styles.module.scss";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";

import InputTimePicker from "components/common/inputs/InputTimePicker";
import Button, { BtnType } from "components/common/buttons/Button";
import TableHeader from "components/Table/TableHeader";
import { TableHeaderLabel } from "models/general";
import { AddCircle, DeleteOutlineOutlined } from "@mui/icons-material";

import moment from "moment";
import yup from "configs/yup.custom";
import { useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from "redux/reducers/Status/actionTypes";
import { useDispatch } from "react-redux";
import { ETour, ScheduleItem } from "models/enterprise";
import InputTextfield from "components/common/inputs/InputTextfield";
import PopupConfirmDelete from "components/Popup/PopupConfirmDelete";
import { TourScheduleService } from "services/enterprise/tourSchedule";
import { useTranslation } from "react-i18next";

const tableHeaders: TableHeaderLabel[] = [
  { name: "From", label: "From", sortable: false },
  { name: "To", label: "To", sortable: false },
  { name: "Content", label: "Content", sortable: false },
  { name: "Action", label: "Action", sortable: false },
];

export interface MileStoneForm {
  schedule: {
    id?: number;
    startTime: Date;
    endTime: Date;
    description: string;
  }[];
}

interface Props {
  day: number;
  scheduleEdit?: ScheduleItem[];
  tour?: ETour;
  lang?: string;
  onGetAllSchedule?: () => void;
}

// eslint-disable-next-line react/display-name
const PopupAddMileStone = memo((props: Props) => {
  const { day, tour, scheduleEdit, lang, onGetAllSchedule } = props;
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation("common");

  const tableHeaders: TableHeaderLabel[] = [
    {
      name: "From",
      label: t(
        "enterprise_management_section_tour_tab_schedule_header_table_from"
      ),
      sortable: false,
    },
    {
      name: "To",
      label: t(
        "enterprise_management_section_tour_tab_schedule_header_table_to"
      ),
      sortable: false,
    },
    {
      name: "Content",
      label: t(
        "enterprise_management_section_tour_tab_schedule_header_table_content"
      ),
      sortable: false,
    },
    {
      name: "Action",
      label: t(
        "enterprise_management_section_tour_tab_schedule_header_table_action"
      ),
      sortable: false,
    },
  ];

  const { tourInformation } = useSelector(
    (state: ReducerType) => state.enterprise
  );

  const [scheduleItemDelete, setScheduleItemDelete] = useState(null);

  const schema = useMemo(() => {
    const min = moment().startOf("day").toDate();
    return yup.object().shape({
      schedule: yup.array(
        yup.object({
          id: yup.number().empty().notRequired(),
          startTime: yup
            .date()
            .typeError(
              t(
                "enterprise_management_section_tour_tab_schedule_start_time_validate"
              )
            )
            .startTime({
              lessThan: function (params: any) {
                return t(
                  "enterprise_management_section_tour_tab_schedule_start_time_less_than"
                );
              },
              between: function (params: any) {
                return t(
                  "enterprise_management_section_tour_tab_schedule_start_time_between",
                  { greaterThan: params.greaterThan }
                );
              },
            })
            .min(
              min,
              t(
                "enterprise_management_section_tour_tab_schedule_start_time_min",
                { min: min }
              )
            )
            .required(
              t(
                "enterprise_management_section_tour_tab_schedule_start_time_validate"
              )
            ),
          endTime: yup
            .date()
            .typeError(
              t(
                "enterprise_management_section_tour_tab_schedule_end_time_validate"
              )
            )
            // .max(yup.ref("startTime"), `End time must be greater than ${startTime}`)
            .endTime({
              moreThan: function (params: any) {
                return t(
                  "enterprise_management_section_tour_tab_schedule_end_time_more_than"
                );
              },
              between: function (params: any) {
                return t(
                  "enterprise_management_section_tour_tab_schedule_end_time_between",
                  { lessThan: params.lessThan }
                );
              },
            })
            .required(
              t(
                "enterprise_management_section_tour_tab_schedule_end_time_validate"
              )
            ),
          description: yup
            .string()
            .required(t("enterprise_management_section_tour_tab_schedule_des")),
        })
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    control,
  } = useForm<MileStoneForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const {
    fields: fieldsMileStone,
    append: appendMileStone,
    remove: removeMileStone,
  } = useFieldArray({
    control,
    name: "schedule",
    keyName: "fieldID",
  });

  const onAddMileStone = () => {
    appendMileStone({
      startTime: null,
      endTime: null,
      description: "",
    });
  };

  const onDeleteMileStone = (scheduleItem, index: number) => () => {
    if (scheduleItem?.id) {
      onOpenPopupConfirmDeleteScheduleItem(index, scheduleItem);
    } else {
      removeMileStone(index);
    }
  };

  const onOpenPopupConfirmDeleteScheduleItem = (e, itemAction) => {
    setScheduleItemDelete(itemAction);
  };

  const onClosePopupConfirmDeleteScheduleItem = () => {
    if (!scheduleItemDelete) return;
    setScheduleItemDelete(null);
  };

  const onYesDeleteScheduleItem = () => {
    if (!scheduleItemDelete) return;
    onClosePopupConfirmDeleteScheduleItem();
    dispatch(setLoading(true));
    TourScheduleService.deleteScheduleItem(scheduleItemDelete?.id)
      .then(() => {
        onGetAllSchedule();
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  const _onSubmit = (data: MileStoneForm) => {
    if (tourInformation || tour) {
      dispatch(setLoading(true));
      TourScheduleService.createOrUpdateScheduleTour({
        tourId: tourInformation?.id ? tourInformation?.id : tour?.id,
        day: day,
        language: lang,
        schedule: data.schedule.map((item) => ({
          id: item?.id,
          description: item.description,
          startTime: moment(item.startTime).diff(
            moment().startOf("day"),
            "seconds"
          ),
          endTime: moment(item.endTime).diff(
            moment().startOf("day"),
            "seconds"
          ),
        })),
      })
        .then(() => {
          dispatch(setSuccessMess(t("common_create_success")));
          onGetAllSchedule();
        })
        .catch((e) => {
          // dispatch(setErrorMess(e));
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    }
  };

  useEffect(() => {
    if (!scheduleEdit) {
      onAddMileStone();
    }
  }, [appendMileStone]);

  useEffect(() => {
    if (scheduleEdit) {
      reset({
        schedule: scheduleEdit?.map((item) => ({
          id: item?.id,
          startTime: moment()
            .startOf("day")
            .add(item?.startTime, "seconds")
            .toDate(),
          endTime: moment()
            .startOf("day")
            .add(item?.endTime, "seconds")
            .toDate(),
          description: item?.description,
        })),
      });
    }
  }, [scheduleEdit]);

  return (
    <Grid component="form" onSubmit={handleSubmit(_onSubmit)}>
      <Table className={classes.table}>
        <TableHeader headers={tableHeaders}></TableHeader>
        <TableBody>
          {!!fieldsMileStone?.length &&
            fieldsMileStone?.map((field, index) => (
              <TableRow key={index} className={classes.tableRow}>
                <TableCell
                  scope="row"
                  className={classes.tableCell}
                  sx={{ width: "250px" }}
                >
                  <Controller
                    name={`schedule.${index}.startTime`}
                    control={control}
                    render={({ field }) => (
                      <InputTimePicker
                        value={field.value as any}
                        onChange={field.onChange}
                        inputRef={register(`schedule.${index}.startTime`)}
                        errorMessage={
                          errors.schedule?.[index]?.startTime?.message
                        }
                      />
                    )}
                  />
                </TableCell>
                <TableCell
                  scope="row"
                  className={classes.tableCell}
                  sx={{ width: "250px" }}
                >
                  <Controller
                    name={`schedule.${index}.endTime`}
                    control={control}
                    render={({ field }) => (
                      <InputTimePicker
                        value={field.value as any}
                        onChange={field.onChange}
                        inputRef={register(`schedule.${index}.endTime`)}
                        errorMessage={
                          errors.schedule?.[index]?.endTime?.message
                        }
                      />
                    )}
                  />
                </TableCell>
                <TableCell scope="row" className={classes.tableCell}>
                  <InputTextfield
                    placeholder="Ex: Wake up"
                    inputRef={register(`schedule.${index}.description`)}
                    errorMessage={
                      errors.schedule?.[index]?.description?.message
                    }
                  />
                </TableCell>
                <TableCell
                  className="text-center"
                  component="th"
                  sx={{ width: "135px" }}
                >
                  <IconButton onClick={onDeleteMileStone(field, index)}>
                    <DeleteOutlineOutlined
                      sx={{ marginRight: "0.25rem" }}
                      className={classes.iconDelete}
                      fontSize="small"
                      color={"error"}
                    />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          <TableRow
            onClick={onAddMileStone}
            className="action-row"
            sx={{ cursor: "pointer" }}
          >
            <TableCell
              colSpan={4}
              variant="footer"
              align="center"
              scope="row"
              className={classes.boxAddRow}
            >
              <AddCircle sx={{ fontSize: "16px !important" }} />{" "}
              {t(
                "enterprise_management_section_tour_tab_schedule_add_milestone"
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Grid className={classes.btnControl}>
        <Button btnType={BtnType.Primary} type="submit">
          {t("common_save")}
        </Button>
      </Grid>
      <PopupConfirmDelete
        title={t(
          "enterprise_management_section_tour_tab_schedule_confirm_delete"
        )}
        isOpen={!!scheduleItemDelete}
        onClose={onClosePopupConfirmDeleteScheduleItem}
        toggle={onClosePopupConfirmDeleteScheduleItem}
        onYes={onYesDeleteScheduleItem}
      />
    </Grid>
  );
});

export default PopupAddMileStone;
