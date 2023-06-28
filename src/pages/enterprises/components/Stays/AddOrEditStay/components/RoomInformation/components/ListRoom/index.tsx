import React, { memo, useEffect, useState } from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
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
import TableHeader from "components/Table/TableHeader";
import { DataPagination, TableHeaderLabel } from "models/general";
import {
  EditOutlined,
  DeleteOutlineOutlined,
  ExpandMoreOutlined,
} from "@mui/icons-material";
import { useRouter } from "next/router";
import useDebounce from "hooks/useDebounce";
import InputSearch from "components/common/inputs/InputSearch";
import PopupConfirmDelete from "components/Popup/PopupConfirmDelete";
import "react-loading-skeleton/dist/skeleton.css";
import { useTranslation } from "react-i18next";
import StatusChip from "components/StatusChip";
import PopupConfirmWarning from "components/Popup/PopupConfirmWarning";
import InputSelect from "components/common/inputs/InputSelect";
import { EStayStatusFilter, Stay } from "models/enterprise/stay";
import { ERoomStatusFilter, FindAll, Room } from "models/enterprise/room";
import { RoomService } from "services/enterprise/room";
import { ReducerType } from "redux/reducers";
import Button, { BtnType } from "components/common/buttons/Button";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

interface Props {
  lang?: string;
  stay?: Stay;
  onChangeTab?: (item: Room) => void;
  onChangeRoomOtherPrice?: (item: Room) => void;
  onChangeUpdateRoom?: (item: Room) => void;
  isFetchData?: boolean;
  handleNextStep?: () => void;
}

