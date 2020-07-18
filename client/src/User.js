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
    this.location = "";
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
      this.x += dx;
      this.y += dy;
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
    "--user-x": user.x,
    "--user-y": user.y
  };
  if (user.self) style.transition = "none"

  return (
    <div
      className="user"
      style={style}
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
