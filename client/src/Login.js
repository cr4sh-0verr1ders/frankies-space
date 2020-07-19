import React, { useEffect } from 'react'
import socket from "./socket"

function Login({ setIsAuthed }) {
    window.updateStatus = () => {
        if (window.location.hostname == "localhost") {
            setIsAuthed(true)
        } else {
            try {
                window.FB.getLoginStatus(function(response) {
                    setIsAuthed(response.authResponse != null)
                    if (response.authResponse) {
                        // console.log(response.authResponse.accessToken)
                        socket.emit("identify", response.authResponse.accessToken);
                    }
                })
            } catch(e) {}
        }
        
    }

    useEffect(window.updateStatus, [])

    return (
        <div className="loginModal acrylic">
            <img style={{width: 200}} src="https://unswio.herokuapp.com/frankie.png" />
            <br />
            <h1>Frankie's Space</h1>
            <div className="fb-login-button" data-size="large" data-button-type="continue_with" data-layout="rounded" data-auto-logout-link="false" data-use-continue-as="true" data-width="" data-onlogin="updateStatus"></div>
        </div>
    );
}

export default Login;
