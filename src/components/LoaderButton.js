import React from "react"
import { Button } from "react-bootstrap";
import { FontAwesomeIcon as Icon} from '@fortawesome/react-fontawesome';

export default function LoaderButton({defaultText = "Load", loadingText = "Loading ...", disabled = false, isLoading = false, loadingIcon = "sync-alt", ...props}) {

    const loginButton = isLoading ? 
    <React.Fragment>
        <Icon icon={loadingIcon} spin /> {loadingText}
    </React.Fragment>
    : defaultText

    return (
        <Button disabled={disabled || isLoading} {...props}>
            {loginButton}
        </Button>
        )
}

