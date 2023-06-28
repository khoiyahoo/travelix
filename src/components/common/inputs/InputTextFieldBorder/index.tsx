import React, { memo, useState } from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  FormGroup,
  InputProps,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEyeSlash,
  faEye,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";

interface Props extends InputProps {
  className?: string;
  label?: string;
  optional?: boolean;
  required?: boolean;
  showEyes?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  inputRef?: any;
  errorMessage?: string | null;
}

// eslint-disable-next-line react/display-name
const InputTextField = memo(
  ({
    className,
    label,
    required,
    optional,
    showEyes,
    startIcon,
    endIcon,
    inputRef,
    type,
    errorMessage,
    ...props
  }: Props) => {
    const [faFocus, setFaFocus] = useState(false);

    const [toggleEyes, setToggleEyes] = useState(false);

    const handleClick = () => {
      setToggleEyes(!toggleEyes);
    };
    const { ref: refInput, ...inputProps } = inputRef || { ref: null };

    const renderInput = () => {
      return (
        <Input
          {...inputProps}
          type={!toggleEyes ? type : "text"}
          onFocus={() => setFaFocus(true)}
          onBlur={() => setFaFocus(false)}
          className={clsx(
            { "form-control-danger": !!errorMessage },
            classes.input
          )}
          innerRef={refInput}
          {...props}
        />
      );
    };

    return (
      <FormGroup
        className={clsx(
          classes.root,
          { "has-danger": !!errorMessage },
          className
        )}
      >
        {label && (
          <label className={classes.label}>
            {label} {required && <span className={classes.required}>*</span>}
            {optional && <span className={classes.optional}>(optional)</span>}
          </label>
        )}
        {!!startIcon || !!showEyes ? (
          <InputGroup className={faFocus ? "input-group-focus" : ""}>
            {startIcon && (
              <InputGroupAddon addonType="prepend">
                <InputGroupText>{startIcon}</InputGroupText>
              </InputGroupAddon>
            )}
            {renderInput()}
            {showEyes && (
              <InputGroupAddon addonType="append">
                <InputGroupText
                  onClick={handleClick}
                  className={classes.iconEyes}
                >
                  {toggleEyes ? (
                    <FontAwesomeIcon icon={faEye} />
                  ) : (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  )}
                </InputGroupText>
              </InputGroupAddon>
            )}
          </InputGroup>
        ) : (
          renderInput()
        )}
        {errorMessage && (
          <span
            className={clsx(
              "text-danger ml-2 mt-1 d-block",
              classes.errorMessage
            )}
          >
            {errorMessage}
          </span>
        )}
      </FormGroup>
    );
  }
);

export default InputTextField;
