import React, { memo, useEffect, useState } from "react";
import { Container } from "reactstrap";
import classes from "./styles.module.scss";
import "aos/dist/aos.css";
import Button, { BtnType } from "components/common/buttons/Button";
import clsx from "clsx";
import { Box, Tab, Tabs } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import QueryString from "query-string";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import StayInformation from "./components/StayInformation";
import { StayService } from "services/enterprise/stay";
import { Stay } from "models/enterprise/stay";
import RoomInformation from "./components/RoomInformation";
import Policy from "./components/Policy";

export enum EStep {
  STAY_INFORMATION = 0,
  ROOM_INFORMATION = 1,
  POLICY = 2,
}

function controlProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface Props {
  stayId?: number;
}

// eslint-disable-next-line react/display-name
const AddOrEditTour = memo((props: Props) => {
  const { stayId } = props;
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation("common");
  const router = useRouter();
  let lang;
  if (typeof window !== "undefined") {
    ({ lang } = QueryString.parse(window.location.search));
  }

  const [activeStep, setActiveStep] = useState<EStep>(EStep.STAY_INFORMATION);
  const [stay, setStay] = useState<Stay>(null);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveStep(newValue);
  };

  const onNextStep = (type: EStep) => {
    switch (type) {
      case EStep.STAY_INFORMATION:
        setActiveStep(EStep.STAY_INFORMATION);
        break;
      case EStep.ROOM_INFORMATION:
        setActiveStep(EStep.ROOM_INFORMATION);
        break;
      case EStep.POLICY:
        setActiveStep(EStep.POLICY);
        break;
    }
  };

  const onBack = () => {
    router.push("/enterprises/stays");
  };

  useEffect(() => {
    if (stayId && !isNaN(Number(stayId))) {
      const fetchData = async () => {
        dispatch(setLoading(true));
        StayService.getOneStay(Number(stayId), lang)
          .then((res) => {
            setStay(res?.data);
          })
          .catch((err) => setErrorMess(err))
          .finally(() => dispatch(setLoading(false)));
      };
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stayId, dispatch]);

  return (
    <>
      <div className={classes.root}>
        <Container className={clsx(classes.rowHeaderBox, classes.title)}>
          {!stayId ? (
            <h3>
              {t("enterprise_management_section_add_or_edit_stay_title_add")}
            </h3>
          ) : (
            <h3>
              {t("enterprise_management_section_add_or_edit_stay_title_edit")}
            </h3>
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
              {...controlProps(EStep.STAY_INFORMATION)}
              label={
                <Box display="flex" alignItems="center">
                  <span className={classes.tabItemTitle}>
                    {t(
                      "enterprise_management_section_add_or_edit_stay_tab_information"
                    )}
                  </span>
                </Box>
              }
            />
            <Tab
              {...controlProps(EStep.ROOM_INFORMATION)}
              label={
                <Box display="flex" alignItems="center">
                  <span
                    className={classes.tabItemTitle}
                    // translation-key="target_tab"
                  >
                    {t(
                      "enterprise_management_section_add_or_edit_stay_tab_room_information"
                    )}
                  </span>
                </Box>
              }
            />
            <Tab
              {...controlProps(EStep.POLICY)}
              label={
                <Box display="flex" alignItems="center">
                  <span className={classes.tabItemTitle}>
                    {t(
                      "enterprise_management_section_add_or_edit_stay_tab_policy"
                    )}
                  </span>
                </Box>
              }
            />
          </Tabs>
        </Container>
        <Container className={classes.tabContent}>
          <StayInformation
            value={activeStep}
            index={EStep.STAY_INFORMATION}
            stay={stay}
            lang={lang}
            handleNextStep={() => onNextStep(EStep.ROOM_INFORMATION)}
          />
          <RoomInformation
            value={activeStep}
            index={EStep.ROOM_INFORMATION}
            lang={lang}
            stay={stay}
            handleNextStep={() => onNextStep(EStep.POLICY)}
          />
          <Policy value={activeStep} index={EStep.POLICY} stay={stay} />
        </Container>
      </div>
    </>
  );
});

export default AddOrEditTour;
