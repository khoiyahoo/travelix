/* eslint-disable react/display-name */
import { memo } from "react";
import Button, {BtnType} from "../Button";

interface Props { 

}

// eslint-disable-next-line no-empty-pattern
const SignOutButton = memo((props: Props) => {
    const handleSignOut = () => {

    }
    return (
        <Button onClick ={ handleSignOut } btnType = {BtnType.Secondary}>
            Sign Out
        </Button>
    )
});

export default SignOutButton;