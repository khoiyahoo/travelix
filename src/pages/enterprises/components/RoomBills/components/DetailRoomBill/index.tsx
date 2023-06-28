import { memo, useEffect, useState } from "react";
import { Row, Col, Container } from "reactstrap";
import classes from "./styles.module.scss";
import clsx from "clsx";
import { useDispatch } from "react-redux";
import { Grid } from "@mui/material";
import Button, { BtnType } from "components/common/buttons/Button";
import { useRouter } from "next/router";
import { setErrorMess } from "redux/reducers/Status/actionTypes";
import moment from "moment";
import { fCurrency2VND, fPercent } from "utils/formatNumber";
import { useTranslation } from "react-i18next";
import StatusPayment from "components/StatusPayment";
import { RoomBill } from "models/enterprise/roomBill";
import { fTime } from "utils/formatTime";
import { RoomBillService } from "services/enterprise/roomBill";

interface Props {
  roomBillId: number;
}

const DetailRoomBill = memo(({ roomBillId }: Props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [roomBill, setRoomBill] = useState<RoomBill>(null);
  const { t, i18n } = useTranslation("common");

  useEffect(() => {
    RoomBillService.findOne(roomBillId)
      .then((res) => {
        setRoomBill(res?.data);
      })
      .catch((e) => {
        dispatch(setErrorMess(e));
      });
  }, [roomBillId]);

  return (
    <Grid className={classes.root}>
      <Row className={clsx(classes.rowHeaderBox, classes.title)}>
        <Grid sx={{ display: "flex" }}>
          <h3>{t("enterprise_management_section_tour_bill_title")}</h3>
          <StatusPayment status={roomBill?.status} type={true} />
        </Grid>
        <Button
          onClick={() => {
            router.push("/enterprises/roomBills");
          }}
          btnType={BtnType.Primary}
        >
          {t("common_back")}
        </Button>
      </Row>
      <Grid className={clsx(classes.wrapper)} container spacing={1}>
        <Grid item xs={6}>
          <h3 className={classes.titleBill}>
            {t("enterprise_management_section_room_bill_title_room_detail")}
          </h3>
          <Row className={clsx("mb-1", classes.row)}>
            <Col xs={4} className={classes.titleInfo}>
              {t("enterprise_management_section_tour_bill_title_person_name")}:
            </Col>
            <Col xs={8} className={classes.info}>
              {roomBill?.firstName} {roomBill?.lastName}
            </Col>
          </Row>
          <Row className={clsx("mb-1", classes.row)}>
            <Col xs={4} className={classes.titleInfo}>
              {t("enterprise_management_section_tour_bill_title_person_email")}:
            </Col>
            <Col xs={8} className={classes.info}>
              {roomBill?.email}
            </Col>
          </Row>
          <Row className={clsx("mb-1", classes.row)}>
            <Col xs={4} className={classes.titleInfo}>
              {t("enterprise_management_section_tour_bill_title_person_phone")}:
            </Col>
            <Col xs={8} className={classes.info}>
              {roomBill?.phoneNumber}
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
              {moment(roomBill?.createdAt).format("DD/MM/YYYY")}
            </Col>
          </Row>
          <Row className={clsx("mb-1", classes.row)}>
            <Col xs={4} className={classes.titleInfo}>
              {t(
                "enterprise_management_section_tour_bill_title_person_discount"
              )}
              :
            </Col>
            <Col xs={8} className={classes.info}>
              {roomBill?.discount <= 100 ? (
                fPercent(roomBill?.discount)
              ) : (
                <span>{fCurrency2VND(roomBill?.discount)}VND</span>
              )}
            </Col>
          </Row>
          <Row className={clsx("mb-1", classes.row)}>
            <Col xs={4} className={classes.titleInfo}>
              {t("enterprise_management_section_tour_bill_title_person_total")}:
            </Col>
            <Col xs={8} className={classes.info}>
              {fCurrency2VND(roomBill?.totalBill)} VND
            </Col>
          </Row>
        </Grid>
        <Grid item xs={6}>
          <h3 className={classes.titleBill}>
            {" "}
            {t("enterprise_management_section_room_bill_title_stay_room_info")}
          </h3>
          <Row className={clsx("mb-1", classes.row)}>
            <Col xs={4} className={classes.titleInfo}>
              {t(
                "enterprise_management_section_room_bill_title_stay_name_info"
              )}
              :
            </Col>
            <Col xs={8} className={classes.info}>
              {roomBill?.stayData?.name}
            </Col>
          </Row>
          <Row className={clsx("mb-1", classes.row)}>
            <Col xs={4} className={classes.titleInfo}>
              {t("enterprise_management_section_tour_bill_title_tour_location")}
              :
            </Col>
            <Col xs={8} className={classes.info}>
              {roomBill?.stayData?.moreLocation},{" "}
              {roomBill?.stayData?.commune?.name},{" "}
              {roomBill?.stayData?.district?.name},{" "}
              {roomBill?.stayData?.city?.name}
            </Col>
          </Row>
          <Row className={clsx("mb-1", classes.row)}>
            <Col xs={4} className={classes.titleInfo}>
              {t(
                "enterprise_management_section_stay_header_table_check_in_out"
              )}
              :
            </Col>
            <Col xs={8} className={classes.info}>
              {fTime(roomBill?.stayData?.checkInTime)} -{" "}
              {fTime(roomBill?.stayData?.checkInTime)}
            </Col>
          </Row>
          <Row className={clsx("mb-1", classes.row)}>
            <Col xs={4} className={classes.titleInfo}>
              {t("enterprise_management_section_tour_bill_title_tour_contact")}:
            </Col>
            <Col xs={8} className={classes.info}>
              {roomBill?.stayData?.contact}
            </Col>
          </Row>
          <h3 className={classes.titleBill}>
            {" "}
            {t(
              "enterprise_management_section_room_bill_title_stay_room_info_title"
            )}
          </h3>
          {roomBill?.roomBillDetail?.map((item, index) => (
            <div key={index}>
              <Row className={clsx("mb-1", classes.row)}>
                <Col xs={4} className={classes.titleInfo}>
                  {t(
                    "enterprise_management_section_room_bill_title_room_name_info"
                  )}
                  :
                </Col>
                <Col xs={8} className={classes.info}>
                  {item?.roomData?.title}
                </Col>
              </Row>
              <Row className={clsx("mb-1", classes.row)}>
                <Col xs={4} className={classes.titleInfo}>
                  {t(
                    "enterprise_management_section_room_bill_title_room_amount_info"
                  )}
                  :
                </Col>
                <Col xs={8} className={classes.info}>
                  {item?.amount}
                </Col>
              </Row>
              <Row className={clsx("mb-1", classes.row)}>
                <Col xs={4} className={classes.titleInfo}>
                  {t(
                    "enterprise_management_section_stay_statistic_header_table_quantity"
                  )}
                  :
                </Col>
                <Col xs={8} className={classes.info}>
                  {item?.roomData?.numberOfAdult}{" "}
                  {t("payment_history_page_hotel_adult")},{" "}
                  {item?.roomData?.numberOfChildren}{" "}
                  {t("payment_history_page_hotel_child")}
                </Col>
              </Row>
              <Row className={clsx("mb-1", classes.row)}>
                <Col xs={4} className={classes.titleInfo}>
                  {t(
                    "enterprise_management_section_stay_statistic_header_table_bed"
                  )}
                  :
                </Col>
                <Col xs={8} className={classes.info}>
                  {item?.roomData?.numberOfBed}{" "}
                  {t("payment_history_page_hotel_bed")}
                </Col>
              </Row>
            </div>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
});

export default DetailRoomBill;
