import React, { memo, useEffect, useState } from "react";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setErrorMess } from "redux/reducers/Status/actionTypes";
import { Container } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceFrown } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-scroll";
import styled from "styled-components";
import { useMediaQuery, useTheme } from "@mui/material";
import { Stay } from "models/stay";
import { StayService } from "services/normal/stay";
import { useTranslation } from "react-i18next";
import Location from "pages/listHotel/[hotelId]/components/Location";
import SectionHotel from "pages/listHotel/[hotelId]/components/SectionHotel";
import CheckRoomEmpty from "pages/listHotel/[hotelId]/components/CheckRoomEmpty";
import { RoomBillService } from "services/normal/roomBill";
import { RoomBill } from "models/roomBill";

interface Props {
  roomBillId: number;
}
// eslint-disable-next-line react/display-name
const ReSchedule = memo(({ roomBillId }: Props) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(1024));
  const router = useRouter();

  const { t } = useTranslation("common");

  const [oldRoomBill, setOldRoomBill] = useState<RoomBill>(null);

  const [stay, setStay] = useState<Stay>(null);

  useEffect(() => {
    if (roomBillId) {
      RoomBillService.findOne(roomBillId)
        .then((res) => {
          setOldRoomBill(res.data);
        })
        .catch((e) => {
          dispatch(setErrorMess(e));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomBillId]);
  useEffect(() => {
    if (oldRoomBill) {
      StayService.findOne(oldRoomBill.stayId)
        .then((res) => {
          setStay(res.data);
        })
        .catch((e) => {
          dispatch(setErrorMess(e));
        })
        .finally(() => {
          // dispatch(setLoading(false));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oldRoomBill]);

  if (typeof window !== "undefined") {
    window.onscroll = function () {
      scrollFunction();
    };
  }

  function scrollFunction() {
    if (
      document.body.scrollTop > 150 ||
      document.documentElement.scrollTop > 150
    ) {
      if (document.getElementById("navbar") !== null) {
        if (isMobile) {
          document.getElementById("navbar").style.top = "53px";
          document.getElementById("navbar").style.display = "block";
        } else {
          document.getElementById("navbar").style.top = "62px";
          document.getElementById("navbar").style.display = "block";
        }
      }
    } else {
      if (document.getElementById("navbar") !== null) {
        document.getElementById("navbar").style.top = "0px";
        document.getElementById("navbar").style.display = "none";
      }
    }
  }

  return (
    <>
      <div className={clsx("wrapper", classes.root)}>
        {stay?.isDeleted ? (
          <Container className={classes.boxStopWorking}>
            <h3>{t("service_dont_work")}</h3>
            <FontAwesomeIcon icon={faFaceFrown} />
          </Container>
        ) : (
          <>
            <SectionHotel stay={stay} />
            <Location stay={stay} />
            {stay && <CheckRoomEmpty stay={stay} />}
          </>
        )}
      </div>
    </>
  );
});

export default ReSchedule;
