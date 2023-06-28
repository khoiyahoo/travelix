import { memo, useEffect, useState } from "react";
import { Row, Col, Container, Table } from "reactstrap";
import classes from "./styles.module.scss";
import clsx from "clsx";
import { useDispatch } from "react-redux";
import {
  Box,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
} from "@mui/material";
import Button, { BtnType } from "components/common/buttons/Button";
import { useRouter } from "next/router";
import { TourBillService } from "services/admin/tourBill";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { fCurrency2VND } from "utils/formatNumber";
import { useTranslation } from "react-i18next";
import { DataPagination, TableHeaderLabel } from "models/general";
import { Moment } from "moment";
import {
  GetAllBillOfOneTourOnSale,
  IStatisticByTourOnSale,
  IStatisticTourBill,
  StatisticByTourOnSale,
} from "models/admin/tourBill";
import InputDatePicker from "components/common/inputs/InputDatePicker";
import TableHeader from "components/Table/TableHeader";
import { ExpandMoreOutlined } from "@mui/icons-material";
import SearchNotFound from "components/SearchNotFound";
import VisibilityIcon from "@mui/icons-material/Visibility";
import moment from "moment";
import StatusPayment from "components/StatusPayment";

interface Props {
  tourOnSaleId?: number;
}

const TourRevenue = memo(({ tourOnSaleId }: Props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const enterpriseId = Number(router.query?.action);
  const tourId = Number(router.query?.type);

  const { t, i18n } = useTranslation("common");
  const [data, setData] = useState<DataPagination<IStatisticTourBill>>();

  const tableHeaders: TableHeaderLabel[] = [
    { name: "id", label: "#", sortable: false },
    {
      name: "name",
      label: t("admin_management_section_tour_bill_header_table_name"),
      sortable: false,
    },
    {
      name: "name",
      label: t("enterprise_management_section_tour_bill_title_person_name"),
      sortable: false,
    },
    {
      name: "duration",
      label: t("admin_management_section_tour_bill_header_table_duration"),
      sortable: false,
    },
    {
      name: "total bill",
      label: t("admin_management_section_tour_bill_header_table_total"),
      sortable: false,
    },
    {
      name: "amount",
      label: t("admin_management_section_tour_bill_header_table_amount"),
      sortable: false,
    },
    {
      name: "start time",
      label: t("admin_management_section_tour_bill_header_table_start_date"),
      sortable: false,
    },
    {
      name: "booking date",
      label: t("admin_management_section_tour_bill_header_table_booking_date"),
      sortable: false,
    },
    {
      name: "status",
      label: t("admin_management_section_tour_bill_header_table_status"),
      sortable: false,
    },
  ];

  const fetchData = (value?: { take?: number; page?: number }) => {
    const params: GetAllBillOfOneTourOnSale = {
      take: value?.take || data?.meta?.take || 10,
      page: value?.page || data?.meta?.page || 1,
    };
    dispatch(setLoading(true));
    TourBillService.getAllBillOfOneTourOnSale(tourOnSaleId, params)
      .then((res) => {
        if (res.success) {
          setData({
            data: res.data,
            meta: res.meta,
          });
        }
      })
      .catch((e) => {
        dispatch(setErrorMess(e));
      })
      .finally(() => dispatch(setLoading(false)));
  };

  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    newPage: number
  ) => {
    fetchData({
      page: newPage + 1,
    });
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    fetchData({
      take: Number(event.target.value),
      page: 1,
    });
  };

  const onBack = () => {
    router.push({
      pathname: `/admin/statisticTourBills/${enterpriseId}/${tourId}`,
    });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.root}>
      <Row className={clsx(classes.rowHeaderBox, classes.title)}>
        <h3>{t("admin_management_section_tour_bill")}</h3>
        <Button btnType={BtnType.Primary} onClick={onBack}>
          {t("common_back")}
        </Button>
      </Row>
      <TableContainer component={Paper} sx={{ marginTop: "2rem" }}>
        <Table className={classes.table}>
          <TableHeader headers={tableHeaders} />
          <TableBody>
            {data?.data?.length ? (
              data.data?.map((item, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell scope="row" className={classes.tableCell}>
                      {index + 1}
                    </TableCell>
                    <TableCell className={classes.tableCell} component="th">
                      {item?.tourData?.title}
                    </TableCell>
                    <TableCell className={classes.tableCell} component="th">
                      {item?.firstName} {item?.lastName}
                    </TableCell>
                    <TableCell className={classes.tableCell} component="th">
                      {item?.tourData?.numberOfDays} {t("common_days")}{" "}
                      {item?.tourData?.numberOfNights} {t("common_nights")}
                    </TableCell>
                    <TableCell className={classes.tableCell} component="th">
                      {fCurrency2VND(item?.totalBill)} VND
                    </TableCell>
                    <TableCell className={classes.tableCell} component="th">
                      {item?.amountAdult + item?.amountChild}{" "}
                      {t(
                        "admin_management_section_tour_bill_body_table_amount"
                      )}
                    </TableCell>
                    <TableCell className={classes.tableCell} component="th">
                      {moment(item?.tourOnSaleData?.startDate).format(
                        "DD-MM-YYYY"
                      )}
                    </TableCell>
                    <TableCell className={classes.tableCell} component="th">
                      {moment(item?.createdAt).format("DD-MM-YYYY")}
                    </TableCell>
                    <TableCell className={classes.tableCell} component="th">
                      <StatusPayment status={item?.status} type={true} />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={9}>
                  <SearchNotFound searchQuery={""} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          labelRowsPerPage={t("common_row_per_page")}
          labelDisplayedRows={function defaultLabelDisplayedRows({
            from,
            to,
            count,
          }) {
            return t("common_row_of_page", {
              from: from,
              to: to,
              count: count,
            });
          }}
          component="div"
          className={classes.pagination}
          count={data?.meta?.itemCount || 0}
          rowsPerPage={data?.meta?.take || 10}
          page={data?.meta?.page ? data?.meta?.page - 1 : 0}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </div>
  );
});

export default TourRevenue;
