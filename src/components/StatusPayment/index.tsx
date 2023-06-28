import { Chip, ChipProps } from "@mui/material";
// import { EStatus } from 'models/general';
import { memo } from "react";
import classes from "./styles.module.scss";
import { EBillStatus, EPaymentStatus } from "models/general";
import { useTranslation } from "react-i18next";

interface StatusChipProps extends ChipProps {
  status: number;
  type?: boolean;
}

const StatusChip = memo((props: StatusChipProps) => {
  const { status, type, ...rest } = props;
  const { t } = useTranslation("common");

  const getLabel = () => {
    switch (status) {
      case EPaymentStatus.PAID:
        return t("bill_status_paid");
      case EPaymentStatus.NOT_PAID:
        return t("bill_status_not_paid");
      case EPaymentStatus.CANCEL:
        return t("bill_status_canceled");
      case EPaymentStatus.FAILED:
        return t("bill_status_not_fail");
    }
  };

  const getLabelType = () => {
    switch (status) {
      case EBillStatus.RESCHEDULED:
        return t("bill_status_reschedule");
      case EBillStatus.CANCELED:
        return t("bill_status_canceled");
      case EBillStatus.NOT_CONTACTED_YET:
        return t("bill_status_not_contact_yet");
      case EBillStatus.CONTACTED:
        return t("bill_status_contacted");
      case EBillStatus.USED:
        return t("bill_status_used");
      case EBillStatus.NOT_USE:
        return t("bill_status_not_use");
    }
  };

  const getColor = ():
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning" => {
    switch (status) {
      case EPaymentStatus.PAID:
        return "success";
      case EPaymentStatus.NOT_PAID:
        return "warning";
      case EPaymentStatus.CANCEL:
        return "error";
      case EPaymentStatus.FAILED:
        return "error";
    }
  };

  const getColorType = ():
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning" => {
    switch (status) {
      case EBillStatus.RESCHEDULED:
        return "info";
      case EBillStatus.CANCELED:
        return "error";
      case EBillStatus.NOT_CONTACTED_YET:
        return "warning";
      case EBillStatus.CONTACTED:
        return "success";
      case EBillStatus.USED:
        return "success";
      case EBillStatus.NOT_USE:
        return "error";
    }
  };

  return (
    <Chip
      label={type ? getLabelType() : getLabel()}
      color={type ? getColorType() : getColor()}
      variant="outlined"
      {...rest}
      className={classes.root}
    />
  );
});

export default StatusChip;
