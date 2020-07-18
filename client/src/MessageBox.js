import React, { useRef, useEffect } from 'react'
import socket from './socket'

function MessageBox(props) {
  const element = useRef();

  useEffect(() => {
    // element.current.focus()
    window.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        element.current.focus()
      }
    })
  }, [])

  const onKeyDown = event => {
    if (event.key === "Enter") {
      if (event.target.value.length > 0) {
        socket.emit("message", event.target.value)
        props.onMessage(event.target.value)
        event.target.value = ""
        event.target.placeholder = "Press enter to focus"
      }
      element.current.blur()
    }

    event.stopPropagation(); // don't trigger movement
  }

  return (
    <input
      ref={element}
      className="MessageBox acrylic"
      placeholder="Type a message"
      onKeyDown={onKeyDown}
    />
  );
}

export default MessageBox;
