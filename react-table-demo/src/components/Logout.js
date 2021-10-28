import React from 'react';
import { GoogleLogout } from 'react-google-login';

import { useAuthState, useAuthDispatch } from '../Context/index'

const clientId = '232679417776-urc47i20q2haqg0on3cdvbb8k7g3chtl.apps.googleusercontent.com';

function Logout() {

  const dispatch = useAuthDispatch()

  const onSuccess = (res) => {
    console.log("Logged out of: ", res);
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <div>
            <GoogleLogout
                clientId={clientId}
                buttonText="Logout"
                onLogoutSuccess={onSuccess}
            />
        </div>
  );
}

export default Logout;