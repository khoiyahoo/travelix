/*eslint-disable*/
import { memo } from "react";
import { Row, Col } from "reactstrap";
import Link from "next/link";
import classes from "./styles.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import {
  faMapLocation,
  faPhone,
  faEnvelopeOpenText,
  faEarthAmerica,
} from "@fortawesome/free-solid-svg-icons";
import { images } from "configs/images";
import useAuth from "hooks/useAuth";
import { EUserType } from "models/user";
import { useTranslation } from "react-i18next";
const Footer = memo(() => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation("common");

  return (
    <>
      <div
        className={
          user?.role === EUserType.ENTERPRISE || user?.role === EUserType.ADMIN
            ? classes.rootRole
            : ""
        }
      >
        <Row className={classes.root}>
          <Col>
            <img alt="anh" src={images.footer.src}></img>
          </Col>
          <Col>
            <Row>
              <Col className={classes.titleFollow}>
                <p>{t("footer_follow_title")}</p>
                {/* <p>Follow us</p> */}
              </Col>
            </Row>
            <Row>
              <Col className={classes.contentFollow}>
                <ul>
                  <li className={classes.itemFollow}>
                    <Link href="/">
                      <a>
                        <div>
                          <FontAwesomeIcon icon={faFacebook} fontSize="18px" />
                          Facebook
                        </div>
                      </a>
                    </Link>
                  </li>
                  <li className={classes.itemFollow}>
                    <Link href="/">
                      <a>
                        <div>
                          <FontAwesomeIcon icon={faTwitter} fontSize="18px" />
                          Twitter
                        </div>
                      </a>
                    </Link>
                  </li>
                  <li className={classes.itemFollow}>
                    <Link href="/">
                      <a>
                        <div>
                          <FontAwesomeIcon icon={faInstagram} fontSize="18px" />
                          Instagram
                        </div>
                      </a>
                    </Link>
                  </li>
                  <li className={classes.itemFollow}>
                    <Link href="/">
                      <a>
                        <div>
                          <FontAwesomeIcon icon={faYoutube} fontSize="18px" />
                          Youtube
                        </div>
                      </a>
                    </Link>
                  </li>
                </ul>
              </Col>
            </Row>
          </Col>
          <Col>
            <Row>
              <Col className={classes.titleContact}>
                <p>{t("footer_contact_title")}</p>
                {/* <p>Contact us</p> */}
              </Col>
            </Row>
            <ul className={classes.infoBodyListContact}>
              <li className={classes.infoContact}>
                <div>
                  <FontAwesomeIcon icon={faMapLocation}></FontAwesomeIcon>
                  4127 Raoul Wallenber 45b-c Gibraltar
                </div>
              </li>
              <li className={classes.infoContact}>
                <div>
                  <FontAwesomeIcon icon={faPhone}></FontAwesomeIcon>
                  <Link
                    href="tel:+84 954 000 917"
                    className={classes.contactLinkInfo}
                  >
                    <a>84 954 000 917</a>
                  </Link>
                </div>
              </li>
              <li className={classes.infoContact}>
                <div>
                  <FontAwesomeIcon icon={faEnvelopeOpenText}></FontAwesomeIcon>
                  <Link
                    href="mailto:mail@mail.com"
                    className={classes.contactLinkInfo}
                  >
                    <a>travelix@gmail.com</a>
                  </Link>
                </div>
              </li>
              <li className={classes.infoContact}>
                <div>
                  <FontAwesomeIcon icon={faEarthAmerica}></FontAwesomeIcon>
                  <Link href="/" className={classes.contactLinkInfo}>
                    <a>www.colorlib.com</a>
                  </Link>
                </div>
              </li>
            </ul>
          </Col>
          <Col>
            <div className={classes.subFooter}>
              <p>{t("footer_sub_title")}</p>
              {/* <p>
                Acsses our's website to have more new destination information in
                Viet Nam
              </p> */}
            </div>
          </Col>
        </Row>
        <Row className={classes.rootBottom}>
          <Col className={classes.wrapper}>
            <div>
              <p>© 2000-22 TRAVELIX ALL RIGHTS RESERVED</p>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
});

export default Footer;
