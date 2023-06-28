import { Alert, Snackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import {
  setSuccessMess,
  clearErrorMess,
} from "redux/reducers/Status/actionTypes";
import LoadingScreen from "../LoadingSrceen";

export const AppStatus = () => {
  const dispach = useDispatch();
  const status = useSelector((state: ReducerType) => state.status);

  return (
    <>
      {(status?.isLoading || status?.isLoadingAuth) && <LoadingScreen />}
      <Snackbar
        open={!!status?.error}
        autoHideDuration={6000}
        onClose={() => dispach(clearErrorMess(undefined))}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={() => dispach(clearErrorMess(undefined))}
          severity="error"
          sx={{
            width: "350px",
          }}
        >
          {status?.error}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!status?.success}
        autoHideDuration={6000}
        onClose={() => dispach(setSuccessMess(undefined))}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={() => dispach(setSuccessMess(undefined))}
          severity="success"
          sx={{
            width: "350px",
            fontWeight: 500,
          }}
        >
          {status?.success}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AppStatus;
