import React, { Component } from 'react';
import defaultIcon from './default-icon.svg';

class User {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    this.name = "Luke Fisk-Lennon";
    this.icon = defaultIcon;
  }

  step(dx, dy) {
    this.x += dx;
    this.y += dy;
    return this;
  }
}

function Avatar(props) {
  const { user } = props;
  const cssPosition = {
    "--user-x": user.x,
    "--user-y": user.y,
  };

  return (
    <div
      className="user"
      style={cssPosition}
    >
      <img
        className="avatar"
        src={user.icon}
      />
      <div
        className="name"
      >
        {user.name}
      </div>
    </div>
  );
}

export { User, Avatar };
