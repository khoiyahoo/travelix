import {
  TimePicker as TimePickerMUI,
  TimePickerProps,
} from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { memo } from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { FormControl, OutlinedInput, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import ErrorMessage from "components/common/texts/ErrorMessage";

import {
  DateTimePicker,
  DateTimePickerProps,
} from "@mui/x-date-pickers/DateTimePicker";
interface Props
  extends Partial<DateTimePickerProps<moment.Moment, moment.Moment>> {
  title?: string;
  titleRequired?: boolean;
  placeholder?: string;
  showEyes?: boolean;
  root?: string;
  className?: any;
  inputRef?: any;
  autoComplete?: string;
  errorMessage?: string | null;
  optional?: boolean;
  infor?: string;
  isShowError?: boolean;
  tabIndex?: number;
}

const TimePicker = memo(
  ({
    title,
    placeholder,
    root,
    showEyes,
    inputRef,
    errorMessage,
    autoComplete,
    optional,
    infor,
    titleRequired,
    isShowError,
    value,
    tabIndex,
    onChange,
    ...rest
  }: Props) => {
    const { t } = useTranslation();

    return (
      <FormControl className={clsx(classes.root, root)}>
        {title && (
          <p className={classes.title}>
            {title}
            {optional ? (
              <span className={classes.optional}>
                {" "}
                ({t("common_optional")})
              </span>
            ) : (
              ""
            )}
            {titleRequired ? (
              <span className={classes.titleRequired}> *</span>
            ) : (
              ""
            )}
          </p>
        )}
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DateTimePicker
            value={value}
            onChange={onChange}
            views={["hours", "minutes"]}
            inputFormat="hh:mm a"
            ampmInClock={true}
            ampm={true}
            mask="__:__"
            renderInput={({ InputProps, ...params }) => (
              <TextField
                fullWidth
                variant="standard"
                classes={{
                  root: clsx(classes.inputTextfield, {
                    [classes.inputInvalid]: !!errorMessage,
                  }),
                }}
                onWheel={(e) =>
                  e.target instanceof HTMLElement &&
                  (e.target as any).type === "number" &&
                  e.target.blur()
                }
                {...params}
                inputProps={{
                  ...(params.inputProps || {}),
                  tabIndex: tabIndex,
                }}
                margin={params.margin as any}
                onKeyDown={params.onKeyDown as any}
                onKeyUp={params.onKeyUp as any}
                placeholder="00:00"
              />
            )}
            {...rest}
          />
        </LocalizationProvider>
        {infor && <p className={classes.textInfor}>{infor}</p>}
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </FormControl>
    );
  }
);

export default TimePicker;
