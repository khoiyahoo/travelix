import React, { memo } from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";

import { Grid } from "@mui/material";

import Tour from "./components/Tour";
import Hotel from "./components/Hotel";
import { useTranslation } from "react-i18next";

export enum EActiveNav {
  Tour_Active = 1,
  Hotel_Active = 2,
}

interface Props {}
// eslint-disable-next-line react/display-name
const CommissionComponent = memo(({}: Props) => {
  const { t, i18n } = useTranslation("common");

  const [verticalTabs, setVerticalTabs] = React.useState(
    EActiveNav.Tour_Active
  );

  const onChangeTab = (type: EActiveNav) => {
    switch (type) {
      case EActiveNav.Tour_Active:
        setVerticalTabs(EActiveNav.Tour_Active);
        break;
      case EActiveNav.Hotel_Active:
        setVerticalTabs(EActiveNav.Hotel_Active);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className={classes.root}>
        <Row className={clsx(classes.rowHeaderBox, classes.title)}>
          <h3>{t("admin_management_navbar_commission")}</h3>
          <Nav tabs className={classes.nav}>
            <NavItem>
              <NavLink
                href="#"
                className={
                  verticalTabs === EActiveNav.Tour_Active
                    ? classes.active
                    : classes.navLink
                }
                onClick={() => onChangeTab(EActiveNav.Tour_Active)}
              >
                {t("admin_management_section_commission_tab_tour_title")}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={
                  verticalTabs === EActiveNav.Hotel_Active
                    ? classes.active
                    : classes.navLink
                }
                onClick={() => onChangeTab(EActiveNav.Hotel_Active)}
              >
                {t("admin_management_section_commission_tab_hotel_title")}
              </NavLink>
            </NavItem>
          </Nav>
        </Row>
        <Grid>
          <TabContent
            activeTab={"verticalTabs" + verticalTabs}
            className={classes.tabContent}
          >
            <TabPane tabId="verticalTabs1" className={classes.tabPane}>
              <Tour />
            </TabPane>
            <TabPane tabId="verticalTabs2" className={classes.tabPane}>
              <Hotel />
            </TabPane>
          </TabContent>
        </Grid>
      </div>
    </>
  );
});

export default CommissionComponent;
