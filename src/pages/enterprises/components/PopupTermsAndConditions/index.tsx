import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  ModalProps,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Container,
} from "reactstrap";
import classes from "./styles.module.scss";
import "aos/dist/aos.css";
import Button, { BtnType } from "components/common/buttons/Button";
import { DETAIL_SECTION, Tour } from "models/tour";
import { Link } from "react-scroll";
import { Grid, Tabs, useMediaQuery, useTheme } from "@mui/material";
import styled from "styled-components";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import _ from "lodash";
import { Commission, FindAll } from "models/enterprise/commission";
import { DataPagination, EServiceType } from "models/general";
import { useDispatch } from "react-redux";
import { CommissionService } from "services/enterprise/commission";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { fCurrency2VND, fPercent } from "utils/formatNumber";
import ApartmentIcon from "@mui/icons-material/Apartment";
import { useTranslation } from "react-i18next";

interface Props extends ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  toggle?: () => void;
}

// eslint-disable-next-line react/display-name
const TermsAndCondition = memo((props: Props) => {
  const { isOpen, toggle, onClose } = props;
  const { t, i18n } = useTranslation("common");

  const dispatch = useDispatch();

  const [dataTourCommission, setDataTourCommission] = useState<Commission[]>();

  const [dataHotelCommission, setDataHotelCommission] =
    useState<Commission[]>();

  const fetchDataTourCommission = (value?: { serviceType?: number }) => {
    const params: FindAll = {
      serviceType: EServiceType?.TOUR,
    };

    dispatch(setLoading(true));
    CommissionService.findAll(params)
      .then((res) => {
        setDataTourCommission(res.data);
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  const fetchDataHotelCommission = (value?: { serviceType?: number }) => {
    const params: FindAll = {
      serviceType: EServiceType?.HOTEL,
    };
    dispatch(setLoading(true));
    CommissionService.findAll(params)
      .then((res) => {
        setDataHotelCommission(res.data);
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  useEffect(() => {
    fetchDataTourCommission();
    fetchDataHotelCommission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} className={classes.root}>
        <ModalHeader toggle={toggle} className={classes.title}>
          {t("popup_enterprise_term_and_condition")}
        </ModalHeader>

        <ModalBody className={classes.modalBody}>
          <Container>
            <Grid className={classes.rootOverview}>
              <Grid className={classes.boxTitle}>
                <AirplaneTicketIcon />
                <p>{t("popup_enterprise_term_and_condition_tour")}</p>
              </Grid>
              {dataTourCommission?.length ? (
                dataTourCommission?.map((item, index) => (
                  <Grid className={classes.boxDuration} key={index}>
                    {item?.maxPrice ? (
                      <p
                        className={classes.titleDetail}
                        dangerouslySetInnerHTML={{
                          __html: t(
                            "popup_enterprise_term_and_condition_content",
                            {
                              minPrice: fCurrency2VND(item?.minPrice),
                              maxPrice: fCurrency2VND(item?.maxPrice),
                              rate: fPercent(item?.rate * 100),
                            }
                          ),
                        }}
                      ></p>
                    ) : (
                      <p
                        className={classes.titleDetail}
                        dangerouslySetInnerHTML={{
                          __html: t(
                            "popup_enterprise_term_and_condition_content_no_max_price",
                            {
                              minPrice: fCurrency2VND(item?.minPrice),
                              rate: fPercent(item?.rate * 100),
                            }
                          ),
                        }}
                      ></p>
                    )}
                  </Grid>
                ))
              ) : (
                <Grid className={classes.boxDuration}>
                  <p className={classes.titleDetail}>
                    {t("popup_enterprise_term_and_condition_no_terms")}
                  </p>
                </Grid>
              )}
              <Grid className={classes.boxDuration}>
                <p className={classes.titleDetail}>
                  {t("popup_enterprise_term_and_condition_content_revenue")}
                </p>
              </Grid>
            </Grid>
            <Grid className={classes.rootOverview}>
              <Grid className={classes.boxTitle}>
                <ApartmentIcon />
                <p>{t("popup_enterprise_term_and_condition_stay")}</p>
              </Grid>
              {dataHotelCommission?.length ? (
                dataHotelCommission?.map((item, index) => (
                  <Grid className={classes.boxDuration} key={index}>
                    {item?.maxPrice ? (
                      <p
                        className={classes.titleDetail}
                        dangerouslySetInnerHTML={{
                          __html: t(
                            "popup_enterprise_term_and_condition_content",
                            {
                              minPrice: fCurrency2VND(item?.minPrice),
                              maxPrice: fCurrency2VND(item?.maxPrice),
                              rate: fPercent(item?.rate * 100),
                            }
                          ),
                        }}
                      ></p>
                    ) : (
                      <p
                        className={classes.titleDetail}
                        dangerouslySetInnerHTML={{
                          __html: t(
                            "popup_enterprise_term_and_condition_content_no_max_price",
                            {
                              minPrice: fCurrency2VND(item?.minPrice),
                              rate: fPercent(item?.rate * 100),
                            }
                          ),
                        }}
                      ></p>
                    )}
                  </Grid>
                ))
              ) : (
                <Grid className={classes.boxDuration}>
                  <p className={classes.titleDetail}>
                    {t("popup_enterprise_term_and_condition_no_terms")}
                  </p>
                </Grid>
              )}
              <Grid className={classes.boxDuration}>
                <p className={classes.titleDetail}>
                  {t(
                    "popup_enterprise_term_and_condition_content_revenue_stay"
                  )}
                </p>
              </Grid>
            </Grid>
          </Container>
        </ModalBody>
        <ModalFooter className={classes.footer}>
          <Button btnType={BtnType.Secondary} onClick={toggle} className="mr-2">
            {t("common_cancel")}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
});

export default TermsAndCondition;
