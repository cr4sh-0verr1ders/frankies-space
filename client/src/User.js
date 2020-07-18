import React from 'react';
import defaultIcon from './default-icon.svg';
import locationData from "./locations.json";
import classifyPoint from "robust-point-in-polygon";

const defaultUserData = {
  x: 3000,
  y: 2500,
  name: "Placeholder",
  icon: defaultIcon,
  id: "",
}

class User {
  constructor(data = defaultUserData) {
    this.x = data.x;
    this.y = data.y;
    this.message = "";
    this.name = data.name;
    this.icon = defaultIcon;
    this.id = data.socket_id;
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

  setId(id) {
    this.id = id;
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
        style={{
          opacity: user.message.length > 0 ? 1 : 0,
          transform: `scale(${user.message.length > 0 ? 1 : 0})`
        }}
      >
        {user.message}
      </div>
    </div>
  );
}

export { User, Avatar };
