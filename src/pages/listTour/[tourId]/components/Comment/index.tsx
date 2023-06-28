import React, { memo, useEffect, useState } from "react";
// reactstrap components
import { Container } from "reactstrap";

import classes from "./styles.module.scss";
import "aos/dist/aos.css";
import Button, { BtnType } from "components/common/buttons/Button";
import { Comment, FindAllComment } from "models/comment";

import PopupAddTourComment from "../PopupAddTourComment";
import { ReducerType } from "redux/reducers";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import PopupConfirmDelete from "components/Popup/PopupConfirmDelete";
import { CommentService } from "services/normal/comment";
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from "redux/reducers/Status/actionTypes";
import {
  useMediaQuery,
  useTheme,
  Grid,
  IconButton,
  MenuItem,
  Box,
  Menu,
  Pagination,
} from "@mui/material";
import Stars from "components/Stars";
import { TourBill } from "models/tourBill";
import { DataPagination, EServiceType } from "models/general";
import { TourBillService } from "services/normal/tourBill";

import moment from "moment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { DeleteOutlineOutlined, EditOutlined } from "@mui/icons-material";
import useAuth from "hooks/useAuth";
import AddCommentIcon from "@mui/icons-material/AddComment";
import InputTextfield from "components/common/inputs/InputTextfield";
import PopupModalImages from "components/Popup/PopupModalImages";
import { useTranslation } from "react-i18next";

interface Props {}

