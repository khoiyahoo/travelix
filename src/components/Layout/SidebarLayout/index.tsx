import React from "react";
import WhiteNavbar from "components/Navbars/TransparentNavbar";
import Footer from "components/Footer";
import { Row, Col } from "reactstrap";
interface Props {
  children: React.ReactNode;
}

const SidebarLayoutAuth = ({ children }: Props) => {
  return (
    <>
      <WhiteNavbar />
      <Row>
        <Col>{/* <Sidebar/> */}</Col>
        <Col>{children}</Col>
      </Row>
      <Footer />
    </>
  );
};

export default SidebarLayoutAuth;
