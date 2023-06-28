import React, { memo, useRef, useState } from "react";
import { useRouter } from "next/router";

import dynamic from "next/dynamic";
import { Col, Nav, NavItem, NavLink, TabContent } from "reactstrap";
import classes from "./styles.module.scss";
import { images } from "configs/images";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AttractionsIcon from "@mui/icons-material/Attractions";
import EventIcon from "@mui/icons-material/Event";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { EUserType } from "models/user";
import useAuth from "hooks/useAuth";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import TourIcon from "@mui/icons-material/Tour";
import BarChartIcon from "@mui/icons-material/BarChart";
import Tours from "../components/Tours";
import Stays from "../components/Stays";
import Vouchers from "../components/Vouchers";
import Staffs from "../components/Staffs";
import TourBills from "../components/TourBills";
import TourStatistic from "../components/TourStatistic";
import { Grid } from "@mui/material";
import PopupTermsAndConditions from "../components/PopupTermsAndConditions";
import { useTranslation } from "react-i18next";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import RoomBills from "../components/RoomBills";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import StayStatistic from "../components/StayStatistic";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ForumIcon from "@mui/icons-material/Forum";
import TourRate from "../components/TourRate";
import StayRate from "../components/StayRate";
interface PropTypes {}

const Enterprise = memo(({ ...props }: PropTypes) => {
  const router = useRouter();
  const { page } = router.query;
  const { user } = useAuth();
  const { t, i18n } = useTranslation("common");

  const toursRef = useRef<HTMLDivElement>(null);
  const staysRef = useRef<HTMLDivElement>(null);
  const vouchersRef = useRef<HTMLDivElement>(null);
  const staffsRef = useRef<HTMLDivElement>(null);

  const [openPopupTermsAndConditions, setOpenPopupTermsAndConditions] =
    useState(false);

  const onTogglePopupTermsAndConditions = () => {
    setOpenPopupTermsAndConditions(!openPopupTermsAndConditions);
  };

  const renderComponent = () => {
    switch (page) {
      case "tours":
        toursRef &&
          toursRef.current &&
          toursRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        return (
          <Col xs={10} className={classes.content}>
            <TabContent className={classes.tabContent}>
              <Tours />
            </TabContent>
          </Col>
        );
      case "stays":
        staysRef &&
          staysRef.current &&
          staysRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        return (
          <Col xs={10} className={classes.content}>
            <TabContent className={classes.tabContent}>
              <Stays />
            </TabContent>
          </Col>
        );
      case "vouchers":
        vouchersRef &&
          vouchersRef.current &&
          vouchersRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        return (
          <Col xs={10} className={classes.content}>
            <TabContent className={classes.tabContent}>
              <Vouchers />
            </TabContent>
          </Col>
        );
      case "staffs":
        staffsRef &&
          staffsRef.current &&
          staffsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        return (
          <Col xs={10} className={classes.content}>
            <TabContent className={classes.tabContent}>
              <Staffs />
            </TabContent>
          </Col>
        );
      case "tourBills":
        return (
          <Col xs={10} className={classes.content}>
            <TabContent className={classes.tabContent}>
              <TourBills />
            </TabContent>
          </Col>
        );
      case "roomBills":
        return (
          <Col xs={10} className={classes.content}>
            <TabContent className={classes.tabContent}>
              <RoomBills />
            </TabContent>
          </Col>
        );
      case "tourRates":
        return (
          <Col xs={10} className={classes.content}>
            <TabContent className={classes.tabContent}>
              <TourRate />
            </TabContent>
          </Col>
        );
      case "stayRates":
        return (
          <Col xs={10} className={classes.content}>
            <TabContent className={classes.tabContent}>
              <StayRate />
            </TabContent>
          </Col>
        );
      case "tourStatistic":
        return (
          <Col xs={10} className={classes.content}>
            <TabContent className={classes.tabContent}>
              <TourStatistic />
            </TabContent>
          </Col>
        );
      case "stayStatistic":
        return (
          <Col xs={10} className={classes.content}>
            <TabContent className={classes.tabContent}>
              <StayStatistic />
            </TabContent>
          </Col>
        );
    }
  };

  const renderClass = (pageName: string) => {
    return `${Boolean(page === pageName) && "active"}`;
  };

  const gotoMenu = (pageName: string) => {
    router.push(`/enterprises/${pageName}`);
  };

  return (
    <div className={classes.root}>
      <Col xs={2} className={classes.sideBar}>
        <div className={classes.headerSidebar}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images.imgLogo.src} alt="" />
          <h4>TRAVELIX</h4>
        </div>
        <Nav tabs className={classes.nav}>
          <span>{t("enterprise_management_navbar_dashboard")}</span>
          <NavItem
            onClick={() => gotoMenu("tours")}
            className={classes.navItem}
          >
            <NavLink className={renderClass("tours")}>
              <AttractionsIcon />
              <span ref={toursRef}>
                {t("enterprise_management_navbar_tour")}
              </span>
            </NavLink>
          </NavItem>
          <NavItem
            onClick={() => gotoMenu("stays")}
            className={classes.navItem}
          >
            <NavLink className={renderClass("stays")}>
              <ApartmentIcon />
              <span ref={staysRef}>
                {t("enterprise_management_navbar_hotel")}
              </span>
            </NavLink>
          </NavItem>
          <NavItem
            onClick={() => gotoMenu("vouchers")}
            className={classes.navItem}
          >
            <NavLink className={renderClass("vouchers")}>
              <AirplaneTicketIcon />
              <span ref={vouchersRef}>
                {t("enterprise_management_navbar_voucher")}
              </span>
            </NavLink>
          </NavItem>
          {user?.role === EUserType.ENTERPRISE && (
            <NavItem
              onClick={() => gotoMenu("staffs")}
              className={classes.navItem}
            >
              <NavLink className={renderClass("staffs")}>
                <PeopleAltIcon />
                <span ref={staffsRef}>
                  {t("enterprise_management_navbar_staff")}
                </span>
              </NavLink>
            </NavItem>
          )}
          <span>{t("enterprise_management_navbar_order")}</span>
          <NavItem
            onClick={() => gotoMenu("tourBills")}
            className={classes.navItem}
          >
            <NavLink className={renderClass("tourBills")}>
              <TourIcon />
              <span>{t("enterprise_management_navbar_tour_bill")}</span>
            </NavLink>
          </NavItem>
          <NavItem
            onClick={() => gotoMenu("roomBills")}
            className={classes.navItem}
          >
            <NavLink className={renderClass("roomBills")}>
              <MeetingRoomIcon />
              <span>{t("enterprise_management_navbar_room_bill")}</span>
            </NavLink>
          </NavItem>
          <span>{t("enterprise_management_navbar_rate")}</span>
          <NavItem
            onClick={() => gotoMenu("tourRates")}
            className={classes.navItem}
          >
            <NavLink className={renderClass("tourRates")}>
              <RateReviewIcon />
              <span>{t("enterprise_management_navbar_rate_tour")}</span>
            </NavLink>
          </NavItem>
          <NavItem
            onClick={() => gotoMenu("stayRates")}
            className={classes.navItem}
          >
            <NavLink className={renderClass("stayRates")}>
              <ForumIcon />
              <span>{t("enterprise_management_navbar_rate_stay")}</span>
            </NavLink>
          </NavItem>
          {user?.role === EUserType.ENTERPRISE && (
            <>
              <span>{t("enterprise_management_navbar_statistic")}</span>
              <NavItem
                onClick={() => gotoMenu("tourStatistic")}
                className={classes.navItem}
              >
                <NavLink className={renderClass("tourStatistic")}>
                  <BarChartIcon />
                  <span ref={vouchersRef}>
                    {t("enterprise_management_navbar_tour")}
                  </span>
                </NavLink>
              </NavItem>
              <NavItem
                onClick={() => gotoMenu("stayStatistic")}
                className={classes.navItem}
              >
                <NavLink className={renderClass("stayStatistic")}>
                  <SignalCellularAltIcon />
                  <span ref={vouchersRef}>
                    {t("enterprise_management_navbar_hotel")}
                  </span>
                </NavLink>
              </NavItem>
            </>
          )}
          <Grid
            className={classes.boxTerms}
            onClick={onTogglePopupTermsAndConditions}
          >
            <span>{t("enterprise_management_navbar_term_and_condition")}</span>
          </Grid>
        </Nav>
      </Col>
      {renderComponent()}
      <PopupTermsAndConditions
        isOpen={openPopupTermsAndConditions}
        toggle={onTogglePopupTermsAndConditions}
      />
    </div>
  );
});

export default Enterprise;
