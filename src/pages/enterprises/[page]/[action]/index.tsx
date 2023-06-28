import React, { memo, useRef, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { Col, Nav, NavItem, NavLink, TabContent } from "reactstrap";
import classes from "./styles.module.scss";
import { images } from "configs/images";
import Stays from "pages/enterprises/components/Stays";

import OfferStaffs from "pages/enterprises/components/Staffs/components/OfferStaffs";
import { EUserType } from "models/user";
import useAuth from "hooks/useAuth";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AttractionsIcon from "@mui/icons-material/Attractions";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import TourIcon from "@mui/icons-material/Tour";
import Tours from "pages/enterprises/components/Tours";
import Vouchers from "pages/enterprises/components/Vouchers";
import AddOrEditTour from "pages/enterprises/components/Tours/AddOrEditTour";
import AddOrEditVoucher from "pages/enterprises/components/Vouchers/components/AddOrEditVoucher";
import DetailTourBill from "pages/enterprises/components/TourBills/components/DetailTourBill";
import Staffs from "pages/enterprises/components/Staffs";
import TourBills from "pages/enterprises/components/TourBills";
import TourStatistic from "pages/enterprises/components/TourStatistic";
import TourOnSaleStatistic from "pages/enterprises/components/TourStatistic/components/TourOnSaleStatistic";
import PopupTermsAndConditions from "pages/enterprises/components/PopupTermsAndConditions";
import { useTranslation } from "react-i18next";
import { Grid } from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import AddOrEditStay from "pages/enterprises/components/Stays/AddOrEditStay";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import DetailRoomBill from "pages/enterprises/components/RoomBills/components/DetailRoomBill";
import RoomBills from "pages/enterprises/components/RoomBills";
import StayStatistic from "pages/enterprises/components/StayStatistic";
import DetailStayStatistic from "pages/enterprises/components/StayStatistic/components/DetailStayStatistic";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import TourRate from "pages/enterprises/components/TourRate";
import DetailRateTour from "pages/enterprises/components/TourRate/components/DetailRateTour";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ForumIcon from "@mui/icons-material/Forum";
import StayRate from "pages/enterprises/components/StayRate";
import DetailRateStay from "pages/enterprises/components/StayRate/components/DetailRateStay";
import TourTransaction from "pages/enterprises/components/Staffs/components/TourTransaction";
import StayTransaction from "pages/enterprises/components/Staffs/components/StayTransaction";
interface PropTypes {}

const Enterprise = memo(({ ...props }: PropTypes) => {
  const router = useRouter();
  const { user } = useAuth();
  const { page, action, type } = router.query;
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
        if (action === "create-tour") {
          return (
            <Col xs={10} className={classes.content}>
              <TabContent className={classes.tabContent}>
                <AddOrEditTour />
              </TabContent>
            </Col>
          );
        }
        if (action) {
          return (
            <Col xs={10} className={classes.content}>
              <TabContent className={classes.tabContent}>
                <AddOrEditTour tourId={Number(action)} />
              </TabContent>
            </Col>
          );
        }
        return (
          <Col xs={10} className={classes.content}>
            <TabContent className={classes.tabContent}>
              <Tours />
            </TabContent>
          </Col>
        );
      case "stays":
        if (action === "create-stay") {
          return (
            <Col xs={10} className={classes.content}>
              <TabContent className={classes.tabContent}>
                <AddOrEditStay />
              </TabContent>
            </Col>
          );
        }
        if (action) {
          return (
            <Col xs={10} className={classes.content}>
              <TabContent className={classes.tabContent}>
                <AddOrEditStay stayId={Number(action)} />
              </TabContent>
            </Col>
          );
        }
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
        if (action === "create-voucher") {
          return (
            <Col xs={10} className={classes.content}>
              <TabContent className={classes.tabContent}>
                <AddOrEditVoucher />
              </TabContent>
            </Col>
          );
        }
        if (action) {
          return (
            <Col xs={10} className={classes.content}>
              <TabContent className={classes.tabContent}>
                <AddOrEditVoucher voucherId={Number(action)} />
              </TabContent>
            </Col>
          );
        }
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
        if (action === "list-offers") {
          return (
            <Col xs={10} className={classes.content}>
              <TabContent className={classes.tabContent}>
                <OfferStaffs />
              </TabContent>
            </Col>
          );
        }
        if (action === "tour-transaction") {
          return (
            <Col xs={10} className={classes.content}>
              <TabContent className={classes.tabContent}>
                <TourTransaction />
              </TabContent>
            </Col>
          );
        }
        if (action === "stay-transaction") {
          return (
            <Col xs={10} className={classes.content}>
              <TabContent className={classes.tabContent}>
                <StayTransaction />
              </TabContent>
            </Col>
          );
        }
        return (
          <Col xs={10} className={classes.content}>
            <TabContent className={classes.tabContent}>
              <Staffs />
            </TabContent>
          </Col>
        );
      case "tourBills":
        if (action) {
          return (
            <Col xs={10} className={classes.content}>
              <TabContent className={classes.tabContent}>
                <DetailTourBill tourBillId={Number(action)} />
              </TabContent>
            </Col>
          );
        }
        return (
          <Col xs={10} className={classes.content}>
            <TabContent className={classes.tabContent}>
              <TourBills />
            </TabContent>
          </Col>
        );
      case "roomBills":
        if (action) {
          return (
            <Col xs={10} className={classes.content}>
              <TabContent className={classes.tabContent}>
                <DetailRoomBill roomBillId={Number(action)} />
              </TabContent>
            </Col>
          );
        }
        return (
          <Col xs={10} className={classes.content}>
            <TabContent className={classes.tabContent}>
              <RoomBills />
            </TabContent>
          </Col>
        );
      case "tourRates":
        if (action) {
          return (
            <Col xs={10} className={classes.content}>
              <TabContent className={classes.tabContent}>
                <DetailRateTour tourId={Number(action)} />
              </TabContent>
            </Col>
          );
        }
        return (
          <Col xs={10} className={classes.content}>
            <TabContent className={classes.tabContent}>
              <TourRate />
            </TabContent>
          </Col>
        );
      case "stayRates":
        if (action) {
          return (
            <Col xs={10} className={classes.content}>
              <TabContent className={classes.tabContent}>
                <DetailRateStay stayId={Number(action)} />
              </TabContent>
            </Col>
          );
        }
        return (
          <Col xs={10} className={classes.content}>
            <TabContent className={classes.tabContent}>
              <StayRate />
            </TabContent>
          </Col>
        );
      case "tourStatistic":
        if (action) {
          return (
            <Col xs={10} className={classes.content}>
              <TabContent className={classes.tabContent}>
                <TourOnSaleStatistic tourId={Number(action)} />
              </TabContent>
            </Col>
          );
        }
        return (
          <Col xs={10} className={classes.content}>
            <TabContent className={classes.tabContent}>
              <TourStatistic />
            </TabContent>
          </Col>
        );
      case "stayStatistic":
        if (action) {
          return (
            <Col xs={10} className={classes.content}>
              <TabContent className={classes.tabContent}>
                <DetailStayStatistic stayId={Number(action)} />
              </TabContent>
            </Col>
          );
        }
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
              <span ref={vouchersRef}>
                {t("enterprise_management_navbar_tour_bill")}
              </span>
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
