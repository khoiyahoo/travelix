import { memo } from "react";
import { Button as ButtonReactStrap, ButtonProps as ButtonPropsReactStrap} from 'reactstrap';
import clsx from "clsx";
import classes from './styles.module.scss';

export enum BtnType {
  Primary = 'Primary',
  Secondary = 'Secondary',
  Outlined = 'Outlined',
  Linear = 'Linear',
  Raised ='Raised'
}

interface ButtonProps extends ButtonPropsReactStrap {
  btnType?: BtnType;
  width?: string;
  padding?: string;
  nowrap?: boolean;
  isDot?: boolean;
}

// eslint-disable-next-line react/display-name
const Button = memo((props: ButtonProps) => {
  const { className, btnType, isDot, children, ...rest } = props;
  return (
    <ButtonReactStrap
      className={clsx(
        classes.root,
        {
          [classes.btnPrimary]: btnType === BtnType.Primary,
          [classes.btnSecondary]: btnType === BtnType.Secondary,
          [classes.btnOutlined]: btnType === BtnType.Outlined,
          [classes.btnLinear]: btnType === BtnType.Linear,
          [classes.btnRaised]: btnType === BtnType.Raised,  
        },
        className
      )}
      type="button"
      {...rest}
    >
      {children}
      { isDot &&       
        <div className={classes.dotContainer}>
          <span></span>
          <span></span>
          <span></span>
        </div> }

    </ButtonReactStrap>
  );
});
export default Button;