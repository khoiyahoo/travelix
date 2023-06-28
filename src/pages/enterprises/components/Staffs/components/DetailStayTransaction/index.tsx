import React, { memo, useEffect, useState } from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";

import { Row } from "reactstrap";
import Button, { BtnType } from "components/common/buttons/Button";

import { useDispatch } from "react-redux";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import SearchNotFound from "components/SearchNotFound";

import {
  IconButton,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  TableRow,
  TableCell,
  Paper,
  Grid,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import TableHeader from "components/Table/TableHeader";
import {
  DataPagination,
  EBillStatus,
  EPaymentStatus,
  OptionItem,
  TableHeaderLabel,
  billStatusType,
} from "models/general";

import { useRouter } from "next/router";

import { StatisticTourBill, sortStaffOption } from "models/enterprise/staff";
import { StaffService } from "services/enterprise/staff";
// import PopupSendOffer from "./components/PopupSendOffer";

import { useTranslation } from "react-i18next";

import InputDatePicker from "components/common/inputs/InputDatePicker";
import InputSelect from "components/common/inputs/InputSelect";
import { Moment } from "moment";
import { fCurrency2VND } from "utils/formatNumber";
import { EditOutlined, ExpandMoreOutlined } from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { TourBillService } from "services/enterprise/tourBill";
import { FindAllStaffBill } from "models/enterprise/roomBill";
import { TourService } from "services/enterprise/tour";
import { AdminGetTours, ETour } from "models/enterprise";
import moment from "moment";
import StatusPayment from "components/StatusPayment";
import { RoomBillService } from "services/enterprise/roomBill";
import { StayService } from "services/enterprise/stay";
import { FindAll } from "models/enterprise/stay";
import { fTime } from "utils/formatTime";

interface Props {
  staffId?: number;
}
// eslint-disable-next-line react/display-name
const Staff = memo(({ staffId }: Props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t, i18n } = useTranslation("common");

  const tableHeaders: TableHeaderLabel[] = [
    { name: "id", label: "#", sortable: false },
    {
      name: "name",
      label: t("enterprise_management_section_room_bill_title_stay_name"),
      sortable: false,
    },
    {
      name: "roomName",
      label: t("enterprise_management_section_room_bill_title_room_name"),
      sortable: false,
    },
    {
      name: "duration",
      label: t("enterprise_management_section_room_bill_header_table_duration"),
      sortable: false,
    },
    {
      name: "total bill",
      label: t("enterprise_management_section_tour_bill_header_table_total"),
      sortable: false,
    },
    {
      name: "start time",
      label: t(
        "enterprise_management_section_tour_bill_header_table_start_time"
      ),
      sortable: false,
    },
    {
      name: "end time",
      label: t("enterprise_management_section_tour_bill_header_table_end_time"),
      sortable: false,
    },
    {
      name: "booking date",
      label: t(
        "enterprise_management_section_tour_bill_header_table_booking_date"
      ),
      sortable: false,
    },
    {
      name: "statusBill",
      label: t("enterprise_management_section_tour_bill_header_table_status"),
      sortable: false,
    },
  ];

  const [data, setData] = useState<DataPagination<any>>();
  const [dateFilter, setDateFilter] = useState<Moment>(moment(new Date()));
  const [statusFilter, setStatusFilter] = useState<number>(-1);
  const [stayOption, setStayOption] = useState<OptionItem[]>([]);
  const [stayFilter, setStayFilter] = useState<number>(-1);

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

  const fetchDataStay = (value?: {
    take?: number;
    page?: number;
    keyword?: string;
  }) => {
    const params: FindAll = {
      take: value?.take || data?.meta?.take || 10,
      page: value?.page || data?.meta?.page || 1,
      keyword: "",
      status: -1,
      type: null,
    };
    if (value?.keyword !== undefined) {
      params.keyword = value.keyword || undefined;
    }
    dispatch(setLoading(true));

    StayService.findAll(params)
      .then((res) => {
        setStayOption([
          ...[{ id: 0, name: t("common_select_all"), value: -1 }],
          ...res.data.map((item, index) => ({
            id: index + 1,
            name: item?.name,
            value: item?.id,
          })),
        ]);
      })
      .catch((e) => {
        dispatch(setErrorMess(e));
      })
      .finally(() => dispatch(setLoading(false)));
  };

  const fetchData = (value?: { take?: number; page?: number }) => {
    const params: FindAllStaffBill = {
      stayId: stayFilter || -1,
      take: value?.take || data?.meta?.take || 10,
      page: value?.page || data?.meta?.page || 1,
      month: dateFilter ? dateFilter.month() + 1 : -1,
      year: dateFilter ? dateFilter.year() : -1,
      status: statusFilter || -1,
    };
    dispatch(setLoading(true));
    RoomBillService.findAllStaffBill(staffId, params)
      .then((res) => {
        setData({
          data: res.data,
          meta: res.meta,
        });
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  const onChangeMonth = (date: Moment) => {
    setDateFilter(date);
  };
  const onClear = () => {
    setDateFilter(null);
    setStatusFilter(-1);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFilter, statusFilter, stayFilter]);

  useEffect(() => {
    fetchDataStay();
  }, []);

  return (
    <>
      <div className={classes.root}>
        <Row className={clsx(classes.rowHeaderBox, classes.title)}>
          <h3>
            {t("enterprise_management_section_staff_title_transaction_room")}
          </h3>
        </Row>
        <Row className={clsx(classes.rowHeaderBox, classes.boxControl)}>
          <Grid container xs={10} spacing={2}>
            <Grid item xs={3}>
              <InputSelect
                fullWidth
                title={t(
                  "enterprise_management_section_room_bill_title_stay_name"
                )}
                selectProps={{
                  options: stayOption,
                  placeholder: `-- ${t(
                    "enterprise_management_section_room_bill_title_stay_name"
                  )} --`,
                }}
                onChange={(e) => setStayFilter(e?.value)}
              />
            </Grid>
            <Grid xs={3} item>
              <InputDatePicker
                label={t(
                  "admin_management_section_tour_bill_input_date_placeholder"
                )}
                value={dateFilter ? dateFilter : ""}
                initialValue={dateFilter ? dateFilter : ""}
                _onChange={(date) => onChangeMonth(date)}
                placeholder={t(
                  "admin_management_section_tour_bill_input_date_placeholder"
                )}
                closeOnSelect={true}
                timeFormat={false}
                dateFormat="M/YYYY"
              />
            </Grid>
            <Grid item xs={3}>
              <InputSelect
                fullWidth
                title={t(
                  "enterprise_management_section_tour_bill_title_filter_status"
                )}
                bindLabel="translation"
                selectProps={{
                  options: billStatusType,
                  placeholder: t(
                    "enterprise_management_section_tour_bill_title_filter_status_placeholder"
                  ),
                }}
                onChange={(e) => setStatusFilter(e?.value)}
              />
            </Grid>
            <Grid xs={3} item className={classes.btnReset}>
              <Button btnType={BtnType.Primary} onClick={onClear}>
                {t("common_clear")}
              </Button>
            </Grid>
          </Grid>
          <Button
            btnType={BtnType.Primary}
            onClick={() => router.push("/enterprises/staffs/stay-transaction")}
          >
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
                        {item?.stayData?.name}
                      </TableCell>
                      <TableCell
                        className={clsx(classes.tableCell, classes.bookInfo)}
                        component="th"
                      >
                        {item?.bookedRoomsInfo?.map((item, index) => (
                          <div key={index}>
                            <span>
                              {item?.title} - {item?.amount}{" "}
                              {t(
                                "enterprise_management_section_room_bill_title_room"
                              )}{" "}
                            </span>
                          </div>
                        ))}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {fTime(item?.stayData?.checkInTime)}{" "}
                        {fTime(item?.stayData?.checkOutTime)}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {fCurrency2VND(item?.totalBill)} VND
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {moment(item?.startDate).format("DD-MM-YYYY")}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {moment(item?.endDate).format("DD-MM-YYYY")}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {moment(item?.createdAt).format("DD-MM-YYYY")}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {item?.paymentStatus === EPaymentStatus.PAID ||
                        item?.status === EBillStatus.CANCELED ? (
                          <StatusPayment status={item?.status} type={true} />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={11}>
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

export default Staff;
