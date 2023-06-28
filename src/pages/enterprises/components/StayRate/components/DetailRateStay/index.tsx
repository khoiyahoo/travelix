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
import {
  DataPagination,
  EServiceType,
  EStatusService,
  TableHeaderLabel,
  rateOption,
} from "models/general";
import {
  ExpandMoreOutlined,
  DeleteOutlineOutlined,
  EditOutlined,
} from "@mui/icons-material";
import { useRouter } from "next/router";
import useDebounce from "hooks/useDebounce";
import InputSearch from "components/common/inputs/InputSearch";
import "react-loading-skeleton/dist/skeleton.css";
import { useTranslation } from "react-i18next";
import InputSelect from "components/common/inputs/InputSelect";
import { FindAll, Comment, Reply } from "models/enterprise/comment";
import { CommentService } from "services/enterprise/comment";
import { CommentService as CommentServiceNormal } from "services/normal/comment";
import PopupConfirmDelete from "components/Popup/PopupConfirmDelete";
import PopupModalImages from "components/Popup/PopupModalImages";
import moment from "moment";
import RateReviewIcon from "@mui/icons-material/RateReview";
import PopupReplyComment from "components/Popup/PopupReplyComment";
import useAuth from "hooks/useAuth";
import Button, { BtnType } from "components/common/buttons/Button";
import { EUserType } from "models/user";
interface Props {
  stayId?: number;
}

