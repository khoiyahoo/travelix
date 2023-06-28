import React from "react";
import Link from "next/link";
// reactstrap components
import {
  Container,
  Row,
  TabPane,
  TabContent,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";

import { NextPage } from "next";
import { images } from "configs/images";
import classes from "./styles.module.scss";
import SectionHeader from "components/Header/SectionHeader";

import Button, { BtnType } from "components/common/buttons/Button";
import Tour from "../components/Tour";
import Hotel from "../components/Hotel";
import { Grid } from "@mui/material";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

const PaymentHistory: NextPage = () => {
  const router = useRouter();
  const { page } = router.query;
  const { t, i18n } = useTranslation("common");

  const renderComponent = () => {
    switch (page) {
      case "tour":
        return <Tour />;
      case "hotel":
        return <Hotel />;
    }
  };

  const gotoMenu = (pageName: string) => {
    router.push(`/paymentHistory/${pageName}`);
  };

  const renderClass = (pageName: string) => {
    return `${Boolean(page === pageName) && "active"}`;
  };

  return (
    <>
      <SectionHeader
        title={t("payment_history_page_title_hero")}
        src={images.bgUser.src}
        className={classes.sectionHeader}
      />
      <Grid className={classes.rootContent}>
        <Container className={classes.root}>
          <Row className={classes.headerPaymentHistory}>
            <Nav tabs className={classes.nav}>
              <span>{t("payment_history_page_title")}</span>
              <NavItem
                onClick={() => gotoMenu("tour")}
                className={classes.navItem}
              >
                <NavLink className={renderClass("tour")}>
                  {t("payment_history_page_title_tab_tour")}
                </NavLink>
              </NavItem>
              <NavItem
                onClick={() => gotoMenu("hotel")}
                className={classes.navItem}
              >
                <NavLink className={renderClass("hotel")}>
                  {t("payment_history_page_title_tab_stay")}
                </NavLink>
              </NavItem>
            </Nav>
          </Row>
          <Grid>{renderComponent()}</Grid>
        </Container>
      </Grid>
    </>
  );
};

export default PaymentHistory;
