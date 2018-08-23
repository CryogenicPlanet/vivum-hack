var port = process.env.PORT; // Port of server

//Libraries
var getenv = require('getenv'); // Library for Enviroment Variables, Used for Db Conn
var mysql = require('promise-mysql'); // Mysql Library, With Node Promises
var sha512 = require('sha512'); // Sha512 Library, Sha512 is a hash
var bodyParser = require('body-parser'); // Library for parsing data
var jsonParser = bodyParser.json(); // Using Data type Json
var cors = require("cors"); // Library for handling access headers
const spawn = require("child_process").spawn;
var randomstring = require("randomstring");
var multer = require('multer');

var express = require('express'); // Framework for Node
var app = express(); // Establishing Express App
app.use(express.logger());
app.use(cors()); // Cors to Handle Url Authentication 
app.use(bodyParser.json()); // Using Body Parser
var server = app.listen(port); // Set Port

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, 'temp.png') //Appending .jpg
    }
});

var upload = multer({ storage: storage });

var con = null;
mysql.createConnection({
    host: getenv('IP'),
    user: getenv('C9_USER'),
    password: "",
    database: "c9"
}).then(function(connection) { con = connection });

app.get("/attendance", async function(req, res) {
    var users = [];

    function newUser(uuid, name, timestamp, boolean) {
        return {
            "Uuid": uuid,
            "Name": name,
            "Timestamp": timestamp,
            "Attendance": boolean
        }
    }
    let date = new Date();
    var data = await con.query(`SELECT * FROM Attendance ORDER BY Timestamp DESC LIMIT 10`);
    console.log(data);
    for (var instance of data) {
        var [name] = await con.query(`SELECT * FROM Users WHERE UUID = "${instance.User}"`); //query WHERE user.User
        let tempUser = newUser(instance.User, name.Name, instance.Timestamp, instance.Boolean);
        users.push(tempUser);
    }
    console.log(users);
    res.status(200).json({
        users: users
    });
});

var type = upload.single('media');
app.post("/postImage", type,function(req, res,next) {
    var imgfile = req.file;
    console.log(imgfile);
    res.send("Dumbass");
});
