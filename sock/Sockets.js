const facebook = require("../fb/Facebook");

class User {
  constructor(socket, name, image_uri){
    this.socket = socket;
    this.name = name;
    this.image_uri = image_uri;
    this.x = 0; // change start coords later
    this.y = 0;
  }

  public(){
    return {socket_id: this.socket.id, name: this.name, image_uri: this.image_uri, x: this.x, y: this.y};
  }
}

function setupConnection(socket) {
  // broadcast new connection to other clients
  // by default, set their name to their socket id

  // print socket id
  console.log(`New connection: ${socket.id}`);
  facebook.identify("2693873687550953|9M8I5tk0Rhrj3UgfN7kQyzNTVog");
  // we push the user onto the stack with placeholder name and image uri, awaiting identification event
  users.push(new User(socket, socket.id, "/"));

  // handle the identification event
  socket.on("identify", (token) => {
    console.log("Identification event");
    // grab the facebook auth token and get a name and image uri
    facebook.identify(token);

  });

  // we want to handle disconnect events before the socket object is sent to the shadow realm
  // handle disconnect
  socket.on("disconnecting", (reason) =>{
    let index = users.findIndex(o => o.socket.id == socket.id);
    // emit an event incase we want to do a disconnect animation or something
    io.emit("user_disconnect", {x: users[index].x, y: users[index].y});
    console.log(`Socket ${socket.id} (name: ${users[index].name}) disconnected: ${reason}`);

    // pop from stack
    // users = users.filter(function(o) {
    //     return o.socket !== socket;
    // });
    users.splice(index, 1);

  });

  // handle chat message
  socket.on("message", (msg) => {
    console.log(`Message from ${socket.id}: ${msg}`);
    // broadcast to everyone, including the sender
    io.emit("message", {msg:msg, sender: socket.id});
  });
}

exports = module.exports = function(io){
  const updateInterval = 100; // every 100 ms we poll to update user coords
  let users = [];

  // handle connection and setup other listeners
  io.on("connection", setupConnection);

  // Polling
  setInterval(() => {
    io.emit("update", users.map(user => user.public()));
  }, updateInterval);
}
