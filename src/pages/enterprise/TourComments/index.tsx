import React, { memo, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { Row, Table } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import moment from "moment";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomSelect from "components/common/CustomSelect";
import { CommentService } from "services/enterprise/comment";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import SearchNotFound from "components/SearchNotFound";
import Button, { BtnType } from "components/common/buttons/Button";
import PopupReplyComment from "./PopupReplyComment";
import PopupConfirmDelete from "components/Popup/PopupConfirmDelete";
import Link from "next/link";
import { useRouter } from "next/router";
import PopupRequestDeleteComment from "./PopupRequestDeleteComment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHourglass } from "@fortawesome/free-solid-svg-icons";

interface ITourSelection {
  tours?: any;
}

// eslint-disable-next-line react/display-name
const TourComments = memo(() => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { allTours } = useSelector((state: ReducerType) => state.enterprise);
  const [tours, setTours] = useState([]);
  const [comments, setComments] = useState([]);
  const [allComments, setAllComments] = useState([]);

  const [tourIds, setTourIds] = useState([]);
  const [openPopupReplyComment, setOpenPopupReplyComment] = useState(false);
  const [openPopupRequestDeleteComment, setOpenPopupRequestDeleteComment] =
    useState(false);
  const [commentAction, setCommentAction] = useState(null);
  const [commentDelete, setCommentDelete] = useState(null);
  const [commentEdit, setCommentEdit] = useState(null);

  const schema = useMemo(() => {
    return yup.object().shape({
      tours: yup.object().required("This field is required"),
    });
  }, []);

  const {
    register,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<ITourSelection>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      tours: tours[0],
    },
  });

  const watchTourValue = watch("tours");

  const sortDate = (a, b) => {
    if (moment(a?.createdAt).toDate() > moment(b?.createdAt).toDate()) {
      return 1;
    } else if (moment(a?.createdAt).toDate() < moment(b?.createdAt).toDate()) {
      return -1;
    } else {
      return 0;
    }
  };
  const onOpenPopupReplyComment = (e, itemAction) => {
    setOpenPopupReplyComment(true);
    setCommentAction(itemAction);
    setCommentEdit(itemAction);
  };

  const onOpenPopupRequestDeleteComment = (e, itemAction) => {
    setOpenPopupRequestDeleteComment(true);
    setCommentAction(itemAction);
    setCommentEdit(itemAction);
  };

  const onOpenPopupConfirmDelete = (e, itemAction) => {
    setCommentDelete(itemAction);
  };

  const onClosePopupConfirmDelete = () => {
    if (!commentDelete) return;
    setCommentDelete(null);
  };

  const onClosePopupAddComment = () => {
    setOpenPopupReplyComment(false);
    setCommentEdit(null);
  };

  const onClosePopupRequesttDeleteComment = () => {
    setOpenPopupRequestDeleteComment(false);
    setCommentEdit(null);
  };

  const onGetTourComments = () => {
    // CommentService.getAllTourComments({ tourIds: tourIds })
    //   .then((res) => {
    //     setComments(res.data.sort(sortDate));
    //     setAllComments(res.data.sort(sortDate));
    //   })
    //   .catch((e) => {
    //     dispatch(setErrorMess(e));
    //   })
    //   .finally(() => {
    //     dispatch(setLoading(false));
    //   });
  };

  const onYesDelete = () => {
    if (!commentDelete) return;
    onClosePopupConfirmDelete();
    dispatch(setLoading(true));
    CommentService.deleteCommentTour(commentDelete?.id)
      .then(() => {
        onGetTourComments();
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  // useEffect(() => {
  //   dispatch(setLoading(true));
  //   onGetTourComments();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [tourIds]);

  // useEffect(() => {
  //   const newTours = [{ id: 0, name: "All", value: "All" }];
  //   allTours?.map((item, index) => {
  //     newTours.push({
  //       id: item?.id,
  //       name: item?.title,
  //       value: item?.title,
  //     });
  //   });
  //   const tempTourIds = allTours.map((tour) => tour?.id);
  //   setTourIds(tempTourIds);
  //   setTours(newTours);
  //   setValue("tours", tours[0]);
  // }, [allTours]);

  // useEffect(() => {
  //   if (watchTourValue) {
  //     if (watchTourValue.id === 0) {
  //       setComments(allComments);
  //     } else {
  //       const filterTour = allComments.filter(
  //         (item) => item.tourId === watchTourValue.id
  //       );
  //       setComments(filterTour);
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [watchTourValue]);

  return (
    <>
      <div className={classes.root}>
        <Row className={clsx(classes.rowHeaderBox, classes.title)}>
          <h3>comment of tours</h3>
        </Row>
        <Row className={classes.rowSelectTour}>
          <p>Tour:</p>
          <CustomSelect
            className={classes.input}
            placeholder="Please choose tour"
            name="tours"
            control={control}
            options={tours}
            errorMessage={errors.tours?.message}
          />
        </Row>
        <Table className={classes.table} responsive>
          <thead>
            <tr>
              <th scope="row">#</th>
              <th>Tour name</th>
              <th>User name</th>
              <th>Created</th>
              <th>Content</th>
              <th>Reply</th>
              <th>Reason for decline delete</th>
              <th className={classes.colActionBtn}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {comments?.map((cmt, index) => (
              <tr key={index}>
                <td scope="row">{index + 1}</td>
                <td>
                  <Link href={`/listTour/:${cmt?.tourId}`}>
                    <a className={classes.linkDetail}>{cmt?.tourInfo.title}</a>
                  </Link>
                </td>
                <td>
                  {cmt?.tourReviewer?.firstName} {cmt?.tourReviewer?.lastName}
                </td>
                <td>{moment(cmt?.createdAt).format("DD/MM/YYYY")}</td>
                <td>{cmt?.comment}</td>
                <td>
                  {cmt?.replyComment || (
                    <span className={classes.textNoReply}>Not reply</span>
                  )}
                </td>
                <td>
                  {cmt?.reasonForDecline || (
                    <span className={classes.textNoReply}>Not decline</span>
                  )}
                </td>
                <td className={classes.colActionBtn}>
                  <Button
                    className="btn-icon mr-1"
                    color="info"
                    size="sm"
                    type="button"
                    onClick={(e) => onOpenPopupReplyComment(e, cmt)}
                  >
                    <i className="now-ui-icons ui-1_send mr-1"></i>
                  </Button>
                  <Button
                    className="btn-icon"
                    color="danger"
                    size="sm"
                    type="button"
                    onClick={(e) => onOpenPopupRequestDeleteComment(e, cmt)}
                  >
                    <i className="now-ui-icons ui-1_simple-remove"></i>
                  </Button>
                </td>
              </tr>
            ))}
            {!comments?.length && (
              <tr>
                <td scope="row" colSpan={7}>
                  <SearchNotFound mess="No comment" />
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        <PopupReplyComment
          isOpen={openPopupReplyComment}
          commentEdit={commentEdit}
          commentId={commentAction?.id}
          onClose={onClosePopupAddComment}
          toggle={onClosePopupAddComment}
          onGetTourComments={onGetTourComments}
        />
        <PopupRequestDeleteComment
          isOpen={openPopupRequestDeleteComment}
          commentEdit={commentEdit}
          commentId={commentAction?.id}
          onClose={onClosePopupRequesttDeleteComment}
          toggle={onClosePopupRequesttDeleteComment}
          onGetHotelComments={onGetTourComments}
        />
        <PopupConfirmDelete
          title="Are you sure delete this comment?"
          isOpen={!!commentDelete}
          onClose={onClosePopupConfirmDelete}
          toggle={onClosePopupConfirmDelete}
          onYes={onYesDelete}
        />
      </div>
    </>
  );
});

export default TourComments;
