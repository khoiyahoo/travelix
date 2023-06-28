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
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import classes from "./styles.module.scss";
import Button, { BtnType } from "components/common/buttons/Button";
import InputTextfield from "components/common/inputs/InputTextfield";
import Google from "components/SocialButton/Google";
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
import Router, { useRouter } from "next/router";
import { EUserType } from "models/user";
import InputCheckbox from "components/common/inputs/InputCheckbox";
import ErrorMessage from "components/common/texts/ErrorMessage";
import { Grid } from "@mui/material";

interface LoginForm {
  email: string;
  password: string;
  role: number;
}

const Login: NextPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [errorSubmit, setErrorSubmit] = useState(false);

  const schema = useMemo(() => {
    return yup.object().shape({
      email: yup
        .string()
        .email("Please enter a valid email address")
        .required("Email is required"),
      password: yup.string().required("Password is required"),
      role: yup.number().required(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
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

  const _onSubmit = (data: LoginForm) => {
    dispatch(setLoading(true));
    UserService.login({
      username: data?.email,
      password: data?.password,
      role: 1,
    })
      .then((res) => {
        localStorage.setItem(EKey.TOKEN, res.token);
        dispatch(setUserLogin(res.user));
        router.push(`/admin`);
      })
      .catch((e) => {
        setErrorSubmit(true);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  return (
    <div className="main-content">
      <div className={clsx("header page-header-image", classes.headerWrapper)}>
        <Container className={classes.container}>
          <div className="header-body mb-7">
            <Row className="justify-content-center">
              <Col lg="5" md="6">
                <h1 className="text-white text-center">Welcome!</h1>
              </Col>
            </Row>
            <Container className="mt--8 pb-5">
              <Row className="justify-content-center">
                <Col lg="5" md="7">
                  <Card className={clsx("shadow", classes.card)}>
                    <CardHeader>
                      <div
                        className={clsx(
                          "text-center mt-4",
                          classes.headerLoginContainer
                        )}
                      >
                        <p>Sign in</p>
                      </div>
                    </CardHeader>
                    <CardBody className="px-lg-5">
                      <Form role="form" onSubmit={handleSubmit(_onSubmit)}>
                        <InputTextfield
                          title="Email"
                          placeholder="Enter your email"
                          type="email"
                          inputRef={register("email")}
                          errorMessage={errors.email?.message}
                        />
                        <Grid sx={{ paddingTop: "16px" }}>
                          <InputTextfield
                            title="Password"
                            placeholder="Enter your password"
                            type="password"
                            showEyes={true}
                            inputRef={register("password")}
                            errorMessage={errors.password?.message}
                          />
                        </Grid>
                        {errorSubmit && (
                          <div className={classes.boxError}>
                            <ErrorMessage>
                              Please enter a correct email and password.
                            </ErrorMessage>
                          </div>
                        )}
                        <div className={classes.btnLoginContainer}>
                          <Button btnType={BtnType.Linear} type="submit">
                            Sign in
                          </Button>
                        </div>
                      </Form>
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
