import { memo, useEffect, useState } from "react";
import { Row, Col, Container } from "reactstrap";
import classes from "./styles.module.scss";
import clsx from "clsx";
import { useDispatch } from "react-redux";
import { Grid } from "@mui/material";
import Button, { BtnType } from "components/common/buttons/Button";
import { useRouter } from "next/router";
import { TourBillService } from "services/enterprise/tourBill";
import { TourBill } from "models/enterprise/tourBill";
import { setErrorMess } from "redux/reducers/Status/actionTypes";
import moment from "moment";
import { fCurrency2VND, fPercent } from "utils/formatNumber";
import { useTranslation } from "react-i18next";
import StatusPayment from "components/StatusPayment";

interface Props {
  tourBillId: number;
}

const DetailTourBill = memo(({ tourBillId }: Props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [tourBill, setTourBill] = useState<TourBill>(null);
  const { t, i18n } = useTranslation("common");

  useEffect(() => {
    TourBillService.findOne(tourBillId)
      .then((res) => {
        setTourBill(res?.data);
      })
      .catch((e) => {
        dispatch(setErrorMess(e));
      });
  }, [tourBillId]);

  return (
    <Grid className={classes.root}>
      <Row className={clsx(classes.rowHeaderBox, classes.title)}>
        <Grid sx={{ display: "flex" }}>
          <h3>{t("enterprise_management_section_tour_bill_title")}</h3>
          <StatusPayment status={tourBill?.status} type={true} />
        </Grid>
        <Button
          onClick={() => {
            router.push("/enterprises/tourBills");
          }}
          btnType={BtnType.Primary}
        >
          {t("common_back")}
        </Button>
      </Row>
      <Grid className={clsx(classes.wrapper)} container spacing={1}>
        <Grid item xs={6}>
          <h3 className={classes.titleBill}>Tour Bill</h3>
          <Row className={clsx("mb-1", classes.row)}>
            <Col xs={4} className={classes.titleInfo}>
              {t("enterprise_management_section_tour_bill_title_person_name")}:
            </Col>
            <Col xs={8} className={classes.info}>
              {tourBill?.firstName} {tourBill?.lastName}
            </Col>
          </Row>
          <Row className={clsx("mb-1", classes.row)}>
            <Col xs={4} className={classes.titleInfo}>
              {t(
                "enterprise_management_section_tour_bill_title_person_name_phone"
              )}
              :
            </Col>
            <Col xs={8} className={classes.info}>
              {Array?.isArray(tourBill?.participantsInfo) ? (
                tourBill?.participantsInfo?.map((item) => (
                  <>
                    {item?.fullName} - {item?.phoneNumber}
                    <br />
                  </>
                ))
              ) : (
                <>No participants</>
              )}
            </Col>
          </Row>
          <Row className={clsx("mb-1", classes.row)}>
            <Col xs={4} className={classes.titleInfo}>
              {t("enterprise_management_section_tour_bill_title_person_email")}:
            </Col>
            <Col xs={8} className={classes.info}>
              {tourBill?.email}
            </Col>
          </Row>
          <Row className={clsx("mb-1", classes.row)}>
            <Col xs={4} className={classes.titleInfo}>
              {t("enterprise_management_section_tour_bill_title_person_phone")}:
            </Col>
            <Col xs={8} className={classes.info}>
              {tourBill?.phoneNumber}
            </Col>
          </Row>
          <Row className={clsx("mb-1", classes.row)}>
            <Col xs={4} className={classes.titleInfo}>
              {t(
                "enterprise_management_section_tour_bill_title_person_purchase"
              )}
              :
            </Col>
            <Col xs={8} className={classes.info}>
              {moment(tourBill?.createdAt).format("DD/MM/YYYY")}
            </Col>
          </Row>
          <Row className={clsx("mb-1", classes.row)}>
            <Col xs={4} className={classes.titleInfo}>
              {t("enterprise_management_section_tour_bill_title_person_adult")}:
            </Col>
            <Col xs={8} className={classes.info}>
              {fCurrency2VND(tourBill?.tourOnSaleData?.adultPrice)} VND/ticket
            </Col>
          </Row>
          {tourBill?.amountChild !== 0 && (
            <Row className={clsx("mb-1", classes.row)}>
              <Col xs={4} className={classes.titleInfo}>
                {t(
                  "enterprise_management_section_tour_bill_title_person_child"
                )}
                :
              </Col>
              <Col xs={8} className={classes.info}>
                {fCurrency2VND(tourBill?.tourOnSaleData?.childrenPrice)} VND/
                {t(
                  "enterprise_management_section_tour_bill_title_person_ticket"
                )}
              </Col>
            </Row>
          )}
          <Row className={clsx("mb-1", classes.row)}>
            <Col xs={4} className={classes.titleInfo}>
              {t(
                "enterprise_management_section_tour_bill_title_person_discount"
              )}
              :
            </Col>
            <Col xs={8} className={classes.info}>
              {tourBill?.discount <= 100 ? (
                fPercent(tourBill?.discount)
              ) : (
                <span>{fCurrency2VND(tourBill?.discount)}VND</span>
              )}
            </Col>
          </Row>
          <Row className={clsx("mb-1", classes.row)}>
            <Col xs={4} className={classes.titleInfo}>
              {t("enterprise_management_section_tour_bill_title_person_adult")}:
            </Col>
            <Col xs={8} className={classes.info}>
              {tourBill?.amountAdult}
            </Col>
          </Row>
          {tourBill?.amountChild !== 0 && (
            <Row className={clsx("mb-1", classes.row)}>
              <Col xs={4} className={classes.titleInfo}>
                {t(
                  "enterprise_management_section_tour_bill_title_person_child"
                )}
                :
              </Col>
              <Col xs={8} className={classes.info}>
                {tourBill?.amountChild}
              </Col>
            </Row>
          )}
          <Row className={clsx("mb-1", classes.row)}>
            <Col xs={4} className={classes.titleInfo}>
              {t("enterprise_management_section_tour_bill_title_person_total")}:
            </Col>
            <Col xs={8} className={classes.info}>
              {fCurrency2VND(tourBill?.totalBill)} VND
            </Col>
          </Row>
        </Grid>
        <Grid item xs={6}>
          <h3 className={classes.titleBill}>Tour Information</h3>
          <Row className={clsx("mb-1", classes.row)}>
            <Col xs={4} className={classes.titleInfo}>
              {t("enterprise_management_section_tour_bill_title_tour_name")}:
            </Col>
            <Col xs={8} className={classes.info}>
              {tourBill?.tourData?.title}
            </Col>
          </Row>
          <Row className={clsx("mb-1", classes.row)}>
            <Col xs={4} className={classes.titleInfo}>
              {t("enterprise_management_section_tour_bill_title_tour_location")}
              :
            </Col>
            <Col xs={8} className={classes.info}>
              {tourBill?.tourData?.moreLocation},{" "}
              {tourBill?.tourData?.commune?.name},{" "}
              {tourBill?.tourData?.district?.name},{" "}
              {tourBill?.tourData?.city?.name}
            </Col>
          </Row>
          <Row className={clsx("mb-1", classes.row)}>
            <Col xs={4} className={classes.titleInfo}>
              {t("enterprise_management_section_tour_bill_title_tour_start")}:
            </Col>
            <Col xs={8} className={classes.info}>
              {moment(tourBill?.tourOnSaleData?.startDate).format("DD-MM-YYYY")}
            </Col>
          </Row>
          <Row className={clsx("mb-1", classes.row)}>
            <Col xs={4} className={classes.titleInfo}>
              {t("enterprise_management_section_tour_bill_title_tour_duration")}
              :
            </Col>
            <Col xs={8} className={classes.info}>
              {tourBill?.tourData?.numberOfDays} days -{" "}
              {tourBill?.tourData?.numberOfNights} nights
            </Col>
          </Row>
          <Row className={clsx("mb-1", classes.row)}>
            <Col xs={4} className={classes.titleInfo}>
              {t("enterprise_management_section_tour_bill_title_tour_contact")}:
            </Col>
            <Col xs={8} className={classes.info}>
              {tourBill?.tourData?.contact}
            </Col>
          </Row>
        </Grid>
      </Grid>
    </Grid>
  );
});

export default DetailTourBill;
