/*eslint-disable*/
import {memo} from "react";
import {
  Container,
  Row,
  Col,
} from "reactstrap";
import clsx from "clsx";
import classes from "./styles.module.scss";

interface Props { 
  src?: string;
  title?: string;
  className?: string;
}

const SectionHeader = memo(({src, title, className} : Props) => {

  return (
    <>
        <div className="cd-section" id="headers">
            <div className="header-2">
                <div className={clsx("page-header header-filter", classes.pageHeader, className)}>
                    <div
                    className="page-header-image"
                    style={{backgroundImage: `url(${src})`,}}
                    >
                    </div>
                    <Container>
                        <Row>
                            <Col className="ml-auto mr-auto text-center" md="8">
                                <h1 className={clsx("title", classes.titleHome)}>{title}</h1>
                            </Col>  
                        </Row>
                    </Container>
                </div>
            </div>
        </div>
    </>
  );
}) 

export default SectionHeader;
