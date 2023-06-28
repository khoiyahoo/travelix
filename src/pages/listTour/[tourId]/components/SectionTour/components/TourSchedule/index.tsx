import React, { memo, useMemo, useState } from "react";
import { Nav, NavItem, TabContent, TabPane } from "reactstrap";
import classes from "./styles.module.scss";
import { Schedule, ScheduleItem } from "models/tour";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

import _ from "lodash";
import { TabPanel } from "@material-ui/lab";
import { fTime } from "utils/formatTime";

interface Props {
  tourSchedule: ScheduleItem[];
  value: string;
}

// eslint-disable-next-line react/display-name
const TourSchedule = memo(({ value, tourSchedule }: Props) => {
  return (
    <>
      <TabPanel value={value}>
        <Box sx={{ maxWidth: 400 }} className={classes.boxStep}>
          <Stepper orientation="vertical" className={classes.stepper}>
            {tourSchedule?.map((step, index) => (
              <Step key={index} className={classes.step}>
                <StepLabel>
                  <p>
                    {fTime(step?.startTime)}-{fTime(step?.endTime)}{" "}
                    <span>{step?.description}</span>
                  </p>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </TabPanel>
    </>
  );
});

export default TourSchedule;
