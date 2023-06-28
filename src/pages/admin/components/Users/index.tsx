import React, { memo, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { Row } from "reactstrap";
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
import { DataPagination, TableHeaderLabel } from "models/general";
import {
  EditOutlined,
  DeleteOutlineOutlined,
  ExpandMoreOutlined,
} from "@mui/icons-material";
import { FindAll, User } from "models/admin/user";
import useDebounce from "hooks/useDebounce";
import InputSearch from "components/common/inputs/InputSearch";
import { UserService } from "services/admin/user";
import { getRoleUser } from "utils/getOption";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import EditRoleForm from "./EditRoleForm";
import StatusChip from "components/StatusChip";
import { useTranslation } from "react-i18next";

interface RoleForm {
  role: {
    id: number;
    name: string;
    value: number;
  };
}

interface Props {}
// eslint-disable-next-line react/display-name
const User = memo(({}: Props) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation("common");

  const tableHeaders: TableHeaderLabel[] = [
    { name: "#", label: "#", sortable: false },
    {
      name: "name",
      label: t("admin_management_tab_user_header_table_name"),
      sortable: false,
    },
    {
      name: "role",
      label: t("admin_management_tab_user_header_table_role"),
      sortable: false,
    },
    {
      name: "status",
      label: t("admin_management_tab_user_header_table_status"),
      sortable: false,
    },
    {
      name: "actions",
      label: t("admin_management_tab_user_header_table_actions"),
      sortable: false,
    },
  ];

  const [itemAction, setItemAction] = useState<User>();
  const [userEdit, setUserEdit] = useState<User>();
  const [userDelete, setUserDelete] = useState<User>(null);
  const [keyword, setKeyword] = useState<string>("");
  const [dataUser, setDataUser] = useState<DataPagination<User>>();
  const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);
  const [role, setRole] = useState(null);

  const [languageAnchor, setLanguageAnchor] = useState<null | HTMLElement>(
    null
  );

  const schema = useMemo(() => {
    return yup.object().shape({
      role: yup
        .object()
        .typeError("Role is required.")
        .shape({
          id: yup.number().required("Role is required"),
          name: yup.string().required(),
        })
        .required(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const {} = useForm<RoleForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const handleAction = (e: React.MouseEvent<HTMLButtonElement>, item: User) => {
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
    take?: number;
    page?: number;
    keyword?: string;
  }) => {
    const params: FindAll = {
      take: value?.take || dataUser?.meta?.take || 10,
      page: value?.page || dataUser?.meta?.page || 1,
      keyword: keyword,
    };
    if (value?.keyword !== undefined) {
      params.keyword = value.keyword || undefined;
    }
    dispatch(setLoading(true));
    UserService.getAllUsers(params)
      .then((res) => {
        setDataUser({
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
    setLanguageAnchor(null);
  };

  const onActionEditRole = () => {
    setUserEdit(itemAction);
    setRole(userEdit?.role);
    onCloseActionMenu();
  };

  const onShowConfirmDelete = () => {
    if (!itemAction) return;
    setUserDelete(itemAction);
    onCloseActionMenu();
  };

  const onClosePopupConfirmDelete = () => {
    if (!userDelete) return;
    setUserDelete(null);
    onCloseActionMenu();
  };

  const onCloseEditUser = () => {
    setUserEdit(null);
  };

  const onYesDelete = () => {
    if (!userDelete) return;
    onClosePopupConfirmDelete();
    dispatch(setLoading(true));
    UserService.delete(userDelete?.id)
      .then(() => {
        dispatch(setSuccessMess(t("common_delete")));
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
          <h3>{t("admin_management_navbar_user")}</h3>
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
        </Row>
        <TableContainer component={Paper} sx={{ marginTop: "2rem" }}>
          <Table className={classes.table}>
            <TableHeader headers={tableHeaders} />
            <TableBody>
              {dataUser?.data?.length ? (
                dataUser.data?.map((item, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell scope="row" className={classes.tableCell}>
                        {item.id}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {item?.username}
                      </TableCell>
                      {userEdit?.id === item?.id ? (
                        <TableCell className={classes.tableCell} component="th">
                          <Grid
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <EditRoleForm
                              userEdit={userEdit}
                              fetchData={fetchData}
                              onCloseEditUser={onCloseEditUser}
                            />
                          </Grid>
                        </TableCell>
                      ) : (
                        <TableCell className={classes.tableCell} component="th">
                          {getRoleUser(item?.role)}
                        </TableCell>
                      )}
                      <TableCell className={classes.tableCell} component="th">
                        <StatusChip status={!item.isDeleted} />
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
                  <TableCell align="center" colSpan={3}>
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
            count={dataUser?.meta?.itemCount || 0}
            rowsPerPage={dataUser?.meta?.take || 10}
            page={dataUser?.meta?.page ? dataUser?.meta?.page - 1 : 0}
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
            onClick={onActionEditRole}
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
          title={t("admin_management_tab_user_confirm_delete")}
          isOpen={!!userDelete}
          onClose={onClosePopupConfirmDelete}
          toggle={onClosePopupConfirmDelete}
          onYes={onYesDelete}
        />
      </div>
    </>
  );
});

export default User;
