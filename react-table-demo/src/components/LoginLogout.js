import React, { useState, useContext } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login'
import { refreshTokenSetup } from '../services/refreshToken';

import { useAuthState, useAuthDispatch } from '../Context/index'

const clientId = '232679417776-urc47i20q2haqg0on3cdvbb8k7g3chtl.apps.googleusercontent.com';

export default function LoginLogout() {

  const dispatch = useAuthDispatch()
  const userDetails = useAuthState()
  // const { updateName } = useContext(GlobalContext);

  const onLoginSuccess = (res) => {
    console.log("Logged in as: ", res.profileObj);
    dispatch({ type: 'LOGIN_SUCCESS', payload: res.profileObj })
    //console.log(res.profileObj.name)
    //setName(res.profileObj.name);
    //updateName(res.profileObj.name);
    //setName(res.profileObj.name);

    refreshTokenSetup(res);
  };

  const onLoginFailure = (res) => {
    console.log("Failed login: ", res)
    dispatch({ type: 'LOGIN_ERROR', error: "error" })
  };

  const onLogoutSuccess = (res) => {
    console.log("Logged out of: ", res);
    dispatch({ type: 'LOGOUT' });
  };

  if (userDetails.user === "") {
    return (
      <div>
          <GoogleLogin
            clientId={clientId}
            buttonText="Login"
            onSuccess={onLoginSuccess}
            onFailure={onLoginFailure}
            cookiePolicy={"single_host_origin"}
            style={{ marginTop: '100px' }}
            isSignedIn={true}
          />
        </div>
    );
  } else {
    return (
      <div>
        <GoogleLogout
          clientId={clientId}
          buttonText="Logout"
          onLogoutSuccess={onLogoutSuccess}
        />
      </div>
    );
  }

}