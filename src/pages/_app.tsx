import "../../i18n";
import "styles/globals.css";
import "assets/css/bootstrap.min.css";
import "assets/scss/now-ui-kit.scss?v=1.4.0";
import "assets/demo/demo.css?v=1.4.0";
import "assets/demo/react-demo.css?v=1.4.0";
import "assets/demo/nucleo-icons-page-styles.css?v=1.4.0";
import "./index.scss";
import "@fortawesome/fontawesome-svg-core/styles.css"; // import Font Awesome CSS
import LayoutAuth from "components/Layout/DefaultLayout";
import LayoutEnterprise from "components/Layout/EnterpriseLayout";
import { config } from "@fortawesome/fontawesome-svg-core";
import { publicRoutes } from "routes";
config.autoAddCss = false;
import type { AppProps } from "next/app";
import { Provider, useDispatch, useSelector } from "react-redux";
// import { createConfigureStore } from "redux/configureStore";
import withReduxSaga from "next-redux-saga";
import { wrapper } from "redux/configureStore";
import { StrictMode, useEffect, useState } from "react";
import { getMe } from "redux/reducers/User/actionTypes";
import AppStatus from "components/AppStatus";
import Router, { useRouter } from "next/router";
import LoadingScreen from "components/LoadingSrceen";
import { EUserType } from "models/user";
import { ReducerType } from "redux/reducers";
import "../styles/globals.css";
import { getAllHotels as getAllHotelsOfEnterprise, getAllTours as getAllToursOfEnterprise } from "redux/reducers/Enterprise/actionTypes";

import {
  getAllTours as getAllToursOfNormal,
  getAllHotels as getAllHotelsOfNormal,
  getAllTourBills,
  getAllRoomBills,
} from "redux/reducers/Normal/actionTypes";
import Home from "pages";
import { langSupports } from "models/general";
import moment from "moment";
import { I18nextProvider } from "react-i18next";

// const { store } = createConfigureStore();

import i18next from "i18next";
import { store } from "redux/configureStore";

function MyApp({ Component, pageProps }: AppProps) {
  // const { store, props } = wrapper.useWrappedStore(pageProps);
  const dispatch = useDispatch();
  const { user } = useSelector((state: ReducerType) => state.user);

  // useEffect(() => {
  //   if (!i18n.language) return;
  //   if (!langSupports.find((lang) => lang.key === i18n.language)) {
  //     i18n.changeLanguage(langSupports[0].key);
  //   }
  //   moment.locale(i18n.language);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [i18n.language]);
  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  const [loading, setLoading] = useState(false);
  Router.events.on("routeChangeStart", (url) => {
    setLoading(true);
  });
  Router.events.on("routeChangeComplete", (url) => {
    setLoading(false);
  });

  let allowed = true;
  const router = useRouter();
  if (router.pathname.startsWith("/enterprises") && user?.role !== EUserType.ENTERPRISE && user?.role !== EUserType.STAFF) {
    allowed = false;
  }
  if (router.pathname.startsWith("/admin") && user?.role !== EUserType.SUPER_ADMIN && user?.role !== EUserType.ADMIN) {
    allowed = false;
  }

  const ComponentToRender = allowed ? Component : Home;
  return (
    <StrictMode>
      <Provider store={store}>
        <I18nextProvider i18n={i18next}>
          <LayoutAuth>
            {loading && <LoadingScreen />}
            <AppStatus />
            <ComponentToRender {...pageProps} />
          </LayoutAuth>
        </I18nextProvider>
      </Provider>
    </StrictMode>
  );
}

// export default useWrappedStore(wrapper)(withReduxSaga(MyApp));
export default wrapper.withRedux(withReduxSaga(MyApp));
// export default translate('common')(wrapper.withRedux(withReduxSaga(MyApp)));
// export default withRedux(wrapper)(withReduxSaga(MyApp));
// export default appWithTranslation(withRedux(wrapper)(withReduxSaga(MyApp)));
// export default MyApp;
