import { Chip, ChipProps } from "@mui/material";
// import { EStatus } from 'models/general';
import { memo } from "react";
import classes from "./styles.module.scss";
import { useTranslation } from "react-i18next";

interface StatusChipProps extends ChipProps {
  status?: boolean;
  statusRefund?: boolean;
}

const StatusChip = memo((props: StatusChipProps) => {
  const { status, statusRefund, ...rest } = props;
  const { t } = useTranslation("common");

  const getLabel = () => {
    switch (status) {
      case true:
        return t("common_active");
      case false:
        return t("common_in_active");
    }
  };

  const getLabelRefund = () => {
    switch (statusRefund) {
      case true:
        return t("common_refund");
      case false:
        return t("common_not_refund");
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
      case true:
        return "success";
      case false:
        return "error";
    }
  };

  const getColorRefund = ():
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning" => {
    switch (statusRefund) {
      case true:
        return "success";
      case false:
        return "error";
    }
  };

  return (
    <Chip
      label={statusRefund ? getLabelRefund() : getLabel()}
      color={statusRefund ? getColorRefund() : getColor()}
      variant="outlined"
      {...rest}
      className={classes.root}
    />
  );
});

export default StatusChip;
