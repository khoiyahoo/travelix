import { memo, useMemo } from "react";
import { Modal, ModalFooter, ModalHeader, ModalBody, ModalProps } from "reactstrap";
import classes from "./styles.module.scss";
import { useDispatch } from "react-redux";
import { TourBill } from "models/tourBill";
import { fCurrency2VND } from "utils/formatNumber";
import Button, { BtnType } from "components/common/buttons/Button";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { Grid } from "@mui/material";
import { setErrorMess, setLoading, setSuccessMess } from "redux/reducers/Status/actionTypes";
import { TourBillService } from "services/normal/tourBill";
import { useTranslation } from "react-i18next";
import { BillHelper } from "helpers/bill";
import { EServicePolicyType } from "models/general";
interface Props extends ModalProps {
  onClose: () => void;
  isOpen: boolean;
  tourBill?: TourBill;
}

const PopupConfirmCancel = memo(({ onClose, isOpen, tourBill }: Props) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation("common");

  const refundRate = useMemo(() => {
    return BillHelper.getRefundRate(tourBill?.tourOnSaleData?.startDate, EServicePolicyType.REFUND, tourBill?.tourData?.tourPolicies) || 0;
  }, [tourBill]);
  const priceRefund = useMemo(() => {
    return (tourBill?.totalBill * refundRate) / 100 || 0;
  }, [tourBill, refundRate]);

  const onYes = () => {
    dispatch(setLoading(true));
    TourBillService.cancelBookTour(tourBill?.id, {
      moneyRefund: priceRefund,
    })
      .then(() => {
        dispatch(setSuccessMess(t("common_cancel_success")));
        onClose();
      })
      .catch((e) => {
        dispatch(setErrorMess(e));
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} centered scrollable className={classes.modal}>
      <ModalHeader isOpen={isOpen} toggle={onClose} className={classes.title}>
        {t("popup_confirm_cancel_payment_history_title")}
      </ModalHeader>
      <ModalBody>
        <Grid>
          <Grid className={classes.boxPrice}>
            <p>
              {t("popup_confirm_cancel_payment_history_total_bill")}: <span>{fCurrency2VND(tourBill?.totalBill)} VND</span>
            </p>
            <p>
              {t("popup_confirm_cancel_payment_history_reimbursed")} ({refundRate}%): <span>{fCurrency2VND(priceRefund)} VND</span>
            </p>
          </Grid>
        </Grid>
        <Grid className={classes.boxNote}>
          <NotificationsActiveIcon />
          <p>{t("popup_confirm_cancel_payment_history_not")}: </p>
        </Grid>
        <ul className={classes.boxContentNote}>
          <li>{t("popup_confirm_cancel_payment_history_not_1")}</li>
          <li>{t("popup_confirm_cancel_payment_history_not_2")}</li>
        </ul>
      </ModalBody>
      <ModalFooter className={classes.footer}>
        <Button btnType={BtnType.Secondary} onClick={onClose} className="mr-2">
          {t("common_cancel")}
        </Button>
        <Button btnType={BtnType.Primary} onClick={onYes}>
          {t("common_yes")}
        </Button>
      </ModalFooter>
    </Modal>
  );
});

export default PopupConfirmCancel;
