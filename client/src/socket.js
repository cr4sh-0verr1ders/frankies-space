const socket = window.io(":8080", {transports: ['websocket']});
export default socket;