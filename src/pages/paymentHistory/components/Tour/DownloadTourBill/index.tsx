import { memo, useMemo } from "react";
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
import _ from "lodash";
import { fTime } from "utils/formatTime";
interface DownloadTourBillProps {
  onClose: () => void;
  isOpen: boolean;
  tourBill: TourBill;
}

const DownloadTourBill = memo(
  ({ onClose, isOpen, tourBill }: DownloadTourBillProps) => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation("common");

    const daySchedule = useMemo(() => {
      return _.chain(tourBill?.tourData?.tourSchedules)
        .groupBy((item) => item?.day)
        .map((value) => ({ day: value[0].day, schedule: value }))
        .value();
    }, [tourBill?.tourData?.tourSchedules]);

    console.log(daySchedule, "---schedule");

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
              {tourBill?.firstName} {tourBill?.lastName}
            </Col>
          </Row>
          <Row className="mb-1">
            <Col xs={4} className={classes.titleInfo}>
              {t("popup_download_view_tour_title_person_email")}
            </Col>
            <Col xs={8} className={classes.info}>
              {tourBill?.email}
            </Col>
          </Row>
          <Row className="mb-1">
            <Col xs={4} className={classes.titleInfo}>
              {t("popup_download_view_tour_title_person_phone")}
            </Col>
            <Col xs={8} className={classes.info}>
              {tourBill?.phoneNumber}
            </Col>
          </Row>
          <Row className="mb-1">
            <Col xs={4} className={classes.titleInfo}>
              {t("popup_download_view_tour_title_person_purchase")}
            </Col>
            <Col xs={8} className={classes.info}>
              {moment(tourBill?.createdAt).format("DD/MM/YYYY")}
            </Col>
          </Row>
          <Row className="mb-1">
            <Col xs={4} className={classes.titleInfo}>
              {t("popup_download_view_tour_title_person_adult")}
            </Col>
            <Col xs={8} className={classes.info}>
              {fCurrency2VND(tourBill?.tourOnSaleData?.adultPrice)} VND/
              {t("popup_download_view_tour_title_person_ticket")}
            </Col>
          </Row>
          {tourBill?.amountChild !== 0 && (
            <Row className="mb-1">
              <Col xs={4} className={classes.titleInfo}>
                {t("popup_download_view_tour_title_person_child")}
              </Col>
              <Col xs={8} className={classes.info}>
                {fCurrency2VND(tourBill?.tourOnSaleData?.childrenPrice)} VND/
                {t("popup_download_view_tour_title_person_ticket")}
              </Col>
            </Row>
          )}
          <Row className="mb-1">
            <Col xs={4} className={classes.titleInfo}>
              {t("popup_download_view_tour_title_person_discount")}:
            </Col>
            <Col xs={8} className={classes.info}>
              {tourBill?.discount <= 100 ? (
                fPercent(tourBill?.discount)
              ) : (
                <span>{fCurrency2VND(tourBill?.discount)}VND</span>
              )}
            </Col>
          </Row>
          <Row className="mb-1">
            <Col xs={4} className={classes.titleInfo}>
              {t("popup_download_view_tour_title_person_adult")}:
            </Col>
            <Col xs={8} className={classes.info}>
              {tourBill?.amountAdult}
            </Col>
          </Row>
          {tourBill?.amountChild !== 0 && (
            <Row className="mb-1">
              <Col xs={4} className={classes.titleInfo}>
                {t("popup_download_view_tour_title_person_child")}:
              </Col>
              <Col xs={8} className={classes.info}>
                {tourBill?.amountChild}
              </Col>
            </Row>
          )}
          <Row className="mb-1">
            <Col xs={4} className={classes.titleInfo}>
              {t("popup_download_view_tour_title_person_total")}:
            </Col>
            <Col xs={8} className={classes.info}>
              {fCurrency2VND(tourBill?.totalBill)} VND
            </Col>
          </Row>
          <hr />
          <h3 className={classes.title}>
            {t("popup_download_view_tour_title_section_info")}
          </h3>
          <Row className="mb-1">
            <Col xs={4} className={classes.titleInfo}>
              {t("popup_download_view_tour_title_tour_name")}:
            </Col>
            <Col xs={8} className={classes.info}>
              {tourBill?.tourData?.title}
            </Col>
          </Row>
          <Row className="mb-1">
            <Col xs={4} className={classes.titleInfo}>
              {t("popup_download_view_tour_title_tour_location")}:
            </Col>
            <Col xs={8} className={classes.info}>
              {tourBill?.tourData?.moreLocation},{" "}
              {tourBill?.tourData?.commune?.name},{" "}
              {tourBill?.tourData?.district?.name},{" "}
              {tourBill?.tourData?.city?.name}
            </Col>
          </Row>
          <Row className="mb-1">
            <Col xs={4} className={classes.titleInfo}>
              {t("tour_detail_section_tour_place_start")}:
            </Col>
            <Col xs={8} className={classes.info}>
              {tourBill?.tourData?.moreLocationStart},{" "}
              {tourBill?.tourData?.communeStart?.name},{" "}
              {tourBill?.tourData?.districtStart?.name},{" "}
              {tourBill?.tourData?.cityStart?.name}
            </Col>
          </Row>
          <Row className="mb-1">
            <Col xs={4} className={classes.titleInfo}>
              {t("popup_download_view_tour_title_tour_start")}:
            </Col>
            <Col xs={8} className={classes.info}>
              {moment(tourBill?.tourOnSaleData?.startDate).format("DD-MM-YYYY")}
            </Col>
          </Row>
          <Row className="mb-1">
            <Col xs={4} className={classes.titleInfo}>
              {t("popup_download_view_tour_title_tour_duration")}:
            </Col>
            <Col xs={8} className={classes.info}>
              {tourBill?.tourData?.numberOfDays} days -{" "}
              {tourBill?.tourData?.numberOfNights} nights
            </Col>
          </Row>
          <Row className="mb-3">
            <Col xs={4} className={classes.titleInfo}>
              {t("popup_download_view_tour_title_tour_contact")}:
            </Col>
            <Col xs={8} className={classes.info}>
              {tourBill?.tourData?.contact}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col xs={4} className={classes.titleInfo}>
              Lịch trình:
            </Col>
            {/* {daySchedule?.map((schedule, index) => (
              <Col xs={8} className={classes.info} key={index}>
                
                {schedule?.schedule?.map((item, index) => (
                  <div key={index}>
                    {fTime(item?.startTime)}-{fTime(item?.endTime)}:{" "}
                    <span>{item?.description}</span>
                  </div>
                ))}
              </Col>
            ))} */}
          </Row>
          {daySchedule?.map((schedule, index) => (
            <Row className="mb-3" key={index}>
              <Col xs={4} className={classes.titleInfo}>
                Ngày {schedule?.day} :
              </Col>
              <Col xs={8} className={classes.info}>
                {schedule?.schedule?.map((item, index) => (
                  <div key={index}>
                    <span style={{ fontWeight: "600" }}>
                      {fTime(item?.startTime)}
                    </span>
                    -
                    <span style={{ fontWeight: "600" }}>
                      {fTime(item?.endTime)}
                    </span>
                    : {item?.description}
                  </div>
                ))}
              </Col>
            </Row>
          ))}
        </div>
        <ModalFooter className={classes.downloadBtnWrapper}>
          {tourBill?.paymentStatus === EPaymentStatus.PAID ? (
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
