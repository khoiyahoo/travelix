import React, { memo, useEffect, useState } from "react";
import SectionHeader from "components/Header/SectionHeader";
import { images } from "configs/images";
import SectionTour from "./components/SectionTour";
import Comment from "./components/Comment";
import clsx from "clsx";
import classes from "./styles.module.scss";
import { useRouter } from "next/router";
import { TourService } from "services/normal/tour";
import { useDispatch } from "react-redux";
import { setErrorMess } from "redux/reducers/Status/actionTypes";
import { TourScheduleService } from "services/normal/tourSchedule";
import { useTranslation } from "react-i18next";

// eslint-disable-next-line react/display-name
const ProductPage = memo(() => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t, i18n } = useTranslation("common");

  const [tour, setTour] = useState<any>();
  const [tourSchedule, setTourSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (router) {
      setIsLoading(true);
      TourService.getTour(Number(router.query.tourId.slice(1)))
        .then((res) => {
          setTour(res.data);
          setIsLoading(false);
        })
        .catch((e) => {
          dispatch(setErrorMess(e));
          setIsLoading(false);
        })
        .finally(() => {
          // dispatch(setLoading(false));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  useEffect(() => {
    if (router) {
      setIsLoading(true);
      TourScheduleService.getTourSchedule(Number(router.query.tourId.slice(1)))
        .then((res) => {
          setTourSchedule(res.data);
          setIsLoading(false);
        })
        .catch((e) => {
          dispatch(setErrorMess(e));
          setIsLoading(false);
        })
        .finally(() => {
          // dispatch(setLoading(false));
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  return (
    <>
      <div className={clsx("wrapper", classes.root)}>
        <SectionHeader
          title={t("tour_detail_section_title_hero")}
          src={images.bgUser.src}
          className={
            tour?.isTemporarilyStopWorking || tour?.isDeleted
              ? classes.sectionHeader
              : ""
          }
        />
        <SectionTour
          tour={tour}
          tourSchedule={tourSchedule}
          isLoading={isLoading}
        />
        <Comment />
      </div>
    </>
  );
});

export default ProductPage;

// export async function getStaticPaths() {
//   return {
//     paths: [], //indicates that no page needs be created at build time
//     fallback: "blocking", //indicates the type of fallback
//   };
// }

// export async function getStaticProps({ locale }) {
//   return {
//     props: {
//       ...(await serverSideTranslations(locale)),
//     },
//   };
// }
