import { memo } from "react";
import { Modal, Button, Table } from "reactstrap";
import classes from "./styles.module.scss";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import clsx from "clsx";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { fCurrency2VND } from "utils/formatNumber";
import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";

interface DownloadRevenueProps {
  onClose: () => void;
  isOpen: boolean;
  revenue: any;
  revenueType: number;
  monthOrYearValue: number;
}

const DownloadRevenue = memo(({ onClose, isOpen, revenue, revenueType, monthOrYearValue }: DownloadRevenueProps) => {
  const dispatch = useDispatch();
  const { allHotels } = useSelector((state: ReducerType) => state.enterprise);

  const handleDownload = () => {
    const pdfElement = document.getElementById("pdf-component");
    if (pdfElement) {
      dispatch(setLoading(true));
      const w = pdfElement?.offsetWidth;
      const h = pdfElement?.offsetHeight;
      const doc = new jsPDF("l", "pt", "a4");
      html2canvas(pdfElement, {
        scale: 4,
      })
        .then(async (canvas) => {
          const imgData = canvas.toDataURL("image/png");
          doc.addImage(imgData as any, "PNG", 0, 30, w, h);

          doc.save(`Revenue.pdf`);
          onClose();
        })
        .catch((e) => {
          dispatch(setErrorMess(e));
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    }
  };

  const convertNumberToMonth = (value) => {
    switch (value) {
      case 0:
        return "January";
      case 1:
        return "February";
      case 2:
        return "March";
      case 3:
        return "April";
      case 4:
        return "May";
      case 5:
        return "June";
      case 6:
        return "July";
      case 7:
        return "August";
      case 8:
        return "September";
      case 9:
        return "October";
      case 10:
        return "November";
      default:
        return "December";
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} centered scrollable className={classes.modal}>
      <div id="pdf-component" className={clsx(classes.pdfWrapper)}>
        <h3 className={classes.title}>
          {revenueType === 1 ? `${convertNumberToMonth(monthOrYearValue)} revenue` : `Revenue of ${monthOrYearValue}`}
        </h3>
        <h5 className={classes.subTitle}>Unit: VND</h5>
        <Table className={classes.table} responsive>
          <thead>
            <tr>
              <th scope="row" className={clsx(classes.index, classes.paragraphFontSize)}>
                #
              </th>
              <th className={classes.paragraphFontSize}>Name</th>
              {revenue.length > 0 && revenueType === 1
                ? revenue[0]?.map((item, index) => (
                    <th key={index} className={clsx("text-center", classes.paragraphFontSize)}>
                      {item.date}
                    </th>
                  ))
                : revenue[0]?.map((item, index) => (
                    <th key={index} className={clsx("text-center", classes.paragraphFontSize)}>
                      {index + 1}
                    </th>
                  ))}
            </tr>
          </thead>
          <tbody>
            {allHotels?.map((item, index) => {
              return (
                <>
                  <tr key={index}>
                    <th scope="row" className={clsx(classes.index, classes.paragraphFontSize)}>
                      {index + 1}
                    </th>
                    <td className={clsx(classes.paragraphFontSize, classes.hotelTitle)}>{item?.name}</td>
                    {revenueType === 1
                      ? revenue[index]?.map((item, index) => (
                          <th key={index} className={clsx("text-center", classes.paragraphFontSize)}>
                            {fCurrency2VND(Math.floor(item.revenue))}
                          </th>
                        ))
                      : revenue[index]?.map((item, index) => (
                          <th key={index} className="text-center">
                            {fCurrency2VND(Math.floor(item))}
                          </th>
                        ))}
                  </tr>
                </>
              );
            })}
          </tbody>
        </Table>
      </div>
      <div className={classes.downloadBtnWrapper}>
        <Button onClick={handleDownload} color="primary">
          Download
        </Button>
      </div>
    </Modal>
  );
});

export default DownloadRevenue;
