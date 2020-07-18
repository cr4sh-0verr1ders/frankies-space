
exports = module.exports = function(io){
    const updateInterval = 100; // every 100 ms we poll to update user coords 
    let users = [];
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

    


    // handle connection and setup other listeners
    io.on("connection", (socket) => {
        // broadcast new connection to other clients
        // by default, set their name to their socket id 
        
        // print socket id 
        console.log(`New connection: ${socket.id}`);
        
        // we push the user onto the stack with placeholder name and image uri, awaiting identification event
        users.push(new User(socket, socket.id, "/"));

        // handle the identification event
        socket.on("identify", (name, image_uri) => {
            console.log("Identification event"); 
            // probably replace with receiving a jwt and querying /me 

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
            io.emit("message", msg); 
        });

    });

    // Polling
    setInterval(() => {
        let data = []; 
        users.forEach(user =>{
            data.push(user.public()); // push coords of every user 
        });
        //console.log(data);
        io.emit("update", data); 
    }, updateInterval);
}

 


