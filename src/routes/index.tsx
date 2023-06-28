import LandingPage from "pages/landingPage";
import Login from "pages/auth/login";
import Profile from "pages/profile";
import SidebarLayout from "components/Layout/SidebarLayout";
import VerifySignup from "pages/auth/verifySignup";
const publicRoutes = [
    {path: '/', components: LandingPage},
    {path: '/auth/login', components: Login},
    {path: '/auth/verify-signup', components: VerifySignup},
    {path: '/profile', components: Profile, layout: SidebarLayout}
]; 

// const privateRoutes = [];

export { publicRoutes };