import { memo } from "react";
import { Controller, FieldError, FieldErrors, Merge } from "react-hook-form";
import Select, { GroupBase, StylesConfig } from "react-select";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { FormGroup } from "reactstrap";
import { StateManagerProps } from "react-select/dist/declarations/src/stateManager";

const customStyles = (
  _?: boolean
): StylesConfig<any, boolean, GroupBase<unknown>> => ({
  indicatorSeparator: () => ({
    display: "none",
  }),
  container: (provided) => ({
    ...provided,
    margin: 0,
  }),
  option: (provided, state) => ({
    ...provided,
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    background: state.isSelected ? "#e8f1fb" : "#ffffff",
    color: "#2c2c2c",
    "&:hover": {
      background: "#e8f1fb",
    },
  }),
  control: (provided, state) => ({
    ...provided,
    border: state.menuIsOpen ? "1px solid #f96332" : "1px solid #e3e3e3",
    borderRadius: "30px",
    boxShadow: "none",
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      borderColor: "#f96332",
      transition: "all 0.3s ease-in-out",
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "5px 18px",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#888888",
    opacity: 0.8,
    fontSize: "14px",
    fontWeight: "400",
    margin: 0,
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#2c2c2c",
    fontSize: "0.8571em",
    fontWeight: 400,
    margin: 0,
  }),
  input: (provided) => ({
    ...provided,
    margin: 0,
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
});

interface Props extends StateManagerProps {
  label?: string;
  labelIcon?: string;
  className?: string;
  errorMessage?: string | FieldError | Merge<FieldError, FieldErrors<any>>;
  name: string;
  control?: any;
  bindKey?: any;
  bindLabel?: any;
}

// eslint-disable-next-line react/display-name
const CustomSelect = memo(({label, labelIcon, className, errorMessage, name, control, bindKey, bindLabel, ...rest}: Props) => {

    return (
      <FormGroup
        className={clsx(
          classes.root,
          { "has-danger": !!errorMessage },
          className
        )}
      >
        {label && <label className={classes.label}>{labelIcon} {label}</label>}
        {control ? (
          <>
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  styles={customStyles(!!errorMessage)}
                  menuPortalTarget={document.querySelector("body")}
                  getOptionValue={(option) => option[bindKey || "id"]}
                  getOptionLabel={(option) => option[bindLabel || "name"]}
                  {...rest}
                />
              )}
            />
          </>
        ) : (
          <>
            <Select
              styles={customStyles(!!errorMessage)}
              menuPortalTarget={document.querySelector("body")}
              getOptionValue={(option: any) => option[bindKey || "id"]}
              getOptionLabel={(option: any) => option[bindLabel || "name"]}
              {...rest}
            />
          </>
        )}
        {errorMessage && (
          <span className="text-danger ml-2 mt-1 d-block"><>{errorMessage}</></span>
        )}
      </FormGroup>
    );
  }
);

export default CustomSelect;
