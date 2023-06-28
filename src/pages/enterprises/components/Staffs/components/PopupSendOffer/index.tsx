import React, { memo, useMemo } from "react";
import {
  Modal,
  ModalProps,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import classes from "./styles.module.scss";
import "aos/dist/aos.css";
import Button, { BtnType } from "components/common/buttons/Button";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputTextfield from "components/common/inputs/InputTextfield";
import { Grid } from "@mui/material";
import { StaffService } from "services/enterprise/staff";
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from "redux/reducers/Status/actionTypes";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
interface Props extends ModalProps {
  isOpen: boolean;
  onClose: () => void;
  toggle?: () => void;
  onYes?: () => void;
}

interface SendOfferForm {
  email: string;
}

// eslint-disable-next-line react/display-name
const PopupConfirmDeleteTour = memo((props: Props) => {
  const { isOpen, toggle, onClose, onYes } = props;
  const { t, i18n } = useTranslation("common");

  const dispatch = useDispatch();

  const schema = useMemo(() => {
    return yup.object().shape({
      email: yup
        .string()
        .email(
          t(
            "enterprise_management_section_staff_popup_send_staff_email_validate_error"
          )
        )
        .required(
          t(
            "enterprise_management_section_staff_popup_send_staff_email_validate"
          )
        ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    clearErrors,
    reset,
  } = useForm<SendOfferForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const clearForm = () => {
    reset({
      email: "",
    });
  };

  const handleClose = () => {
    onClose();
    clearForm();
  };

  const _onSubmit = (data: SendOfferForm) => {
    dispatch(setLoading(true));
    StaffService.sendOffer({ email: data?.email })
      .then(() => {
        dispatch(setSuccessMess(t("common_send_success")));
        onClose();
      })
      .catch((e) => {
        dispatch(setErrorMess(e));
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} className={classes.root}>
        <Grid component="form" onSubmit={handleSubmit(_onSubmit)}>
          <ModalHeader toggle={toggle} className={classes.title}>
            {t("enterprise_management_section_staff_popup_send_staff_title")}
          </ModalHeader>
          <ModalBody>
            <InputTextfield
              title={t(
                "enterprise_management_section_staff_popup_send_staff_email"
              )}
              placeholder={t(
                "enterprise_management_section_staff_popup_send_staff_email"
              )}
              type="email"
              inputRef={register("email")}
              errorMessage={errors.email?.message}
            />
          </ModalBody>
          <ModalFooter className={classes.footer}>
            <Button
              btnType={BtnType.Secondary}
              onClick={handleClose}
              className="mr-2"
            >
              {t("common_cancel")}
            </Button>
            <Button btnType={BtnType.Primary} type="submit">
              {t("common_send")}
            </Button>
          </ModalFooter>
        </Grid>
      </Modal>
    </>
  );
});

export default PopupConfirmDeleteTour;
