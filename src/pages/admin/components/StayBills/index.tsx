import React, { memo, useEffect, useState } from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { Row } from "reactstrap";
import { useDispatch } from "react-redux";
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from "redux/reducers/Status/actionTypes";
import SearchNotFound from "components/SearchNotFound";

import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  TableRow,
  TableCell,
  Paper,
  Grid,
} from "@mui/material";
import TableHeader from "components/Table/TableHeader";
import { DataPagination, TableHeaderLabel } from "models/general";
import { ExpandMoreOutlined } from "@mui/icons-material";

import { useRouter } from "next/router";

import "react-loading-skeleton/dist/skeleton.css";
import {
  FindAllOrderNeedRefund,
  refundStatusOption,
} from "models/admin/roomBill";
import { RoomBillService } from "services/admin/roomBill";
import { fCurrency2VND } from "utils/formatNumber";
import moment from "moment";
import { useTranslation } from "react-i18next";
import InputSelect from "components/common/inputs/InputSelect";
import Button, { BtnType } from "components/common/buttons/Button";
import { Moment } from "moment";
import InputDatePicker from "components/common/inputs/InputDatePicker";

import { fTime } from "utils/formatTime";
import StatusRefund from "components/StatusRefund";
import PopupSendMoneyRefund from "./PopupSendMoneyRefund";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";

interface Props {}
// eslint-disable-next-line react/display-name
const Tour = memo(({}: Props) => {
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
      name: "duration",
      label: t("enterprise_management_section_tour_bill_header_table_duration"),
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
      name: "money refund",
      label: t(
        "enterprise_management_section_tour_bill_header_table_money_refund"
      ),
      sortable: false,
    },
    {
      name: "status",
      label: t(
        "enterprise_management_section_tour_bill_header_table_status_refund"
      ),
      sortable: false,
    },

    {
      name: "actions",
      label: t("enterprise_management_section_tour_bill_header_table_action"),
      sortable: false,
    },
  ];

  const [itemAction, setItemAction] = useState<any>();
  const [data, setData] = useState<DataPagination<any>>();
  const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);
  const [refundFilter, setRefundFilter] = useState<number>(-1);
  const [dateFilter, setDateFilter] = useState<Moment>(null);
  const [itemSendMoney, setItemSendMoney] = useState(null);

  const onClosePopupSendMoney = () => {
    if (!itemSendMoney) return;
    setItemSendMoney(null);
    onCloseActionMenu();
  };

  const onShowRefund = () => {
    if (!itemAction) return;
    setItemSendMoney(itemAction);
    onCloseActionMenu();
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFilter, refundFilter]);

  const handleAction = (
    event: React.MouseEvent<HTMLButtonElement>,
    item: any
  ) => {
    setItemAction(item);
    setActionAnchor(event.currentTarget);
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

  const fetchData = (value?: { take?: number; page?: number }) => {
    const params: FindAllOrderNeedRefund = {
      take: value?.take || data?.meta?.take || 10,
      page: value?.page || data?.meta?.page || 1,
      month: dateFilter ? dateFilter.month() + 1 : -1,
      year: dateFilter ? dateFilter.year() : -1,
      refundStatus: refundFilter || -1,
    };
    dispatch(setLoading(true));

    RoomBillService.orderRefundFindAll(params)
      .then((res) => {
        setData({
          data: res.data,
          meta: res.meta,
        });
      })
      .catch((e) => {
        dispatch(setErrorMess(e));
      })
      .finally(() => dispatch(setLoading(false)));
  };

  const onCloseActionMenu = () => {
    setItemAction(null);
    setActionAnchor(null);
  };

  const handleRefund = () => {
    if (!itemSendMoney) return;
    dispatch(setLoading(true));
    RoomBillService.updateRefund(itemSendMoney?.id)
      .then(() => {
        dispatch(setSuccessMess(t("common_update_success")));
        onClosePopupSendMoney();
      })
      .catch((e) => {
        dispatch(setErrorMess(e));
      })
      .finally(() => dispatch(setLoading(false)));
  };

  const onChangeMonth = (date: Moment) => {
    setDateFilter(date);
  };

  const onClear = () => {
    setDateFilter(null);
    setRefundFilter(-1);
  };

  return (
    <>
      <div className={classes.root}>
        <Row className={clsx(classes.rowHeaderBox, classes.title)}>
          <h3>{t("enterprise_management_section_room_bill_title_tab")}</h3>
        </Row>
        <Grid
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Grid
            container
            xs={6}
            sx={{
              display: "flex",
            }}
            spacing={2}
          >
            <Grid xs={4} item>
              <InputSelect
                fullWidth
                selectProps={{
                  options: refundStatusOption,
                  placeholder: t(
                    "admin_management_section_tour_bill_sort_option_placeholder"
                  ),
                }}
                bindLabel="translation"
                onChange={(e) => setRefundFilter(e?.value)}
              />
            </Grid>
            <Grid xs={4} item>
              <InputDatePicker
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
          </Grid>
          <Button btnType={BtnType.Primary} onClick={onClear}>
            {t("enterprise_management_section_tour_statistic_btn_clear")}
          </Button>
        </Grid>
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
                        {fCurrency2VND(item?.moneyRefund)} VND
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        <StatusRefund
                          statusRefund={item?.isRefunded}
                          titleTrue={t("common_refund")}
                          titleFalse={t("common_not_refund")}
                        />
                      </TableCell>

                      <TableCell className="text-center" component="th">
                        <IconButton
                          className={clsx(classes.actionButton)}
                          color="primary"
                          disabled={item?.isRefunded}
                          onClick={(event) => {
                            handleAction(event, item);
                          }}
                        >
                          <ExpandMoreOutlined />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={10}>
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
        <Menu
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          anchorEl={actionAnchor}
          keepMounted
          open={Boolean(actionAnchor)}
          onClose={onCloseActionMenu}
        >
          {/* {!itemAction?.isRefunded && ( */}
          <MenuItem
            sx={{ fontSize: "0.875rem" }}
            onClick={onShowRefund}
            className={classes.menuItem}
          >
            <Box display="flex" alignItems={"center"}>
              <CurrencyExchangeIcon
                sx={{ marginRight: "0.25rem" }}
                fontSize="small"
                color="info"
              />
              <span>
                {t(
                  "enterprise_management_section_tour_bill_action_view_refund"
                )}
              </span>
            </Box>
          </MenuItem>
          {/* )} */}
        </Menu>
        <PopupSendMoneyRefund
          isOpen={!!itemSendMoney}
          toggle={onClosePopupSendMoney}
          onClose={onClosePopupSendMoney}
          bill={itemSendMoney}
          onYes={handleRefund}
        />
      </div>
    </>
  );
});

export default Tour;
