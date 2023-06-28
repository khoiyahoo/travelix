/*eslint-disable*/
import { memo, Component} from "react";
import {
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import classes from "./styles.module.scss";
import { PaginationProps } from "react-rainbow-components/components/Pagination";
interface Props {
  className?:string;
  postPerPage: number;
  totalPosts: number;
  paginate: (number: number) => void;
}
const CustomPagination = memo((props: Props) => {
  const {postPerPage, totalPosts, paginate, className} = props;
  const pageNumbers=[];
  for (let i = 1; i <= Math.ceil(totalPosts / postPerPage); i++ ){
    pageNumbers.push(i);
  }
  return (
    <>
        <Pagination className={className}>
            <PaginationItem>
                <PaginationLink
                    aria-label="Previous"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                >
                    <span aria-hidden={true}>
                    <FontAwesomeIcon icon={faChevronLeft}/>
                    </span>
                  </PaginationLink>
            </PaginationItem>
            {pageNumbers.map(number => (
                <PaginationItem key={number}>
                    <PaginationLink
                      href="#pablo"
                      onClick={() => paginate(number)}
                    >
                      {number}
                  </PaginationLink>
                </PaginationItem>
            ))}
            <PaginationItem>
                  <PaginationLink
                    aria-label="Next"
                    href="#"
                    onClick={(e) => e.preventDefault()}
                  >
                    <span aria-hidden={true}>
                        <FontAwesomeIcon icon={faChevronRight}/>
                    </span>
                </PaginationLink>
            </PaginationItem>
        </Pagination>
    </>
  );
}) 

export default CustomPagination;
