import React from 'react';
import defaultIcon from './default-icon.svg';
import locationData from "./locations.json";
import classifyPoint from "robust-point-in-polygon";

const defaultUserData = {
  x: 3000,
  y: 2500,
  name: "Placeholder",
  message: "",
  image_uri: defaultIcon,
  id: "",
}

const diagonalFactor = Math.sqrt(0.5)

class User {
  constructor(data) {
    if (!data) {
      data = defaultUserData
      this.self = true
    } else {
      this.self = false
    }
    this.x = data.x;
    this.y = data.y;
    this.location = "WASD to move around";
    this.locationID = -1; // initially start outside.
    this.message = data.message;
    this.name = data.name;
    this.icon = data.image_uri;
    this.id = data.socket_id;
  }

  step(dx, dy) {
    if (dx < 0 || dx > 0 || dy > 0 || dy < 0) {
      // If not in current geo-fence.
      if (this.locationID == -1 || classifyPoint(locationData[this.locationID].coordinates[0], [this.x, this.y] == 1)) {
        // Find where the player is.
        for(let i = 0; i < locationData.length; i++){
          if (classifyPoint(locationData[i].coordinates[0], [this.x, this.y]) === -1) {
            this.location = locationData[i].name;
            this.locationID = i;
            console.log("You're inside " + locationData[i].name);
            break;
          }
        }
      }
      if ((dx > 0 || dx < 0) && (dy > 0 || dy < 0)) {
        dx *= diagonalFactor;
        dy *= diagonalFactor;
      }
      this.x += Math.round(dx);
      this.y += Math.round(dy);
    }
    return this;
  }

  setMessage(msg) {
    this.message = msg;
    return this;
  }

  setId(id) {
    this.id = id;
    return this;
  }
}

function Avatar(props) {
  const { user } = props;
  const style = {
    "--user-x": user.x + "px",
    "--user-y": user.y + "px"
  };
  if (user.self) style.transition = "none"

  let hasMessage = user.message ? 1 : 0;

  return (
    <div
      className="user"
      style={style}
    >
      <a href="#">
        <img
          className="avatar"
          src={user.icon}
        />
      </a>
      <div
        className="name"
      >
        {user.name}
      </div>
      <div
        className="message acrylic"
        style={{
          opacity: hasMessage,
          transform: `scale(${hasMessage})`
        }}
      >
        {user.message}
      </div>
    </div>
  );
}

export { User, Avatar };
