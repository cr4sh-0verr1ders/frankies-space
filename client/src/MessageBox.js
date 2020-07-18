import React from 'react'
import socket from './socket'

function MessageBox() {
  const onKeyDown = event => {
    if (event.key === "Enter") {
      socket.emit("message", event.target.value)
      event.target.value = ""
    }
  }

  return (
    <input
      className="MessageBox"
      placeholder="Type a message"
      onKeyDown={onKeyDown}
    />
  );
}

export default MessageBox;
