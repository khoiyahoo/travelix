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
import { Moment } from "moment";

interface Props {
  label?: string;
  labelIcon?: React.ReactNode;
  className?: string;
  placeholder?: string;
  errorMessage?: string | FieldError | Merge<FieldError, FieldErrors<any>>;
  name?: string;
  control?: any;
  dateFormat?: string;
  initialValue?: string | Date | moment.Moment;
  value?: string | Date | moment.Moment;
  _onChange?: (date) => void;
  [key: string]: any;
  closeOnClickOutside?: boolean;
  closeOnSelect?: boolean;
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
    initialValue,
    value,
    closeOnClickOutside,
    closeOnSelect,
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
                      <FontAwesomeIcon icon={faCalendarDays}></FontAwesomeIcon>
                    </div>
                    <ReactDatetime
                      {...field}
                      className={classes.datePickerInput}
                      onChange={(date) => {
                        _onChange && _onChange(date);
                        return field?.onChange(date);
                      }}
                      // value={value}
                      initialValue={initialValue}
                      closeOnClickOutside={closeOnClickOutside}
                      closeOnSelect={closeOnSelect}
                      dateFormat={dateFormat || "D/M/YYYY"}
                      inputProps={{
                        className: "form-control",
                        placeholder: `${placeholder}`,
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
              <FontAwesomeIcon icon={faCalendarDays}></FontAwesomeIcon>
            </div>
            <ReactDatetime
              className={classes.datePickerInput}
              inputProps={{
                className: "form-control",
                placeholder: `${placeholder}`,
              }}
              initialValue={initialValue}
              value={value}
              closeOnClickOutside={closeOnClickOutside}
              closeOnSelect={closeOnSelect}
              dateFormat={dateFormat || "D/M/YYYY"}
              onChange={(date) => {
                _onChange && _onChange(date);
              }}
              {...rest}
              renderInput={(props) => {
                return (
                  <input
                    {...props}
                    value={
                      value
                        ? (value as Moment).format(dateFormat || "D/M/YYYY")
                        : ""
                    }
                  />
                );
              }}
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
