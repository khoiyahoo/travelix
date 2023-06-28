import { memo } from "react";
import { FormControl } from "@mui/material";
import Select, {
  components,
  DropdownIndicatorProps,
  GroupBase,
  OptionProps,
  SingleValueProps,
  StylesConfig,
} from "react-select";
import classes from "./styles.module.scss";
import { Controller } from "react-hook-form";
import { StateManagerProps } from "react-select/dist/declarations/src/stateManager";
import TextTitle from "components/common/texts/TextTitle";
import ErrorMessage from "components/common/texts/ErrorMessage";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useTranslation } from "react-i18next";

const customStyles = (
  error?: boolean
): StylesConfig<any, boolean, GroupBase<unknown>> => ({
  indicatorSeparator: () => ({
    display: "none",
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    div: {
      padding: "6px 8px",
    },
  }),
  option: (provided, state) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 16,
    lineHeight: "24px",
    letterSpacing: "0.015em",
    color: "var(--eerie-black)",
    padding: "14px 15px",
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    zIndex: "10 !important",
    background:
      state.isSelected || state.isFocused ? "var(--gray-10)" : "#FFFFFF",
  }),
  placeholder: (provided, state) => ({
    ...provided,
    fontSize: 14,
    fontWeight: 400,
    color: state.isFocused ? "var(--gray-50)" : "var(--gray-50)",
    whiteSpace: "nowrap",
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "10px 0 6px 16px",
    minWidth: "50px",
    color: "var(--text-color)",
    div: {
      paddingBottom: 0,
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    display: "flex",
    fontSize: 14,
    fontWeight: 400,
    alignItems: "center",
    color: "var(--text-color)",
  }),
  control: (provided, state) => ({
    ...provided,
    cursor: state.isDisabled ? "not-allowed" : "pointer",
    background: state.isDisabled ? "var(--gray-5)" : "#FFFFFF",
    border: state.isFocused
      ? "1px solid var(--primary-light-color)"
      : "1px solid #c4c4c4",
    // borderColor:"var(--gray-40)",
    svg: {
      color: state.isFocused ? "" : "var(--gray-60)",
    },
    div: {
      color: state.isFocused ? "var(--text-color)" : "var(--gray-90)",
    },
    boxShadow: "0",
    "&:hover": {
      border: "1px solid var(--text-color)",
    },
    "&:hover svg, &:hover div": {
      color: "var(--text-color)",
    },
  }),
});

const DropdownIndicator = (props: DropdownIndicatorProps) => {
  return (
    <components.DropdownIndicator {...props}>
      {props.selectProps.menuIsOpen ? (
        <KeyboardArrowUpIcon />
      ) : (
        <KeyboardArrowDownIcon />
      )}
    </components.DropdownIndicator>
  );
};

const Option = ({ children, ...props }: OptionProps<any>) => (
  <components.Option {...props}>
    {props.data?.img && (
      <img src={props.data.img} alt="" className={classes.iconOption} />
    )}
    {children}
  </components.Option>
);

const SingleValue = ({ children, ...props }: SingleValueProps<any>) => (
  <components.SingleValue {...props}>
    {props.data?.img && (
      <img src={props.data.img} alt="" className={classes.iconValue} />
    )}
    {children}
  </components.SingleValue>
);

interface InputSelectProps {
  className?: string;
  title?: string;
  name?: string;
  errorMessage?: string | null;
  control?: any;
  bindKey?: string;
  bindLabel?: string;
  selectProps?: StateManagerProps;
  fullWidth?: boolean;
  optional?: boolean;
  onChange?: (e: any) => void;
  defaultValue?: any;
  value?: any;
}

const InputSelect = memo((props: InputSelectProps) => {
  const {
    className,
    title,
    errorMessage,
    name,
    control,
    bindKey,
    bindLabel,
    selectProps,
    fullWidth,
    optional,
    onChange,
    defaultValue,
    value,
  } = props;
  const { t } = useTranslation("common");

  const getOptionLabel = (option: any) => {
    switch (bindLabel || "name") {
      case "translation":
        return t(option["translation"]);
      default:
        return option[bindLabel || "name"];
    }
  };

  return (
    <FormControl
      className={className}
      sx={{ width: fullWidth ? "100%" : "auto" }}
    >
      {title && (
        <label className={classes.title}>
          {title} {optional && <span>({t("common_optional")})</span>}
        </label>
      )}
      {control ? (
        <>
          <Controller
            name={name}
            control={control}
            render={({ field }) =>
              onChange ? (
                <Select
                  {...field}
                  styles={customStyles(!!errorMessage)}
                  getOptionValue={(option) => option[bindKey || "id"]}
                  getOptionLabel={(option) => getOptionLabel(option)}
                  components={{ DropdownIndicator, Option, SingleValue }}
                  onChange={(e) => onChange && onChange(e)}
                  {...selectProps}
                />
              ) : (
                <Select
                  {...field}
                  styles={customStyles(!!errorMessage)}
                  getOptionValue={(option) => option[bindKey || "id"]}
                  getOptionLabel={(option) => getOptionLabel(option)}
                  components={{ DropdownIndicator, Option, SingleValue }}
                  {...selectProps}
                />
              )
            }
          />
        </>
      ) : onChange ? (
        <Select
          styles={customStyles(!!errorMessage)}
          getOptionValue={(option) => option[bindKey || "id"]}
          getOptionLabel={(option) => getOptionLabel(option)}
          components={{ DropdownIndicator, Option, SingleValue }}
          onChange={(e) => onChange && onChange(e)}
          {...selectProps}
        />
      ) : (
        <Select
          styles={customStyles(!!errorMessage)}
          getOptionValue={(option) => option[bindKey || "id"]}
          getOptionLabel={(option) => getOptionLabel(option)}
          components={{ DropdownIndicator, Option, SingleValue }}
          {...selectProps}
        />
      )}
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </FormControl>
  );
});
export default InputSelect;
