import React, { useEffect } from 'react'

function Login() {
    const updateStatus = () => {
        window.FB.getLoginStatus(function(response) {
            // {authResponse: null, status: "not_authorized"}
            console.log(response)
        })
    }

    useEffect(updateStatus, [])

    return (
        <div className="loginModal acrylic">
            <h1><del>u</del>nsw.io</h1>
            <div className="fb-login-button" data-size="large" data-button-type="continue_with" data-layout="rounded" data-auto-logout-link="false" data-use-continue-as="true" data-width="" data-onlogin="updateStatus"></div>
        </div>
    );
}

export default Login;
