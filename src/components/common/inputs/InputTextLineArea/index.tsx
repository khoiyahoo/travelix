import { memo, useState } from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { Input, InputProps, FormGroup, InputGroup } from "reactstrap";
import { FieldError, FieldErrors, Merge, UseFormRegisterReturn } from "react-hook-form";

interface Props extends InputProps{
  className?: string;
  label?: string;
  labelIcon?: React.ReactNode;
  placeholder?: string;
  autoComplete?: string;
  inputRef?: UseFormRegisterReturn<string>;
  errorMessage?: string | FieldError | Merge<FieldError, FieldErrors<any>>;
}

// eslint-disable-next-line react/display-name
const CustomTextarea = memo(
  ({ className, label, labelIcon, inputRef, errorMessage, ...props }: Props) => {
    const { ref: refInput, ...inputProps } = inputRef || { ref: null };
    const [faFocus, setFaFocus] = useState(false);

    return (
      <FormGroup
        className={clsx(
          classes.root,
          { "has-danger": !!errorMessage },
          className
        )}
      >
        {label && <label className={classes.label}>{labelIcon} {label}</label>}
        <InputGroup className={faFocus ? "input-group-focus" : ""}>
            <Input
            {...inputProps}
            type="textarea"
            className={clsx(classes.textarea, {
                "form-control-danger" : !!errorMessage,
            })}
            innerRef={refInput}
            {...props}
            onFocus={() => setFaFocus(true)}
            onBlur={() => setFaFocus(false)}
            />
        </InputGroup>
        {errorMessage && (
          <span className={clsx("text-danger ml-2 mt-1 d-block", classes.errorMessage)}><>{errorMessage}</></span>
        )}
      </FormGroup>
    );
  }
);

export default CustomTextarea;
