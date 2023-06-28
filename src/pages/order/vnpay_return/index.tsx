import React, { useEffect } from "react";
import Link from "next/link";
// reactstrap components
import {
  Container,
  Row,
  TabPane,
  TabContent,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";

import { NextPage } from "next";
import { images } from "configs/images";
import classes from "./styles.module.scss";
import SectionHeader from "components/Header/SectionHeader";

import Button, { BtnType } from "components/common/buttons/Button";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import DangerousIcon from "@mui/icons-material/Dangerous";
import clsx from "clsx";
import { TourBillService } from "services/normal/tourBill";
import { EPaymentStatus } from "models/general";
import { useDispatch } from "react-redux";
import { setErrorMess } from "redux/reducers/Status/actionTypes";
import { useTranslation } from "react-i18next";

export enum EActiveNav {
  Tour_Active = 1,
  Hotel_Active = 2,
}

const VNPay: NextPage = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation("common");

  const getStatusPayment = (status) => {
    if (status === "00") {
      return EPaymentStatus.PAID;
    } else {
      return EPaymentStatus.FAILED;
    }
  };

  useEffect(() => {
    TourBillService.updateTourBill(Number(router?.query.vnp_TxnRef), {
      paymentStatus: getStatusPayment(router?.query?.vnp_TransactionStatus),
    })
      .then(() => {})
      .catch((e) => {
        dispatch(setErrorMess(e));
      });
  }, [router]);

  return (
    <div className="main-content">
      <div className={clsx("header page-header-image", classes.headerWrapper)}>
        <Container className={classes.container}>
          <Modal isOpen={true} className={classes.root}>
            {router?.query?.vnp_TransactionStatus === "00" ? (
              <ModalHeader className={classes.title}>
                <FontAwesomeIcon icon={faCircleCheck} />
                {t("order_vn_pay_title")}
              </ModalHeader>
            ) : (
              <ModalHeader className={classes.dangerTitle}>
                <DangerousIcon />
                {t("order_vn_pay_title")}
              </ModalHeader>
            )}
            <ModalBody>
              {router?.query?.vnp_TransactionStatus === "00" ? (
                <span>{t("order_vn_pay_sub_title_success")}</span>
              ) : (
                <span>{t("order_vn_pay_sub_title_error")}</span>
              )}
              <Link href="/paymentHistory/tour">
                <a>
                  <Button
                    btnType={BtnType.Primary}
                    className={classes.linkBackTo}
                    onClick={() => {
                      router.push("/paymentHistory/tour");
                    }}
                  >
                    {t("order_vn_pay_go_to_payment")}
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

export default VNPay;
