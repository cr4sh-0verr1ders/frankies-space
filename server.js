const express = require("express");
const app = express();
var cors = require("cors");
const path = require("path");
const router = express.Router();
const mongoose = require("mongoose");
const port = process.env.PORT || 8080; // export in commandline.
const UserController = require("./user/UserController");
// yay sockets
const http = require("http").createServer(app); 
const io = require("socket.io")(http);
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
app.use(express.static(path.join(__dirname, 'resources')))
app.use("/api/auth", UserController);
app.get("/frankie", (req, res)=>{
    res.sendFile(path.join(__dirname, "resources", "frankie.png"));
})
app.get("/clancy", (req, res)=> {
    res.sendFile(path.join(__dirname, "resources", "clancy.png"))
})
app.get('*', (req,res) =>{
    res.sendFile(path.join(path.join(__dirname,"client", "build","index.html")));
});
//router.get('/', (req, res) => res.sendFile(path.join(__dirname,"test-react-app", "public","index.html")))
//app.use('/', router);


//app.listen(port, ()=> console.log("Server is listening on port " + port));

http.listen(port, () => {
    console.log(`Listening on ${port}`);
});
