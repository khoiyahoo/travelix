import { memo } from "react";
import { Modal, Row, Col, ModalFooter, ModalHeader } from "reactstrap";
import classes from "./styles.module.scss";
import moment from "moment";
import clsx from "clsx";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useDispatch } from "react-redux";
import { setLoading } from "redux/reducers/Status/actionTypes";
import { TourBill } from "models/tourBill";
import { fCurrency2VND, fPercent } from "utils/formatNumber";
import Button, { BtnType } from "components/common/buttons/Button";
import QRCode from "react-qr-code";
import { EPaymentStatus } from "models/general";
import { useTranslation } from "react-i18next";
import { RoomBill } from "models/roomBill";
import { fTime } from "utils/formatTime";
import { Grid } from "@mui/material";
interface DownloadTourBillProps {
  onClose: () => void;
  isOpen: boolean;
  roomBill: RoomBill;
}

const DownloadTourBill = memo(
  ({ onClose, isOpen, roomBill }: DownloadTourBillProps) => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation("common");

    const handleDownload = () => {
      const pdfElement = document.getElementById("pdf-component");
      if (pdfElement) {
        dispatch(setLoading(true));
        const w = pdfElement?.offsetWidth;
        const h = pdfElement?.offsetHeight;
        const doc = new jsPDF("p", "pt", "a4");
        html2canvas(pdfElement, {
          scale: 4,
        }).then(async (canvas) => {
          const imgData = canvas.toDataURL("image/png");
          doc.addImage(imgData as any, "PNG", 0, 30, w, h);

          doc.save(`tour-bill.pdf`);
          onClose();
          dispatch(setLoading(false));
        });
      }
    };

    return (
      <Modal
        isOpen={isOpen}
        toggle={onClose}
        centered
        scrollable
        className={classes.modal}
      >
        <ModalHeader
          isOpen={isOpen}
          toggle={onClose}
          className={classes.titleHeader}
        >
          {t("popup_download_view_tour_title")}
        </ModalHeader>
        <div id="pdf-component" className={clsx(classes.pdfWrapper)}>
          <h3 className={classes.title}>
            {t("popup_download_view_tour_title_section")}
          </h3>
          <Row className="mb-1">
            <Col xs={4} className={classes.titleInfo}>
              {t("popup_download_view_tour_title_person_name")}
            </Col>
            <Col xs={8} className={classes.info}>
              {roomBill?.firstName} {roomBill?.lastName}
            </Col>
          </Row>
          <Row className="mb-1">
            <Col xs={4} className={classes.titleInfo}>
              {t("popup_download_view_tour_title_person_email")}
            </Col>
            <Col xs={8} className={classes.info}>
              {roomBill?.email}
            </Col>
          </Row>
          <Row className="mb-1">
            <Col xs={4} className={classes.titleInfo}>
              {t("popup_download_view_tour_title_person_phone")}
            </Col>
            <Col xs={8} className={classes.info}>
              {roomBill?.phoneNumber}
            </Col>
          </Row>
          <Row className="mb-1">
            <Col xs={4} className={classes.titleInfo}>
              {t("popup_download_view_tour_title_person_purchase")}
            </Col>
            <Col xs={8} className={classes.info}>
              {moment(roomBill?.createdAt).format("DD/MM/YYYY")}
            </Col>
          </Row>
          {/* {tourBill?.amountChild !== 0 && (
            <Row className="mb-1">
              <Col xs={4} className={classes.titleInfo}>
                {t("popup_download_view_tour_title_person_child")}
              </Col>
              <Col xs={8} className={classes.info}>
                {fCurrency2VND(tourBill?.tourOnSaleData?.childrenPrice)} VND/
                {t("popup_download_view_tour_title_person_ticket")}
              </Col>
            </Row>
          )} */}
          <Row className="mb-1">
            <Col xs={4} className={classes.titleInfo}>
              {t("popup_download_view_tour_title_person_discount")}:
            </Col>
            <Col xs={8} className={classes.info}>
              {roomBill?.discount <= 100 ? (
                fPercent(roomBill?.discount)
              ) : (
                <span>{fCurrency2VND(roomBill?.discount)}VND</span>
              )}
            </Col>
          </Row>
          <Row className="mb-1">
            <Col xs={4} className={classes.titleInfo}>
              {t("popup_download_view_tour_title_person_total")}:
            </Col>
            <Col xs={8} className={classes.info}>
              {fCurrency2VND(roomBill?.totalBill)} VND
            </Col>
          </Row>
          <hr />
          <h3 className={classes.title}>
            {t("payment_history_page_room_title")}
          </h3>
          {roomBill?.roomBillDetail?.map((item, index) => (
            <Grid key={index}>
              <Row>
                <Col xs={4} className={classes.titleInfo}>
                  {t("payment_history_page_hotel_room_name")}:
                </Col>
                <Col xs={8} className={classes.info}>
                  {item?.roomData?.title}
                </Col>
              </Row>
              <Row key={index}>
                <Col xs={4} className={classes.titleInfo}>
                  {t("payment_history_page_hotel_amount_room_booked")}:
                </Col>
                <Col xs={8} className={classes.info}>
                  {item?.amount} {t("payment_history_page_hotel_room")}
                </Col>
              </Row>
              <Row key={index}>
                <Col xs={4} className={classes.titleInfo}>
                  {t("payment_history_page_hotel_number_adult")}:
                </Col>
                <Col xs={8} className={classes.info}>
                  {item?.roomData?.numberOfAdult}
                  {t("payment_history_page_hotel_adult")}
                </Col>
              </Row>
              <Row key={index}>
                <Col xs={4} className={classes.titleInfo}>
                  {t("payment_history_page_hotel_number_child")}:
                </Col>
                <Col xs={8} className={classes.info}>
                  {item?.roomData?.numberOfChildren}{" "}
                  {t("payment_history_page_hotel_child")}
                </Col>
              </Row>
              <Row key={index}>
                <Col xs={4} className={classes.titleInfo}>
                  {t("payment_history_page_hotel_number_bed")}:
                </Col>
                <Col xs={8} className={classes.info}>
                  {item?.roomData?.numberOfBed}{" "}
                  {t("payment_history_page_hotel_bed")}
                </Col>
              </Row>
              <hr/>
            </Grid>
          ))}

          <Row className="mb-1">
            <Col xs={4} className={classes.titleInfo}>
              {t("popup_download_view_tour_title_tour_location")}:
            </Col>
            <Col xs={8} className={classes.info}>
              {roomBill?.stayData?.moreLocation},{" "}
              {roomBill?.stayData?.commune?.name},{" "}
              {roomBill?.stayData?.district?.name},{" "}
              {roomBill?.stayData?.city?.name}
            </Col>
          </Row>
          <Row className="mb-1">
            <Col xs={4} className={classes.titleInfo}>
              {t("payment_history_page_hotel_check_in")}:
            </Col>
            <Col xs={8} className={classes.info}>
              {fTime(roomBill?.stayData?.checkInTime)}
            </Col>
          </Row>
          <Row className="mb-1">
            <Col xs={4} className={classes.titleInfo}>
              {t("payment_history_page_hotel_check_out")}:
            </Col>
            <Col xs={8} className={classes.info}>
              {fTime(roomBill?.stayData?.checkOutTime)}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col xs={4} className={classes.titleInfo}>
              {t("popup_download_view_tour_title_tour_contact")}:
            </Col>
            <Col xs={8} className={classes.info}>
              {roomBill?.stayData?.contact}
            </Col>
          </Row>
        </div>
        <ModalFooter className={classes.downloadBtnWrapper}>
          {roomBill?.paymentStatus === EPaymentStatus.PAID ? (
            <Button onClick={handleDownload} btnType={BtnType.Primary}>
              {t("popup_download_view_tour_download_btn")}
            </Button>
          ) : (
            <Button onClick={onClose} btnType={BtnType.Primary}>
              {t("common_cancel")}
            </Button>
          )}
        </ModalFooter>
      </Modal>
    );
  }
);

export default DownloadTourBill;
