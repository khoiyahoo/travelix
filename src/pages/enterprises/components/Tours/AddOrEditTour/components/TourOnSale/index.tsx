import React, { memo, useEffect, useState } from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import { useDispatch } from "react-redux";
import { Grid } from "@mui/material";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import PastOnSale from "./components/PastOnSale";
import { ETour } from "models/enterprise";
import RangePrice from "./components/RangePrice";

interface Props {
  value?: number;
  index?: number;
  tour?: ETour;
  lang?: string;
  handleNextStep?: () => void;
}

export enum EActiveNav {
  Past = 1,
  Upcoming = 2,
}
// eslint-disable-next-line react/display-name
const TourOnSaleStatistic = memo(
  ({ value, index, tour, lang, handleNextStep }: Props) => {
    const { t, i18n } = useTranslation("common");

    const [verticalTabs, setVerticalTabs] = React.useState(EActiveNav.Past);

    const onChangeTab = (type: EActiveNav) => {
      switch (type) {
        case EActiveNav.Past:
          setVerticalTabs(EActiveNav.Past);
          break;
        case EActiveNav.Upcoming:
          setVerticalTabs(EActiveNav.Upcoming);
          break;
        default:
          break;
      }
    };

    return (
      <>
        <Grid
          className={classes.root}
          role="tabpanel"
          hidden={value !== index}
          id={`simple-tabpanel-${index}`}
          aria-labelledby={`simple-tab-${index}`}
        >
          <Row className={clsx(classes.rowHeaderBox, classes.title)}>
            <h3>
              {t("enterprise_management_section_tour_tab_range_price_title")}
            </h3>
            {tour && (
              <Nav tabs className={classes.nav}>
                <NavItem>
                  <NavLink
                    href="#"
                    className={
                      verticalTabs === EActiveNav.Past
                        ? classes.active
                        : classes.navLink
                    }
                    onClick={() => onChangeTab(EActiveNav.Past)}
                  >
                    {t(
                      "enterprise_management_section_tour_tab_range_price_title_took_place"
                    )}
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={
                      verticalTabs === EActiveNav.Upcoming
                        ? classes.active
                        : classes.navLink
                    }
                    onClick={() => onChangeTab(EActiveNav.Upcoming)}
                  >
                    {t(
                      "enterprise_management_section_tour_tab_range_price_title_upcoming"
                    )}
                  </NavLink>
                </NavItem>
              </Nav>
            )}
          </Row>
          <Grid>
            {tour ? (
              <TabContent
                activeTab={"verticalTabs" + verticalTabs}
                className={classes.tabContent}
              >
                <TabPane tabId="verticalTabs1" className={classes.tabPane}>
                  <PastOnSale tour={tour} handleNextStep={handleNextStep} />
                </TabPane>
                <TabPane tabId="verticalTabs2" className={classes.tabPane}>
                  <RangePrice
                    tour={tour}
                    lang={lang}
                    handleNextStep={handleNextStep}
                  />
                </TabPane>
              </TabContent>
            ) : (
              <RangePrice
                tour={tour}
                lang={lang}
                handleNextStep={handleNextStep}
              />
            )}
          </Grid>
        </Grid>
      </>
    );
  }
);

export default TourOnSaleStatistic;
