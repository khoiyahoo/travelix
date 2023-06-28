import React, { useMemo, memo, useState, useEffect } from "react";
import { Row, Col, Input } from "reactstrap";
import classes from "./styles.module.scss";
import "aos/dist/aos.css";
import Button, { BtnType } from "components/common/buttons/Button";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from "redux/reducers/Status/actionTypes";
import { OptionItem } from "models/general";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import ErrorMessage from "components/common/texts/ErrorMessage";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { Grid } from "@mui/material";
import InputTextfield from "components/common/inputs/InputTextfield";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import { useTranslation } from "react-i18next";
import { Stay, StayType } from "models/enterprise/stay";
import moment from "moment";
import InputCreatableSelect from "components/common/inputs/InputCreatableSelect";
import { ReducerType } from "redux/reducers";
import { RoomService } from "services/enterprise/room";
import { Room } from "models/enterprise/room";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import InputDatePicker from "components/common/inputs/InputDatePicker";

const ReactQuill = dynamic(async () => await import("react-quill"), {
  ssr: false,
});
const modules = {
  toolbar: [
    [{ size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["link", "image"],
    ["clean"],
    [{ color: [] }, { background: [] }],
  ],
};

export interface RoomForm {
  date: Date;
  amount: number;
}

interface Props {
  stay?: Stay;
  lang?: string;
  room?: Room;
  onChangeTab?: (isFetchData: boolean) => void;
  handleNextStep?: () => void;
}

// eslint-disable-next-line react/display-name
const AddOrEditRoom = memo((props: Props) => {
  const { stay, lang, room, onChangeTab, handleNextStep } = props;
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation("common");

  const schema = useMemo(() => {
    return yup.object().shape({
      amount: yup
        .number()
        .typeError(t("common_validate_field"))
        .positive(t("common_validate_field"))
        .required(t("common_validate_field")),
      date: yup.date().required(t("common_validate_field")),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<RoomForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const clearForm = () => {
    reset({
      date: null,
      amount: null,
    });
  };

  const _onSubmit = (data: RoomForm) => {
    dispatch(setLoading(true));
    RoomService.createOrUpdateCheckRoom({
      stayId: stay?.id,
      roomId: room?.id,
      date: data?.date,
      amount: data?.amount,
    })
      .then(() => {
        dispatch(setSuccessMess(t("common_update_success")));
      })
      .catch((e) => {
        dispatch(setErrorMess(e));
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  useEffect(() => {
    if (!room) {
      clearForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  return (
    <Grid component="form" onSubmit={handleSubmit(_onSubmit)}>
      <Grid className={classes.root}>
        <h3>
          {t(
            "enterprise_management_section_stay_header_table_room_other_price_title_update_room"
          )}
        </h3>
        <Grid>
          <Grid
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
            container
          >
            <Grid xs={2} sm={4} md={4} item>
              <InputDatePicker
                name={`date`}
                control={control}
                label={t(
                  "enterprise_management_section_tour_tab_range_price_date_title"
                )}
                placeholder={t(
                  "enterprise_management_section_tour_tab_range_price_date_title"
                )}
                closeOnSelect={true}
                timeFormat={false}
                errorMessage={errors.date?.message}
              />
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
              <InputTextfield
                title={t(
                  "enterprise_management_section_tour_bill_header_table_amount"
                )}
                placeholder={t(
                  "enterprise_management_section_tour_bill_header_table_amount"
                )}
                autoComplete="off"
                type="number"
                inputRef={register(`amount`)}
                errorMessage={errors.amount?.message}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid className={classes.boxNextBtn}>
          <Button btnType={BtnType.Primary} type="submit">
            {t("common_save")}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
});

export default AddOrEditRoom;
