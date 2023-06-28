import React, { memo } from "react";
import {
  Modal,
  ModalProps,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import classes from "./styles.module.scss";
import "aos/dist/aos.css";
import Button, { BtnType } from "components/common/buttons/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { Grid } from "@mui/material";
import { fCurrency2VND } from "utils/formatNumber";

interface Props extends ModalProps {
  title?: string;
  isOpen?: boolean;
  onClose?: () => void;
  toggle?: () => void;
  onYes?: () => void;
  bill?: any;
}

// eslint-disable-next-line react/display-name
const PopupConfirmDeleteTour = memo((props: Props) => {
  const { title, isOpen, toggle, onClose, onYes, bill } = props;
  const { t, i18n } = useTranslation("common");

  const handleYes = () => {
    onYes();
  };

  const handleClose = () => {
    onClose();
  };
  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} className={classes.root}>
        <ModalHeader toggle={toggle} className={classes.title}>
          {t("enterprise_management_section_tour_bill_action_view_refund")}
        </ModalHeader>
        <ModalBody>
          <Grid container spacing={2}>
            <Grid item xs={12} className={classes.boxItemInfo}>
              <p>{t("popup_download_view_tour_title_person_name")}: </p>
              <span>
                {bill?.userInfo?.firstName} {bill?.userInfo?.lastName}
              </span>
            </Grid>
            <Grid item xs={12} className={classes.boxItemInfo}>
              <p>
                {t("enterprise_management_section_staff_header_table_phone")}:{" "}
              </p>
              <span>{bill?.userInfo?.phoneNumber}</span>
            </Grid>
            <Grid item xs={12} className={classes.boxItemInfo}>
              <p>{t("admin_management_section_tour_bill_body_user_name")}: </p>
              <span style={{ textTransform: "uppercase" }}>
                {bill?.userInfo?.bankUserName}
              </span>
            </Grid>
            <Grid item xs={12} className={classes.boxItemInfo}>
              <p>{t("admin_management_section_tour_bill_body_code_bank")}: </p>
              <span>{bill?.userInfo?.bankCode?.name}</span>
            </Grid>
            {bill?.userInfo?.bankName?.name && (
              <Grid item xs={12} className={classes.boxItemInfo}>
                <p>
                  {t("admin_management_section_tour_bill_body_name_bank")}:{" "}
                </p>
                <span>{bill?.userInfo?.bankName?.name}</span>
              </Grid>
            )}
            <Grid item xs={12} className={classes.boxItemInfo}>
              <p>
                {t("admin_management_section_tour_bill_body_number_bank")}:{" "}
              </p>
              <span>{bill?.userInfo?.bankCardNumber}</span>
            </Grid>
            <Grid item xs={12} className={classes.boxItemInfo}>
              <p>
                {t(
                  "enterprise_management_section_tour_bill_header_table_money_refund"
                )}
                :{" "}
              </p>
              <span> {fCurrency2VND(bill?.moneyRefund)} VND</span>
            </Grid>
          </Grid>
        </ModalBody>
        <ModalFooter className={classes.footer}>
          <Button
            btnType={BtnType.Secondary}
            onClick={handleClose}
            className="mr-2"
          >
            {t("common_cancel")}
          </Button>
          <Button btnType={BtnType.Primary} onClick={handleYes}>
            {t("common_yes")}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
});

export default PopupConfirmDeleteTour;
