import type { NextPage } from "next";
import LandingPage from "./landingPage";
import { memo } from "react";

const Home: NextPage = () => {
  return <LandingPage />;
};

export default memo(Home);
