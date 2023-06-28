/* eslint-disable react/display-name */
import React, { memo, useMemo, useState } from "react";
import classes from "./styles.module.scss";
import { Row, Container, Col, Form } from "reactstrap";
import { images } from "configs/images";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import InputTextFieldBorder from "components/common/inputs/InputTextFieldBorder";
import Button, { BtnType } from "components/common/buttons/Button";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { VALIDATION } from "configs/constants";
import { Divider } from "components/common/Divider";
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from "redux/reducers/Status/actionTypes";
import { UserService } from "services/user";
import { useDispatch } from "react-redux";
import UseAuth from "hooks/useAuth";
import { useTranslation } from "react-i18next";
import InputTextfield from "components/common/inputs/InputTextfield";

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
interface Props {}

const UserProfile = memo((props: Props) => {
  const dispatch = useDispatch();
  const { user } = UseAuth();
  const { t, i18n } = useTranslation("common");

  const [isEmptyPassword, setIsEmptyPassword] = useState(false);

  const schema = useMemo(() => {
    return yup.object().shape({
      currentPassword: isEmptyPassword
        ? yup.string()
        : yup
            .string()
            .required(t("profile_detail_user_profile_current_validation")),
      newPassword: yup
        .string()
        .matches(VALIDATION.password, {
          message: t("profile_detail_user_profile_new_validation_error"),
          excludeEmptyString: true,
        })
        .notOneOf(
          [yup.ref("currentPassword")],
          t("profile_detail_user_profile_new_validation_diff")
        )
        .required(t("profile_detail_user_profile_new_validation")),
      confirmPassword: yup
        .string()
        .oneOf(
          [yup.ref("newPassword")],
          t("profile_detail_user_profile_confirm_validation_error")
        )
        .required(t("profile_detail_user_profile_confirm_validation")),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEmptyPassword, i18n.language]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const _onSubmit = (data: FormData) => {
    dispatch(setLoading(true));
    if (user) {
      UserService.changePassword({
        userId: user.id,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      })
        .then((res) => {
          dispatch(setSuccessMess(t("common_update_success")));
          if (isEmptyPassword) {
            setIsEmptyPassword(false);
          }
          reset();
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)));
    }
  };
  return (
    <>
      <Container className={`px-lg-5 ${classes.containerForm}`}>
        <h3>{t("profile_detail_change_pass_title")}</h3>
        <p>{t("profile_detail_change_pass_sub_title")}</p>
        {isEmptyPassword && (
          <p>{t("profile_detail_change_pass_sub_title_empty")}</p>
        )}
        <Form role="form" onSubmit={handleSubmit(_onSubmit)}>
          {!isEmptyPassword && (
            <InputTextfield
              className="mb-4"
              title={t("profile_detail_change_pass_current")}
              name="currentPassword"
              placeholder={t("profile_detail_change_pass_current")}
              type="password"
              showEyes={true}
              autoComplete="off"
              inputRef={register("currentPassword")}
              errorMessage={errors.currentPassword?.message}
            />
          )}
          <InputTextfield
            className="mb-4"
            title={t("profile_detail_change_pass_new")}
            name="newPassword"
            placeholder={t("profile_detail_change_pass_new")}
            type="password"
            showEyes={true}
            autoComplete="off"
            inputRef={register("newPassword")}
            errorMessage={errors.newPassword?.message}
          />
          <InputTextfield
            className="mb-4"
            title={t("profile_detail_change_pass_confirm")}
            name="confirmPassword"
            placeholder={t("profile_detail_change_pass_confirm")}
            type="password"
            showEyes={true}
            autoComplete="off"
            inputRef={register("confirmPassword")}
            errorMessage={errors.confirmPassword?.message}
          />
          <Button
            btnType={BtnType.Primary}
            type="submit"
            className={classes.btnSave}
          >
            {t("common_save")}
          </Button>
        </Form>
      </Container>
    </>
  );
});

export default UserProfile;
