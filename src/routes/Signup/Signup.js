import React, { useState } from "react";
import VerifyContact from "../VerifyContact/VerifyContact"
import { Form } from "react-bootstrap";
import LoaderButton from "../../components/LoaderButton";
import { useFormFields } from "../../libs/hooksLib";

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/bootstrap.css'
import "./Signup.css";
import "../../App.css";

import Auth from '@aws-amplify/auth'

export default function Signup(props) {
  const [fields, handleFieldChange] = useFormFields({
    email: "",
    phone_number:"",
    password: "",
    confirmPassword: ""
  });

  const [newUser, setNewUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorHelperText, setErrorHelperText] = useState('')

  function validateForm() {
    return (
      fields.email.length > 0 &&
      fields.password.length > 0 &&
      fields.confirmPassword.length > 0 &&
      fields.phone_number.length > 2
    );
  }

  function handlePhoneChange (phone) {

        phone = '+' + phone.replace(/[^0-9]/g,'')

        phone = phone === '+1' ? '' : phone

        const event = { target : { id : "phone_number", value : phone }}

        handleFieldChange(event)
  }

  function validateSubmit () {
    const phone = document.querySelector( "[name=phone_number]" );
    if(!/^\+[1-9]{1}[0-9]{3,14}$/.test(fields.phone_number)) {
        phone.setCustomValidity("Please enter a valid phone number.");
    } else {
        phone.setCustomValidity('')
    }

    const confirm =  document.querySelector( "[id=confirmPassword]" );
    if(fields.password !== fields.confirmPassword) {
        confirm.setCustomValidity("Passwords do not match. Please reenter your password.");
    } else {
        confirm.setCustomValidity('')
    }
  }

  async function handleSubmit(event) {

    event.preventDefault();

    setIsLoading(true);

    try {
        const createdUser = await Auth.signUp({
            username : fields.email,
            password : fields.password,
            attributes : {
                email : fields.email,
                phone_number : fields.phone_number
            }
        })
        setNewUser(createdUser)
    } catch (e) {
        console.log(e)
        setErrorHelperText(e.message)
    } finally {
        setIsLoading(false)
    }
  }


  function renderForm() {
    return (
      <form onSubmit={handleSubmit}>
        <Form.Group controlId="email" size="lg">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="phone_number" size="lg">
          <Form.Label>Mobile Number</Form.Label>
          <PhoneInput
            inputProps={{name : "phone_number"}}
            country={'us'}
            countryCodeEditable={false}
            value={fields.phone_number}
            disableDropdown={true}
            onChange={handlePhoneChange}
            tabIndex = {99}
            />       
        </Form.Group>
        <Form.Group controlId="password" size="lg">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="confirmPassword" size="lg">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            onChange={handleFieldChange}
            value={fields.confirmPassword}
          />
          <Form.Text className="text-danger">{errorHelperText}</Form.Text>
        </Form.Group>
        <LoaderButton
          block
          type="submit"
          size="lg"
          isLoading={isLoading}
          disabled={!validateForm()}
          defaultText="Signup"
          loadingText="Signing Up ..."
          onClick={validateSubmit}
        >
          Signup
        </LoaderButton>
      </form>
    );
  }

  return (
    <div className="Signup">
      {newUser === null ? renderForm() : <VerifyContact action="confirm" item="email" email={fields.email} password={fields.password} {...props} />}
    </div>
  );
}