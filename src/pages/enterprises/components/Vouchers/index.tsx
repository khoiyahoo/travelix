import React, { memo, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Row } from "reactstrap";
import Button, { BtnType } from "components/common/buttons/Button";
import PopupConfirmDelete from "components/Popup/PopupConfirmDelete";
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
} from "@mui/material";
import TableHeader from "components/Table/TableHeader";
import {
  DataPagination,
  EDiscountType,
  LangSupport,
  langSupports,
  TableHeaderLabel,
} from "models/general";
import {
  EditOutlined,
  DeleteOutlineOutlined,
  ExpandMoreOutlined,
} from "@mui/icons-material";

import { useRouter } from "next/router";
import useDebounce from "hooks/useDebounce";
import InputSearch from "components/common/inputs/InputSearch";
import { FindAll, Voucher } from "models/enterprise/voucher";
import { VoucherService } from "services/enterprise/voucher";
import { fCurrency2VND, fPercent, fShortenNumber } from "utils/formatNumber";
import { useTranslation } from "react-i18next";
import moment from "moment";

interface Props {}
// eslint-disable-next-line react/display-name
const Event = memo(({}: Props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t, i18n } = useTranslation("common");

  const tableHeaders: TableHeaderLabel[] = [
    { name: "id", label: "#", sortable: false },
    {
      name: "name",
      label: t("enterprise_management_section_voucher_header_table_name"),
      sortable: false,
    },
    {
      name: "startTime",
      label: t("enterprise_management_section_voucher_header_table_startTime"),
      sortable: false,
    },
    {
      name: "endTime",
      label: t("enterprise_management_section_voucher_header_table_endTime"),
      sortable: false,
    },
    {
      name: "numberOfCodes",
      label: t(
        "enterprise_management_section_voucher_header_table_numberOfCode"
      ),
      sortable: false,
    },
    {
      name: "numberOfCodesUsed",
      label: t(
        "enterprise_management_section_voucher_header_table_numberOfCodeUsed"
      ),
      sortable: false,
    },
    {
      name: "discountValue",
      label: t(
        "enterprise_management_section_voucher_header_table_discount_value"
      ),
      sortable: false,
    },
    {
      name: "minOrder",
      label: t("enterprise_management_section_voucher_header_table_min_order"),
      sortable: false,
    },
    {
      name: "maxDiscount",
      label: t(
        "enterprise_management_section_voucher_header_table_max_discount"
      ),
      sortable: false,
    },
    {
      name: "actions",
      label: t("enterprise_management_section_voucher_header_table_action"),
      sortable: false,
    },
  ];

  const [itemAction, setItemAction] = useState<Voucher>();
  const [voucherDelete, setVoucherDelete] = useState<Voucher>(null);
  const [keyword, setKeyword] = useState<string>("");
  const [data, setData] = useState<DataPagination<Voucher>>();
  const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);

  const handleAction = (
    event: React.MouseEvent<HTMLButtonElement>,
    item: Voucher
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

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    _onSearch(e.target.value);
  };

  const fetchData = (value?: {
    take?: number;
    page?: number;
    keyword?: string;
  }) => {
    const params: FindAll = {
      take: value?.take || data?.meta?.take || 10,
      page: value?.page || data?.meta?.page || 1,
      keyword: keyword,
    };
    if (value?.keyword !== undefined) {
      params.keyword = value.keyword || undefined;
    }
    dispatch(setLoading(true));
    VoucherService.findAll(params)
      .then((res) => {
        setData({
          data: res.data,
          meta: res.meta,
        });
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  const _onSearch = useDebounce(
    (keyword: string) => fetchData({ keyword, page: 1 }),
    500
  );

  const onCreateTour = () => {
    router.push("/enterprises/vouchers/create-voucher");
  };

  const onCloseActionMenu = () => {
    setItemAction(null);
    setActionAnchor(null);
  };

  const handleRedirect = () => {
    if (!itemAction) return;
    onRedirectEdit(itemAction);
    onCloseActionMenu();
  };

  const onRedirectEdit = (item: Voucher) => {
    router.push({
      pathname: `/enterprises/vouchers/${item.id}`,
    });
  };

  const onShowConfirmDelete = () => {
    if (!itemAction) return;
    setVoucherDelete(itemAction);
    onCloseActionMenu();
  };

  const onClosePopupConfirmDelete = () => {
    if (!voucherDelete) return;
    setVoucherDelete(null);
    onCloseActionMenu();
  };

  const onYesDelete = () => {
    if (!voucherDelete) return;
    onClosePopupConfirmDelete();
    dispatch(setLoading(true));
    VoucherService.delete(voucherDelete?.id)
      .then(() => {
        dispatch(setSuccessMess(t("common_delete_success")));
        fetchData();
      })
      .catch((e) => {
        dispatch(setErrorMess(e));
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className={classes.root}>
        <Row className={clsx(classes.rowHeaderBox, classes.title)}>
          <h3>{t("enterprise_management_section_voucher_title")}</h3>
        </Row>
        <Row className={clsx(classes.rowHeaderBox, classes.boxControl)}>
          <div className={classes.boxInputSearch}>
            <InputSearch
              autoComplete="off"
              placeholder={t("common_search")}
              value={keyword || ""}
              onChange={onSearch}
            />
          </div>
          <Button btnType={BtnType.Primary} onClick={onCreateTour}>
            <FontAwesomeIcon icon={faPlus} />
            {t("common_create")}
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
                        {item?.discountType === EDiscountType.PERCENT ? (
                          <>
                            {t("voucher_title_deal")}{" "}
                            {fPercent(item?.discountValue)}{" "}
                          </>
                        ) : (
                          <>
                            {t("voucher_title_deal")}{" "}
                            {fShortenNumber(item?.discountValue)}
                          </>
                        )}
                      </TableCell>
                      <TableCell scope="row" className={classes.tableCell}>
                        {moment(item?.startTime).format("DD-MM-YYYY")}
                      </TableCell>{" "}
                      <TableCell scope="row" className={classes.tableCell}>
                        {moment(item?.endTime).format("DD-MM-YYYY")}
                      </TableCell>{" "}
                      <TableCell scope="row" className={classes.tableCell}>
                        {!item?.isQuantityLimit
                          ? t(
                              "enterprise_management_section_voucher_body_table_action"
                            )
                          : item?.numberOfCodes}
                      </TableCell>{" "}
                      <TableCell scope="row" className={classes.tableCell}>
                        {item?.numberOfCodesUsed}
                      </TableCell>{" "}
                      <TableCell scope="row" className={classes.tableCell}>
                        {item?.discountType === EDiscountType.PERCENT ? (
                          <>{fPercent(item?.discountValue)} </>
                        ) : (
                          <>{fCurrency2VND(item?.discountValue)} VND</>
                        )}
                      </TableCell>{" "}
                      <TableCell scope="row" className={classes.tableCell}>
                        {item?.discountType === EDiscountType.PERCENT ? (
                          <>{fCurrency2VND(item?.minOrder)} VND</>
                        ) : (
                          <>{fCurrency2VND(item?.minOrder)} VND</>
                        )}
                      </TableCell>
                      <TableCell scope="row" className={classes.tableCell}>
                        {item?.maxDiscount !== 0 ? (
                          <>{fCurrency2VND(item?.maxDiscount)} VND</>
                        ) : (
                          "-"
                        )}
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
                  <TableCell align="center" colSpan={10}>
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
              <EditOutlined sx={{ marginRight: "0.25rem" }} fontSize="small" />
              <span>{t("common_edit")}</span>
            </Box>
          </MenuItem>
          <MenuItem
            sx={{ fontSize: "0.875rem" }}
            className={classes.menuItem}
            onClick={onShowConfirmDelete}
          >
            <Box display="flex" alignItems={"center"}>
              <DeleteOutlineOutlined
                sx={{ marginRight: "0.25rem" }}
                color="error"
                fontSize="small"
              />
              <span>{t("common_delete")}</span>
            </Box>
          </MenuItem>
        </Menu>
        <PopupConfirmDelete
          title={t("enterprise_management_section_voucher_confirm_delete")}
          isOpen={!!voucherDelete}
          onClose={onClosePopupConfirmDelete}
          toggle={onClosePopupConfirmDelete}
          onYes={onYesDelete}
        />
      </div>
    </>
  );
});

export default Event;
