import React, { memo, useState } from "react";
import {
  OutlinedInput,
  FormControl,
  InputAdornment,
  OutlinedInputProps,
  Grid,
} from "@mui/material";

import classes from "./styles.module.scss";
import SearchIcon from "@mui/icons-material/Search";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlassArrowRight } from "@fortawesome/free-solid-svg-icons";
interface InputSearchProps extends OutlinedInputProps {
  type?: string;
  placeholder?: string;
  name?: string;
  defaultValue?: string;
  value?: string;
  disabled?: boolean;
  className?: any;
  inputRef?: any;
  autoComplete?: string;
  width?: string;
  onClick?: () => void;
}
const InputSearch = memo(
  React.forwardRef((props: InputSearchProps, ref) => {
    const {
      type,
      placeholder,
      name,
      defaultValue,
      value,
      disabled,
      className,
      inputRef,
      autoComplete,
      width,
      onClick,
      ...rest
    } = props;

    const { ref: refInput, ...inputProps } = inputRef || { ref: null };
    const [focus, setFocus] = useState(false);
    const onFocus = () => {
      setFocus(true);
    };
    const onBlur = () => {
      setFocus(false);
    };
    return (
      <FormControl sx={{ width: width }}>
        <OutlinedInput
          type="text"
          disabled={disabled}
          className={className}
          placeholder={placeholder}
          name={name}
          fullWidth
          defaultValue={defaultValue}
          value={value}
          classes={{
            root: classes.rootTextField,
            input: classes.inputTextfield,
          }}
          onFocus={onFocus}
          onBlur={onBlur}
          autoComplete={autoComplete}
          endAdornment={
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          }
          {...inputProps}
          inputRef={refInput}
          {...rest}
        />
        {focus && (
          <Grid className={classes.recentSearchBox} onClick={onClick}>
            <Grid
              sx={{
                display: "inline-flex",
                alignItems: "center",
                padding: "10px 16px",
                backgroundColor: "var(--gray-10)",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              <FontAwesomeIcon
                icon={faMagnifyingGlassArrowRight}
              ></FontAwesomeIcon>
              <div>
                <p>Vinhome</p>
                <span>Recent Searchs</span>
              </div>
            </Grid>
          </Grid>
        )}
      </FormControl>
    );
  })
);
export default InputSearch;
