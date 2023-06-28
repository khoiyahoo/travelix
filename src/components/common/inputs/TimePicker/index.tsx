import clsx from "clsx";
import React, { memo } from "react";
import {
  Control,
  Controller,
  FieldError,
  FieldErrors,
  FieldValues,
  Merge,
} from "react-hook-form";
import { FormGroup } from "reactstrap";
import classes from "./styles.module.scss";
import ReactDatetime from "react-datetime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import { OutlinedInput } from "@mui/material";
interface Props {
  label?: string;
  labelIcon?: React.ReactNode;
  className?: string;
  placeholder?: string;
  errorMessage?: string | FieldError | Merge<FieldError, FieldErrors<any>>;
  name?: string;
  control?: any;
  dateFormat?: string;
  disabled?: boolean;
  _onChange?: () => void;
  [key: string]: any;
}

// eslint-disable-next-line react/display-name
const CustomDatePicker = memo(
  ({
    label,
    labelIcon,
    className,
    placeholder,
    errorMessage,
    name,
    handleChange,
    _onChange,
    control,
    dateFormat,
    disabled,
    ...rest
  }: Props) => {
    return (
      <FormGroup
        className={clsx(
          classes.root,
          { [classes.danger]: !!errorMessage },
          className
        )}
      >
        {control ? (
          <>
            <Controller
              name={name}
              control={control}
              render={({ field }) => {
                return (
                  <div className={classes.form}>
                    {label && <label className={classes.label}>{label} </label>}
                    <div className={label ? classes.iconLabel : classes.icon}>
                      <AccessAlarmIcon />
                    </div>
                    <ReactDatetime
                      {...field}
                      initialValue={"00:00 a"}
                      className={classes.datePickerInput}
                      onChange={(time) => {
                        _onChange && _onChange();
                        return field?.onChange(time);
                      }}
                      dateFormat={false}
                      timeFormat="hh:mm a"
                      timeConstraints={{
                        minutes: { min: 0, max: 59, step: 5 },
                      }}
                      inputProps={{
                        className: "form-control",
                        placeholder: `${placeholder}`,
                        disabled: disabled,
                      }}
                      {...rest}
                    />
                  </div>
                );
              }}
            />
          </>
        ) : (
          <>
            {label && (
              <label className={classes.label}>
                {labelIcon} {label}
              </label>
            )}
            <div className={label ? classes.iconLabel : classes.icon}>
              <AccessAlarmIcon />
            </div>
            <ReactDatetime
              initialValue={"00:00"}
              className={classes.datePickerInput}
              inputProps={{
                className: "form-control",
                placeholder: `${placeholder}`,
                disabled: disabled,
              }}
              dateFormat={false}
              timeFormat="hh:mm a"
              onChange={(time) => {
                _onChange && _onChange();
              }}
              timeConstraints={{ minutes: { min: 0, max: 59, step: 5 } }}
              {...rest}
            />
          </>
        )}
        {errorMessage && (
          <span className="text-danger mt-1 d-block">
            <>{errorMessage}</>
          </span>
        )}
      </FormGroup>
    );
  }
);

export default CustomDatePicker;
