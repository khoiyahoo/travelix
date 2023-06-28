import React, { memo, useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Container,
  Row,
  Col,
} from "reactstrap";
import { images } from "configs/images";
import classes from "./styles.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteRight } from "@fortawesome/free-solid-svg-icons";
import { CommentService } from "services/enterprise/comment";
import { useDispatch, useSelector } from "react-redux";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { ReducerType } from "redux/reducers";
import moment from "moment";
import clsx from "clsx";
import Aos from "aos";
import "aos/dist/aos.css";
// eslint-disable-next-line react/display-name
const Testimonials = memo(() => {
  const dispatch = useDispatch();
  const { allTours } = useSelector((state: ReducerType) => state.normal);

  const [tourIds, setTourIds] = useState([]);
  const [comments, setComments] = useState([]);

  const onGetTourComments = () => {
    CommentService.getAllTourComments({ tourIds: tourIds })
      .then((res) => {
        setComments(res.data);
      })
      .catch((e) => {
        dispatch(setErrorMess(e));
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
  useEffect(() => {
    const tempTourIds = allTours.map((tour) => tour?.id);
    setTourIds(tempTourIds);
  }, [allTours]);

  useEffect(() => {
    dispatch(setLoading(true));
    onGetTourComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourIds]);

  useEffect(() => {
    Aos.init({ duration: 500 });
  }, []);

  return (
    <>
      <div className="cd-section" id="testimonials">
        <div
          className="testimonials-1 section-image"
          style={{
            backgroundImage: `url(${images.bg19.src})`,
          }}
        >
          <Container>
            <Row>
              <Col className="ml-auto mr-auto text-center" md="6">
                <h2 className="title">What customers say about us?</h2>
                <h4 className="description">
                  If you’re selected for ALPHA you’ll also get 3 tickets,
                  opportunity to access Investor Office Hours and Mentor Hours
                  and much more all for €850.
                </h4>
              </Col>
            </Row>
            <Row>
              <Col md="4" data-aos="fade-up">
                <Card className="card-testimonial">
                  <div className="card-avatar">
                    <img
                      alt="..."
                      className={clsx("img img-raised", classes.imgAvatar)}
                      src={comments[0]?.tourReviewer?.avatar}
                    ></img>
                  </div>
                  <CardBody>
                    <p className="card-description">
                      {" "}
                      {comments[0]?.tourReviewer?.firstName}{" "}
                      {comments[0]?.tourReviewer?.lastName}
                    </p>
                  </CardBody>
                  <div className="icon icon-info">
                    <FontAwesomeIcon
                      icon={faQuoteRight}
                      className={classes.iconQuote}
                    ></FontAwesomeIcon>
                  </div>
                  <CardFooter>
                    <CardTitle tag="h4">{comments[0]?.comment}</CardTitle>
                    <p className="category">
                      {moment(comments[0]?.createdAt).format("DD/MM/YYYY")}
                    </p>
                  </CardFooter>
                </Card>
              </Col>
              <Col md="4" data-aos="fade-down">
                <Card className="card-testimonial">
                  <div className="card-avatar">
                    <img
                      alt="..."
                      className={clsx("img img-raised", classes.imgAvatar)}
                      src={comments[1]?.tourReviewer?.avatar}
                    ></img>
                  </div>
                  <CardBody>
                    <p className="card-description">
                      {" "}
                      {comments[1]?.tourReviewer?.firstName}{" "}
                      {comments[1]?.tourReviewer?.lastName}
                    </p>
                  </CardBody>
                  <div className="icon icon-info">
                    <FontAwesomeIcon
                      icon={faQuoteRight}
                      className={classes.iconQuote}
                    ></FontAwesomeIcon>
                  </div>
                  <CardFooter>
                    <CardTitle tag="h4">{comments[1]?.comment}</CardTitle>
                    <p className="category">
                      {moment(comments[1]?.createdAt).format("DD/MM/YYYY")}
                    </p>
                  </CardFooter>
                </Card>
              </Col>
              <Col md="4" data-aos="fade-up">
                <Card className="card-testimonial">
                  <div className="card-avatar">
                    <img
                      alt="..."
                      className={clsx("img img-raised", classes.imgAvatar)}
                      src={comments[2]?.tourReviewer?.avatar}
                    ></img>
                  </div>
                  <CardBody>
                    <p className="card-description">
                      {comments[2]?.tourReviewer?.firstName}{" "}
                      {comments[2]?.tourReviewer?.lastName}
                    </p>
                  </CardBody>
                  <div className="icon icon-info">
                    <FontAwesomeIcon
                      icon={faQuoteRight}
                      className={classes.iconQuote}
                    ></FontAwesomeIcon>
                  </div>
                  <CardFooter>
                    <CardTitle tag="h4">{comments[2]?.comment}</CardTitle>
                    <p className="category">
                      {moment(comments[2]?.createdAt).format("DD/MM/YYYY")}
                    </p>
                  </CardFooter>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </>
  );
});

export default Testimonials;
