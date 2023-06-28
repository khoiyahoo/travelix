import type { NextPage } from "next";
import { Container, Row, Col } from "reactstrap";
import clsx from "clsx";
import classes from "./styles.module.scss";
import "aos/dist/aos.css";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import { Grid } from "@mui/material";
import { Fragment } from "react";
const Events = dynamic(() => import("./components/Events"), { ssr: false });
const Offer = dynamic(() => import("./components/Offer"), { ssr: false });
const About = dynamic(() => import("./components/About"), { ssr: false });
const Contact = dynamic(() => import("./components/Contact"), { ssr: false });
const Social = dynamic(() => import("../../components/Social"), { ssr: false });
const Search = dynamic(() => import("./components/Search"), { ssr: false });

const LandingPage: NextPage = () => {
  const { t, i18n } = useTranslation("common");

  return (
    <Fragment>
      <Grid className="cd-section" id="headers">
        <Grid className="header-2">
          <Grid
            className={clsx("page-header header-filter", classes.pageHeadBox)}
          >
            <Grid
              className={clsx("page-header-image", classes.pageHeader)}
            ></Grid>
            <Container>
              <Row>
                <Col className="ml-auto mr-auto text-center" md="12">
                  <Grid
                    className={clsx("title", classes.titleHome)}
                    // eslint-disable-next-line react/no-unknown-property
                  >
                    {t("landing_page_section_search_title_hero")}
                  </Grid>
                  <Grid className={classes.subTitle}>
                    {t("landing_page_section_search_sub_title_hero")}
                  </Grid>
                  <Search />
                </Col>
              </Row>
            </Container>
          </Grid>
        </Grid>
      </Grid>
      <Events />
      <Offer />
      <About />
      <Contact />
      <Social />
    </Fragment>
  );
};

export default LandingPage;
