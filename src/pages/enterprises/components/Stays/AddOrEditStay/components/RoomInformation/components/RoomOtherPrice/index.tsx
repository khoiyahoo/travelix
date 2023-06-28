import React, { memo, useEffect, useState } from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import PastOnSale from "./components/PastOnSale";
import RangePrice from "./components/RangePrice";
import { Room } from "models/enterprise/room";

interface Props {
  room?: Room;
  lang?: string;
  handleNextStep?: () => void;
}

export enum EActiveNav {
  Past = 1,
  Upcoming = 2,
}
// eslint-disable-next-line react/display-name
const RoomOtherPrice = memo(({ room, lang, handleNextStep }: Props) => {
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
      <Grid className={classes.root}>
        <Row className={clsx(classes.rowHeaderBox, classes.title)}>
          <h3>
            {t(
              "enterprise_management_section_stay_header_table_room_other_price_title"
            )}
          </h3>
          {room && (
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
          <TabContent
            activeTab={"verticalTabs" + verticalTabs}
            className={classes.tabContent}
          >
            <TabPane tabId="verticalTabs1" className={classes.tabPane}>
              <PastOnSale room={room} handleNextStep={handleNextStep} />
            </TabPane>
            <TabPane tabId="verticalTabs2" className={classes.tabPane}>
              <RangePrice
                room={room}
                lang={lang}
                handleNextStep={handleNextStep}
              />
            </TabPane>
          </TabContent>
        </Grid>
      </Grid>
    </>
  );
});

export default RoomOtherPrice;
