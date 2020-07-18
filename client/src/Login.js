import React, { useEffect } from 'react'
import socket from "./socket"

function Login({ setIsAuthed }) {
    window.updateStatus = () => {
        try {
            window.FB.getLoginStatus(function(response) {
                setIsAuthed(response.authResponse != null)
                if (response.authResponse) {
                    socket.emit("identify", response.authResponse.accessToken);
                }
            })
        } catch(e) {}
    }

    useEffect(window.updateStatus, [])

    return (
        <div className="loginModal acrylic">
            <h1><del>u</del>nsw.io</h1>
            <div className="fb-login-button" data-size="large" data-button-type="continue_with" data-layout="rounded" data-auto-logout-link="false" data-use-continue-as="true" data-width="" data-onlogin="updateStatus"></div>
        </div>
    );
}

export default Login;
