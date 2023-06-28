import { memo, useEffect } from "react";
import classes from "./styles.module.scss";
import "aos/dist/aos.css";
import { Card, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";

// eslint-disable-next-line react/display-name
const About = memo(() => {
  const { t, i18n } = useTranslation("common");

  return (
    <>
      <Grid className={classes.root}>
        <h3 className={classes.title}>
          {t("landing_page_section_offer_title_story")}
        </h3>
        <Grid container spacing={2} className={classes.containerBoxCard}>
          <Grid item xs={6}>
            <Card className={classes.card}>
              <p> 🌍 {t("landing_page_section_offer_title_story_left")}</p>
              <span>
                {" "}
                {t("landing_page_section_offer_sub_title_story_left")}
              </span>
            </Card>
          </Grid>
          <Grid item xs={6} container spacing={2} className={classes.lastCol}>
            <Grid item xs={6} container className={classes.aboutCard}>
              <Grid item xs={7} className={classes.col8}>
                <Card className={classes.card1}></Card>
              </Grid>
              <Grid item xs={5} className={classes.col4}>
                <div className={classes.titleCard}>
                  <span>
                    {t("landing_page_section_offer_title_story_center")}
                  </span>
                  {t("landing_page_section_offer_sub_title_story_center")}
                </div>
              </Grid>
            </Grid>
            <Grid item xs={6} container className={classes.aboutCard}>
              <Grid item xs={7} className={classes.col8}>
                <Card className={classes.card2}></Card>
              </Grid>
              <Grid item xs={5} className={classes.col4}>
                <div className={classes.titleCard}>
                  <span>
                    {t("landing_page_section_offer_title_story_right")}
                  </span>
                  {t("landing_page_section_offer_sub_title_story_right")}
                </div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
});

export default About;
