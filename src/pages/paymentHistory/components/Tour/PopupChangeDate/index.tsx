import { memo, useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import classes from "./styles.module.scss";
import moment from "moment";
import { useDispatch } from "react-redux";
import { TourBill } from "models/tourBill";
import { Tour, TourPrice } from "models/tour";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { Grid } from "@mui/material";
import { setSelectChangeDateReducer } from "redux/reducers/Normal/actionTypes";
import { useRouter } from "next/router";
import ReportIcon from "@mui/icons-material/Report";
import { EServicePolicyType } from "models/general";
import { useTranslation } from "react-i18next";
interface Props {
  onClose: () => void;
  isOpen: boolean;
  tour: Tour;
  tourBill?: TourBill;
}

const PopupSelectDate = memo(({ onClose, isOpen, tour, tourBill }: Props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t, i18n } = useTranslation("common");

  const yesterday = moment().subtract(1, "day");
  const dateReschedule = new Date();
  const [isValidReschedule, setIsValidReschedule] = useState(false);

  const onSelectDate = (item: TourPrice) => {
    dispatch(
      setSelectChangeDateReducer({
        id: item?.id,
        tourId: item?.tourId,
        discount: item?.discount,
        quantity: item?.quantity,
        quantityOrdered: item?.quantityOrdered,
        startDate: item?.startDate,
        childrenAgeMin: item?.childrenAgeMin,
        childrenAgeMax: item?.childrenAgeMax,
        childrenPrice: item?.childrenPrice,
        adultPrice: item?.adultPrice,
        currency: item?.currency,
      })
    );
    router.push(`/paymentHistory/tour/${tourBill?.id}`);
  };

  useEffect(() => {
    {
      tour?.tourPolicies.map((item, index) => {
        if (
          dateReschedule?.setDate(dateReschedule?.getDate()) <
            new Date(tourBill?.createdAt)?.setDate(
              new Date(tourBill?.createdAt)?.getDate() + item?.dayRange
            ) &&
          item?.policyType === EServicePolicyType.RESCHEDULE
        ) {
          setIsValidReschedule(true);
        }
      });
    }
  }, [tour, tourBill]);

  return (
    <Modal
      isOpen={isOpen}
      toggle={onClose}
      centered
      scrollable
      className={classes.modal}
    >
      <ModalHeader isOpen={isOpen} toggle={onClose} className={classes.title}>
        {t("popup_change_date_payment_history_title")}
      </ModalHeader>
      {isValidReschedule ? (
        <ModalBody>
          <Grid className={classes.boxDate}>
            <p>{t("popup_change_date_payment_history_date_available")}: </p>
            <Grid container>
              {tour?.tourOnSales?.map((item, index) =>
                moment(item?.startDate) < yesterday ||
                item?.startDate ===
                  tourBill?.tourOnSaleData?.startDate ? null : (
                  <Grid
                    className={classes.boxItemDate}
                    item
                    key={index}
                    onClick={() => onSelectDate(item)}
                  >
                    <span>{moment(item?.startDate).format("DD-MM")}</span>
                  </Grid>
                )
              )}
            </Grid>
          </Grid>
          <Grid className={classes.boxNote}>
            <NotificationsActiveIcon />
            <p>{t("popup_change_date_payment_history_notification")}: </p>
          </Grid>
          <ul className={classes.boxContentNote}>
            <li>{t("popup_change_date_payment_history_not_1")}</li>
            <li>{t("popup_change_date_payment_history_not_2")}</li>
            <li>{t("popup_change_date_payment_history_not_3")}</li>
          </ul>
        </ModalBody>
      ) : (
        <ModalBody>
          <Grid className={classes.noDate}>
            <ReportIcon />
            <span>{t("popup_change_date_payment_history_no_date")}</span>
          </Grid>
        </ModalBody>
      )}
    </Modal>
  );
});

export default PopupSelectDate;
