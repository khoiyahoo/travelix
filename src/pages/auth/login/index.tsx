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
import { useState, useMemo, useEffect } from "react";
import clsx from "clsx";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import classes from "./styles.module.scss";
import Button, { BtnType } from "components/common/buttons/Button";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from "redux/reducers/Status/actionTypes";
import { UserService } from "services/user";
import { EKey } from "models/general";
import { setUserLogin } from "redux/reducers/User/actionTypes";
import { ReducerType } from "redux/reducers";
import Router from "next/router";
import { EUserType } from "models/user";
import ErrorMessage from "components/common/texts/ErrorMessage";
import PopupDefault from "components/Popup/PopupDefault";
import InputTextfield from "components/common/inputs/InputTextfield";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";

interface LoginForm {
  email: string;
  password: string;
  role: number;
}

const Login: NextPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: ReducerType) => state.user);

  const [errorSubmit, setErrorSubmit] = useState(false);
  const [isNotVerified, setIsNotVerified] = useState(false);

  const { t } = useTranslation("common");

  const schema = useMemo(() => {
    return yup.object().shape({
      email: yup
        .string()
        .email(t("auth_login_email_validate_error"))
        .required(t("auth_login_email_validate")),
      password: yup.string().required(t("auth_login_password_validate")),
      role: yup.number().required(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    watch,
    getValues,
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      role: EUserType.USER,
    },
  });

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      errorSubmit && setErrorSubmit(false);
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch]);

  useEffect(() => {
    if (
      user?.role === EUserType.SUPER_ADMIN ||
      user?.role === EUserType.ADMIN
    ) {
      Router.push("/admin/users");
    }
    if (user?.role === EUserType.ENTERPRISE || user?.role === EUserType.STAFF) {
      Router.push("/enterprises/tours");
    }
    if (user?.role === EUserType.USER) {
      Router.push("/");
    }
  }, [user]);

  const _onSubmit = (data: LoginForm) => {
    dispatch(setLoading(true));
    UserService.login({
      username: data?.email,
      password: data?.password,
    })
      .then((res) => {
        localStorage.setItem(EKey.TOKEN, res.token);
        dispatch(setUserLogin(res.user));
      })
      .catch((e) => {
        if (e?.detail === "notVerified") setIsNotVerified(true);
        else setErrorSubmit(true);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  const onReSendVerifySignUp = () => {
    setIsNotVerified(false);
    const email = getValues("email");
    if (!email || errors.email) return;
    dispatch(setLoading(true));
    UserService.reSendEmailVerifySignup(email)
      .then(() => {
        dispatch(setSuccessMess(t("common_send_success")));
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };
  return (
    <div className="main-content">
      <div className={clsx("header page-header-image", classes.headerWrapper)}>
        <Container className={classes.container}>
          <div className="header-body mb-7">
            <Container className="mt--8 pb-5">
              <Row className="justify-content-center">
                <Col lg="5" md="7">
                  <Card className={clsx("shadow", classes.card)}>
                    <CardHeader>
                      <div
                        className={clsx(
                          "mt-4 text-center",
                          classes.headerLoginContainer
                        )}
                      >
                        <p>{t("auth_login")}</p>
                      </div>
                    </CardHeader>
                    <CardBody className="px-lg-5">
                      <Form role="form" onSubmit={handleSubmit(_onSubmit)}>
                        <Grid>
                          <InputTextfield
                            title={t("auth_login_email")}
                            placeholder={t("auth_login_email")}
                            type="email"
                            inputRef={register("email")}
                            errorMessage={errors.email?.message}
                          />
                        </Grid>
                        <Grid sx={{ marginTop: "16px" }}>
                          <InputTextfield
                            title={t("auth_login_password")}
                            placeholder={t("auth_login_password")}
                            type="password"
                            showEyes={true}
                            inputRef={register("password")}
                            errorMessage={errors.password?.message}
                          />
                        </Grid>
                        {errorSubmit && (
                          <div className={classes.boxError}>
                            <ErrorMessage>{t("auth_login_error")}</ErrorMessage>
                          </div>
                        )}
                        <div className={classes.btnLoginContainer}>
                          <Button btnType={BtnType.Linear} type="submit">
                            {t("auth_login_btn_login")}
                          </Button>
                        </div>
                      </Form>
                      <Row className="mt-3">
                        <Col xs="6">
                          <Link href="/auth/forgotPassword">
                            <a>
                              <span>{t("auth_login_btn_forgot_pass")}</span>
                            </a>
                          </Link>
                        </Col>
                        <Col className="text-right" xs="6">
                          <Link href="/auth/signup">
                            <a>
                              <span>{t("auth_login_btn_create_acc")}</span>
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
      </div>
      <PopupDefault
        className={classes.popupResend}
        isOpen={isNotVerified}
        title="Notifications"
        description="Your account is not be verified. Please check your email for confirmation or click here to get a confirmation email resend"
        // eslint-disable-next-line react/no-children-prop
        children={
          <>
            <Button btnType={BtnType.Linear} onClick={onReSendVerifySignUp}>
              Send verify
            </Button>
          </>
        }
      />
    </div>
  );
};

export default Login;
