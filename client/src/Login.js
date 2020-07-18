import React, { useEffect } from 'react'
import socket from "./socket"

function Login({ setIsAuthed }) {
    window.updateStatus = () => {
        // try {
        //     window.FB.getLoginStatus(function(response) {
                setIsAuthed(true)//response.authResponse != null)
                // if (response.authResponse) {
                //     console.log(response.authResponse.accessToken)
                    // socket.emit("identify", "EAAmSEFg3WZBkBAJrr23N7xMMBmTZARWAxsSZBTAAMyx4lArjZCAmAggmRqWk1K0p2Lx7ZA30SZC9fBUSZBcbM35RWSnc8Asb4lZBW0xhGsV2FzYhcY0Pvrngvz48DhZCiFdhc8QTKo1mbCBUnDg1KnaNQZBXkQiovsXZC2UogAYSnxCZCTZCWOkBm42WNEBnPfY6LfIQZD")//response.authResponse.accessToken);
    //             }
    //         })
    //     } catch(e) {}
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
