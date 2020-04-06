import React from 'react'
import { Form } from "react-bootstrap";
import LoaderButton from "../../components/LoaderButton";
import { useFormFields } from "../../libs/hooksLib";
import { FontAwesomeIcon as Icon} from '@fortawesome/react-fontawesome';
import './VerifyContact.css'

import Auth from '@aws-amplify/auth'

export default function VerifyContact(props) {
    
    const [validated, setValidated] = React.useState(false)
    const [errorHelperText, setErrorHelperText] = React.useState('')
    const [fields, handleFieldChange] = useFormFields({
        confirmationCode: ""
    });
    const [isLoading, setIsLoading] = React.useState(false);
    const [verifyMobile, setVerifyMobile] = React.useState(false)

    React.useEffect( () => {

        async function checkValidated () {

            try {
    
                if( props.isAuthenticated ) {
                    const userInfo = await Auth.currentUserInfo()
                    if(userInfo.attributes[props.item + '_verified']) { 
                        setValidated (true)
                    } else {
                        await Auth.verifyCurrentUserAttribute(props.item);
                        setValidated (false)
                    }
                } else if ( props.resend ) {
                    await Auth.resendSignUp(props.email)
                }
            } catch (e) {
                console.log(e);
            }
            
        }
    

        checkValidated()
    }, [props.item, props.email, props.resend, props.isAuthenticated])

    const submitAction = props.action === "confirm" ? handleConfirmationSubmit : handleValidateSubmit

    const text = {
        title : props.item === "email" ? "Email" : "Mobile Device",
        helperText : props.item === "email" ? "email" 
            : "mobile device"
    }


    async function handleConfirmationSubmit(event) {
        event.preventDefault();
    
        setIsLoading(true);

        try {
            await Auth.confirmSignUp(props.email, fields.confirmationCode);
            await Auth.signIn(props.email, props.password);
            
            props.setIsAuthenticated(true);

            const currentUserInfo = await Auth.currentUserInfo()

            console.log("error here")

            if(!currentUserInfo.attributes.phone_number_verified) {
                setVerifyMobile(true)
                setIsLoading(false);
            } else {
                props.history.push("/");
            }
        } catch (e) {
            console.log(e)
            setErrorHelperText(e.message);
            setIsLoading(false);
        }
    }

    async function handleValidateSubmit(event) {
        event.preventDefault();
    
        setIsLoading(true);

        try {
            await Auth.verifyCurrentUserAttributeSubmit(props.item, fields.confirmationCode);
            props.history.push("/");
        } catch (e) {
            setErrorHelperText(e.message);
            setIsLoading(false);
        }
    }

    function validateConfirmationForm() {
      return fields.confirmationCode.length > 0;
    }

    function renderConfirmationForm() {
        return (
        <form onSubmit={submitAction}>
            <Form.Group controlId="confirmationCode" size="lg">
            <Form.Label>Confirm Your {text.title}</Form.Label>
            <Form.Control
                autoFocus
                type="number"
                onChange={handleFieldChange}
                value={fields.confirmationCode}
            />
            <Form.Text>Please enter the confirmation code sent to your {text.helperText}.</Form.Text>
            <Form.Text className="text-danger">{errorHelperText}</Form.Text>
            </Form.Group>
            <LoaderButton
            block
            type="submit"
            size="large"
            isLoading={isLoading}
            disabled={!validateConfirmationForm()}
            defaultText="Verify"
            loadingText="Verifying ..."
            />
        </form>
        );
    }

    function renderContent () {
         if ( validated) {
            return (
                <span className="text-success">
                    <Icon icon="check-circle"/> Thanks for validating your {props.item === "email" ? "email" : "mobile device"}.
                </span>
            )
        } else {
            return (
                renderConfirmationForm()
            )
        }
    }

    if( verifyMobile ) {
        return  <VerifyContact {...props} action="verify" item="phone_number" />
    }

    return (
        <div className="Verify">
            {renderContent()}
        </div>
    )

}