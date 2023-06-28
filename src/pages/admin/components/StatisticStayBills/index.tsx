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
import InputSelect from "components/common/inputs/InputSelect";
import { RoomBillService } from "services/admin/roomBill";
import {
  IStatisticAllUser,
  StatisticAllUsers,
  sortRevenueOption,
} from "models/admin/roomBill";

interface Props {}
// eslint-disable-next-line react/display-name
const StayStatistic = memo(({}: Props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t, i18n } = useTranslation("common");

  const tableHeaders: TableHeaderLabel[] = [
    { name: "#", label: "#", sortable: false },
    {
      name: "email",
      label: t("admin_management_section_tour_bill_header_table_email"),
      sortable: false,
    },
    {
      name: "address",
      label: t("admin_management_section_tour_bill_header_table_address"),
      sortable: false,
    },
    {
      name: "phoneNumber",
      label: t("admin_management_section_tour_bill_header_table_phoneNumber"),
      sortable: false,
    },
    {
      name: "number of booking",
      label: t(
        "admin_management_section_tour_bill_header_table_number_booking"
      ),
      sortable: false,
    },
    {
      name: "amount",
      label: t("admin_management_section_tour_bill_header_table_amount"),
      sortable: false,
    },
    {
      name: "revenue",
      label: t("admin_management_section_tour_bill_header_table_revenue"),
      sortable: false,
    },
    {
      name: "commission",
      label: t("admin_management_section_tour_bill_header_table_commission"),
      sortable: false,
    },
    {
      name: "actions",
      label: t("admin_management_section_tour_bill_header_table_action"),
      sortable: false,
    },
  ];
  const [itemAction, setItemAction] = useState<IStatisticAllUser>();
  const [keyword, setKeyword] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<Moment>(null);
  const [data, setData] = useState<DataPagination<IStatisticAllUser>>();
  const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);
  const [roomBillRevenueFilter, setRoomBillRevenueFilter] = useState(-1);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, dateFilter, roomBillRevenueFilter]);

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

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
  };

  const onChangeMonth = (date: Moment) => {
    setDateFilter(date);
  };

  const onClear = () => {
    setKeyword("");
    setDateFilter(null);
    setRoomBillRevenueFilter(-1);
  };

  const fetchData = (value?: { take?: number; page?: number }) => {
    const params: StatisticAllUsers = {
      take: value?.take || data?.meta?.take || 10,
      page: value?.page || data?.meta?.page || 1,
      keyword: keyword || "",
      month: dateFilter ? dateFilter.month() + 1 : -1,
      year: dateFilter ? dateFilter.year() : -1,
      sort: roomBillRevenueFilter,
    };
    dispatch(setLoading(true));

    RoomBillService.statisticAllUsers(params)
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
    item: IStatisticAllUser
  ) => {
    setItemAction(item);
    setActionAnchor(event.currentTarget);
  };

  const handleRedirect = () => {
    if (!itemAction) return;
    onRedirectEdit(itemAction);
    onCloseActionMenu();
  };

  const onRedirectEdit = (item: IStatisticAllUser) => {
    router.push({
      pathname: `/admin/statisticStayBills/${item?.id}`,
    });
  };

  const onBack = () => {
    router.push({
      pathname: `/admin/statisticStayBills`,
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
              <InputSearch
                autoComplete="off"
                placeholder={t(
                  "admin_management_section_tour_bill_search_placeholder"
                )}
                value={keyword || ""}
                onChange={onSearch}
              />
            </Grid>
            <Grid xs={4} item>
              <InputSelect
                fullWidth
                selectProps={{
                  options: sortRevenueOption,
                  placeholder: t(
                    "admin_management_section_tour_bill_sort_option_placeholder"
                  ),
                }}
                bindLabel="translation"
                onChange={(e) => setRoomBillRevenueFilter(e?.value)}
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
                        {item?.username}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {item?.address ? item?.address : "-"}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {item?.phoneNumber}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {item?.listRoomBillDetails[0]?.numberOfBookings}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {item?.listRoomBillDetails[0]?.totalNumberOfRoom}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {fCurrency2VND(item?.listRoomBillDetails[0]?.revenue)}{" "}
                        VND
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {fCurrency2VND(
                          item?.listRoomBillDetails[0]?.commission
                        )}{" "}
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
                    <SearchNotFound searchQuery={keyword} />
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
