import React, { memo, useRef } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { Col, Nav, NavItem, NavLink, TabContent } from "reactstrap";
import classes from "./styles.module.scss";
import { images } from "configs/images";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EventIcon from "@mui/icons-material/Event";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import { useTranslation } from "react-i18next";
import TourIcon from "@mui/icons-material/Tour";
import useAuth from "hooks/useAuth";
import { EUserType } from "models/user";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import StatisticStayBills from "../components/StatisticStayBills";
import TourBills from "../components/TourBills";
import StayBills from "../components/StayBills";
import SwipeLeftIcon from "@mui/icons-material/SwipeLeft";
import SwipeDownIcon from "@mui/icons-material/SwipeDown";
import MarkunreadMailboxIcon from "@mui/icons-material/MarkunreadMailbox";
import MoveDownIcon from "@mui/icons-material/MoveDown";
import TourSendRevenue from "../components/TourSendRevenue";
import StaySendRevenue from "../components/StaySendRevenue";
const Users = dynamic(() => import("pages/admin/components/Users"));
const Events = dynamic(() => import("pages/admin/components/Events"));
const Commissions = dynamic(() => import("pages/admin/components/Commissions"));
const StatisticTourBills = dynamic(
  () => import("../components/StatisticTourBills")
);

interface PropTypes {}

const Admin = memo(({ ...props }: PropTypes) => {
  const router = useRouter();
  const { page } = router.query;
  const { t, i18n } = useTranslation("common");
  const { user } = useAuth();

  const usersRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);

  const renderComponent = () => {
    switch (page) {
      case "users":
        usersRef &&
          usersRef.current &&
          usersRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        return (
          <Col xs={10} className={classes.content}>
            <TabContent className={classes.tabContent}>
              <Users />
            </TabContent>
          </Col>
        );
      case "events":
        eventsRef &&
          eventsRef.current &&
          eventsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        return (
          <Col xs={10} className={classes.content}>
            <TabContent className={classes.tabContent}>
              <Events />
            </TabContent>
          </Col>
        );
      case "commissions":
        return (
          <Col xs={10} className={classes.content}>
            <TabContent className={classes.tabContent}>
              <Commissions />
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
              <StayBills />
            </TabContent>
          </Col>
        );
      case "tourRevenue":
        return (
          <Col xs={10} className={classes.content}>
            <TabContent className={classes.tabContent}>
              <TourSendRevenue />
            </TabContent>
          </Col>
        );
      case "stayRevenue":
        return (
          <Col xs={10} className={classes.content}>
            <TabContent className={classes.tabContent}>
              <StaySendRevenue />
            </TabContent>
          </Col>
        );
      case "statisticTourBills":
        return (
          <Col xs={10} className={classes.content}>
            <TabContent className={classes.tabContent}>
              <StatisticTourBills />
            </TabContent>
          </Col>
        );
      case "statisticStayBills":
        return (
          <Col xs={10} className={classes.content}>
            <TabContent className={classes.tabContent}>
              <StatisticStayBills />
            </TabContent>
          </Col>
        );
    }
  };

  const renderClass = (pageName: string) => {
    return `${Boolean(page === pageName) && "active"}`;
  };

  const gotoMenu = (pageName: string) => {
    router.push(`/admin/${pageName}`);
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
          <span>{t("admin_management_navbar_dashboard")}</span>
          <NavItem
            onClick={() => gotoMenu("users")}
            className={classes.navItem}
          >
            <NavLink className={renderClass("users")}>
              <PeopleAltIcon />
              <span ref={usersRef}>{t("admin_management_navbar_user")}</span>
            </NavLink>
          </NavItem>
          <NavItem
            onClick={() => gotoMenu("events")}
            className={classes.navItem}
          >
            <NavLink className={renderClass("events")}>
              <EventIcon />
              <span ref={eventsRef}>{t("admin_management_navbar_event")}</span>
            </NavLink>
          </NavItem>
          <NavItem
            onClick={() => gotoMenu("commissions")}
            className={classes.navItem}
          >
            <NavLink className={renderClass("commissions")}>
              <MonetizationOnIcon />
              <span>{t("admin_management_navbar_commission")}</span>
            </NavLink>
          </NavItem>
          <span>{t("enterprise_management_navbar_order_refund")}</span>
          <NavItem
            onClick={() => gotoMenu("tourBills")}
            className={classes.navItem}
          >
            <NavLink className={renderClass("tourBills")}>
              <SwipeLeftIcon />
              <span>{t("enterprise_management_navbar_tour_bill")}</span>
            </NavLink>
          </NavItem>
          <NavItem
            onClick={() => gotoMenu("roomBills")}
            className={classes.navItem}
          >
            <NavLink className={renderClass("roomBills")}>
              <SwipeDownIcon />
              <span>{t("enterprise_management_navbar_room_bill")}</span>
            </NavLink>
          </NavItem>
          <span>{t("enterprise_management_navbar_send_money")}</span>
          <NavItem
            onClick={() => gotoMenu("tourRevenue")}
            className={classes.navItem}
          >
            <NavLink className={renderClass("tourRevenue")}>
              <MarkunreadMailboxIcon />
              <span>{t("enterprise_management_navbar_tour_bill")}</span>
            </NavLink>
          </NavItem>
          <NavItem
            onClick={() => gotoMenu("stayRevenue")}
            className={classes.navItem}
          >
            <NavLink className={renderClass("stayRevenue")}>
              <MoveDownIcon />
              <span>{t("enterprise_management_navbar_room_bill")}</span>
            </NavLink>
          </NavItem>
          {user.role === EUserType.SUPER_ADMIN && (
            <>
              <span>{t("admin_management_navbar_statistic")}</span>
              <NavItem
                onClick={() => gotoMenu("statisticTourBills")}
                className={classes.navItem}
              >
                <NavLink className={renderClass("statisticTourBills")}>
                  <TourIcon />
                  <span>{t("admin_management_navbar_tour_bills")}</span>
                </NavLink>
              </NavItem>
              <NavItem
                onClick={() => gotoMenu("statisticStayBills")}
                className={classes.navItem}
              >
                <NavLink className={renderClass("statisticStayBills")}>
                  <MeetingRoomIcon />
                  <span>{t("enterprise_management_navbar_room_bill")}</span>
                </NavLink>
              </NavItem>
            </>
          )}
        </Nav>
      </Col>
      {renderComponent()}
    </div>
  );
});

export default Admin;
