import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
// import { userSocialLogin } from 'redux/reducers/User/actionTypes';
// import { setErrorMess } from 'redux/reducers/Status/actionTypes';
// import { SocialProvider } from 'models/general';
import classes from './styles.module.scss';
import icGoogle from 'assets/img/icon/ic-google.svg';
import { Button } from 'reactstrap';
import {images} from "configs/images";

const Google = () => {
//   const dispatch = useDispatch()
  
  const onSuccess = (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    // const userInfo = res as GoogleLoginResponse
    // dispatch(userSocialLogin({
    //   token: userInfo.tokenId,
    //   provider: SocialProvider.GOOGLE
    // }))
  }

  const onFailure = (error: any) => {
    // dispatch(setErrorMess({message: t('auth_login_again')}))
  }

  return (
    <GoogleLogin
      clientId=""
      onSuccess={onSuccess}
      onFailure={onFailure}
      render={(renderProps) => (
        <Button className={classes.icGoogle} onClick={renderProps.onClick}>
            <img src={images.google.src} alt="" />
            Google
        </Button>
      )}
    />
  );
};
export default Google;
