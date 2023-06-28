import React, { memo, useEffect, useState } from "react";
import clsx from "clsx";
import GoogleMapReact from "google-map-react";

import { Grid } from "@mui/material";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
interface Props {
  coords: any;
  className?: string;
}

// eslint-disable-next-line react/display-name
const Map = memo(({ coords, className }: Props) => {
  return (
    <Grid className={className} sx={{ height: "135px" }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: "AIzaSyCRzSrswCY_UoHgkZnUW7JsPeq4VizUB2k",
        }}
        defaultCenter={coords}
        defaultZoom={11}
        center={coords}
      >
        {" "}
        {/* <AnyReactComponent
          lat={lat}
          lng={lng}
          text={<FontAwesomeIcon icon={faLocationDot} />}
        /> */}
      </GoogleMapReact>
    </Grid>
  );
});

export default Map;
