import React, { useEffect, useState, memo } from "react";
import { Container, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignsPost } from "@fortawesome/free-solid-svg-icons";
import { images } from "configs/images";
import classes from "./styles.module.scss";
import "aos/dist/aos.css";
import Button, { BtnType } from "components/common/buttons/Button";
import SectionHeader from "components/Header/SectionHeader";
import { useDispatch } from "react-redux";
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from "redux/reducers/Status/actionTypes";
import { Grid } from "@mui/material";
import InputTextfield from "components/common/inputs/InputTextfield";
import { EventService } from "services/normal/event";
import { useRouter } from "next/router";
import { IEvent } from "models/event";
import PopupTermAndCondition from "./components/PopupTermAndCondition";
import { useTranslation } from "react-i18next";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
const EventPage = memo(() => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation("common");

  const router = useRouter();
  const [event, setEvent] = useState<IEvent>();
  const [copyCode, setCopyCode] = useState("");
  const [openPopupTermAndCondition, setOpenPopupTermAndCondition] =
    useState(false);

  const onOpenPopupTermAndCondition = () => {
    setOpenPopupTermAndCondition(!openPopupTermAndCondition);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(copyCode);
    dispatch(setSuccessMess(t("common_copy_success")));
  };

  useEffect(() => {
    if (router) {
      EventService.getEvent(Number(router.query.eventId.slice(1)))
        .then((res) => {
          setEvent(res.data);
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

  useEffect(() => {
    setCopyCode(event?.code);
  }, [event]);
  return (
    <>
      <SectionHeader
        src={images.pannerCoupon.src}
        className={classes.imgHeader}
      />
      <Row className={classes.containerBody}>
        <Container>
          <Grid className={classes.titleBody}>
            <h1>🎉 {t("event_detail_section_title")}</h1>
            <p>🔥 {t("event_detail_section_sub_title")}</p>
          </Grid>
          <Grid
            container
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
            }}
          >
            <Grid className={classes.boxTicket}>
              <Grid className={classes.titleTicket}>
                <FontAwesomeIcon icon={faSignsPost}></FontAwesomeIcon>
                <p>{event?.name}</p>
              </Grid>
              <Grid sx={{ paddingBottom: "10px" }}>
                <InputTextfield
                  className={classes.inputCode}
                  value={copyCode}
                  disabled
                  // onChange={(e) => setCopyCode("")}
                  endAdornment={<ContentCopyIcon onClick={handleCopyCode} />}
                />
              </Grid>
              <Grid className={classes.description}>
                <p
                  dangerouslySetInnerHTML={{
                    __html: event?.description,
                  }}
                ></p>
              </Grid>
              <Grid
                className={classes.footTicket}
                onClick={onOpenPopupTermAndCondition}
              >
                <p>{t("event_detail_section_read_terms")}</p>
              </Grid>
            </Grid>
            <Grid className={classes.textRemind}>
              <p>{t("event_detail_section_limit_title")}</p>
            </Grid>
            <Grid sx={{ width: "100%" }}>
              <Button
                btnType={BtnType.Primary}
                className={classes.btnFind}
                onClick={() => {
                  router.push("/listTour");
                }}
              >
                {t("event_detail_section_find_service_btn")}
              </Button>
            </Grid>
            <Grid className={classes.boxTip}>
              <p>{t("event_detail_section_title_list_tip")}</p>
              <ul>
                <li>{t("event_detail_section_title_item_tip_first")}</li>
                <li>{t("event_detail_section_title_item_tip_second")}</li>
                <li>{t("event_detail_section_title_item_tip_third")}</li>
              </ul>
            </Grid>
          </Grid>
        </Container>
        <PopupTermAndCondition
          isOpen={openPopupTermAndCondition}
          toggle={onOpenPopupTermAndCondition}
          event={event}
        />
      </Row>
    </>
  );
});

export default EventPage;
