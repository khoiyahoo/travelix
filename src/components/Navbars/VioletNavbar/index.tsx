/*eslint-disable*/
import {useState, useEffect, memo} from "react";
import {
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  NavItem,
  Navbar,
  Nav,
  Container,
} from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBook, faLocationDot, faPlane, faHotel, 
  faAddressCard,
  faCalendarCheck, 
  faLandmarkDome,
  faEarthAsia, faE, faV, faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import clsx from "clsx";
import Link from "next/link";
import dynamic from "next/dynamic";
import classes from "./styles.module.scss";
import Button, {BtnType} from "components/common/buttons/Button";
import SignOutButton from "components/common/buttons/SignOutButton";
const WhiteNavbar = memo(() => {
  const [collapseOpen, setCollapseOpen] = useState(false);
  // const [navbarColor, setNavbarColor] = useState(" navbar-transparent");

  const handleCollapseNavbar = () => {
    if (window.innerWidth <= 991) {
      document.documentElement.classList.toggle("nav-open");
      setCollapseOpen(!collapseOpen);
    }
  };

  return (
    <>
      <Navbar className={clsx("fixed-top", classes.navbarWrapper)} expand="lg">
        <Container className={classes.container}>
          <div className={clsx("navbar-translate", classes.navLogoName)}>
            <Link href="/" passHref>
              <a>
                TRAVELIX
              </a>
              </Link>
            <button
              onClick={handleCollapseNavbar}
              aria-expanded={collapseOpen}
              className="navbar-toggler"
            >
              <span className="navbar-toggler-bar top-bar"></span>
              <span className="navbar-toggler-bar middle-bar"></span>
              <span className="navbar-toggler-bar bottom-bar"></span>
            </button>
          </div>
          <Collapse isOpen={collapseOpen} navbar className={classes.collapseMobile}>
            <Nav className={clsx("ml-auto", classes.navWrapperMenu)} id="ceva" navbar>
              <UncontrolledDropdown nav>
                <DropdownToggle
                  caret
                  color="default"
                  data-toggle="dropdown"
                  href="#pablo"
                  id="navbarDropdownMenuLink1"
                  nav
                  onClick={(e) => e.preventDefault()}
                >
                 <FontAwesomeIcon icon={faSquarePlus} className={classes.iconNav}/>
                  <p>Actions</p>
                </DropdownToggle>
                <DropdownMenu aria-labelledby="navbarDropdownMenuLink1">
                  <DropdownItem className={classes.dropdownItem}>
                    <Link href="/" passHref>
                      <a>
                        <FontAwesomeIcon icon={faPlane} className={classes.iconNav}/>
                        Add tour
                      </a>
                    </Link>
                  </DropdownItem>
                  <DropdownItem className={classes.dropdownItem}>
                    <Link href="/" passHref>
                      <a>
                        <FontAwesomeIcon icon={faHotel} className={classes.iconNav}/>
                        Add hotel
                      </a>
                    </Link>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <UncontrolledDropdown nav>
                <DropdownToggle
                  caret
                  color="default"
                  data-toggle="dropdown"
                  href="#pablo"
                  id="navbarDropdownMenuLink1"
                  nav
                  onClick={(e) => e.preventDefault()}
                >
                 <FontAwesomeIcon icon={faLocationDot} className={classes.iconNav}/>
                  <p>Services</p>
                </DropdownToggle>
                <DropdownMenu aria-labelledby="navbarDropdownMenuLink1">
                  <DropdownItem className={classes.dropdownItem}>
                    <Link href="/" passHref>
                      <a>
                        <FontAwesomeIcon icon={faPlane} className={classes.iconNav}/>
                        Tour
                      </a>
                    </Link>
                  </DropdownItem>
                  <DropdownItem className={classes.dropdownItem}>
                    <Link href="/" passHref>
                      <a>
                        <FontAwesomeIcon icon={faHotel} className={classes.iconNav}/>
                        Hotel
                      </a>
                    </Link>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <UncontrolledDropdown nav>
                <DropdownToggle
                  caret
                  color="default"
                  data-toggle="dropdown"
                  href="#pablo"
                  id="navbarDropdownMenuLink"
                  nav
                  onClick={(e) => e.preventDefault()}
                >
                  <FontAwesomeIcon icon={faUser} className={classes.iconNav}/>
                  <p>Profile</p>
                </DropdownToggle>
                <DropdownMenu aria-labelledby="navbarDropdownMenuLink">
                  <DropdownItem className="noti-title" header tag="div">
                        <h6 className={classes.headerTitle}>Welcome!</h6>
                      </DropdownItem>
                  <DropdownItem className={classes.dropdownItem}>
                    <Link href="/profile" passHref>
                      <a>
                        <FontAwesomeIcon icon={faAddressCard} className={classes.iconNav}/>
                        My profile
                      </a>
                    </Link>
                  </DropdownItem>
                  <DropdownItem className={classes.dropdownItem}>
                    <Link href="/about" passHref>
                      <a>
                        <FontAwesomeIcon icon={faCalendarCheck} className={classes.iconNav}/>
                        Activity
                      </a>
                    </Link>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <UncontrolledDropdown nav>
                <DropdownToggle
                  caret
                  color="default"
                  data-toggle="dropdown"
                  href="#pablo"
                  id="navbarDropdownMenuLink"
                  nav
                  onClick={(e) => e.preventDefault()}
                >
                  <FontAwesomeIcon icon={faEarthAsia} className={classes.iconNav}/>
                  <p>Languages</p>
                </DropdownToggle>
                <DropdownMenu aria-labelledby="navbarDropdownMenuLink">
                  <DropdownItem className={classes.dropdownItem}>
                    <Link href="/" passHref>
                      <a>
                        <FontAwesomeIcon icon={faE} className={classes.iconNav}/>
                        English
                      </a>
                    </Link>
                  </DropdownItem>
                  <DropdownItem className={classes.dropdownItem}>
                    <Link href="/" passHref>
                      <a>
                        <FontAwesomeIcon icon={faV} className={classes.iconNav}/>
                        VietNamese
                      </a>
                    </Link>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <NavItem>
              {/* <SignOutButton/> */}
              <Link href="/auth/login" passHref>
                <a>
                  <Button btnType={BtnType.Secondary}>Sign in</Button>
                </a>
              </Link>
              </NavItem>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </>
  );
}) 

export default WhiteNavbar;
