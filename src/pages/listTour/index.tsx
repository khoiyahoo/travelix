import React, { useEffect, useLayoutEffect, useState } from "react";
// reactstrap components
import { Container, Row, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGrip,
  faList,
  faArrowsRotate,
} from "@fortawesome/free-solid-svg-icons";
import { NextPage } from "next";
import { images } from "configs/images";
import clsx from "clsx";
import classes from "./styles.module.scss";
import Social from "components/Social";
import "aos/dist/aos.css";
import Button, { BtnType } from "components/common/buttons/Button";
import SectionHeader from "components/Header/SectionHeader";
import CardItemGrid from "components/CardItemGrid";
import CardItemList from "components/CardItemList";
import { useDispatch } from "react-redux";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { TourService } from "services/normal/tour";
import SearchNotFound from "components/SearchNotFound";
import InputSelect from "components/common/inputs/InputSelect";
import { DataPagination, ESortOption, sortOption } from "models/general";
import { Grid, Pagination } from "@mui/material";
import { NormalGetTours, Tour } from "models/tour";
import useDebounce from "hooks/useDebounce";
import { useTranslation } from "react-i18next";
import InputSearch from "components/common/inputs/InputSearch";
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Moment } from "moment";
import InputDatePicker from "components/common/inputs/InputDatePicker";
import moment from "moment";
import { useRouter } from "next/router";
import _ from "lodash";

