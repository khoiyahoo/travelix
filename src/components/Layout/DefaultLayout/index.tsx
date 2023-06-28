import React from "react";
import TransparentNavbar from "components/Navbars/TransparentNavbar";
import Footer from "components/Footer";
interface Props { 
    children: React.ReactNode;
}

const LayoutAuth = ({children}: Props) => {
    return (
        <>
            <TransparentNavbar/>
            <div>
                {children}
            </div>
            <Footer/>
        </>
    )
}

export default LayoutAuth;