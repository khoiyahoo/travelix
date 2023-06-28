/* eslint-disable react/display-name */
import React, { memo, useEffect, useMemo, useState } from "react";
import classes from "./styles.module.scss";
import { Row, Container, Col, Form } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import InputTextFieldBorder from "components/common/inputs/InputTextFieldBorder";
import Button, { BtnType } from "components/common/buttons/Button";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { VALIDATION } from "configs/constants";
import UseAuth from "hooks/useAuth";
import { useDispatch } from "react-redux";
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from "redux/reducers/Status/actionTypes";
import { UserService } from "services/user";
import UploadAvatar from "components/UploadAvatar";
import { ImageService } from "services/image";
import { EUserType } from "models/user";
import { useTranslation } from "react-i18next";
import InputTextfield from "components/common/inputs/InputTextfield";

interface FormUser {
  avatar?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
}
interface Props {}

const UserProfile = memo((props: Props) => {
  const { t, i18n } = useTranslation("common");
  const { user } = UseAuth();
  const dispatch = useDispatch();

  const schema = useMemo(() => {
    return yup.object().shape({
      firstName: yup
        .string()
        .required(t("profile_detail_user_profile_first_name_validation")),
      lastName: yup
        .string()
        .required(t("profile_detail_user_profile_last_name_validation")),
      email: yup
        .string()
        .email(t("profile_detail_user_profile_email_validation"))
        .required(t("profile_detail_user_profile_email_validation_error")),
      phoneNumber: yup
        .string()
        .required()
        .matches(VALIDATION.phone, {
          message: t("profile_detail_user_profile_phone_validation"),
          excludeEmptyString: true,
        }),
      address: yup.string().nullable().notRequired(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<FormUser>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const _onSubmit = async (data: FormUser) => {
    dispatch(setLoading(true));
    const formData: any = new FormData();
    formData.append("file", data.avatar);
    formData.append("tags", "codeinfuse, medium, gist");
    formData.append("upload_preset", "my-uploads");
    formData.append("api_key", "859398113752799");
    formData.append("timestamp", Date.now() / 1000 / 0);
    console.log(formData);
    ImageService.uploadImage(formData)
      .then((res) => {
        console.log(res);
        if (user) {
          UserService.updateUserProfile(user.id, {
            avatar: res,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address || "",
            phoneNumber: data.phoneNumber,
          })
            .then(() => {
              dispatch(setSuccessMess(t("common_update_success")));
            })
            .catch((err) => dispatch(setErrorMess(err)))
            .finally(() => dispatch(setLoading(false)));
        }
      })
      .catch((e) => {
        dispatch(setErrorMess(e));
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  useEffect(() => {
    if (user) {
      UserService.getUserProfile(user?.id)
        .then((res) => {
          reset({
            avatar: res.avatar,
            firstName: res.firstName,
            lastName: res.lastName,
            email: res.email,
            phoneNumber: res.phoneNumber,
            address: res.address || "",
          });
        })
        .catch((err) => dispatch(setErrorMess(err)))
        .finally(() => dispatch(setLoading(false)));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, dispatch]);

  return (
    <>
      <Row className={classes.personalInfor}>
        <div className={classes.photoContainer}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <Controller
            name="avatar"
            control={control}
            render={({ field }) => (
              <UploadAvatar
                file={field.value}
                errorMessage={errors.avatar?.message}
                onChange={(value) => field.onChange(value)}
                className={classes.avatar}
              />
            )}
          />
          <div className={classes.uploadImage}>
            <FontAwesomeIcon icon={faCamera} />
          </div>
        </div>
        <div className={classes.information}>
          <h4>
            {user?.firstName} {user?.lastName}
          </h4>
        </div>
      </Row>
      <Container className={`px-lg-5 ${classes.containerForm}`}>
        <Form role="form" onSubmit={handleSubmit(_onSubmit)}>
          <Row xs={2} className={classes.nameWrapper}>
            <Col>
              <InputTextfield
                className="mb-4"
                title={t("profile_detail_user_profile_first_name")}
                name="firstName"
                placeholder={t("profile_detail_user_profile_first_name")}
                type="text"
                inputRef={register("firstName")}
                errorMessage={errors.firstName?.message}
              />
            </Col>
            <Col>
              <InputTextfield
                className="mb-4"
                title={t("profile_detail_user_profile_last_name")}
                name="lastName"
                placeholder={t("profile_detail_user_profile_last_name")}
                type="text"
                inputRef={register("lastName")}
                errorMessage={errors.lastName?.message}
              />
            </Col>
          </Row>
          <InputTextfield
            className="mb-4"
            title={t("profile_detail_user_profile_email")}
            name="email"
            placeholder={t("profile_detail_user_profile_email")}
            type="text"
            inputRef={register("email")}
            errorMessage={errors.email?.message}
            disabled
          />
          <InputTextfield
            className="mb-4"
            title={t("profile_detail_user_profile_phone")}
            name="phone"
            placeholder={t("profile_detail_user_profile_phone")}
            type="text"
            inputRef={register("phoneNumber")}
            errorMessage={errors.phoneNumber?.message}
          />
          <InputTextfield
            className="mb-4"
            title={t("profile_detail_user_profile_address")}
            name="address"
            optional
            placeholder={t("profile_detail_user_profile_address")}
            type="text"
            inputRef={register("address")}
            errorMessage={errors.address?.message}
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
