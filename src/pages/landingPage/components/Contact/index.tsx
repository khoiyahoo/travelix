import React, { useMemo, memo, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Label,
  FormGroup,
  Form,
  Container,
  Row,
  Col,
} from "reactstrap";
import { images } from "configs/images";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button, { BtnType } from "components/common/buttons/Button";
import Link from "next/link";
import classes from "./styles.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapLocation,
  faPhone,
  faEnvelopeOpenText,
  faEarthAmerica,
} from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import InputTextfield from "components/common/inputs/InputTextfield";

export interface EmailForm {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

// eslint-disable-next-line react/display-name
const Contact = memo(() => {
  const { t, i18n } = useTranslation("common");

  const schema = useMemo(() => {
    return yup.object().shape({
      firstName: yup.string().required("Fist name is required"),
      lastName: yup.string().required("Last name is required"),
      email: yup
        .string()
        .email("Please enter a valid email address")
        .required("Email is required"),
      message: yup.string().required("Message is required"),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const clearForm = () => {
    reset({
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    });
  };

  const _onSubmit = (data: EmailForm) => {
    console.log(data);
    clearForm();
  };

  return (
    <>
      <Grid className={classes.root}>
        <Row>
          <Col md="5">
            <h2 className={clsx("title", classes.title)}>
              {t("landing_page_section_contact_title")}
            </h2>
            <h4 className="description">
              {t("landing_page_section_contact_sub_title")}
            </h4>
            <div className="info info-horizontal">
              <img alt="anh" src={images.man.src} />
            </div>
          </Col>
          <Col className="ml-auto mr-auto" md="5">
            <Card
              className={clsx(classes.cardFood, "card-contact card-raised")}
            >
              {/* <Form
                id="contact-form1"
                method="post"
                role="form"
                onSubmit={handleSubmit(_onSubmit)}
              >
                <CardHeader className="text-center">
                  <CardTitle tag="h4">
                    {" "}
                    {t("landing_page_section_contact_form_title")}
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col className="pr-2" md="6">
                      <InputTextfield
                        title={t(
                          "landing_page_section_contact_title_first_name"
                        )}
                        startAdornment={
                          <i className="now-ui-icons users_circle-08"></i>
                        }
                        placeholder={t(
                          "landing_page_section_contact_title_first_name_placeholder"
                        )}
                        aria-label="First Name..."
                        autoComplete="family-name"
                        type="text"
                        inputRef={register("firstName")}
                        errorMessage={errors.firstName?.message}
                      />
                    </Col>
                    <Col className="pl-2" md="6">
                      <InputTextfield
                        title={t(
                          "landing_page_section_contact_title_last_name"
                        )}
                        startAdornment={
                          <i className="now-ui-icons text_caps-small"></i>
                        }
                        placeholder={t(
                          "landing_page_section_contact_title_last_name_placeholder"
                        )}
                        aria-label="Last Name..."
                        autoComplete="family-name"
                        type="text"
                        inputRef={register("lastName")}
                        errorMessage={errors.lastName?.message}
                      />
                    </Col>
                  </Row>
                  <FormGroup>
                    <InputTextfield
                      title={t("landing_page_section_contact_title_email")}
                      startAdornment={
                        <i className="now-ui-icons ui-1_email-85"></i>
                      }
                      placeholder={t(
                        "landing_page_section_contact_title_email_placeholder"
                      )}
                      aria-label="Email Here..."
                      autoComplete="family-name"
                      type="text"
                      inputRef={register("email")}
                      errorMessage={errors.email?.message}
                    />
                  </FormGroup>
                  <FormGroup>
                    <InputTextfield
                      multiline
                      rows={3}
                      title={t("landing_page_section_contact_title_message")}
                      placeholder={t(
                        "landing_page_section_contact_title_message_placeholder"
                      )}
                      autoComplete="family-name"
                      inputRef={register("message")}
                      errorMessage={errors.message?.message}
                    />
                  </FormGroup>
                  <Row>
                    <Col md="12">
                      <Button
                        className="btn-round pull-right"
                        btnType={BtnType.Primary}
                        type="submit"
                      >
                        {t("landing_page_section_contact_title_send_btn")}
                      </Button>
                    </Col>
                  </Row>
                </CardBody>
              </Form> */}
              <img
                src={images.food.src}
                alt="anh food"
                className={classes.foodContact}
              />
            </Card>
            <Row>
              <ul className={classes.infoBodyListContact}>
                <li className={classes.infoContact}>
                  <FontAwesomeIcon icon={faMapLocation}></FontAwesomeIcon>
                  <p>4127 Raoul Wallenber 45b-c Gibraltar</p>
                </li>
                <li className={classes.infoContact}>
                  <FontAwesomeIcon icon={faPhone}></FontAwesomeIcon>
                  <a
                    href="tel:+84 954 000 917"
                    className={classes.contactLinkInfo}
                  >
                    <p>84 954 000 917</p>
                  </a>
                </li>
                <li className={classes.infoContact}>
                  <FontAwesomeIcon icon={faEnvelopeOpenText}></FontAwesomeIcon>
                  <a
                    href="mailto:mail@mail.com"
                    className={classes.contactLinkInfo}
                  >
                    <p>travelix@gmail.com</p>
                  </a>
                </li>
                <li className={classes.infoContact}>
                  <FontAwesomeIcon icon={faEarthAmerica}></FontAwesomeIcon>
                  <Link href="/" className={classes.contactLinkInfo}>
                    <p>www.colorlib.com</p>
                  </Link>
                </li>
              </ul>
            </Row>
          </Col>
        </Row>
      </Grid>
    </>
  );
});

export default Contact;
