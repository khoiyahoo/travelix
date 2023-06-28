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
import { DataPagination, TableHeaderLabel } from "models/general";

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
import moment from "moment";

interface Props {
  handleTourEdit?: () => void;
}
// eslint-disable-next-line react/display-name
const Staff = memo(({ handleTourEdit }: Props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t, i18n } = useTranslation("common");

  const tableHeaders: TableHeaderLabel[] = [
    { name: "id", label: "#", sortable: false },
    {
      name: "name",
      label: t("enterprise_management_section_staff_header_table_name"),
      sortable: false,
    },
    {
      name: "numberOfBills",
      label: t("enterprise_management_section_staff_header_number_of_bill"),
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
      name: "actions",
      label: t("enterprise_management_section_staff_header_table_action"),
      sortable: false,
    },
  ];

  const [data, setData] = useState<DataPagination<any>>();
  const [dateFilter, setDateFilter] = useState<Moment>(moment(new Date()));
  const [sortFilter, setSortFilter] = useState(0);
  const [itemAction, setItemAction] = useState<any>();
  const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);

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

  const onCloseActionMenu = () => {
    setItemAction(null);
    setActionAnchor(null);
  };

  const fetchData = (value?: { take?: number; page?: number }) => {
    const params: StatisticTourBill = {
      take: value?.take || data?.meta?.take || 10,
      page: value?.page || data?.meta?.page || 1,
      month: dateFilter ? dateFilter.month() + 1 : -1,
      year: dateFilter ? dateFilter.year() : -1,
      sort: sortFilter,
    };
    dispatch(setLoading(true));
    StaffService.statisticTourBill(params)
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
    setSortFilter(0);
  };

  const handleRedirect = () => {
    if (!itemAction) return;
    onRedirectEdit(itemAction);
    onCloseActionMenu();
  };

  const onRedirectEdit = (item: any) => {
    router.push({
      pathname: `/enterprises/staffs/tour-transaction/${item?.staffId}`,
    });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFilter, sortFilter]);

  return (
    <>
      <div className={classes.root}>
        <Row className={clsx(classes.rowHeaderBox, classes.title)}>
          <h3>{t("enterprise_management_section_staff_title_transaction")}</h3>
        </Row>
        <Row className={clsx(classes.rowHeaderBox, classes.boxControl)}>
          <Grid container xs={8} spacing={2}>
            <Grid xs={3} item>
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
            <Grid xs={4} item>
              <InputSelect
                fullWidth
                selectProps={{
                  options: sortStaffOption,
                  placeholder: t(
                    "admin_management_section_tour_bill_sort_option_placeholder"
                  ),
                }}
                bindLabel="translation"
                onChange={(e) => setSortFilter(e?.value)}
              />
            </Grid>
            <Grid xs={4} item className={classes.btnReset}>
              <Button btnType={BtnType.Primary} onClick={onClear}>
                {t("common_clear")}
              </Button>
            </Grid>
          </Grid>
          <Button
            btnType={BtnType.Primary}
            onClick={() => router.push("/enterprises/staffs")}
          >
            {t("common_back")}
          </Button>
        </Row>
        <TableContainer component={Paper} sx={{ marginTop: "2rem" }}>
          <Table className={classes.table}>
            <TableHeader headers={tableHeaders} />
            <TableBody>
              {data?.data?.length ? (
                data.data?.map(
                  (item, index) =>
                    item?.staffInfo !== null && (
                      <TableRow key={index}>
                        <TableCell scope="row" className={classes.tableCell}>
                          {index + 1}
                        </TableCell>
                        <TableCell className={classes.tableCell} component="th">
                          {item?.staffInfo?.firstName}{" "}
                          {item?.staffInfo?.lastName}
                        </TableCell>
                        <TableCell className={classes.tableCell} component="th">
                          {item?.numberOfBills}
                        </TableCell>{" "}
                        <TableCell className={classes.tableCell} component="th">
                          {fCurrency2VND(item?.revenue)} VND
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
                    )
                )
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
              <span>
                {t("enterprise_management_section_tour_bill_action_view")}
              </span>
            </Box>
          </MenuItem>
        </Menu>
      </div>
    </>
  );
});

export default Staff;
