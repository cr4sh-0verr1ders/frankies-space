const facebook = require("../fb/Facebook");

const updateInterval = 100; // every 100 ms we poll to update user coords
const messageTimeout = 5000; // How long to keep chat bubbles
let users = [];

class User {
  constructor(socket, name, image_uri){
    this.socket = socket;
    this.name = name;
    this.image_uri = image_uri;
    this.message = "";
    this.x = 0; // change start coords later
    this.y = 0;
    this.messageTimeout = null;
  }

  public(){
    return {
      socket_id: this.socket.id,
      name: this.name,
      image_uri: this.image_uri,
      x: this.x,
      y: this.y,
      message: this.message,
    };
  }
}

function setupConnection(io, socket) {
  // broadcast new connection to other clients
  // by default, set their name to their socket id

  // we push the user onto the stack with placeholder name and image uri, awaiting identification event
  let user = new User(socket, socket.id, "/")

  // print socket id
  console.log(`New connection: ${socket.id}`);

  // handle the identification event
  socket.on("identify", (token) => {
    console.log("Identification event");
    // grab the facebook auth token and get a name and image uri
    facebook.identify(token,function(identity){
        user.name = identity.name;
        user.image_uri = identity.uri;
        console.log(identity);

        users.push(user);
        socket.emit("identified", identity);
    });
  });

  // we want to handle disconnect events before the socket object is sent to the shadow realm
  // handle disconnect
  socket.on("disconnect", (reason) =>{
    let index = users.findIndex(o => o.socket.id == socket.id);
    // emit an event incase we want to do a disconnect animation or something
    // io.emit("user_disconnect", {x: user.x, y: user.y});
    //console.log(`Socket ${socket.id} (name: ${users[index].name}) disconnected: ${reason}`);

    // pop from stack
    users.splice(index, 1);
  });

  socket.on("position", (pos) => {
    // Update position
    user.x = pos.x;
    user.y = pos.y;
  });

  // handle chat message
  socket.on("message", (msg) => {
    // get relevant user
    if(user.messageTimeout) clearTimeout(user.messageTimeout);
    console.log(`Message from ${socket.id}: ${msg}`);
    user.message = msg;
    user.messageTimeout = setTimeout(() => {
      user.message = "";
      socket.emit("clearmessage");
    }, messageTimeout + 50 * msg.length);
  });
}

exports = module.exports = function(io){
    // handle connection and setup other listeners
    io.on("connection", socket => setupConnection(io, socket));

    // Polling
    setInterval(() => {
        io.emit("update", users.map(user => user.public()));
        // console.log(users); 
    }, updateInterval);
}
