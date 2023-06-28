import React, { memo } from "react";
import {
  Modal,
  ModalProps,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
// import classes from "./styles.module.scss";
import "aos/dist/aos.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import classes from "./styles.module.scss";
import { clsx } from "clsx";
import { images } from "configs/images";
import { Grid } from "@mui/material";
import Button, { BtnType } from "components/common/buttons/Button";
import { useTranslation } from "react-i18next";

interface Props extends ModalProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
  toggle?: () => void;
  onClick?: () => void;
}

// eslint-disable-next-line react/display-name
const PopupDefault = memo((props: Props) => {
  const { className, isOpen, toggle, onClick } = props;
  const { t, i18n } = useTranslation("common");

  return (
    <>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        className={clsx(className, classes.root)}
      >
        <ModalHeader toggle={toggle} className={classes.title}>
          {t("popup_check_review_title")}
        </ModalHeader>
        <ModalBody>
          <Grid className={classes.content}>
            <img src={images.imgChecking.src} alt="anh"></img>
            <p>{t("popup_check_review_sub_title")}</p>
          </Grid>
        </ModalBody>
        <ModalFooter className={classes.footer}>
          <Button btnType={BtnType.Outlined} onClick={toggle}>
            {t("popup_check_review_check_again_btn")}
          </Button>
          <Button btnType={BtnType.Primary} onClick={onClick} className="ml-2">
            {t("common_continue")}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
});

export default PopupDefault;
