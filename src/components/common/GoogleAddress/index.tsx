import React, { useState, useEffect, useRef, memo } from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { FieldError, FieldErrors, Merge } from "react-hook-form";
import {
  FormControlProps,
  FormControl,
  OutlinedInput,
  OutlinedInputProps,
} from "@mui/material";
import ErrorMessage from "../texts/ErrorMessage";
let autoComplete: any;

const loadScript = (url: string, callback: any) => {
  let script: any = document.createElement("script");
  script.type = "text/javascript";

  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
};

const handleScriptLoad = (onChange: any, autoCompleteRef: any) => {
  autoComplete = new window.google.maps.places.Autocomplete(
    autoCompleteRef.current,
    { fields: ["address_components"], types: ["geocode", "establishment"] }
  );
  autoComplete.setFields(["address_components", "formatted_address"]);
  autoComplete.addListener("place_changed", () => handlePlaceSelect(onChange));
};

const handlePlaceSelect = async (onChange: any) => {
  const addressObject = autoComplete.getPlace();
  const latitude = addressObject?.geometry?.location.lat();
  const longitude = addressObject?.geometry?.location.lng();
  const address = seperateAddress(addressObject);
  onChange({
    address,
    latitude,
    longitude,
  });
};

const seperateAddress = (addressObject: any) => {
  const { address_components, formatted_address, value, ...rest } =
    addressObject;
  let country: string, city: string, commune: string, district: string;
  address_components?.forEach((item: any) => {
    commune = item.short_name;
    if (item.types.includes("country")) {
      country = item.long_name;
    }
    if (item.types.includes("administrative_area_level_1")) {
      city = item.long_name;
    }
  });

  return {
    country,
    city,
    commune,
    district,
    formattedAddress: `${commune}, ${city}`,
  };
};

interface Props extends OutlinedInputProps {
  title?: string;
  titleRequired?: boolean;
  optional?: boolean;
  className?: string;
  placeholder?: any;
  root?: string;
  name?: string;
  defaultValue?: string;
  onChange?: (value: any) => void;
  value?: string;
  isShowError?: boolean;
  rootProps?: FormControlProps;
  errorMessage?: string | FieldError | Merge<FieldError, FieldErrors<any>>;
}

const SearchLocationInput = memo(
  ({
    title,
    className,
    titleRequired,
    placeholder,
    onChange,
    value,
    root,
    name,
    optional,
    errorMessage,
    isShowError,
    rootProps,
    defaultValue,
    ...props
  }: Props) => {
    const autoCompleteRef = useRef(null);
    const [valueShow, setValueShow] = useState("");

    useEffect(() => {
      setValueShow(value || "");
    }, [value]);

    useEffect(() => {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=AIzaSyCe3Vka8IIYYbTKEzyV3x0Ay6HNAV8g6z8&libraries=places`,
        () => handleScriptLoad(onChange, autoCompleteRef)
      );
    }, []);

    return (
      <FormControl className={clsx(classes.root, root)} {...rootProps}>
        {title && (
          <label className={classes.title}>
            {title}
            {optional ? (
              <span className={classes.optional}>&nbsp;(optional)</span>
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
          autoComplete="off"
          classes={{
            root: clsx(classes.inputTextfield, {
              [classes.inputInvalid]: !!errorMessage || isShowError,
            }),
          }}
          fullWidth
          defaultValue={defaultValue}
          name={name}
          className={className}
          inputRef={autoCompleteRef}
          placeholder={placeholder}
          value={valueShow}
          onChange={(e) => setValueShow(e.target.value)}
          {...props}
        />
        {errorMessage && (
          <ErrorMessage>
            <>{errorMessage}</>
          </ErrorMessage>
        )}
      </FormControl>
    );
  }
);

export default SearchLocationInput;