// eslint-disable-next-line react/display-name
const Comments = memo(({}: Props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useAuth();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { t, i18n } = useTranslation("common");

  const tourId = Number(router.query.tourId.slice(1));

  const [itemAction, setItemAction] = useState<Comment>();
  const [openPopupAddComment, setOpenPopupAddComment] = useState(false);
  const [openPopupConfirmDelete, setOpenPopupConfirmDelete] = useState(false);
  const [actionAnchor, setActionAnchor] = useState<null | HTMLElement>(null);
  const [data, setData] = useState<DataPagination<Comment>>();
  const [lastedBill, setLastedBill] = useState<TourBill>(null);
  const [comment, setComment] = useState<Comment>(null);
  const [commentDelete, setCommentDelete] = useState<Comment>(null);
  const [reply, setReply] = useState(null);
  const [contentReply, setContentReply] = useState("");
  const [replyDelete, setReplyDelete] = useState(null);
  const [replyEdit, setReplyEdit] = useState(null);
  const [openPopupModalImages, setOpenPopupModalImages] = useState(false);
  const [visible, setVisible] = useState(1);

  const getRateComment = (rate: number) => {
    switch (rate) {
      case 1:
        return t("common_rate_worst");
      case 2:
        return t("common_rate_bad");
      case 3:
        return t("common_rate_normal");
      case 4:
        return t("common_rate_good");
      case 5:
        return t("common_rate_excellent");
    }
  };

  const sortDataByDate = (first, second) =>
    Number(Date.parse(second)) - Number(Date.parse(first));

  const onToggleAddComment = () => {
    setComment(null);
    setOpenPopupAddComment(!openPopupAddComment);
  };

  const onTogglePopupConfirmDelete = () => {
    setOpenPopupConfirmDelete(!openPopupConfirmDelete);
  };

  const handleAction = (
    event: React.MouseEvent<HTMLButtonElement>,
    item: Comment
  ) => {
    setItemAction(item);
    setActionAnchor(event.currentTarget);
  };

  const onCloseActionMenu = () => {
    setItemAction(null);
    setActionAnchor(null);
  };

  const handleChangePage = (_: React.ChangeEvent<unknown>, newPage: number) => {
    fetchData({
      page: newPage + 1,
    });
  };

  const fetchData = (value?: {
    serviceId?: number;
    serviceType?: number;
    take?: number;
    page?: number;
    keyword?: string;
  }) => {
    const params: FindAllComment = {
      serviceId: tourId,
      serviceType: EServiceType?.TOUR,
      take: value?.take || data?.meta?.take || 10,
      page: value?.page || data?.meta?.page || 1,
      keyword: "",
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
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  const onUpdateComment = () => {
    onToggleAddComment();
    onCloseActionMenu();
    setComment(itemAction);
  };

  const onDelete = () => {
    onTogglePopupConfirmDelete();
    onCloseActionMenu();
    setCommentDelete(itemAction);
  };

  const onYesDelete = () => {
    dispatch(setLoading(true));
    if (commentDelete) {
      CommentService.deleteComment(commentDelete?.id)
        .then(() => {
          dispatch(setSuccessMess(t("common_update_success")));
          onTogglePopupConfirmDelete();
          fetchData();
        })
        .catch((e) => {
          dispatch(setErrorMess(e));
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    } else {
      CommentService.deleteComment(commentDelete?.id)
        .then(() => {
          dispatch(setSuccessMess(t("common_update_success")));
          onTogglePopupConfirmDelete();
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

  const onOpenReply = () => {
    setReply(itemAction);
    onCloseActionMenu();
  };

  const onDeleteReply = (e, item) => {
    setReplyDelete(item);
    onTogglePopupConfirmDelete();
    onCloseActionMenu();
  };

  const onUpdateReply = (e, reply) => {
    setReplyEdit(reply);
  };

  const onPostReply = () => {
    dispatch(setLoading(true));

    if (replyEdit) {
      CommentService.updateReplyComment(replyEdit?.id, {
        content: contentReply,
      })
        .then(() => {
          dispatch(setSuccessMess(t("common_update_success")));
          setReplyEdit(null);
          fetchData();
        })
        .catch((e) => {
          dispatch(setErrorMess(e));
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    } else {
      CommentService.replyComment({
        commentId: reply?.id,
        content: contentReply,
      })
        .then(() => {
          dispatch(setSuccessMess(t("common_send_success")));
          setReply(null);
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

  const onOpenPopupModalImages = () =>
    setOpenPopupModalImages(!openPopupModalImages);

  const showMoreReply = () => {
    setVisible((prev) => prev + 1);
  };

  useEffect(() => {
    fetchData();
    if (user) {
      TourBillService.getLastedTourBill(tourId)
        .then((res) => {
          setLastedBill(res?.data);
        })
        .catch((e) => {
          dispatch(setErrorMess(e));
        });
    }
  }, []);

  useEffect(() => {
    if (replyEdit) {
      setContentReply(replyEdit?.content);
    }
  }, [replyEdit]);

  return (
    <Grid className={classes.root}>
      <Container className={classes.container}>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <Grid className={classes.titleHeader}>
          <h2 className={classes.title}>
            {t("tour_detail_section_comment_title")}
          </h2>
          {lastedBill && (
            <Button btnType={BtnType.Primary} onClick={onToggleAddComment}>
              {t("tour_detail_section_comment_btn")}
            </Button>
          )}
        </Grid>
        <p className={classes.subTitle}>
          {t("tour_detail_section_comment_sub_title")}
        </p>
        {data?.data.length ? (
          data?.data?.map((item, index) => (
            <Grid
              key={index}
              container
              sx={{ borderTop: "1px solid var(--gray-40)", padding: "16px 0" }}
            >
              <Grid xs={3} item className={classes.boxAvatar}>
                {item?.reviewer?.avatar ? (
                  <Grid>
                    <img alt="" src={item?.reviewer?.avatar} />
                  </Grid>
                ) : (
                  <Grid>
                    <img
                      alt=""
                      src="https://res.cloudinary.com/dpvvffyul/image/upload/v1675930803/my-uploads/user_qcfigg.png"
                    />
                  </Grid>
                )}
                <p>
                  {item?.reviewer?.lastName} {item?.reviewer?.firstName}
                </p>
              </Grid>
              <Grid xs={9} item>
                <Grid sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Grid className={classes.boxRate}>
                    <Stars numberOfStars={item?.rate} />
                    <p className={classes.textRate}>
                      {getRateComment(item?.rate)}
                    </p>
                    <p className={classes.textTime}>
                      {moment(item?.createdAt).format("DD-MM-YYYY")}
                    </p>
                  </Grid>
                  <Grid>
                    <IconButton
                      onClick={(e) => {
                        handleAction(e, item);
                      }}
                    >
                      <MoreVertIcon
                        sx={{
                          fontSize: "28px",
                          color: "var(--primary-color)",
                        }}
                      />
                    </IconButton>
                  </Grid>
                </Grid>
                <Grid className={classes.boxComment}>
                  <p>{item?.content}</p>
                </Grid>
                {item?.images?.length ? (
                  <ul className={classes.boxImg}>
                    {item?.images?.map((img, index) => (
                      <li className={classes.boxItemImg} key={index}>
                        {item?.images?.length >= 7 ? (
                          <Grid
                            className={classes.overLayMore}
                            onClick={onOpenPopupModalImages}
                          >
                            {t("common_see_all")}
                          </Grid>
                        ) : (
                          <Grid
                            className={classes.overLay}
                            onClick={onOpenPopupModalImages}
                          ></Grid>
                        )}
                        <img alt="" src={img} />
                      </li>
                    ))}
                    <PopupModalImages
                      isOpen={openPopupModalImages}
                      toggle={onOpenPopupModalImages}
                      images={item?.images}
                    />
                  </ul>
                ) : (
                  <p>{t("tour_detail_section_comment_no_img")}</p>
                )}
                {reply?.id === item?.id && (
                  <Grid>
                    <InputTextfield
                      placeholder="Your comment"
                      multiline
                      rows={3}
                      onChange={(e) => {
                        setContentReply(e?.target?.value);
                      }}
                    />
                    <Grid className={classes.btnPostReply}>
                      <Button
                        btnType={BtnType?.Secondary}
                        className="mr-2"
                        onClick={() => setReply(null)}
                      >
                        {t("common_cancel")}
                      </Button>
                      <Button btnType={BtnType?.Primary} onClick={onPostReply}>
                        {t("tour_detail_section_comment_btn_post")}
                      </Button>
                    </Grid>
                  </Grid>
                )}
                {item?.replies?.slice(0, visible)?.map((reply, index) => (
                  <Grid key={index}>
                    <Grid className={classes.boxCommentReply}>
                      <Grid
                        className={classes.boxAvatar}
                        sx={{
                          display: "flex",
                          alignItems: "center !important",
                        }}
                      >
                        {reply?.reviewer?.avatar ? (
                          <Grid>
                            <img alt="" src={reply?.reviewer?.avatar} />
                          </Grid>
                        ) : (
                          <Grid>
                            <img
                              alt=""
                              src="https://res.cloudinary.com/dpvvffyul/image/upload/v1675930803/my-uploads/user_qcfigg.png"
                            />
                          </Grid>
                        )}
                        <p>
                          {reply?.reviewer?.lastName}{" "}
                          {reply?.reviewer?.firstName}
                        </p>
                      </Grid>
                      <p className={classes.dateReply}>
                        {moment(item?.createdAt).format("DD-MM-YYYY")}
                      </p>
                      {user && user?.id === reply?.userId && (
                        <Grid>
                          <IconButton onClick={(e) => onUpdateReply(e, reply)}>
                            <EditOutlined
                              sx={{
                                fontSize: "28px",
                              }}
                            />
                          </IconButton>
                        </Grid>
                      )}
                      {user && user?.id === reply?.userId && (
                        <Grid>
                          <IconButton onClick={(e) => onDeleteReply(e, reply)}>
                            <DeleteOutlineOutlined
                              fontSize="small"
                              color="error"
                            />
                          </IconButton>
                        </Grid>
                      )}
                    </Grid>
                    {replyEdit?.id === reply?.id ? (
                      <Grid>
                        <InputTextfield
                          placeholder="Your comment"
                          multiline
                          rows={3}
                          value={contentReply}
                          onChange={(e) => {
                            setContentReply(e?.target?.value);
                          }}
                        />
                        <Grid className={classes.btnPostReply}>
                          <Button
                            btnType={BtnType?.Secondary}
                            className="mr-2"
                            onClick={() => setReplyEdit(null)}
                          >
                            {t("common_cancel")}
                          </Button>
                          <Button
                            btnType={BtnType?.Primary}
                            onClick={onPostReply}
                          >
                            {t("tour_detail_section_comment_btn_post")}
                          </Button>
                        </Grid>
                      </Grid>
                    ) : (
                      <Grid>
                        <p className={classes.contentReply}>{reply?.content}</p>
                      </Grid>
                    )}
                  </Grid>
                ))}
                {item?.replies?.length > 1 && (
                  <Grid className={classes.btnReadMore}>
                    <Button btnType={BtnType?.Primary} onClick={showMoreReply}>
                      {t("book_page_booking_read_all")}
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Grid>
          ))
        ) : (
          <Grid
            container
            sx={{ borderTop: "1px solid var(--gray-40)", padding: "16px 0" }}
          >
            <Grid xs={3} item className={classes.boxAvatar}>
              <p>{t("tour_detail_section_comment_no_cmt")}</p>
            </Grid>
          </Grid>
        )}

        {data?.data?.length !== 0 && (
          <Grid className={classes.boxViewMore}>
            {/* <Button btnType={BtnType.Primary}>See More</Button>
             */}
            <Pagination
              count={data?.meta?.pageCount || 0}
              page={data?.meta?.page}
              onChange={handleChangePage}
            />
          </Grid>
        )}

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
          <>
            {user && user?.id === itemAction?.userId && (
              <MenuItem
                sx={{ fontSize: "0.875rem" }}
                className={classes.menuItem}
                onClick={onUpdateComment}
              >
                <Box display="flex" alignItems={"center"}>
                  <EditOutlined
                    sx={{ marginRight: "0.25rem" }}
                    fontSize="small"
                  />
                  <span>{t("common_edit")}</span>
                </Box>
              </MenuItem>
            )}
            {user ? (
              <MenuItem
                sx={{ fontSize: "0.875rem" }}
                className={classes.menuItem}
                onClick={onOpenReply}
              >
                <Box display="flex" alignItems={"center"}>
                  <AddCommentIcon
                    sx={{ marginRight: "0.25rem" }}
                    fontSize="small"
                    color="info"
                  />
                  <span>{t("common_reply")}</span>
                </Box>
              </MenuItem>
            ) : (
              <MenuItem
                sx={{ fontSize: "0.875rem" }}
                className={classes.menuItem}
                onClick={() => {
                  router?.push("/auth/login");
                }}
              >
                <Box display="flex" alignItems={"center"}>
                  <AddCommentIcon
                    sx={{ marginRight: "0.25rem" }}
                    fontSize="small"
                    color="info"
                  />
                  <span>{t("common_reply")}</span>
                </Box>
              </MenuItem>
            )}
            {user && user?.id === itemAction?.userId && (
              <MenuItem
                sx={{ fontSize: "0.875rem" }}
                className={classes.menuItem}
                onClick={onDelete}
              >
                <Box display="flex" alignItems={"center"}>
                  <DeleteOutlineOutlined
                    sx={{ marginRight: "0.25rem" }}
                    fontSize="small"
                    color="error"
                  />
                  <span>{t("common_delete")}</span>
                </Box>
              </MenuItem>
            )}
          </>
        </Menu>
        <PopupAddTourComment
          isOpen={openPopupAddComment}
          toggle={onToggleAddComment}
          tourBill={lastedBill}
          fetchComment={fetchData}
          commentEdit={comment}
        />
        <PopupConfirmDelete
          title={t("tour_detail_section_comment_popup_title_cmt")}
          isOpen={openPopupConfirmDelete}
          onClose={onTogglePopupConfirmDelete}
          toggle={onTogglePopupConfirmDelete}
          onYes={onYesDelete}
        />
      </Container>
    </Grid>
  );
});

export default Comments;
