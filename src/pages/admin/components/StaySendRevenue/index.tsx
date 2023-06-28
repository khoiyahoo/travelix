import { memo, useEffect, useState } from "react";
import { Row, Col, Container, Table } from "reactstrap";
import classes from "./styles.module.scss";
import clsx from "clsx";
import { useDispatch } from "react-redux";
import {
  Box,
  FormControlLabel,
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
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from "redux/reducers/Status/actionTypes";
import { fCurrency2VND } from "utils/formatNumber";
import { useTranslation } from "react-i18next";
import { DataPagination, EBankType, TableHeaderLabel } from "models/general";
import { Moment } from "moment";
import { StatisticAllTourOnSale } from "models/admin/tourBill";
import InputDatePicker from "components/common/inputs/InputDatePicker";
import TableHeader from "components/Table/TableHeader";
import { ExpandMoreOutlined } from "@mui/icons-material";
import SearchNotFound from "components/SearchNotFound";

import moment from "moment";

import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import StatusRefund from "components/StatusRefund";
import PopupDefault from "components/Popup/PopupDefault";
import { TourOnSaleService } from "services/admin/tourOnSale";
import PopupConfirmDefault from "components/Popup/PopupConfirmDefault";
import InputCheckbox from "components/common/inputs/InputCheckbox";
import useDebounce from "hooks/useDebounce";
import InputSearch from "components/common/inputs/InputSearch";
import { FindAllStayRevenue, sectionRevenue } from "models/admin/roomBill";
import InputSelect from "components/common/inputs/InputSelect";
import { RoomBillService } from "services/admin/roomBill";
interface Props {}

const StayRevenue = memo(({}: Props) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { t, i18n } = useTranslation("common");
  const [data, setData] = useState<DataPagination<any>>();
  const [dateFilter, setDateFilter] = useState<Moment>(null);
  const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);
  const [itemAction, setItemAction] = useState<any>();

  const [itemChangeReceived, setItemChangeReceived] = useState(null);
  const [isReceivedRevenue, setIsReceivedRevenue] = useState(false);
  const [keyword, setKeyword] = useState<string>("");
  const [sectionFilter, setSectionFilter] = useState(1);

  const tableHeaders: TableHeaderLabel[] = [
    { name: "#", label: "#", sortable: false },
    {
      name: "name",
      label: t("admin_management_section_tour_bill_header_table_email"),
      sortable: false,
    },
    {
      name: "sdt",
      label: t("admin_management_section_tour_bill_header_table_phoneNumber"),
      sortable: false,
    },
    {
      name: "bankType",
      label: t("auth_account_bank_type"),
      sortable: false,
    },
    {
      name: "bankCode",
      label: t("auth_account_bank_code"),
      sortable: false,
    },
    {
      name: "bankName",
      label: t("auth_account_bank_name"),
      sortable: false,
    },
    {
      name: "cardNumber",
      label: t("auth_account_bank_card_number"),
      sortable: false,
    },
    {
      name: "title",
      label: t("enterprise_management_section_room_bill_title_stay_name"),
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
      name: "status",
      label: t(
        "admin_management_section_tour_bill_header_table_status_received"
      ),
      sortable: false,
    },
    {
      name: "actions",
      label: t("admin_management_section_tour_bill_header_table_action"),
      sortable: false,
    },
  ];

  const getBankType = (type: number) => {
    switch (type) {
      case EBankType.INTERNAL:
        return t("common_bank_type_internal");
      case EBankType.INTERNATIONAL:
        return t("common_bank_type_international");
    }
  };

  const fetchData = (value?: {
    take?: number;
    page?: number;
    keyword?: string;
  }) => {
    const params: FindAllStayRevenue = {
      take: value?.take || data?.meta?.take || 10,
      page: value?.page || data?.meta?.page || 1,
      month: dateFilter ? dateFilter.month() + 1 : -1,
      year: dateFilter ? dateFilter.year() : -1,
      isReceivedRevenue: isReceivedRevenue,
      keyword: keyword,
      section: sectionFilter,
    };
    if (value?.keyword !== undefined) {
      params.keyword = value.keyword || undefined;
    }
    dispatch(setLoading(true));
    RoomBillService.findAllStayRevenue(params)
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

  const onShowConfirmChangeReceived = () => {
    if (!itemAction) return;
    setItemChangeReceived(itemAction);
    onCloseActionMenu();
  };

  const onClosePopupConfirmChangeReceived = () => {
    if (!itemChangeReceived) return;
    setItemChangeReceived(null);
    onCloseActionMenu();
  };

  const onChangeMonth = (date: Moment) => {
    setDateFilter(date);
  };

  const onClear = () => {
    setDateFilter(null);
    setIsReceivedRevenue(false);
  };

  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    newPage: number
  ) => {
    fetchData({
      page: newPage + 1,
    });
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    _onSearch(e.target.value);
  };

  const _onSearch = useDebounce(
    (keyword: string) => fetchData({ keyword, page: 1 }),
    500
  );

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

  const handleAction = (
    event: React.MouseEvent<HTMLButtonElement>,
    item: any
  ) => {
    setItemAction(item);
    setActionAnchor(event.currentTarget);
  };

  const onChangeReceived = () => {
    dispatch(setLoading(true));
    RoomBillService.updateReceivedRevenue(itemChangeReceived?.id)
      .then(() => {
        dispatch(setSuccessMess(t("common_update_success")));
        setItemChangeReceived(null);
        fetchData();
      })
      .catch((e) => {
        dispatch(setSuccessMess(e));
        fetchData();
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFilter, isReceivedRevenue, sectionFilter]);

  return (
    <div className={classes.root}>
      <Row className={clsx(classes.rowHeaderBox, classes.title)}>
        <h3>{t("admin_management_section_stay_revenue")}</h3>
      </Row>
      <Row className={clsx(classes.rowHeaderBox, classes.boxControl)}>
        <Grid className={classes.boxInputSearch} container xs={10} spacing={2}>
          <Grid item xs={3}>
            <InputSearch
              autoComplete="off"
              placeholder={t("common_search")}
              value={keyword || ""}
              onChange={onSearch}
            />
          </Grid>
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
                options: sectionRevenue,
                placeholder: t(
                  "admin_management_section_tour_bill_sort_option_placeholder"
                ),
              }}
              bindLabel="translation"
              onChange={(e) => setSectionFilter(e?.value)}
            />
          </Grid>
          <Grid item sx={{ display: "flex", alignItems: "center" }} xs={3}>
            <FormControlLabel
              className={classes.checkBoxTourTaken}
              control={
                <InputCheckbox
                  checked={isReceivedRevenue}
                  onChange={() => setIsReceivedRevenue(!isReceivedRevenue)}
                />
              }
              label={t(
                "enterprise_management_section_tour_bill_title_filter_send_revenue"
              )}
            />
          </Grid>
        </Grid>
        <Grid className={classes.headerBtn}>
          <Button btnType={BtnType.Outlined} onClick={onClear}>
            {t("common_clear")}
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
                      {item?.stayInfo?.stayOwner?.username}
                    </TableCell>
                    <TableCell className={classes.tableCell} component="th">
                      {item?.stayInfo?.stayOwner?.phoneNumber}
                    </TableCell>
                    <TableCell className={classes.tableCell} component="th">
                      {getBankType(item?.stayInfo?.stayOwner?.bankType)}
                    </TableCell>
                    <TableCell className={classes.tableCell} component="th">
                      {item?.stayInfo?.stayOwner?.bankCode?.name}
                    </TableCell>
                    <TableCell className={classes.tableCell} component="th">
                      {item?.stayInfo?.stayOwner?.bankName?.name}
                    </TableCell>
                    <TableCell className={classes.tableCell} component="th">
                      {item?.stayInfo?.stayOwner?.bankCardNumber}
                    </TableCell>
                    <TableCell className={classes.tableCell} component="th">
                      {item?.stayInfo?.name}
                    </TableCell>
                    <TableCell className={classes.tableCell} component="th">
                      {fCurrency2VND(item?.revenue)} VND
                    </TableCell>
                    <TableCell className={classes.tableCell} component="th">
                      {fCurrency2VND(item?.commission)} VND
                    </TableCell>
                    <TableCell className={classes.tableCell} component="th">
                      <StatusRefund
                        statusRefund={item?.isReceivedRevenue}
                        titleTrue={t("common_refund")}
                        titleFalse={t("common_not_refund")}
                      />
                    </TableCell>
                    <TableCell className="text-center" component="th">
                      <IconButton
                        className={clsx(classes.actionButton)}
                        color="primary"
                        disabled={item?.isReceivedRevenue}
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
                <TableCell align="center" colSpan={18}>
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
          onClick={onShowConfirmChangeReceived}
          className={classes.menuItem}
        >
          <Box display="flex" alignItems={"center"}>
            <PublishedWithChangesIcon
              sx={{ marginRight: "0.25rem" }}
              fontSize="small"
              color="success"
            />
            <span>
              {t("admin_management_section_tour_bill_change_revenue")}
            </span>
          </Box>
        </MenuItem>
      </Menu>
      <PopupConfirmDefault
        isOpen={!!itemChangeReceived}
        toggle={onClosePopupConfirmChangeReceived}
        onYes={onChangeReceived}
        onClose={onClosePopupConfirmChangeReceived}
        title={"Xác nhận chuyển tiền cho doanh nghiệp ?"}
      />
    </div>
  );
});

export default StayRevenue;
