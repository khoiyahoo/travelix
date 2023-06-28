import React, { memo, useEffect, useState } from "react";
import { Container } from "reactstrap";
import classes from "./styles.module.scss";
import "aos/dist/aos.css";
import Button, { BtnType } from "components/common/buttons/Button";
import { ETour } from "models/enterprise";
import clsx from "clsx";
import { Box, Tab, Tabs } from "@mui/material";
import Information from "./components/Information";
import Schedule from "./components/Schedule";
import RangePrice from "./components/TourOnSale/components/RangePrice";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import QueryString from "query-string";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { TourService } from "services/enterprise/tour";
import Policy from "./components/Policy";
import TourOnSale from "./components/TourOnSale";

export enum EStep {
  INFORMATION,
  SCHEDULE,
  PRICE,
  POLICY,
}

function controlProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface Props {
  tourId?: number;
}

// eslint-disable-next-line react/display-name
const AddOrEditTour = memo((props: Props) => {
  const { tourId } = props;
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  let lang;
  if (typeof window !== "undefined") {
    ({ lang } = QueryString.parse(window.location.search));
  }

  const [activeStep, setActiveStep] = useState<EStep>(EStep.INFORMATION);
  const [tour, setTour] = useState<ETour>(null);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveStep(newValue);
  };

  const onNextStep = (type: EStep) => {
    switch (type) {
      case EStep.INFORMATION:
        setActiveStep(EStep.INFORMATION);
        break;
      case EStep.SCHEDULE:
        setActiveStep(EStep.SCHEDULE);
        break;
      case EStep.PRICE:
        setActiveStep(EStep.PRICE);
        break;
      case EStep.POLICY:
        setActiveStep(EStep.POLICY);
        break;
    }
  };

  const onBack = () => {
    router.push("/enterprises/tours");
  };

  useEffect(() => {
    if (tourId && !isNaN(Number(tourId))) {
      const fetchData = async () => {
        dispatch(setLoading(true));
        TourService.getOneTour(Number(tourId), lang)
          .then((res) => {
            setTour(res?.data);
          })
          .catch((err) => setErrorMess(err))
          .finally(() => dispatch(setLoading(false)));
      };
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourId, dispatch]);

  return (
    <>
      <div className={classes.root}>
        <Container className={clsx(classes.rowHeaderBox, classes.title)}>
          {!tourId ? (
            <h3>{t("enterprise_management_section_tour_create_title")}</h3>
          ) : (
            <h3>{t("enterprise_management_section_tour_edit_title")}</h3>
          )}
          <Button onClick={onBack} btnType={BtnType.Primary}>
            {t("common_back")}
          </Button>
        </Container>
        <Container className={classes.tabsBox}>
          <Tabs
            value={activeStep}
            onChange={handleChange}
            variant="scrollable"
            classes={{
              root: classes.rootTabs,
              indicator: classes.indicatorTabs,
              flexContainer: classes.flexContainer,
            }}
          >
            <Tab
              {...controlProps(EStep.INFORMATION)}
              label={
                <Box display="flex" alignItems="center">
                  <span className={classes.tabItemTitle}>
                    {t("enterprise_management_section_tour_tab_information")}
                  </span>
                </Box>
              }
            />
            <Tab
              {...controlProps(EStep.SCHEDULE)}
              label={
                <Box display="flex" alignItems="center">
                  <span
                    className={classes.tabItemTitle}
                    // translation-key="target_tab"
                  >
                    {t("enterprise_management_section_tour_tab_schedule")}
                  </span>
                </Box>
              }
            />
            <Tab
              {...controlProps(EStep.PRICE)}
              label={
                <Box display="flex" alignItems="center">
                  <span className={classes.tabItemTitle}>
                    {t("enterprise_management_section_tour_tab_price")}
                  </span>
                </Box>
              }
            />
            <Tab
              {...controlProps(EStep.POLICY)}
              label={
                <Box display="flex" alignItems="center">
                  <span className={classes.tabItemTitle}>
                    {t("enterprise_management_section_tour_tab_policy")}
                  </span>
                </Box>
              }
            />
          </Tabs>
        </Container>
        <Container className={classes.tabContent}>
          <Information
            value={activeStep}
            index={EStep.INFORMATION}
            tour={tour}
            lang={lang}
            handleNextStep={() => onNextStep(EStep.SCHEDULE)}
          />
          <Schedule
            value={activeStep}
            index={EStep.SCHEDULE}
            tour={tour}
            lang={lang}
            handleNextStep={() => onNextStep(EStep.PRICE)}
          />
          <TourOnSale
            value={activeStep}
            index={EStep.PRICE}
            tour={tour}
            lang={lang}
            handleNextStep={() => onNextStep(EStep.POLICY)}
          />
          <Policy value={activeStep} index={EStep.POLICY} tour={tour} />
        </Container>
      </div>
    </>
  );
});

export default AddOrEditTour;
