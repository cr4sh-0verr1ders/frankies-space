const socket = window.io(":443", {transports: ['websocket']});
export default socket;
