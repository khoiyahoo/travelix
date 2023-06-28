import clsx from "clsx";
import React, { memo } from "react";
import { FieldError, FieldErrors, Merge } from "react-hook-form";
import { FormGroup } from "reactstrap";
import classes from "./styles.module.scss";
import TagsInput from "react-tagsinput";

interface Props {
  label?: string;
  className?: string;
  placeholder?: string;
  errorMessage: string | FieldError | Merge<FieldError, FieldErrors<any>>;
  name: string;
  control?: any;
  value?: number[] | string[];
  onChange?: (value: any) => void;
}

// eslint-disable-next-line react/display-name
const CustomTagsInput = memo(
  ({
    label,
    className,
    placeholder,
    errorMessage,
    control,
    value,
    ...rest
  }: Props) => {
    return (
      <>
      {label && <p className={classes.label}>{label}</p>}
      <FormGroup
        className={clsx(
          classes.root,
          { "has-danger": !!errorMessage },
          className
        )}
      >  
        <TagsInput
          autoComplete="off"
          tagProps={{
            className: "react-tagsinput-tag badge badge-primary",
          }}
          value={value}
          onlyUnique
          addKeys={[9, 13, 188]}
          inputProps={{
            className: `react-tagsinput-input ${classes.reactTagsInput}`,
            placeholder: placeholder,
          }}
          {...rest}
        />
      </FormGroup>
      {errorMessage && (
          <span className="text-danger ml-2 mt-1 d-block"><>{errorMessage}</></span>
        )}
      </>
    );
  }
);

export default CustomTagsInput;
