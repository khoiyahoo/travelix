import React from "react";
import Link from "next/link";
// reactstrap components
import {
  Container,
  Row,
  Col,
  TabPane,
  TabContent,
  NavLink,
  NavItem,
  Nav,
} from "reactstrap";
import { Item } from "routes/routers";

import { NextPage } from "next";
import { images } from "configs/images";
import classes from "./styles.module.scss";
import clsx from "clsx";
import SectionHeader from "components/Header/SectionHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faArrowsRotate,
  faArrowRightFromBracket,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import UserProfile from "./UserProfile";
import ChangePassword from "./ChangePassword";
import { Divider } from "@mui/material";
import UseAuth from "hooks/useAuth";
import { useTranslation } from "react-i18next";
import AccountBank from "./AccountBank";
interface Props {
  routes: Item[];
}

const Profile: NextPage = () => {
  const { logout } = UseAuth();
  const [verticalTabs, setVerticalTabs] = React.useState("1");
  const { t, i18n } = useTranslation("common");

  return (
    <>
      <SectionHeader
        title={t("profile_detail_section_hero_title")}
        src={images.bgUser.src}
      />
      <Container className={classes.root}>
        <Row>
          <Col md="4">
            <Nav className="nav-pills-info flex-column" pills role="tablist">
              <NavItem className={classes.navItem}>
                <NavLink
                  className={clsx(
                    verticalTabs === "1" ? `${classes.active}` : classes.navLink
                  )}
                  href="#pablo"
                  onClick={(e) => {
                    e.preventDefault();
                    setVerticalTabs("1");
                  }}
                >
                  <FontAwesomeIcon icon={faUser} />
                  <div>
                    <span>{t("profile_detail_title")}</span>
                  </div>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={clsx(
                    verticalTabs === "2" ? `${classes.active}` : classes.navLink
                  )}
                  href="#pablo"
                  onClick={(e) => {
                    e.preventDefault();
                    setVerticalTabs("2");
                  }}
                >
                  <FontAwesomeIcon icon={faArrowsRotate} />
                  <div>
                    <span>{t("profile_detail_change_pass_title")}</span>
                  </div>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={clsx(
                    verticalTabs === "3" ? `${classes.active}` : classes.navLink
                  )}
                  href="#pablo"
                  onClick={(e) => {
                    e.preventDefault();
                    setVerticalTabs("3");
                  }}
                >
                  <AccountBalanceWalletIcon />
                  <div>
                    <span>{t("profile_detail_account_bank_title")}</span>
                  </div>
                </NavLink>
              </NavItem>
              <Divider />
              <NavItem className={classes.navLogout} onClick={logout}>
                <Link href="/auth/login">
                  <a>
                    <FontAwesomeIcon icon={faArrowRightFromBracket} />
                    <span>{t("header_logout")}</span>
                  </a>
                </Link>
              </NavItem>
            </Nav>
          </Col>
          <Col md="8">
            <TabContent
              activeTab={"verticalTabs" + verticalTabs}
              className={classes.tabContent}
            >
              <TabPane tabId="verticalTabs1">
                <UserProfile />
              </TabPane>
              <TabPane tabId="verticalTabs2">
                <ChangePassword />
              </TabPane>
              <TabPane tabId="verticalTabs3">
                <AccountBank />
              </TabPane>
            </TabContent>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
