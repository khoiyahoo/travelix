import React, { memo, useEffect, useState } from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { Row } from "reactstrap";
import { useDispatch } from "react-redux";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
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
import Button, { BtnType } from "components/common/buttons/Button";
import TableHeader from "components/Table/TableHeader";
import { DataPagination, TableHeaderLabel } from "models/general";
import { ExpandMoreOutlined } from "@mui/icons-material";
import InputDatePicker from "components/common/inputs/InputDatePicker";
import { useRouter } from "next/router";
import InputSearch from "components/common/inputs/InputSearch";
import "react-loading-skeleton/dist/skeleton.css";
import { fCurrency2VND } from "utils/formatNumber";
import { Moment } from "moment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useTranslation } from "react-i18next";

import { RoomBillService } from "services/admin/roomBill";
import { IStatisticOneStay, StatisticOneUser } from "models/admin/roomBill";

interface Props {
  stayId?: number;
}
// eslint-disable-next-line react/display-name
const StayStatistic = memo(({ stayId }: Props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t, i18n } = useTranslation("common");
  const enterpriseId = Number(router.query?.action);

  const tableHeaders: TableHeaderLabel[] = [
    { name: "#", label: "#", sortable: false },
    {
      name: "name",
      label: t("enterprise_management_section_room_bill_title_stay_name"),
      sortable: false,
    },
    {
      name: "name",
      label: t(
        "enterprise_management_section_stay_statistic_header_table_quantity"
      ),
      sortable: false,
    },
    {
      name: "quantity",
      label: t(
        "enterprise_management_section_stay_statistic_header_table_room"
      ),
      sortable: false,
    },
    {
      name: "quantity",
      label: t("enterprise_management_section_stay_statistic_header_table_bed"),
      sortable: false,
    },
    {
      name: "number of booking",
      label: t(
        "enterprise_management_section_tour_statistic_header_table_number_booking"
      ),
      sortable: false,
    },
    {
      name: "number of booking",
      label: t(
        "enterprise_management_section_stay_statistic_header_table_total_ticket"
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
      name: "actions",
      label: t(
        "enterprise_management_section_tour_statistic_header_table_action"
      ),
      sortable: false,
    },
  ];

  const [itemAction, setItemAction] = useState<IStatisticOneStay>();
  const [dateFilter, setDateFilter] = useState<Moment>(null);
  const [data, setData] = useState<DataPagination<IStatisticOneStay>>();
  const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFilter, stayId]);

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

  const onChangeMonth = (date: Moment) => {
    setDateFilter(date);
  };

  const onClear = () => {
    setDateFilter(null);
  };

  const fetchData = (value?: { take?: number; page?: number }) => {
    const params: StatisticOneUser = {
      take: value?.take || data?.meta?.take || 10,
      page: value?.page || data?.meta?.page || 1,
      month: dateFilter ? dateFilter.month() + 1 : -1,
      year: dateFilter ? dateFilter.year() : -1,
    };
    dispatch(setLoading(true));

    RoomBillService.statisticOneStay(stayId, params)
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

  const onCloseActionMenu = () => {
    setItemAction(null);
    setActionAnchor(null);
  };

  const handleAction = (
    event: React.MouseEvent<HTMLButtonElement>,
    item: IStatisticOneStay
  ) => {
    setItemAction(item);
    setActionAnchor(event.currentTarget);
  };

  const handleRedirect = () => {
    if (!itemAction) return;
    onRedirectEdit(itemAction);
    onCloseActionMenu();
  };

  const onRedirectEdit = (item: IStatisticOneStay) => {
    router.push({
      pathname: `/admin/statisticStayBills/${enterpriseId}/${stayId}/${item?.roomInfo?.id}`,
    });
  };

  const onBack = () => {
    router.push({
      pathname: `/admin/statisticStayBills/${enterpriseId}`,
    });
  };

  return (
    <>
      <div className={classes.root}>
        <Row className={clsx(classes.rowHeaderBox, classes.title)}>
          <h3>{t("enterprise_management_section_stay_statistic_title")}</h3>
        </Row>
        <Row className={clsx(classes.rowHeaderBox, classes.boxControl)}>
          <Grid className={classes.boxInputSearch} container xs={6} spacing={2}>
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
          <Grid className={classes.headerBtn}>
            <Button btnType={BtnType.Outlined} onClick={onClear}>
              {t("common_clear")}
            </Button>
            <Button btnType={BtnType.Primary} onClick={onBack}>
              {t("common_back")}
            </Button>
          </Grid>
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
                        {item?.roomInfo?.title}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {item?.roomInfo?.numberOfAdult}{" "}
                        {t("payment_history_page_hotel_adult")} -{" "}
                        {item?.roomInfo?.numberOfChildren}{" "}
                        {t("payment_history_page_hotel_child")}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {item?.roomInfo?.numberOfRoom}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {item?.roomInfo?.numberOfBed}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {item?.numberOfBookings}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {item?.totalNumberOfRoom || 0}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {fCurrency2VND(item?.revenue)} VND
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {fCurrency2VND(item?.commission)}
                        VND
                      </TableCell>
                      <TableCell className="text-center" component="th">
                        <IconButton
                          className={clsx(classes.actionButton)}
                          color="primary"
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
                  <TableCell align="center" colSpan={9}>
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
          <MenuItem
            sx={{ fontSize: "0.875rem" }}
            onClick={handleRedirect}
            className={classes.menuItem}
          >
            <Box display="flex" alignItems={"center"}>
              <VisibilityIcon
                sx={{ marginRight: "0.25rem" }}
                fontSize="small"
                color="info"
              />
              <span>{t("admin_management_section_tour_bill_view_detail")}</span>
            </Box>
          </MenuItem>
        </Menu>
      </div>
    </>
  );
});

export default StayStatistic;
