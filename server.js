const express = require("express");
const app = express();
var cors = require("cors");
const path = require("path");
const router = express.Router();
const mongoose = require("mongoose");
const port = 8080; // export in commandline.
const UserController = require("./user/UserController");
// yay sockets
const http = require("http").createServer(app); 
const io = require("socket.io")(http);
io.set('transports', ['websocket']);
// sockets export 
const sock = require("./sock/Sockets")(io); 
const databaseURL = "mongodb+srv://dbUser:dbpassword@main-db.oblp1.mongodb.net/testdb?retryWrites=true&w=majority"

app.use(cors());
mongoose.connect(databaseURL, function(err, db){
    if (err){
        console.log("Unable to connect to the database");
    } else {
        console.log("Established a connection to the database")
    }
})
app.use(express.static(path.join(__dirname,'client', "build")))
app.use("/api/auth", UserController);
app.get('*', (req,res) =>{
    res.sendFile(path.join(path.join(__dirname,"client", "build","index.html")));
});
//router.get('/', (req, res) => res.sendFile(path.join(__dirname,"test-react-app", "public","index.html")))
//app.use('/', router);


//app.listen(port, ()=> console.log("Server is listening on port " + port));

http.listen(port, () => {
    console.log(`Listening on ${port}`);
});
