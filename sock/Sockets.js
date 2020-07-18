const facebook = require("../fb/Facebook");
const path = require("path");
const updateInterval = 100; // every 100 ms we poll to update user coords
const updateAI = 100;
const messageTimeout = 5000; // How long to keep chat bubbles
let users = [];
class User {
  constructor(socket, name, image_uri){
    this.socket = socket;
    this.name = name;
    this.image_uri = image_uri;
    this.message = "";
    this.location = "";
    this.locationID = -1;
    this.x = 0; // change start coords later
    this.y = 0;
    this.messageTimeout = null;
    //this.profile = profile;
  }

  public(){
    return {
      socket_id: this.socket.id,
      name: this.name,
      image_uri: this.image_uri,
      location: this.location,
      locationID: this.locationID,
      x: this.x,
      y: this.y,
      message: this.message,
      //profile: this.profile,
    };
  }
}
// Create a general AI class. 
class AI extends User {
    constructor(x, y, name, image, waypoints) {
      super('', name, image);
      this.x = x;
      this.y = y;
      this.waypoints = waypoints; 
      this.currPos = 0;
      this.closeEnough = 10;
    }
    runAI() {
      let pos = this.waypoints[this.currPos];
      console.log('x');
      console.log(Math.abs(this.x - pos[0]));
      console.log('y');
      console.log(Math.abs(this.y - pos[0]))
      if (Math.abs(this.x - pos[0]) < this.closeEnough && Math.abs(this.y - pos[1]) < this.closeEnough) {
        this.currPos+=1;
        if (this.currPos >= this.waypoints.length) {
          this.currPos = 0;
        }
      } else {
        this.x += (pos[0] - this.x)/10;
        this.y += (pos[1] - this.y)/10;
      }
    }
}

let waypoints = [[3857,1796], [3805,2004], [4380,2121], [4406, 2030], [4170,1978], [4133,1908], [4247, 1755], [4091,1748]]
const frankie = new AI(4010, 1882, "Frankie","https://unswio.herokuapp.com/frankie.png", waypoints);
users.push(frankie);
console.log("Franky is ")
console.log(frankie);
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
        //user.profile= identity.profile; user_link requires app review
        console.log("The identity is...");
        console.log(identity);

        users.push(user);
        socket.emit("identified", identity);
    });
  });

  // we want to handle disconnect events before the socket object is sent to the shadow realm
  // handle disconnect
  socket.on("disconnect", (reason) =>{
    let index = users.findIndex(o => o.socket.id == socket.id);
    if(index < 0) return;
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
    // drop msg if over 400 characters 
    if(msg.length > 400) return; 
      
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
    setInterval(()=>{
      frankie.runAI();
      console.log(frankie);
    }, updateAI);
}
