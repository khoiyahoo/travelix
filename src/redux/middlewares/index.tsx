import loggerMiddleware from "redux/middlewares/logger";
import sagaMiddleware from "redux/middlewares/saga";

export default () => {
  if (process.env.NODE_ENV !== 'production') {
    return [loggerMiddleware, sagaMiddleware];
  } else {
    return [sagaMiddleware];
  }
};