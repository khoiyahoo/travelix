import React, { memo, useMemo } from "react";
import {
  Modal,
  ModalProps,
  ModalHeader,
  ModalBody,
  Container,
} from "reactstrap";
import classes from "./styles.module.scss";
import { DETAIL_SECTION, Tour } from "models/tour";
import { Grid } from "@mui/material";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import _ from "lodash";
import { useTranslation } from "react-i18next";

interface Props extends ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  toggle?: () => void;
  tour?: Tour;
}

// eslint-disable-next-line react/display-name
const PopupDetailTour = memo((props: Props) => {
  const { isOpen, toggle, onClose, tour } = props;
  const { t, i18n } = useTranslation("common");

  const policyType = useMemo(() => {
    return _.toArray(_.groupBy(tour?.tourPolicies, "policyType"));
  }, [tour]);

  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} className={classes.root}>
        <ModalHeader toggle={toggle} className={classes.title}>
          {tour?.title}
        </ModalHeader>

        <ModalBody className={classes.modalBody}>
          <Container>
            <Grid
              id={DETAIL_SECTION.section_reschedule_refund}
              className={classes.rootOverview}
            >
              <Grid className={classes.boxDuration}>
                <p className={classes.titleDetail}>
                  -{" "}
                  {t(
                    "popup_detail_tour_and_terms_conditions_tour_reschedule_title"
                  )}
                  :{" "}
                </p>
                {policyType[0]?.length ? (
                  <ul>
                    {policyType[0]?.map((item, index) => (
                      <li
                        key={index}
                        className={classes.itemPolicy}
                        dangerouslySetInnerHTML={{
                          __html: t(
                            "popup_detail_tour_and_terms_conditions_tour_reschedule_content",
                            {
                              dayRange: item?.dayRange,
                              moneyRate: item?.moneyRate,
                            }
                          ),
                        }}
                      ></li>
                    ))}
                  </ul>
                ) : (
                  <p>
                    {t(
                      "popup_detail_tour_and_terms_conditions_tour_no_reschedule"
                    )}
                  </p>
                )}

                <p className={classes.titleDetail}>
                  -{" "}
                  {t(
                    "popup_detail_tour_and_terms_conditions_tour_refund_title"
                  )}
                  :{" "}
                </p>
                {policyType[1]?.length ? (
                  <ul>
                    {policyType[1]?.map((item, index) => (
                      <li
                        key={index}
                        className={classes.itemPolicy}
                        dangerouslySetInnerHTML={{
                          __html: t(
                            "popup_detail_tour_and_terms_conditions_tour_refund_content",
                            {
                              dayRange: item?.dayRange,
                              moneyRate: item?.moneyRate,
                            }
                          ),
                        }}
                      ></li>
                    ))}
                  </ul>
                ) : (
                  <p>
                    {t("popup_detail_tour_and_terms_conditions_tour_no_refund")}
                  </p>
                )}
              </Grid>
            </Grid>
          </Container>
        </ModalBody>
      </Modal>
    </>
  );
});

export default PopupDetailTour;
