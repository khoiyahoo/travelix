import { Chip, ChipProps } from "@mui/material";
// import { EStatus } from 'models/general';
import { memo } from "react";
import classes from "./styles.module.scss";
import { useTranslation } from "react-i18next";

interface StatusChipProps extends ChipProps {
  statusRefund?: boolean;
  titleTrue?: string;
  titleFalse?: string;
}

const StatusChip = memo((props: StatusChipProps) => {
  const { statusRefund, titleTrue, titleFalse, ...rest } = props;
  const { t } = useTranslation("common");

  const getLabelRefund = () => {
    switch (statusRefund) {
      case true:
        return titleTrue;
      case false:
        return titleFalse;
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
      label={getLabelRefund()}
      color={getColorRefund()}
      variant="outlined"
      {...rest}
      className={classes.root}
    />
  );
});

export default StatusChip;
