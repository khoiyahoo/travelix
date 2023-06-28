import React, { memo, useEffect, useState } from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { Row } from "reactstrap";
import { useDispatch } from "react-redux";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import SearchNotFound from "components/SearchNotFound";
import {
  Box,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import Button, { BtnType } from "components/common/buttons/Button";
import TableHeader from "components/Table/TableHeader";
import { DataPagination, TableHeaderLabel } from "models/general";
import InputDatePicker from "components/common/inputs/InputDatePicker";
import { useRouter } from "next/router";
import "react-loading-skeleton/dist/skeleton.css";
import {
  StatisticAll,
  ITourOnSaleStatistic,
  StatisticTourOnSale,
} from "models/enterprise/tourBill";
import { TourBillService } from "services/enterprise/tourBill";
import { fCurrency2VND } from "utils/formatNumber";
import moment, { Moment } from "moment";
import { useTranslation } from "react-i18next";
import { ExpandMoreOutlined } from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface Props {
  tourOnSaleId?: number;
}
// eslint-disable-next-line react/display-name
const TourOnSaleStatistic = memo(({ tourOnSaleId }: Props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t, i18n } = useTranslation("common");

  const tableHeaders: TableHeaderLabel[] = [
    { name: "#", label: "#", sortable: false },
    {
      name: "departure day",
      label: t(
        "enterprise_management_section_tour_statistic_header_table_departure"
      ),
      sortable: false,
    },
    // {
    //   name: "quantity",
    //   label: t(
    //     "enterprise_management_section_tour_statistic_header_table_quantity"
    //   ),
    //   sortable: false,
    // },
    // {
    //   name: "number of booking",
    //   label: t(
    //     "enterprise_management_section_tour_statistic_header_table_number_booking"
    //   ),
    //   sortable: false,
    // },
    // {
    //   name: "number of tickets booked",
    //   label: t(
    //     "enterprise_management_section_tour_statistic_header_table_number_of_ticket_booked"
    //   ),
    //   sortable: false,
    // },
    {
      name: "number of adult tickets",
      label: t(
        "enterprise_management_section_tour_statistic_header_table_number_of_adult_ticket_booked"
      ),
      sortable: false,
    },
    {
      name: "number of child tickets",
      label: t(
        "enterprise_management_section_tour_statistic_header_table_number_of_child_ticket_booked"
      ),
      sortable: false,
    },
    {
      name: "revenue",
      label: t(
        "enterprise_management_section_tour_statistic_header_table_revenue"
      ),
      sortable: false,
    },
    {
      name: "commission",
      label: t(
        "enterprise_management_section_tour_statistic_header_table_commission"
      ),
      sortable: false,
    },
    {
      name: "profit",
      label: t(
        "enterprise_management_section_tour_statistic_header_table_profit"
      ),
      sortable: false,
    },
  ];

  const [data, setData] = useState<DataPagination<any>>();

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
    router.push(`/enterprises/tourStatistic/${Number(router.query.action)}`);
  };

  const fetchData = (value?: { take?: number; page?: number }) => {
    const params: StatisticTourOnSale = {
      take: value?.take || data?.meta?.take || 10,
      page: value?.page || data?.meta?.page || 1,
    };
    dispatch(setLoading(true));

    TourBillService.GetAllBillOfOneTourOnSale(tourOnSaleId, params)
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

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div className={classes.root}>
        <Row className={clsx(classes.rowHeaderBox, classes.title)}>
          <h3>
            {t(
              "enterprise_management_section_tour_statistic_title_tour_on_sale"
            )}
            {moment(data?.data[0]?.tourOnSaleData?.startDate).format(
              "DD-MM-YYYY"
            )}
          </h3>
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
                    <TableRow key={item?.tourId}>
                      <TableCell scope="row" className={classes.tableCell}>
                        {index + 1}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {moment(item?.tourOnSaleData?.startDate).format(
                          "D/M/YYYY"
                        )}{" "}
                      </TableCell>
                      {/* <TableCell className={classes.tableCell} component="th">
                        {item?.tourOnSaleData?.quantity}
                      </TableCell> */}
                      {/* <TableCell className={classes.tableCell} component="th">
                        {item?.tourOnSaleData?.quantityOrdered}
                      </TableCell> */}
                      <TableCell className={classes.tableCell} component="th">
                        {Number(item?.amountAdult)}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {Number(item?.amountChild)}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {fCurrency2VND(item?.totalBill)} VND
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {fCurrency2VND(item?.commission)} VND
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {fCurrency2VND(item?.totalBill - item?.commission)} VND
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={8}>
                    <SearchNotFound />
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
    </>
  );
});

export default TourOnSaleStatistic;
