import React, { memo, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { Nav, NavItem, NavLink, Row } from "reactstrap";
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
  Grid,
} from "@mui/material";
import TableHeader from "components/Table/TableHeader";
import { DataPagination, EServiceType, TableHeaderLabel } from "models/general";
import {
  EditOutlined,
  DeleteOutlineOutlined,
  ExpandMoreOutlined,
} from "@mui/icons-material";
import { FindAll, Commission } from "models/admin/commission";
import useDebounce from "hooks/useDebounce";
import InputSearch from "components/common/inputs/InputSearch";
import { CommissionService } from "services/admin/commission";
import Button, { BtnType } from "components/common/buttons/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

export enum EActiveNav {
  Tour_Active = 1,
  Hotel_Active = 2,
  Tour_Sales_Active = 3,
  Hotel_Sales_Active = 4,
  Tour_Feedbacks_Active = 5,
  Hotel_Feedbacks_Active = 6,
  Check_Room_Active = 7,
  Email_Active = 8,
  Feedback_Active = 9,
  Tour_Statistic_Active = 10,
  Hotel_Statistic_Active = 11,
  Create_Tour_Active = 12,
  Create_Hotel_Active = 13,
}

interface Props {}
// eslint-disable-next-line react/display-name
const CommissionTour = memo(({}: Props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t, i18n } = useTranslation("common");

  const tableHeaders: TableHeaderLabel[] = [
    { name: "id", label: "#", sortable: false },
    {
      name: "Commission no.",
      label: t("admin_management_section_commission_tab_header_table_comm_no"),
      sortable: false,
    },
    {
      name: "Service type",
      label: t(
        "admin_management_section_commission_tab_header_table_service_type"
      ),
      sortable: false,
    },
    {
      name: "actions",
      label: t("admin_management_section_commission_tab_header_table_action"),
      sortable: false,
    },
  ];

  const [itemAction, setItemAction] = useState<Commission>();
  const [commissionDelete, setCommissionDelete] = useState<Commission>(null);
  const [keyword, setKeyword] = useState<string>("");
  const [data, setData] = useState<DataPagination<Commission>>();
  const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);

  const handleAction = (
    e: React.MouseEvent<HTMLButtonElement>,
    item: Commission
  ) => {
    setItemAction(item);
    setActionAnchor(e.currentTarget);
  };

  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    newPage: number
  ) => {
    fetchData({
      page: newPage + 1,
    });
  };

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    fetchData({
      take: Number(e.target.value),
      page: 1,
    });
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    _onSearch(e.target.value);
  };

  const fetchData = (value?: {
    serviceType?: number;
    take?: number;
    page?: number;
    keyword?: string;
  }) => {
    const params: FindAll = {
      serviceType: EServiceType?.TOUR,
      take: value?.take || data?.meta?.take || 10,
      page: value?.page || data?.meta?.page || 1,
      keyword: keyword,
    };
    if (value?.keyword !== undefined) {
      params.keyword = value.keyword || undefined;
    }
    dispatch(setLoading(true));
    CommissionService.findAll(params)
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

  const onCloseActionMenu = () => {
    setItemAction(null);
    setActionAnchor(null);
  };

  const onShowConfirmDelete = () => {
    if (!itemAction) return;
    setCommissionDelete(itemAction);
    onCloseActionMenu();
  };

  const onClosePopupConfirmDelete = () => {
    if (!commissionDelete) return;
    setCommissionDelete(null);
    onCloseActionMenu();
  };

  const onCreateCommission = () => {
    router.push("/admin/commissions/create-commission");
  };

  const handleRedirect = () => {
    if (!itemAction) return;
    onRedirectEdit(itemAction);
    onCloseActionMenu();
  };

  const onRedirectEdit = (item: Commission) => {
    router.push({
      pathname: `/admin/commissions/${item.id}`,
    });
  };

  const onYesDelete = () => {
    if (!commissionDelete) return;
    onClosePopupConfirmDelete();
    dispatch(setLoading(true));
    CommissionService.delete(commissionDelete?.id)
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
        <Row className={clsx(classes.rowHeaderBox, classes.boxControl)}>
          <div className={classes.boxInputSearch}>
            <InputSearch
              autoComplete="off"
              placeholder={t("common_search")}
              value={keyword || ""}
              onChange={onSearch}
            />
          </div>
          <Button btnType={BtnType.Primary} onClick={onCreateCommission}>
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
                        {t("admin_management_navbar_commission")} {item.rate} %
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {item?.serviceType === EServiceType.TOUR ? (
                          <>
                            {" "}
                            {t(
                              "admin_management_section_commission_tab_tour_title"
                            )}
                          </>
                        ) : (
                          <>
                            {t(
                              "admin_management_section_commission_tab_hotel_title"
                            )}
                          </>
                        )}
                      </TableCell>
                      <TableCell className="text-center" component="th">
                        <IconButton
                          className={clsx(classes.actionButton)}
                          color="primary"
                          onClick={(e) => {
                            handleAction(e, item);
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
                  <TableCell align="center" colSpan={4}>
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
            className={classes.menuItem}
            onClick={handleRedirect}
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
          title={t("admin_management_section_commission_confirm_delete")}
          isOpen={!!commissionDelete}
          onClose={onClosePopupConfirmDelete}
          toggle={onClosePopupConfirmDelete}
          onYes={onYesDelete}
        />
      </div>
    </>
  );
});

export default CommissionTour;
