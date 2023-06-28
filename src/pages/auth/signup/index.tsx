import type { NextPage } from "next";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Form,
} from "reactstrap";
import { useState, useMemo } from "react";
import clsx from "clsx";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import classes from "./styles.module.scss";
import Button, { BtnType } from "components/common/buttons/Button";
import InputTextfield from "components/common/inputs/InputTextfield";
import Google from "components/SocialButton/Google";
import Link from "next/link";
import { VALIDATION } from "configs/constants";
import InputCheckbox from "components/common/inputs/InputCheckbox";
import { EUserType } from "models/user";
import { useDispatch } from "react-redux";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { UserService } from "services/user";
import PopupConfirmSucess from "components/Popup/PopupConfirmSucess";
import { Grid } from "@mui/material";
import ErrorMessage from "components/common/texts/ErrorMessage";
import PopupTermsAndConditions from "pages/enterprises/components/PopupTermsAndConditions";
import { useTranslation } from "react-i18next";

interface SignUpForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  role: number;
}

const Login: NextPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation("common");

  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [checkTerms, setCheckTerms] = useState(true);
  const [openPopupTermsAndConditions, setOpenPopupTermsAndConditions] =
    useState(false);

  const schema = useMemo(() => {
    return yup.object().shape({
      firstName: yup.string().required(t("auth_sign_up_first_name_validate")),
      lastName: yup.string().required(t("auth_sign_up_last_name_validate")),
      email: yup
        .string()
        .email(t("auth_sign_up_email_validate_error"))
        .required(t("auth_sign_up_email_validate")),
      password: yup
        .string()
        .matches(VALIDATION.password, {
          message: t("auth_sign_up_password_validate_error"),
          excludeEmptyString: true,
        })
        .required(t("auth_sign_up_password_validate")),
      confirmPassword: yup
        .string()
        .oneOf(
          [yup.ref("password")],
          t("auth_sign_up_confirm_password_validate_error")
        )
        .required(t("auth_sign_up_confirm_password_validate")),
      phoneNumber: yup
        .string()
        .required(t("auth_sign_up_phone_validate"))
        .matches(VALIDATION.phone, {
          message: t("auth_sign_up_phone_validate_error"),
          excludeEmptyString: true,
        }),
      role: yup.number().required(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
    setValue,
  } = useForm<SignUpForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      role: EUserType.USER,
    },
  });

  const onTogglePopupTermsAndConditions = () => {
    setOpenPopupTermsAndConditions(!openPopupTermsAndConditions);
  };

  const onClosePopupRegisterSuccess = () =>
    setRegisterSuccess(!registerSuccess);

  const _onSubmit = (data: SignUpForm) => {
    if (checkTerms) {
      dispatch(setLoading(true));
      UserService.register({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        phoneNumber: data.phoneNumber,
        role: data.role,
      })
        .then(() => {
          setRegisterSuccess(true);
        })
        .catch((e) => {
          dispatch(setErrorMess(e));
        })
        .finally(() => dispatch(setLoading(false)));
    }
  };
  return (
    <div className="main-content">
      <div className={clsx("header page-header-image", classes.headerWrapper)}>
        <Container className={classes.container}>
          <div className="header-body mb-7">
            <Container className="mt--8 pb-5">
              <Row className="justify-content-center">
                <Col lg="5" md="7" className={classes.containerCard}>
                  <Card className={clsx("shadow", classes.card)}>
                    <CardHeader>
                      <div
                        className={clsx(
                          "text-center mt-4",
                          classes.headerSignUpContainer
                        )}
                      >
                        <p>{t("auth_sign_up")}</p>
                      </div>
                    </CardHeader>
                    <CardBody className="px-lg-5">
                      <Grid
                        component={"form"}
                        onSubmit={handleSubmit(_onSubmit)}
                        container
                        spacing={{ xs: 2, md: 3 }}
                      >
                        <Grid
                          item
                          container
                          xs={12}
                          sx={{ display: "flex" }}
                          spacing={3}
                        >
                          <Grid xs={6} className={classes.colName} item>
                            <InputTextfield
                              title={t("auth_sign_up_fist_name")}
                              placeholder={t("auth_sign_up_fist_name")}
                              type="text"
                              inputRef={register("firstName")}
                              autoComplete="off"
                              errorMessage={errors.firstName?.message}
                            />
                          </Grid>
                          <Grid xs={6} className={classes.colName} item>
                            <InputTextfield
                              title={t("auth_sign_up_last_name")}
                              placeholder={t("auth_sign_up_last_name")}
                              type="text"
                              inputRef={register("lastName")}
                              autoComplete="off"
                              errorMessage={errors.lastName?.message}
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <InputTextfield
                            title={t("auth_sign_up_email")}
                            placeholder={t("auth_sign_up_email")}
                            type="email"
                            inputRef={register("email")}
                            autoComplete="off"
                            errorMessage={errors.email?.message}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <InputTextfield
                            title={t("auth_sign_up_password")}
                            placeholder={t("auth_sign_up_password")}
                            type="password"
                            showEyes={true}
                            inputRef={register("password")}
                            autoComplete="off"
                            errorMessage={errors.password?.message}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <InputTextfield
                            title={t("auth_sign_up_confirm_password")}
                            placeholder={t("auth_sign_up_confirm_password")}
                            type="password"
                            showEyes={true}
                            inputRef={register("confirmPassword")}
                            autoComplete="off"
                            errorMessage={errors.confirmPassword?.message}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <InputTextfield
                            title={t("auth_sign_up_phone")}
                            placeholder={t("auth_sign_up_phone")}
                            type="text"
                            inputRef={register("phoneNumber")}
                            autoComplete="off"
                            errorMessage={errors.phoneNumber?.message}
                          />
                        </Grid>
                        <Grid className={classes.boxTextRole} item>
                          <p className={classes.textYouAre}>
                            {t("auth_sign_up_you_are")}{" "}
                          </p>
                          <div className={classes.boxCheckRole}>
                            <Controller
                              name="role"
                              control={control}
                              render={({ field }) => (
                                <>
                                  <Grid sx={{ paddingRight: "14px" }}>
                                    <InputCheckbox
                                      content={t("auth_sign_up_you_are_user")}
                                      checked={field.value === EUserType.USER}
                                      onChange={() => {
                                        setValue("role", EUserType.USER);
                                      }}
                                    />
                                  </Grid>
                                  <Grid>
                                    <InputCheckbox
                                      content={t(
                                        "auth_sign_up_you_are_enterprise"
                                      )}
                                      checked={
                                        field.value === EUserType.ENTERPRISE
                                      }
                                      onChange={() => {
                                        setValue("role", EUserType.ENTERPRISE);
                                      }}
                                    />
                                  </Grid>
                                </>
                              )}
                            />
                          </div>
                        </Grid>
                        {Number(watch("role")) === EUserType.ENTERPRISE && (
                          <>
                            <Grid className={classes.boxCheckTerms}>
                              <div className={classes.boxCheckRole}>
                                <Controller
                                  name="role"
                                  control={control}
                                  render={({ field }) => (
                                    <>
                                      <Grid className={classes.boxCheckbox}>
                                        <InputCheckbox
                                          checked={checkTerms}
                                          onChange={() => {
                                            setCheckTerms(!checkTerms);
                                          }}
                                        />
                                        <p>
                                          {t(
                                            "auth_sign_up_title_yes_condition"
                                          )}
                                          <span
                                            onClick={
                                              onTogglePopupTermsAndConditions
                                            }
                                          >
                                            {t("auth_sign_up_title_condition")}
                                          </span>
                                        </p>
                                      </Grid>
                                    </>
                                  )}
                                />
                              </div>
                            </Grid>
                            {!checkTerms && (
                              <Grid className={classes.errorTerms}>
                                <ErrorMessage>
                                  {t("auth_sign_up_title_condition_error")}
                                </ErrorMessage>
                              </Grid>
                            )}
                          </>
                        )}
                        <Grid
                          className={classes.btnSignUpContainer}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            padding: "24px 0 0 24px",
                          }}
                        >
                          <Button btnType={BtnType.Linear} type="submit">
                            {t("auth_sign_up_title_btn")}
                          </Button>
                        </Grid>
                      </Grid>
                      <Row className="mt-3">
                        <Col className="text-right" xs="12">
                          <Link href="/auth/login">
                            <a>
                              <span>
                                {t("auth_sign_up_title_btn_have_acc")}
                              </span>
                            </a>
                          </Link>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>
          </div>
        </Container>
        <PopupConfirmSucess
          isOpen={registerSuccess}
          onClose={onClosePopupRegisterSuccess}
          toggle={onClosePopupRegisterSuccess}
          title={"Confirm"}
          description={t("auth_sign_up_title__popup_confirm_success")}
        />
        <PopupTermsAndConditions
          isOpen={openPopupTermsAndConditions}
          toggle={onTogglePopupTermsAndConditions}
        />
      </div>
    </div>
  );
};
export default Login;