const ListTours: NextPage = () => {
  const { t, i18n } = useTranslation("common");

  const dispatch = useDispatch();
  const router = useRouter();

  const [isFirstConnect, setIsFirstConnect] = useState(true);
  const [changeViewLayout, setChangeViewLayout] = useState(false);
  const [data, setData] = useState<DataPagination<Tour>>();
  const [keyword, setKeyword] = useState<string>("");
  const [dateStart, setDateStart] = useState<Moment>(null);
  const [tourFilter, setTourFilter] = useState<number>(
    ESortOption.LOWEST_PRICE
  );

  const onChangeViewLayout = () => {
    setChangeViewLayout(!changeViewLayout);
  };

  const yesterday = moment().subtract(1, "day");
  const disablePastDt = (current) => {
    return current.isAfter(yesterday);
  };

  const fetchData = (value?: {
    take?: number;
    page?: number;
    keyword?: string;
    dateSearch?: Date;
  }) => {
    const params: NormalGetTours = {
      take: value?.take || data?.meta?.take || 10,
      page: value?.page || data?.meta?.page || 1,
      keyword: keyword,
      dateSearch: dateStart?.toDate() || value?.dateSearch,
      sort: tourFilter,
    };
    if (value?.keyword !== undefined) {
      params.keyword = value.keyword || undefined;
    }
    dispatch(setLoading(true));
    TourService.getAllTours(params)
      .then((res) => {
        if (isFirstConnect) {
          setIsFirstConnect(false)
        } else {
          setData({
            data: res.data,
            meta: res.meta,
          });
          dispatch(setLoading(false))
        }
      })
      .catch((e) => {
        dispatch(setErrorMess(e))
        dispatch(setLoading(false))
      })
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    _onSearch(e.target.value);
  };

  const _onSearch = useDebounce(
    (keyword: string) => fetchData({ keyword, page: 1 }),
    500
  );

  const handleChangePage = (_: React.ChangeEvent<unknown>, newPage: number) => {
    fetchData({
      page: newPage,
    });
  };

  const onSearchDate = (e) => {
    setDateStart(moment(e?._d));
    fetchData({ dateSearch: new Date(e?._d) });
  };

  const onClearFilter = () => {
    setKeyword("");
    setDateStart(null);
    setTourFilter(-1);
  };

  // useEffect(() => {
  //   applyFilters();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [tags, selectedPrice, selectedRating]);

  //sort by
  // const watchSortType = watch("sortType");
  // useEffect(() => {
  //   const items = [...listTours];
  //   if (watchSortType?.id === 1) {
  //     const listSortLowPrice = items?.sort(function (a, b) {
  //       return a?.price - b?.price;
  //     });
  //     setListTours(listSortLowPrice);
  //   } else if (watchSortType?.id === 2) {
  //     const listSortHighPrice = items?.sort(function (a, b) {
  //       return b?.price - a?.price;
  //     });
  //     setListTours(listSortHighPrice);
  //   } else if (watchSortType?.id === 3) {
  //     const listSortHighRate = items?.sort(function (a, b) {
  //       return b?.rate - a?.rate;
  //     });
  //     setListTours(listSortHighRate);
  //   }
  // }, [watchSortType]);

  const queryUrl = () => {
    let params = {}
    if (router.query?.keyword) {
      setKeyword(String(router.query?.keyword));
      params = {
        keyword: String(router.query?.keyword),
      }
    }
    if (router.query?.dateSearch) {
      setDateStart(moment(router.query?.dateSearch));
      params = {
        ...params,
        dateSearch: String(router.query?.dateSearch),
      }
    }
    fetchData(params)
  }

  useEffect(() => {
    if(!isFirstConnect) {
      if (router.query?.keyword || router.query?.dateSearch) {
        queryUrl()
      } else {
        fetchData()
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirstConnect])

  useLayoutEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourFilter]);

  return (
    <>
      <SectionHeader
        title={t("list_tours_section_title_hero")}
        src={images.imagesListTour.src}
        className={classes.imgHeader}
      />
      <Row className={classes.containerBody}>
        <Container>
          <Row className={classes.titleBody}>
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="anh" src={images.iconSearch.src}></img>
            </div>
            <h1>{t("list_tours_section_title")}</h1>
            <div className={classes.divider}></div>
            <p>{t("list_tours_section_sub_title")}</p>
          </Row>
          <Row className={classes.containerSearch}>
            <div className={classes.boxControlSearch}>
              <div className={classes.boxTitleSearch}>
                <p>
                  {t("list_tours_header_search_title")} /{" "}
                  <span>{t("list_tours_header_search_results")}</span>
                </p>
              </div>
              <Grid className={classes.searchControlWrapper}>
                <InputSearch
                  placeholder={t("list_tours_header_search_placeholder")}
                  autoComplete="off"
                  value={keyword || ""}
                  onChange={onSearch}
                />
                <InputDatePicker
                  className={classes.inputSearchDate}
                  placeholder={t(
                    "landing_page_section_search_tour_input_start_time"
                  )}
                  dateFormat="DD/MM/YYYY"
                  timeFormat={false}
                  closeOnSelect
                  isValidDate={disablePastDt}
                  value={dateStart ? dateStart : ""}
                  initialValue={dateStart ? dateStart : ""}
                  _onChange={(e) => onSearchDate(e)}
                />
              </Grid>
            </div>
            <Grid className={classes.boxResult} container>
              {/* ======================= RESULT DESKTOP ===================== */}
              <Grid className={classes.boxControlLayout} item xs={2}>
                <Button
                  className={clsx(
                    !changeViewLayout ? "active" : null,
                    classes.layoutBtn
                  )}
                  btnType={BtnType.Outlined}
                  onClick={onChangeViewLayout}
                >
                  <FontAwesomeIcon icon={faGrip} />
                </Button>
                <Button
                  className={clsx(
                    changeViewLayout ? "active" : null,
                    classes.layoutBtn
                  )}
                  btnType={BtnType.Outlined}
                  onClick={onChangeViewLayout}
                >
                  <FontAwesomeIcon icon={faList} />
                </Button>
              </Grid>
              <Grid className={classes.rowResult} container item xs={10}>
                <Grid className={classes.controlSelect} xs={4} item></Grid>
                <Grid>
                  <h5>
                    {t("list_tours_result")} <span>{data?.data?.length}</span>
                  </h5>
                </Grid>
              </Grid>
            </Grid>
          </Row>
          <Row className={classes.rowResultBody}>
            <Col xs={2} className={classes.btnResetWrapper}>
              <Button
                btnType={BtnType.Primary}
                className={classes.btnResetOption}
                onClick={onClearFilter}
              >
                <FontAwesomeIcon icon={faArrowsRotate} />{" "}
                {t("list_tours_reset_filter")}
              </Button>
              <Grid sx={{ width: "100%", marginTop: "14px" }}>
                <InputSelect
                  className={classes.inputSelect}
                  bindLabel="translation"
                  selectProps={{
                    options: sortOption,
                    placeholder: t("list_tours_sort_by_placeholder"),
                  }}
                  onChange={(e) => setTourFilter(e?.value)}
                />
              </Grid>
            </Col>
            <Col xs={10} className={classes.listTours}>
              <div className={classes.containerListTour}>
                {/* ==================== Grid view ===================== */}
                {!changeViewLayout && (
                  <Row className={classes.rowGridView}>
                    {data?.data?.map((tour, index) => (
                      <CardItemGrid
                        linkView="listTour"
                        linkBook="book/tour"
                        key={index}
                        id={tour?.id}
                        src={tour?.images[0]}
                        title={tour.title}
                        description={tour.description}
                        contact={tour.contact}
                        commune={tour?.commune?.name}
                        district={tour?.district?.name}
                        city={tour?.city?.name}
                        minPrice={tour?.minPrice}
                        maxPrice={tour?.maxPrice}
                        cityStart={tour?.cityStart?.name}
                        numberOfDays={tour?.numberOfDays}
                        numberOfNights={tour?.numberOfNights}
                        price={
                          tour?.tourOnSales.length &&
                          tour?.tourOnSales[0]?.adultPrice
                        }
                        discount={
                          tour?.tourOnSales.length &&
                          tour?.tourOnSales[0]?.discount
                        }
                        rate={Math.floor(tour?.rate)}
                        numberOfReviewers={tour?.numberOfReviewer}
                        isDelete={tour.isDeleted}
                        tourOnSale={
                          tour?.tourOnSales.length &&
                          _.sortBy(tour?.tourOnSales, function (o) {
                            return o.adultPrice;
                          })
                        }
                      />
                    ))}
                  </Row>
                )}
                {/* ==================== List view ===================== */}
                {changeViewLayout && (
                  <div>
                    {data?.data.map((tour, index) => (
                      <CardItemList
                        linkView="listTour"
                        linkBook="book/tour"
                        key={index}
                        id={tour?.id}
                        src={tour?.images[0]}
                        title={tour.title}
                        description={tour.description}
                        commune={tour?.commune?.name}
                        district={tour?.district?.name}
                        city={tour?.city?.name}
                        price={
                          tour?.tourOnSales.length &&
                          tour?.tourOnSales[0]?.adultPrice
                        }
                        discount={
                          tour?.tourOnSales.length &&
                          tour?.tourOnSales[0]?.discount
                        }
                        minPrice={tour?.minPrice}
                        maxPrice={tour?.maxPrice}
                        rate={Math.floor(tour?.rate)}
                        numberOfReviewers={tour?.numberOfReviewer}
                        cityStart={tour?.cityStart?.name}
                        numberOfDays={tour?.numberOfDays}
                        numberOfNights={tour?.numberOfNights}
                      />
                    ))}
                  </div>
                )}
                {!data?.data?.length && (
                  <div>
                    <SearchNotFound mess={t("common_not_found")} />
                  </div>
                )}
              </div>
              <Row className={classes.pigination}>
                <Pagination
                  count={data?.meta?.pageCount || 0}
                  page={data?.meta?.page}
                  onChange={handleChangePage}
                />
              </Row>
            </Col>
          </Row>
        </Container>
      </Row>
      <Social />
    </>
  );
};

export default ListTours;

// export async function getStaticProps({ locale }) {
//   return {
//     props: {
//       ...(await serverSideTranslations(locale)),
//     }
//   }
// }
