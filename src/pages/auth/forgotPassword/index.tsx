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
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import classes from "./styles.module.scss";
import Button, { BtnType } from "components/common/buttons/Button";
import Link from "next/link";
import { UserService } from "services/user";
import { useDispatch } from "react-redux";
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from "redux/reducers/Status/actionTypes";
import Router from "next/router";
import InputTextfield from "components/common/inputs/InputTextfield";
import { useTranslation } from "react-i18next";

interface ForgotPasswordForm {
  email: string;
}

const Login: NextPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation("common");

  const schema = useMemo(() => {
    return yup.object().shape({
      email: yup
        .string()
        .email(t("auth_forgot_password_email_validate_error"))
        .required(t("auth_forgot_password_email_validate")),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const _onSubmit = (data: ForgotPasswordForm) => {
    dispatch(setLoading(true));
    UserService.sendEmailForgotPassword(data.email)
      .then(() => {
        dispatch(setSuccessMess(t("common_send_success")));
        Router.push(`/auth/verifyForgotPassword?email=${data.email}`);
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
                          "text-center mt-4",
                          classes.headerContainer
                        )}
                      >
                        <p>{t("auth_forgot_password")}</p>
                        <span>{t("auth_forgot_password_sub")}</span>
                      </div>
                    </CardHeader>
                    <CardBody className="px-lg-5">
                      <Form role="form" onSubmit={handleSubmit(_onSubmit)}>
                        <InputTextfield
                          title={t("auth_forgot_password_email")}
                          placeholder={t("auth_forgot_password_email")}
                          type="text"
                          inputRef={register("email")}
                          errorMessage={errors.email?.message}
                        />
                        <div className={classes.btnContainer}>
                          <Button btnType={BtnType.Linear} type="submit">
                            {t("common_send")}
                          </Button>
                        </div>
                      </Form>
                      <Row className="mt-3">
                        <Col xs="12">
                          <Link href="/auth/login">
                            <a>
                              <span>{t("auth_forgot_password_btn_back")}</span>
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
    </div>
  );
};
export default Login;
