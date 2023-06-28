import React, { memo, useEffect, useState, useMemo } from "react";
import SectionHeader from "components/Header/SectionHeader";
import { images } from "configs/images";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { Container } from "reactstrap";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import { Grid, StepConnector, StepLabel } from "@mui/material";
import { useTranslation } from "react-i18next";
import QontoStepIcon from "components/QontoStepIcon";
import PopupCheckReview from "components/Popup/PopupCheckReview";
import Booking from "../components/Booking";
import { StayService } from "services/normal/stay";
import { Stay } from "models/stay";
import Review from "../components/Review";
import { RoomBillConfirm } from "models/roomBill";

export enum EStep {
  BOOKING,
  REVIEW,
  PAYMENT,
}

// eslint-disable-next-line react/display-name
const BookTour = memo(() => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { page } = router.query;
  const { t, i18n } = useTranslation("common");

  const [modal, setModal] = useState(false);
  const [stay, setStay] = useState<Stay>();
  const [dataRoomBook, setDataRoomBook] = useState<RoomBillConfirm>(null);
  const [activeStep, setActiveStep] = useState<EStep>(EStep.BOOKING);

  const steps = useMemo(() => {
    return [
      {
        id: EStep.BOOKING,
        name: t("book_page_step_title_booking"),
      },
      {
        id: EStep.REVIEW,
        name: t("review_page_step_title_review"),
      },
      {
        id: EStep.PAYMENT,
        name: t("payment_page_step_title_payment"),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const toggle = () => setModal(!modal);

  const handleChangeStepReview = () => {
    setActiveStep(EStep.REVIEW);
    router.push(`/book/hotel/:${stay?.id}/review`);
    toggle();
  };

  const handleChangeStepPayment = () => {
    setActiveStep(EStep.PAYMENT);
  };

  const onSubmitRoomToReview = (data: RoomBillConfirm) => {
    setDataRoomBook(data);
    toggle();
  };

  useEffect(() => {
    if (router) {
      StayService.findOne(Number(router.query.hotelId.slice(1)))
        .then((res) => {
          setStay(res.data);
        })
        .catch((e) => {
          dispatch(setErrorMess(e));
        })
        .finally(() => {
          dispatch(setLoading(false));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const renderComponent = () => {
    switch (page) {
      case "booking":
        return <Booking onSubmit={onSubmitRoomToReview} />;
      case "review":
        return (
          <Review
            handleChangeStep={handleChangeStepPayment}
            dataRoomBook={dataRoomBook}
          />
        );
      case "payment":
      // return <Payment />;
    }
  };

  return (
    <>
      <div className={clsx("wrapper", classes.root)}>
        <SectionHeader
          className={classes.sectionHeader}
          title={t("book_page_step_title_hero_booking")}
          src={images.bgbook.src}
        />
        <Grid className={classes.rootContent}>
          <Container>
            <Grid className={classes.boxStepPayment}>
              <Stepper
                alternativeLabel
                activeStep={activeStep}
                classes={{ root: classes.rootStepper }}
                connector={
                  <StepConnector
                    classes={{
                      root: classes.rootConnector,
                      active: classes.activeConnector,
                    }}
                  />
                }
              >
                {steps.map((item, index) => {
                  return (
                    <Step key={index}>
                      <StepLabel
                        StepIconComponent={QontoStepIcon}
                        classes={{
                          root: classes.rootStepLabel,
                          completed: classes.rootStepLabelCompleted,
                          active: classes.rootStepLabelActive,
                          label: classes.rootStepLabel,
                        }}
                      >
                        {item.name}{" "}
                      </StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
            </Grid>
            <Grid>{renderComponent()}</Grid>
          </Container>
        </Grid>
        <PopupCheckReview
          isOpen={modal}
          onClose={toggle}
          toggle={toggle}
          onClick={handleChangeStepReview}
        />
      </div>
    </>
  );
});

export default BookTour;
