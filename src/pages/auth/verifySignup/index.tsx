import type { NextPage } from "next";
import { Container, Row, Col, Modal, ModalBody, ModalHeader } from "reactstrap";
import clsx from "clsx";
import classes from "./styles.module.scss";
import Button, { BtnType } from "components/common/buttons/Button";
import { useEffect } from "react";
import { UserService } from "services/user";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const VerifySignup: NextPage = () => {
  const { t } = useTranslation("common");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get("code");
    const userId = urlParams.get("userId");
    if (code && userId) {
      UserService.verifySignup({
        code: code,
        userId: Number(userId),
      });
    }
  }, []);

  return (
    <div className="main-content">
      <div className={clsx("header page-header-image", classes.headerWrapper)}>
        <Container className={classes.container}>
          <Modal isOpen={true} className={classes.root}>
            <ModalHeader className={classes.title}>
              <FontAwesomeIcon icon={faCircleCheck} />
              {t("auth_verify_sign_up")}
            </ModalHeader>
            <ModalBody>
              {t("auth_verify_sign_up_title_sub")}
              <Link href="/auth/login">
                <a>
                  <Button
                    btnType={BtnType.Linear}
                    className={classes.linkBackTo}
                  >
                    {t("auth_forgot_password_btn_back")}
                  </Button>
                </a>
              </Link>
            </ModalBody>
          </Modal>
        </Container>
      </div>
    </div>
  );
};
export default VerifySignup;
