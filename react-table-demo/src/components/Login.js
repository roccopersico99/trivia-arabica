import React, { useState, useContext } from 'react';
import { GoogleLogin } from 'react-google-login'
import { refreshTokenSetup } from '../services/refreshToken';

const clientId = '232679417776-urc47i20q2haqg0on3cdvbb8k7g3chtl.apps.googleusercontent.com';

function Login() {

    // const [name, setName] = useState("");
    // const { updateName } = useContext(GlobalContext);

    const onSuccess = (res) => {
        console.log("Logged in as: ", res.profileObj);

        //console.log(res.profileObj.name)
        //setName(res.profileObj.name);
        //updateName(res.profileObj.name);
        //setName(res.profileObj.name);

        refreshTokenSetup(res);
    };

    const onFailure = (res) => {
        console.log("Failed login: ", res)
    };

    return (
        <div>
            <GoogleLogin
                clientId={clientId}
                buttonText="Login"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={"single_host_origin"}
                style={{ marginTop: '100px' }}
                isSignedIn={true}
            />
        </div>
    );
}

export default Login;
