import React from 'react';
import defaultIcon from './default-icon.svg';
import locationData from "./locations.json";
import classifyPoint from "robust-point-in-polygon";
class User {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    this.message = "";
    this.name = "Luke Fisk-Lennon";
    this.icon = defaultIcon;
    this.id = Math.floor(Math.random() * 10000);
  }

  step(dx, dy) {
    if (dx < 0 || dx > 0 || dy > 0 || dy < 0) {
      for(let i = 0; i < locationData.length; i++){
        if (classifyPoint(locationData[i].coordinates[0], [this.x, this.y]) === -1) {
          console.log("You're inside " + locationData[i].name);
          break;
        }
      }
      this.x += dx;
      this.y += dy;
    }
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
        {user.x}, {user.y}
      </div>
      <div
        className="message acrylic"
      >
        {user.message}
      </div>
    </div>
  );
}

export { User, Avatar };
