import React, { memo, useState } from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Stay } from "models/enterprise/stay";
import AddOrEditRoom from "./components/AddOrEditRoom";
import ListRoom from "./components/ListRoom";
import RoomOtherPrice from "./components/RoomOtherPrice";
import UpdateNumberRoom from "./components/UpdateNumberRoom";

interface Props {
  value?: number;
  index?: number;
  lang?: string;
  stay?: Stay;
  handleNextStep?: () => void;
}
export enum EActiveNav {
  LIST_ROOM = 1,
  CREATE_ROOM = 2,
  ROOM_OTHER_PRICE = 3,
  UPDATE_ROOM = 4,
}
// eslint-disable-next-line react/display-name
const RoomInformation = memo(
  ({ value, index, lang, stay, handleNextStep }: Props) => {
    const { t, i18n } = useTranslation("common");

    const [verticalTabs, setVerticalTabs] = React.useState(
      EActiveNav.LIST_ROOM
    );
    const [roomEdit, setRoomEdit] = useState(null);
    const [isFetchData, setIsFetchData] = useState(false);

    const onChangeTab = (type: EActiveNav) => {
      switch (type) {
        case EActiveNav.LIST_ROOM:
          setVerticalTabs(EActiveNav.LIST_ROOM);
          break;
        case EActiveNav.CREATE_ROOM:
          setVerticalTabs(EActiveNav.CREATE_ROOM);
          break;
        case EActiveNav.ROOM_OTHER_PRICE:
          setVerticalTabs(EActiveNav.ROOM_OTHER_PRICE);
          break;
        case EActiveNav.UPDATE_ROOM:
          setVerticalTabs(EActiveNav.UPDATE_ROOM);
          break;
        default:
          break;
      }
    };

    return (
      <>
        <div
          role="tabpanel"
          hidden={value !== index}
          id={`simple-tabpanel-${index}`}
          aria-labelledby={`simple-tab-${index}`}
        >
          <Row className={clsx(classes.rowHeaderBox, classes.title)}>
            <h3>
              {t(
                "enterprise_management_section_add_or_edit_stay_set_up_title_room_information"
              )}
            </h3>
            <Nav tabs className={classes.nav}>
              <NavItem>
                <NavLink
                  href="#"
                  className={
                    verticalTabs === EActiveNav.LIST_ROOM
                      ? classes.active
                      : classes.navLink
                  }
                  onClick={() => onChangeTab(EActiveNav.LIST_ROOM)}
                >
                  {t(
                    "enterprise_management_section_add_or_edit_stay_set_up_title_tab_list"
                  )}
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={
                    verticalTabs === EActiveNav.CREATE_ROOM
                      ? classes.active
                      : classes.navLink
                  }
                  onClick={() => {
                    onChangeTab(EActiveNav.CREATE_ROOM);
                    setRoomEdit(null);
                  }}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  {t("common_create")}
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
                <ListRoom
                  stay={stay}
                  lang={lang}
                  onChangeTab={(item) => {
                    onChangeTab(EActiveNav.CREATE_ROOM);
                    setRoomEdit(item);
                  }}
                  isFetchData={isFetchData}
                  onChangeRoomOtherPrice={(item) => {
                    onChangeTab(EActiveNav.ROOM_OTHER_PRICE);
                    setRoomEdit(item);
                  }}
                  onChangeUpdateRoom={(item) => {
                    onChangeTab(EActiveNav.UPDATE_ROOM);
                    setRoomEdit(item);
                  }}
                  handleNextStep={handleNextStep}
                />
              </TabPane>
              <TabPane tabId="verticalTabs2" className={classes.tabPane}>
                <AddOrEditRoom
                  room={roomEdit}
                  lang={lang}
                  stay={stay}
                  onChangeTab={(isFetchData) => {
                    onChangeTab(EActiveNav.LIST_ROOM);
                    setIsFetchData(isFetchData);
                  }}
                  handleNextStep={handleNextStep}
                />
              </TabPane>
              <TabPane tabId="verticalTabs3" className={classes.tabPane}>
                <RoomOtherPrice
                  room={roomEdit}
                  lang={lang}
                  handleNextStep={handleNextStep}
                />
              </TabPane>
              <TabPane tabId="verticalTabs4" className={classes.tabPane}>
                <UpdateNumberRoom
                  room={roomEdit}
                  lang={lang}
                  stay={stay}
                  handleNextStep={handleNextStep}
                />
              </TabPane>
            </TabContent>
          </Grid>
        </div>
      </>
    );
  }
);

export default RoomInformation;
