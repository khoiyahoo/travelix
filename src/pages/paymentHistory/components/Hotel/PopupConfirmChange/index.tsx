import { memo, useMemo } from "react";
import { Modal, ModalFooter, ModalHeader, ModalBody, ModalProps } from "reactstrap";
import classes from "./styles.module.scss";
import { useDispatch } from "react-redux";
import { fCurrency2VND } from "utils/formatNumber";
import Button, { BtnType } from "components/common/buttons/Button";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { BillHelper } from "helpers/bill";
import { EServicePolicyType } from "models/general";
import { RoomBill } from "models/roomBill";
import { useRouter } from "next/router";
interface Props extends ModalProps {
  onClose: () => void;
  isOpen: boolean;
  roomBill?: RoomBill;
  callBack?: () => void;
}

const PopupConfirmChange = memo(({ onClose, isOpen, roomBill, callBack }: Props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t, i18n } = useTranslation("common");

  const refundRate = useMemo(() => {
    return BillHelper.getRefundRate(roomBill?.startDate, EServicePolicyType.RESCHEDULE, roomBill?.stayData?.stayPolicies) || 0;
  }, [roomBill]);
  const priceRefund = useMemo(() => {
    return (roomBill?.totalBill * refundRate) / 100 || 0;
  }, [roomBill, refundRate]);

  const onYes = () => {
    router.push(`/paymentHistory/hotel/${roomBill?.id}`);
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} centered scrollable className={classes.modal}>
      <ModalHeader isOpen={isOpen} toggle={onClose} className={classes.title}>
        XÁC NHẬN ĐỔI PHÒNG HOẶC THỜI GIAN
      </ModalHeader>
      <ModalBody>
        <Grid>
          <Grid className={classes.boxPrice}>
            <p>
              {t("popup_confirm_cancel_payment_history_total_bill")}: <span>{fCurrency2VND(roomBill?.totalBill)} VND</span>
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

export default PopupConfirmChange;
