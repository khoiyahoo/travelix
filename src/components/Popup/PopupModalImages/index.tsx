import React, { memo } from "react";
import { Modal, ModalBody } from "reactstrap";
import classes from "./styles.module.scss";
import "aos/dist/aos.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import clsx from "clsx";
interface Props {
  isOpen: boolean;
  toggle: () => void;
  images: any;
}
// eslint-disable-next-line react/display-name
const PopupModalImages = memo((props: Props) => {
  const { isOpen, toggle, images } = props;

  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} className={classes.root}>
        <ModalBody className={classes.modalBody}>
          <Swiper
            pagination={{
              type: "fraction",
            }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className={clsx("mySwiper", classes.swiper)}
          >
            {images?.map((img, index) => (
              <SwiperSlide key={index}>
                <div className={classes.containerImg}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="anh" className={classes.imgSlide} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </ModalBody>
      </Modal>
    </>
  );
});

export default PopupModalImages;
