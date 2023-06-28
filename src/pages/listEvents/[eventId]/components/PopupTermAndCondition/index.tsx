import React, { memo, useMemo, useRef, useState } from "react";
import {
  Modal,
  ModalProps,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Container,
} from "reactstrap";
import classes from "./styles.module.scss";
import "aos/dist/aos.css";
import Button, { BtnType } from "components/common/buttons/Button";
import { DETAIL_SECTION, Tour } from "models/tour";
import { Link } from "react-scroll";
import { Grid, Tabs, useMediaQuery, useTheme } from "@mui/material";
import styled from "styled-components";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import _ from "lodash";
import { IEvent } from "models/event";
import moment from "moment";
import { EDiscountType } from "models/general";
import { fCurrency2VND } from "utils/formatNumber";
import { useTranslation } from "react-i18next";

interface Props extends ModalProps {
  isOpen: boolean;
  toggle?: () => void;
  event?: IEvent;
}

// eslint-disable-next-line react/display-name
const PopupTermAndCondition = memo((props: Props) => {
  const { isOpen, toggle, event } = props;
  const { t, i18n } = useTranslation("common");

  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} className={classes.root}>
        <ModalHeader toggle={toggle} className={classes.title}>
          {t("popup_detail_event_and_terms_conditions_title")}
        </ModalHeader>

        <ModalBody className={classes.modalBody}>
          <ul>
            <li>
              {t("popup_detail_event_and_terms_conditions_tip_1")}
              <span>
                {moment(event?.startTime).format("DD/MM/YYYY")}
              </span> -{" "}
              <span>{moment(event?.endTime).format("DD/MM/YYYY")}</span>
            </li>
            {event?.discountType === EDiscountType.PERCENT ? (
              <li
                dangerouslySetInnerHTML={{
                  __html: t("popup_detail_event_and_terms_conditions_tip_2", {
                    discountValue: event?.discountValue,
                    maxDiscount: fCurrency2VND(event?.maxDiscount),
                  }),
                }}
              ></li>
            ) : (
              <li
                dangerouslySetInnerHTML={{
                  __html: t(
                    "popup_detail_event_and_terms_conditions_tip_2_or",
                    {
                      discountValue: fCurrency2VND(event?.discountValue),
                    }
                  ),
                }}
              ></li>
            )}
            <li
              dangerouslySetInnerHTML={{
                __html: t("popup_detail_event_and_terms_conditions_tip_3", {
                  minOrder: fCurrency2VND(event?.minOrder),
                }),
              }}
            ></li>
            <li>{t("popup_detail_event_and_terms_conditions_tip_4")}</li>
            <li>{t("popup_detail_event_and_terms_conditions_tip_5")}</li>
            <li>{t("popup_detail_event_and_terms_conditions_tip_6")}</li>
            <li>{t("popup_detail_event_and_terms_conditions_tip_7")}</li>
          </ul>
        </ModalBody>
      </Modal>
    </>
  );
});

export default PopupTermAndCondition;
