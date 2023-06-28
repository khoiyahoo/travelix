import { memo } from "react";
import classes from "./styles.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import ErrorMessage from "components/common/texts/ErrorMessage";
import Button, { BtnType } from "components/common/buttons/Button";
import { Grid } from "@mui/material";

interface InputsProps {
  className?: string;
  label?: string;
  labelIcon?: React.ReactNode;
  max: number;
  min: number;
  value: number;
  onChange: (value) => void;
  errorMessage?: string;
  valueDisable?: any;
}
// eslint-disable-next-line react/display-name
const InputCounter = memo((props: InputsProps) => {
  const {
    className,
    label,
    labelIcon,
    max,
    min,
    value,
    onChange,
    errorMessage,
    valueDisable,
  } = props;

  const add = () => {
    const newValue = value + 1;
    if ((max ?? null) !== null && newValue > max) return;
    onChange(newValue);
  };

  const minus = () => {
    const newValue = value - 1;
    if ((min ?? null) !== null && newValue < min) return;
    onChange(newValue);
  };

  return (
    <Grid className={className}>
      {label && (
        <label className={classes.label}>
          {labelIcon} {label}
        </label>
      )}
      <div className={classes.contentNumber}>
        <Button
          className={classes.btnControl}
          btnType={BtnType.Primary}
          type="button"
          onClick={minus}
          disabled={(min ?? null) !== null ? value <= min : false}
        >
          <i className="now-ui-icons ui-1_simple-delete"></i>
        </Button>
        <div className={classes.numberValue}>
          <input
            value={valueDisable ? 0 : value}
            onChange={(e) => {
              let val = parseInt(e.target.value, 10);
              if (isNaN(val)) {
                onChange("");
              } else if (val < min) {
                onChange(min);
              } else if (val > max) {
                onChange(max);
              } else {
                val = val >= 0 ? val : 0;
                onChange(Number(val));
              }
            }}
          />
        </div>
        <Button
          className={classes.btnControl}
          btnType={BtnType.Primary}
          type="button"
          onClick={add}
          disabled={(max ?? null) !== null ? value >= max : false}
        >
          <i className="now-ui-icons ui-1_simple-add"></i>
        </Button>
      </div>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </Grid>
  );
});
export default InputCounter;
