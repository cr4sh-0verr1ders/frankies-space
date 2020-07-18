import React, { useRef, useEffect } from 'react'
import socket from './socket'

function MessageBox() {
  const element = useRef();

  useEffect(() => {
    element.current.focus()
  }, [])

  const onKeyDown = event => {
    if (event.key === "Enter") {
      socket.emit("message", event.target.value)
      event.target.value = ""
    }

    event.stopPropagation(); // don't trigger movement
  }

  return (
    <input
      ref={element}
      className="MessageBox"
      placeholder="Type a message"
      onKeyDown={onKeyDown}
    />
  );
}

export default MessageBox;
