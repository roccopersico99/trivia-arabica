import React from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login'
import { refreshTokenSetup } from '../services/refreshToken';
import * as FirestoreBackend from '../services/Firestore.js'
import { useAuthState, useAuthDispatch } from '../Context/index'
import { useHistory } from 'react-router-dom'

const clientId = '232679417776-evek906rd0viu2j08vqsciphcrjhttir.apps.googleusercontent.com';

export default function LoginLogout() {

  const history = useHistory();

  const dispatch = useAuthDispatch()
  const userDetails = useAuthState()

  const onLoginSuccess = (res) => {
    console.log("Logged in as: ", res.profileObj);
    dispatch({ type: 'LOGIN_SUCCESS', payload: res.profileObj })

    refreshTokenSetup(res);

    const usr_query = FirestoreBackend.getUser('' + res.profileObj.googleId);
    usr_query.then((query_snapshot) => {
      if (query_snapshot.empty) {
        //create account
        FirestoreBackend.createUser(res.profileObj.name, '' + res.profileObj.googleId)
      }
    });
  };

  const onLoginFailure = (res) => {
    console.log("Failed login: ", res)
    dispatch({ type: 'LOGIN_ERROR', error: "error" })
  };

  const onLogoutSuccess = (res) => {
    console.log("Logged out of: ", res);
    dispatch({ type: 'LOGOUT' });

    history.push("/");
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