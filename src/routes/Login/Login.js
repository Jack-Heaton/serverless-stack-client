import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { useFormFields } from "../../libs/hooksLib"
import "./Login.css";
import LoaderButton from "../../components/LoaderButton";
import VerifyContact from '../VerifyContact/VerifyContact';

import Auth from "@aws-amplify/auth"

export default function Login(props) {
  const [fields,handleFieldChange] = useFormFields({
    email : "",
    password : ""
  })
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [helperText, setHelperText] = useState('');

  const [confirmEmail, setConfirmEmail] = useState(false)

  const [verifyMobile, setVerifyMobile] = useState(false)


  function validateForm() {
    return fields.email.length > 0 && fields.password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
        setIsLoggingIn(true)
        await Auth.signIn(fields.email, fields.password);
        props.setIsAuthenticated(true)
        const currentUserInfo = await Auth.currentUserInfo(fields.email, fields.password);
        if(!currentUserInfo.attributes.phone_number_verified) {
          setVerifyMobile(true)
        } else {
          props.history.push('/')
        }
    } catch (e) {
        props.setIsAuthenticated(false)
        setHelperText(e.message)
        if(e.code === 'UserNotConfirmedException') setConfirmEmail(true)
        setIsLoggingIn(false)
    }
  }

  if( confirmEmail || verifyMobile ) {
    let verifyContent
    if( confirmEmail ) {
      verifyContent = <VerifyContact {...props} action="confirm" resend={true} email={fields.email} password={props.password} item="email"  />
    } else if( verifyMobile ) {
      verifyContent = <VerifyContact {...props} action="verify" item="phone_number"  />
    }

    return (
      <div className="Login">
        <span>Please verify your contact info in order to complete signup.</span>
        {verifyContent}
      </div>

    )

  }


  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <Form.Group controlId="email" size="lg">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
            disabled={isLoggingIn}
          />
        </Form.Group>
        <Form.Group controlId="password" size="lg">
          <Form.Label>Password</Form.Label>
          <Form.Control
            value={fields.password}
            onChange={handleFieldChange}
            type="password"
            disabled={isLoggingIn}
          />
          <Form.Text className="text-danger">{helperText}</Form.Text>
        </Form.Group>
        <LoaderButton
            block
            size="lg"
            type="submit"
            defaultText="Login"
            loadingText="Loging In ..."
            disabled={!validateForm()}
            isLoading={isLoggingIn}
        />
      </form>
    </div>
  );
}