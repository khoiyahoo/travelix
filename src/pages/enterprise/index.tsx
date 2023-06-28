import type { NextPage } from "next";
import {
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import { useState } from "react";
import classes from "./styles.module.scss";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding,
  faPlaneDeparture,
  faChartSimple,
  faCircleArrowLeft,
  faCircleArrowRight,
  faTicket,
  faDollarSign,
  faCommenting,
  faCommentAlt,
  faScaleUnbalanced,
  faScaleUnbalancedFlip,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import { images } from "configs/images";
import Hotels from "./Hotels";
import Sales from "./Sales";
import EmailTemplate from "./EmailTemplate";
import ToursRevenue from "./ToursRevenue";
import HotelsRevenue from "./HotelsRevenue";
import TourComments from "./TourComments";
import HotelComments from "./HotelComments";
import CheckRoom from "./CheckRoom";
import HotelStatistic from "./HotelStatistic";
import TourStatistic from "./TourStatistic";
import { ETour, IHotel } from "models/enterprise";
import AddOrEditHotel from "./Hotels/AddOrEditHotel";
import { faSellsy } from "@fortawesome/free-brands-svg-icons";

export enum EActiveNav {
  Tour_Active = 1,
  Hotel_Active = 2,
  Tour_Sales_Active = 3,
  Hotel_Sales_Active = 4,
  Tour_Feedbacks_Active = 5,
  Hotel_Feedbacks_Active = 6,
  Check_Room_Active = 7,
  Email_Active = 8,
  Feedback_Active = 9,
  Tour_Statistic_Active = 10,
  Hotel_Statistic_Active = 11,
  Create_Tour_Active = 12,
  Create_Hotel_Active = 13,
}

const Enterprise: NextPage = () => {
  const [tourEdit, setTourEdit] = useState<ETour>(null);
  const [hotelEdit, setHotelEdit] = useState<IHotel>(null);
  const [verticalTabs, setVerticalTabs] = React.useState(
    EActiveNav.Tour_Active
  );
  const [activeSideBarMobile, setActiveSideBarMobile] = useState(false);

  const onChangeTab = (type: EActiveNav) => {
    switch (type) {
      case EActiveNav.Tour_Active:
        setVerticalTabs(EActiveNav.Tour_Active);
        break;
      case EActiveNav.Hotel_Active:
        setVerticalTabs(EActiveNav.Hotel_Active);
        break;
      case EActiveNav.Tour_Sales_Active:
        setVerticalTabs(EActiveNav.Tour_Sales_Active);
        break;
      case EActiveNav.Hotel_Sales_Active:
        setVerticalTabs(EActiveNav.Hotel_Sales_Active);
        break;
      case EActiveNav.Tour_Feedbacks_Active:
        setVerticalTabs(EActiveNav.Tour_Feedbacks_Active);
        break;
      case EActiveNav.Hotel_Feedbacks_Active:
        setVerticalTabs(EActiveNav.Hotel_Feedbacks_Active);
        break;
      case EActiveNav.Check_Room_Active:
        setVerticalTabs(EActiveNav.Check_Room_Active);
        break;
      case EActiveNav.Email_Active:
        setVerticalTabs(EActiveNav.Email_Active);
        break;
      case EActiveNav.Feedback_Active:
        setVerticalTabs(EActiveNav.Feedback_Active);
        break;
      case EActiveNav.Tour_Statistic_Active:
        setVerticalTabs(EActiveNav.Tour_Statistic_Active);
        break;
      case EActiveNav.Hotel_Statistic_Active:
        setVerticalTabs(EActiveNav.Hotel_Statistic_Active);
        break;
      case EActiveNav.Create_Tour_Active:
        setVerticalTabs(EActiveNav.Create_Tour_Active);
        setTourEdit(null);
        break;
      case EActiveNav.Create_Hotel_Active:
        setVerticalTabs(EActiveNav.Create_Hotel_Active);
        setHotelEdit(null);
        break;
      default:
        break;
    }
  };
  const handleSideBarMobile = () => {
    setActiveSideBarMobile(!activeSideBarMobile);
  };

  const handleTourEdit = (e, item) => {
    setTourEdit(item);
    setVerticalTabs(EActiveNav.Create_Tour_Active);
  };

  const handleHotelEdit = (e, item) => {
    setHotelEdit(item);
    setVerticalTabs(EActiveNav.Create_Hotel_Active);
  };

  return (
    <>
      <div className={classes.root}>
        <Col
          xs={2}
          className={
            activeSideBarMobile ? classes.sideBarActive : classes.sideBar
          }
        >
          <div className={classes.menuBarsMobile} onClick={handleSideBarMobile}>
            <FontAwesomeIcon
              icon={
                activeSideBarMobile ? faCircleArrowLeft : faCircleArrowRight
              }
            />
          </div>
          <div className={classes.headerSidebar}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images.imgLogo.src} alt="" />
            <h4>TRAVELIX</h4>
          </div>
          <Nav tabs className={classes.nav}>
            <span>Dashboard</span>
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
                <FontAwesomeIcon icon={faPlaneDeparture} />
                Tours
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                href="#"
                className={
                  verticalTabs === EActiveNav.Hotel_Active
                    ? classes.active
                    : classes.navLink
                }
                onClick={() => onChangeTab(EActiveNav.Hotel_Active)}
              >
                <FontAwesomeIcon icon={faBuilding} />
                Hotels
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                href="#"
                className={
                  verticalTabs === EActiveNav.Check_Room_Active
                    ? classes.active
                    : classes.navLink
                }
                onClick={() => onChangeTab(EActiveNav.Check_Room_Active)}
              >
                <FontAwesomeIcon icon={faChartSimple} />
                Check room
              </NavLink>
            </NavItem>
            <span>Sales</span>
            <NavItem>
              <NavLink
                href="#"
                className={
                  verticalTabs === EActiveNav.Tour_Sales_Active
                    ? classes.active
                    : classes.navLink
                }
                onClick={() => onChangeTab(EActiveNav.Tour_Sales_Active)}
              >
                <FontAwesomeIcon icon={faTicket} />
                Tours
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                href="#"
                className={
                  verticalTabs === EActiveNav.Hotel_Sales_Active
                    ? classes.active
                    : classes.navLink
                }
                onClick={() => onChangeTab(EActiveNav.Hotel_Sales_Active)}
              >
                <FontAwesomeIcon icon={faDollarSign} />
                Hotels
              </NavLink>
            </NavItem>
            <span>Feedbacks</span>
            <NavItem>
              <NavLink
                href="#"
                className={
                  verticalTabs === EActiveNav.Tour_Feedbacks_Active
                    ? classes.active
                    : classes.navLink
                }
                onClick={() => onChangeTab(EActiveNav.Tour_Feedbacks_Active)}
              >
                <FontAwesomeIcon icon={faCommenting} />
                Tours
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                href="#"
                className={
                  verticalTabs === EActiveNav.Hotel_Feedbacks_Active
                    ? classes.active
                    : classes.navLink
                }
                onClick={() => onChangeTab(EActiveNav.Hotel_Feedbacks_Active)}
              >
                <FontAwesomeIcon icon={faCommentAlt} />
                Hotels
              </NavLink>
            </NavItem>
            <span>Statistics</span>
            <NavItem>
              <NavLink
                href="#"
                className={
                  verticalTabs === EActiveNav.Tour_Statistic_Active
                    ? classes.active
                    : classes.navLink
                }
                onClick={() => onChangeTab(EActiveNav.Tour_Statistic_Active)}
              >
                <FontAwesomeIcon icon={faScaleUnbalancedFlip} />
                Tours
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                href="#"
                className={
                  verticalTabs === EActiveNav.Hotel_Statistic_Active
                    ? classes.active
                    : classes.navLink
                }
                onClick={() => onChangeTab(EActiveNav.Hotel_Statistic_Active)}
              >
                <FontAwesomeIcon icon={faChartLine} />
                Hotels
              </NavLink>
            </NavItem>
            {/* <span>Notifications</span>
            <NavItem>
              <NavLink
                href="#"
                className={verticalTabs === EActiveNav.Email_Active ? classes.active : classes.navLink}
                onClick={() => onChangeTab(EActiveNav.Email_Active)}
              >
                <FontAwesomeIcon icon={faEnvelope} />
                Email template
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                href="#"
                className={verticalTabs === EActiveNav.Feedback_Active ? classes.active : classes.navLink}
                onClick={() => onChangeTab(EActiveNav.Feedback_Active)}
              >
                <FontAwesomeIcon icon={faComments} />
                Feedbacks
              </NavLink>
            </NavItem> */}
          </Nav>
        </Col>
        <Col xs={10} className={classes.content}>
          <TabContent
            activeTab={"verticalTabs" + verticalTabs}
            className={classes.tabContent}
          >
            <TabPane
              tabId="verticalTabs1"
              className={classes.tabPane}
            ></TabPane>
            <TabPane tabId="verticalTabs2" className={classes.tabPane}>
              <Hotels
                onChangeTabCreate={onChangeTab}
                handleHotelEdit={handleHotelEdit}
              />
            </TabPane>
            <TabPane tabId="verticalTabs3" className={classes.tabPane}>
              <ToursRevenue />
            </TabPane>
            <TabPane tabId="verticalTabs4" className={classes.tabPane}>
              <HotelsRevenue />
            </TabPane>
            <TabPane tabId="verticalTabs5" className={classes.tabPane}>
              <TourComments />
            </TabPane>
            <TabPane tabId="verticalTabs6" className={classes.tabPane}>
              <HotelComments />
            </TabPane>
            <TabPane tabId="verticalTabs7" className={classes.tabPane}>
              <CheckRoom />
            </TabPane>
            <TabPane tabId="verticalTabs8" className={classes.tabPane}>
              <EmailTemplate />
            </TabPane>
            <TabPane tabId="verticalTabs10" className={classes.tabPane}>
              <TourStatistic />
            </TabPane>
            <TabPane tabId="verticalTabs11" className={classes.tabPane}>
              <HotelStatistic />
            </TabPane>
            <TabPane
              tabId="verticalTabs12"
              className={classes.tabPane}
            ></TabPane>
            <TabPane tabId="verticalTabs13" className={classes.tabPane}>
              <AddOrEditHotel itemEdit={hotelEdit} />
            </TabPane>
          </TabContent>
        </Col>
      </div>
    </>
  );
};

export default Enterprise;
