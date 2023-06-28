// import React, { memo } from "react";

// import classes from "./styles.module.scss";
// import clsx from "clsx";
// import { FormGroup, Input, InputProps, Label } from "reactstrap";

// interface Props extends InputProps {
//   className?: string;
//   content?: React.ReactNode;
//   inputRef?: any;
//   errorMessage?: string | null;
// }

// // eslint-disable-next-line react/display-name
// const CustomCheckbox = memo(
//   ({ className, content, inputRef, errorMessage, ...rest }: Props) => {
//     const { ref: refInput, ...inputProps } = inputRef || { ref: null };

//     return (
//       <FormGroup check className={className}>
//         <Label check className={classes.black}>
//           <Input
//             {...inputProps}
//             type="checkbox"
//             innerRef={refInput}
//             {...rest}
//           />
//           <span className={clsx("form-check-sign",classes.formCheckSign)} />
//           {content}
//         </Label>
//         <span className="text-danger text-left ml-1 mt-1 d-block">
//           {errorMessage}
//         </span>
//       </FormGroup>
//     );
//   }
// );

// export default CustomCheckbox;
import { Checkbox, CheckboxProps } from "@mui/material";
import { memo } from "react";
import classes from "./styles.module.scss";
import CheckIcon from "@mui/icons-material/Check";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import clsx from "clsx";
interface Props extends CheckboxProps {
  cleanPadding?: boolean;
  content?: string;
}

const InputCheckbox = memo(({ cleanPadding, content, ...rest }: Props) => {
  return (
    <>
      <Checkbox
        className={clsx(classes.root, { [classes.cleanPadding]: cleanPadding })}
        icon={<CheckBoxOutlineBlankIcon className={classes.icon} />}
        checkedIcon={
          <CheckIcon className={classes.checkIcon} fontSize="small" />
        }
        {...rest}
      />
      {content && <span className={classes.content}>{content}</span>}
    </>
  );
});

export default InputCheckbox;