// eslint-disable-next-line react/display-name
const Stay = memo(({ stayId }: Props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t, i18n } = useTranslation("common");
  const { user } = useAuth();

  const tableHeaders: TableHeaderLabel[] = [
    { name: "#", label: "#", sortable: false },
    {
      name: "name",
      label: t("enterprise_management_section_tour_bill_title_person_name"),
      sortable: false,
    },
    {
      name: "create",
      label: t("enterprise_management_section_tour_header_created"),
      sortable: false,
    },
    {
      name: "content",
      label: t("enterprise_management_section_tour_header_content"),
      sortable: false,
    },
    {
      name: "rate",
      label: t("enterprise_management_section_tour_header_rate"),
      sortable: false,
    },
    {
      name: "discuss",
      label: t("enterprise_management_section_tour_header_discuss"),
      sortable: false,
    },
    {
      name: "replies",
      label: t("enterprise_management_section_tour_header_reply"),
      sortable: false,
    },
    {
      name: "images",
      label: t("enterprise_management_section_tour_header_img"),
      sortable: false,
    },
    { name: "actions", label: t("common_action"), sortable: false },
  ];

  const [itemReply, setItemReply] = useState<Reply>();
  const [itemAction, setItemAction] = useState<Comment>();
  const [itemComment, setItemComment] = useState<Comment>();
  const [replyEdit, setReplyEdit] = useState<Reply>();
  const [keyword, setKeyword] = useState<string>("");
  const [data, setData] = useState<DataPagination<Comment>>();
  const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);

  const [rateFilter, setRateFilter] = useState<number>(-1);
  const [openPopupModalImages, setOpenPopupModalImages] = useState(false);
  const [openPopupReplyComment, setOpenPopupReplyComment] = useState(false);

  const sortDataByDate = (first, second) =>
    Number(Date.parse(second)) - Number(Date.parse(first));

  const onOpenPopupModalImages = () =>
    setOpenPopupModalImages(!openPopupModalImages);

  const onTogglePopupReplyComment = () => {
    setOpenPopupReplyComment(!openPopupReplyComment);
  };

  const handleAction = (
    event: React.MouseEvent<HTMLButtonElement>,
    item: Comment
  ) => {
    setItemAction(item);
    setActionAnchor(event.currentTarget);
  };

  const onShowConfirm = (
    event: React.MouseEvent<HTMLButtonElement>,
    item: Reply
  ) => {
    setItemReply(item);
  };

  const onClosePopupConfirmDelete = () => {
    if (!itemReply) return;
    setItemReply(null);
  };

  const onYesDelete = () => {
    if (!itemReply) return;
    onClosePopupConfirmDelete();
    dispatch(setLoading(true));
    CommentService.deleteReply(itemReply?.id)
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
      serviceId: stayId,
      serviceType: EServiceType.HOTEL,
      take: value?.take || data?.meta?.take || 10,
      page: value?.page || data?.meta?.page || 1,
      keyword: keyword,
      rate: rateFilter || -1,
    };
    if (value?.keyword !== undefined) {
      params.keyword = value.keyword || undefined;
    }
    dispatch(setLoading(true));

    CommentService.findAll(params)
      .then((res) => {
        setData({
          data: res.data.sort(sortDataByDate),
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

  const handleReply = () => {
    setItemComment(itemAction);
    onCloseActionMenu();
    onTogglePopupReplyComment();
  };

  const onUpdateReply = (e, item) => {
    setReplyEdit(item);
    onTogglePopupReplyComment();
  };

  const onReplyComment = (data) => {
    dispatch(setLoading(true));

    if (replyEdit) {
      CommentServiceNormal.updateReplyComment(replyEdit?.id, {
        content: data?.content,
      })
        .then(() => {
          dispatch(setSuccessMess(t("common_update_success")));
          onTogglePopupReplyComment();

          fetchData();
        })
        .catch((e) => {
          dispatch(setErrorMess(e));
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    } else {
      CommentServiceNormal.replyComment({
        commentId: itemComment?.id,
        content: data?.content,
      })
        .then(() => {
          dispatch(setSuccessMess(t("common_send_success")));
          onTogglePopupReplyComment();
          fetchData();
        })
        .catch((e) => {
          dispatch(setErrorMess(e));
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    }
  };
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rateFilter, keyword]);

  return (
    <>
      <div className={classes.root}>
        <Row className={clsx(classes.rowHeaderBox, classes.title)}>
          <h3>{t("enterprise_management_section_stay_title_rate")}</h3>
        </Row>
        <Row className={clsx(classes.rowHeaderBox, classes.boxControl)}>
          <Grid className={classes.boxInputSearch} container spacing={2} xs={6}>
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
                bindLabel="translation"
                selectProps={{
                  options: rateOption,
                  placeholder: `-- ${t(
                    "enterprise_management_section_tour_header_rate_option"
                  )} --`,
                }}
                onChange={(e) => setRateFilter(e?.value)}
              />
            </Grid>
          </Grid>
          <Button
            onClick={() => {
              router.push("/enterprises/stayRates");
            }}
            btnType={BtnType.Primary}
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
                        {item?.reviewer?.firstName} {item?.reviewer?.lastName}
                        <br />
                        {item?.reviewer?.username}
                        <br />
                        {item?.reviewer?.phoneNumber}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {moment(item?.createdAt).format("DD-MM-YYYY")}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {item?.content}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {item?.rate}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {item?.replies?.length
                          ? item?.replies?.map(
                              (reply, index) =>
                                ((reply?.reviewer?.enterpriseId !==
                                  item?.stayInfo?.owner &&
                                  reply?.reviewer?.role === EUserType.STAFF) ||
                                  (reply?.reviewer?.id !==
                                    item?.stayInfo?.owner &&
                                    reply?.reviewer?.role ===
                                      EUserType.ENTERPRISE) ||
                                  reply?.reviewer?.role === EUserType.USER ||
                                  reply?.reviewer?.role === EUserType.ADMIN ||
                                  reply?.reviewer?.role ===
                                    EUserType.SUPER_ADMIN) && (
                                  <Grid
                                    key={index}
                                    className={classes.containerReply}
                                  >
                                    <Grid className={classes.boxReply}>
                                      {reply?.reviewer?.username}
                                      <br />
                                      <span>{reply?.content}</span>
                                    </Grid>
                                    <Grid>
                                      <IconButton
                                        className={clsx(classes.actionButton)}
                                        color="primary"
                                        onClick={(event) => {
                                          onShowConfirm(event, reply);
                                        }}
                                      >
                                        <DeleteOutlineOutlined
                                          sx={{ marginRight: "0.25rem" }}
                                          color="error"
                                          fontSize="small"
                                        />
                                      </IconButton>
                                    </Grid>
                                  </Grid>
                                )
                            )
                          : "-"}
                      </TableCell>
                      <TableCell className={classes.tableCell} component="th">
                        {item?.replies?.length
                          ? item?.replies?.map(
                              (reply, index) =>
                                ((reply?.reviewer?.enterpriseId ===
                                  item?.stayInfo?.owner &&
                                  reply?.reviewer?.role === EUserType.STAFF) ||
                                  (reply?.reviewer?.id ===
                                    item?.stayInfo?.owner &&
                                    reply?.reviewer?.role ===
                                      EUserType.ENTERPRISE)) && (
                                  <Grid
                                    key={index}
                                    className={classes.containerReply}
                                  >
                                    <Grid className={classes.boxReply}>
                                      {reply?.reviewer?.username}
                                      <br />
                                      <span>{reply?.content}</span>
                                    </Grid>
                                    <Grid>
                                      <Grid sx={{ display: "flex" }}>
                                        {user &&
                                          user?.id === item?.reviewer?.id && (
                                            <IconButton
                                              className={clsx(
                                                classes.actionButton
                                              )}
                                              color="primary"
                                              onClick={(event) => {
                                                onUpdateReply(event, reply);
                                              }}
                                            >
                                              <EditOutlined
                                                sx={{
                                                  marginRight: "0.25rem",
                                                }}
                                                color="info"
                                                fontSize="small"
                                              />
                                            </IconButton>
                                          )}
                                        <IconButton
                                          className={clsx(classes.actionButton)}
                                          color="primary"
                                          onClick={(event) => {
                                            onShowConfirm(event, reply);
                                          }}
                                        >
                                          <DeleteOutlineOutlined
                                            sx={{ marginRight: "0.25rem" }}
                                            color="error"
                                            fontSize="small"
                                          />
                                        </IconButton>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                )
                            )
                          : "-"}
                      </TableCell>
                      {item?.images?.length ? (
                        <TableCell
                          className={clsx(
                            classes.boxViewPhoto,
                            classes.tableCell
                          )}
                          component="th"
                          onClick={onOpenPopupModalImages}
                        >
                          <span className={classes.textViewPhoto}>
                            {t("common_see_all")}
                          </span>
                        </TableCell>
                      ) : (
                        <TableCell
                          className={clsx(
                            classes.boxViewPhoto,
                            classes.tableCell
                          )}
                          component="th"
                        >
                          <span>{t("tour_detail_section_comment_no_img")}</span>
                        </TableCell>
                      )}
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
                      <PopupModalImages
                        isOpen={openPopupModalImages}
                        toggle={onOpenPopupModalImages}
                        images={item?.images}
                      />
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
            className={classes.menuItem}
            onClick={handleReply}
          >
            <Box display="flex" alignItems={"center"}>
              <RateReviewIcon
                sx={{ marginRight: "0.25rem" }}
                color="info"
                fontSize="small"
              />
              <span>{t("common_reply")}</span>
            </Box>
          </MenuItem>
        </Menu>
        <PopupConfirmDelete
          title={t(
            "enterprise_management_section_comment_popup_confirm_delete_title"
          )}
          isOpen={!!itemReply}
          onClose={onClosePopupConfirmDelete}
          toggle={onClosePopupConfirmDelete}
          onYes={onYesDelete}
        />
        <PopupReplyComment
          isOpen={!!openPopupReplyComment}
          toggle={onTogglePopupReplyComment}
          replyEdit={replyEdit}
          onSubmit={onReplyComment}
        />
      </div>
    </>
  );
});

export default Stay;