// eslint-disable-next-line react/display-name
const ListRoom = memo(
  ({
    lang,
    stay,
    onChangeTab,
    onChangeRoomOtherPrice,
    onChangeUpdateRoom,
    isFetchData,
    handleNextStep,
  }: Props) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { t, i18n } = useTranslation("common");

    const { stayInformation } = useSelector(
      (state: ReducerType) => state.enterprise
    );

    const tableHeaders: TableHeaderLabel[] = [
      { name: "#", label: "#", sortable: false },
      {
        name: "name",
        label: t(
          "enterprise_management_section_add_or_edit_stay_tab_list_header_room_name"
        ),
        sortable: false,
      },
      {
        name: "Number Of Rooms",
        label: t(
          "enterprise_management_section_add_or_edit_stay_tab_list_header_number_of_room"
        ),
        sortable: false,
      },
      {
        name: "Number Of Beds",
        label: t(
          "enterprise_management_section_add_or_edit_stay_tab_list_header_number_of_bed"
        ),
        sortable: false,
      },
      {
        name: "Number of people",
        label: t(
          "enterprise_management_section_add_or_edit_stay_tab_list_header_number_of_people"
        ),
        sortable: false,
      },
      {
        name: "status",
        label: t("enterprise_management_section_tour_header_status"),
        sortable: false,
      },
      {
        name: "languages",
        label: t("enterprise_management_section_tour_header_language"),
        sortable: false,
      },
      { name: "actions", label: t("common_action"), sortable: false },
    ];

    const stayStatusFilterOption = [
      { id: 0, name: t("common_select_all"), value: ERoomStatusFilter.ALL },
      {
        id: 1,
        name: t("enterprise_management_section_tour_filter_status_active"),
        value: ERoomStatusFilter.ACTIVED,
      },
      {
        id: 2,
        name: t("enterprise_management_section_tour_filter_status_in_active"),
        value: ERoomStatusFilter.IN_ACTIVED,
      },
    ];

    const [itemAction, setItemAction] = useState<Room>();
    const [itemDelete, setItemDelete] = useState<Room>(null);
    const [keyword, setKeyword] = useState<string>("");
    const [data, setData] = useState<DataPagination<Room>>();
    const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);
    const [openPopupWarning, setOpenPopupWarning] = useState(false);
    const [stayStatusFilter, setStayStatusFilter] = useState<number>(
      EStayStatusFilter.ALL
    );

    const onTogglePopupWarning = () => {
      setOpenPopupWarning(!openPopupWarning);
    };

    const handleAction = (
      event: React.MouseEvent<HTMLButtonElement>,
      item: Room
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
        stayId: stayInformation?.id || stay?.id,
        take: value?.take || data?.meta?.take || 10,
        page: value?.page || data?.meta?.page || 1,
        keyword: keyword,
        status: stayStatusFilter || -1,
      };
      if (value?.keyword !== undefined) {
        params.keyword = value.keyword || undefined;
      }
      dispatch(setLoading(true));
      RoomService.findAll(params)
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

    const _onSearch = useDebounce(
      (keyword: string) => fetchData({ keyword, page: 1 }),
      500
    );

    const onCloseActionMenu = () => {
      setItemAction(null);
      setActionAnchor(null);
    };

    const handleRedirect = () => {
      if (!itemAction) return;
      onRedirectEdit(itemAction);
      onCloseActionMenu();
    };

    const onRedirectEdit = (item: Room) => {
      onChangeTab(item);
    };

    const handleRedirectRoomOtherPrice = () => {
      if (!itemAction) return;
      onRedirectRoomOtherPrice(itemAction);
      onCloseActionMenu();
    };

    const onRedirectRoomOtherPrice = (item: Room) => {
      onChangeRoomOtherPrice(item);
    };

    const handleRedirectUpdateNumber = () => {
      if (!itemAction) return;
      onRedirectUpdateNumber(itemAction);
      onCloseActionMenu();
    };

    const onRedirectUpdateNumber = (item: Room) => {
      onChangeUpdateRoom(item);
    };

    const onShowConfirm = () => {
      // if (!itemAction) return;
      // if (itemAction?.isCanDelete === false) {
      //   onTogglePopupWarning();
      // } else {
      //   setItemDelete(itemAction);
      // }
      // onCloseActionMenu();
    };

    const onClosePopupConfirmDelete = () => {
      if (!itemDelete) return;
      setItemDelete(null);
      onCloseActionMenu();
    };

    const onYesDelete = () => {
      // if (!itemDelete) return;
      // onClosePopupConfirmDelete();
      // dispatch(setLoading(true));
      // TourService.delete(itemDelete?.id)
      //   .then(() => {
      //     dispatch(setSuccessMess("Delete successfully"));
      //     fetchData();
      //   })
      //   .catch((e) => {
      //     dispatch(setErrorMess(e));
      //   })
      //   .finally(() => {
      //     dispatch(setLoading(false));
      //   });
    };

    useEffect(() => {
      if (stayInformation || stay) {
        fetchData();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stayStatusFilter, keyword, stay, isFetchData]);

    return (
      <>
        <div className={classes.root}>
          <Row className={clsx(classes.rowHeaderBox, classes.boxControl)}>
            <Grid
              className={classes.boxInputSearch}
              container
              spacing={2}
              xs={6}
            >
              <Grid item>
                <InputSearch
                  autoComplete="off"
                  placeholder={t("common_search")}
                  value={keyword || ""}
                  onChange={onSearch}
                />
              </Grid>
              <Grid item xs={6}>
                <InputSelect
                  fullWidth
                  selectProps={{
                    options: stayStatusFilterOption,
                    placeholder: t(
                      "enterprise_management_section_tour_header_status"
                    ),
                  }}
                  onChange={(e) => setStayStatusFilter(e?.value)}
                />
              </Grid>
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
                          {item?.title}
                        </TableCell>
                        <TableCell className={classes.tableCell} component="th">
                          {item?.numberOfRoom}{" "}
                          {t(
                            "enterprise_management_section_add_or_edit_stay_tab_list_body_room"
                          )}
                        </TableCell>
                        <TableCell className={classes.tableCell} component="th">
                          {item?.numberOfBed}{" "}
                          {t(
                            "enterprise_management_section_add_or_edit_stay_tab_list_body_bed"
                          )}
                        </TableCell>
                        <TableCell className={classes.tableCell} component="th">
                          {item?.numberOfAdult}{" "}
                          {t(
                            "enterprise_management_section_add_or_edit_stay_tab_list_body_adult"
                          )}{" "}
                          - {item?.numberOfChildren}{" "}
                          {t(
                            "enterprise_management_section_add_or_edit_stay_tab_list_body_child"
                          )}
                        </TableCell>
                        <TableCell className={classes.tableCell} component="th">
                          <StatusChip status={!item?.isDeleted} />
                        </TableCell>
                        <TableCell className={classes.tableCell} component="th">
                          {item?.languages?.map((it) => it.language).join(", ")}
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
                    <TableCell align="center" colSpan={8}>
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
          <Grid className={classes.boxNextBtn}>
            <Button btnType={BtnType.Primary} onClick={handleNextStep}>
              {t("enterprise_management_section_tour_tab_range_price_next")}
              <ArrowRightAltIcon />
            </Button>
          </Grid>
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
                <EditOutlined
                  sx={{ marginRight: "0.25rem" }}
                  fontSize="small"
                />
                <span>{t("common_edit")}</span>
              </Box>
            </MenuItem>
            <MenuItem
              sx={{ fontSize: "0.875rem" }}
              onClick={handleRedirectRoomOtherPrice}
              className={classes.menuItem}
            >
              <Box display="flex" alignItems={"center"}>
                <EditOutlined
                  sx={{ marginRight: "0.25rem" }}
                  fontSize="small"
                />
                <span>
                  {t(
                    "enterprise_management_section_stay_header_table_room_other_price_title_action"
                  )}
                </span>
              </Box>
            </MenuItem>
            <MenuItem
              sx={{ fontSize: "0.875rem" }}
              onClick={handleRedirectUpdateNumber}
              className={classes.menuItem}
            >
              <Box display="flex" alignItems={"center"}>
                <EditOutlined
                  sx={{ marginRight: "0.25rem" }}
                  fontSize="small"
                />
                <span>
                  {t(
                    "enterprise_management_section_stay_header_table_room_check_action"
                  )}
                </span>
              </Box>
            </MenuItem>
            <MenuItem
              sx={{ fontSize: "0.875rem" }}
              className={classes.menuItem}
              onClick={onShowConfirm}
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
            title={t(
              "enterprise_management_section_tour_popup_confirm_delete_title"
            )}
            isOpen={!!itemDelete}
            onClose={onClosePopupConfirmDelete}
            toggle={onClosePopupConfirmDelete}
            onYes={onYesDelete}
          />
          <PopupConfirmWarning
            title={t(
              "enterprise_management_section_tour_popup_confirm_delete_title"
            )}
            isOpen={openPopupWarning}
            onClose={onTogglePopupWarning}
            toggle={onTogglePopupWarning}
          />
        </div>
      </>
    );
  }
);

export default ListRoom;
