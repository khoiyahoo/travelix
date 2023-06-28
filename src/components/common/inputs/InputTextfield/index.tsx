import { useState, memo } from "react";
import {
  OutlinedInput,
  FormControl,
  FormControlProps,
  InputAdornment,
  IconButton,
  OutlinedInputProps,
} from "@mui/material";
import classes from "./styles.module.scss";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import ErrorMessage from "components/common/texts/ErrorMessage";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface InputsProps extends OutlinedInputProps {
  title?: string;
  titleRequired?: boolean;
  placeholder?: string;
  name?: string;
  type?: string;
  defaultValue?: string;
  value?: string | number;
  showEyes?: boolean;
  root?: string;
  className?: any;
  inputRef?: any;
  autoComplete?: string;
  errorMessage?: string | null;
  optional?: boolean;
  infor?: string;
  isShowError?: boolean;
  rootProps?: FormControlProps;
}
const InputTextfield = memo((props: InputsProps) => {
  const { t } = useTranslation("common");

  const [toggleEyes, setToggleEyes] = useState(false);
  const {
    title,
    placeholder,
    name,
    defaultValue,
    value,
    type,
    root,
    className,
    showEyes,
    inputRef,
    errorMessage,
    autoComplete,
    optional,
    infor,
    titleRequired,
    isShowError,
    rootProps,
    ...rest
  } = props;

  const handleClick = () => {
    setToggleEyes(!toggleEyes);
  };

  const { ref: refInput, ...inputProps } = inputRef || { ref: null };

  return (
    <FormControl className={clsx(classes.root, root)} {...rootProps}>
      {title && (
        <label className={classes.title}>
          {title}
          {optional ? (
            <span className={classes.optional}>
              &nbsp;{t("common_optional")}
            </span>
          ) : (
            ""
          )}
          {titleRequired ? (
            <span className={classes.titleRequired}> *</span>
          ) : (
            ""
          )}
        </label>
      )}
      <OutlinedInput
        type={!toggleEyes ? type : "text"}
        placeholder={placeholder}
        fullWidth
        name={name}
        defaultValue={defaultValue}
        value={value}
        variant="standard"
        classes={{
          root: clsx(classes.inputTextfield, {
            [classes.inputInvalid]: !!errorMessage || isShowError,
          }),
        }}
        className={className}
        autoComplete={autoComplete}
        onWheel={(e) =>
          e.target instanceof HTMLElement &&
          (e.target as any).type === "number" &&
          e.target.blur()
        }
        endAdornment={
          showEyes && (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClick}
                className={classes.iconEye}
                tabIndex={-1}
              >
                {toggleEyes ? (
                  <FontAwesomeIcon icon={faEye} />
                ) : (
                  <VisibilityOffIcon />
                )}
              </IconButton>
            </InputAdornment>
          )
        }
        {...inputProps}
        inputRef={refInput}
        {...rest}
      />
      {infor && <p className={classes.textInfor}>{infor}</p>}
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </FormControl>
  );
});
export default InputTextfield;
