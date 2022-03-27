var express = require('express');
var app = express();
var upload = require("express-fileupload");
var fs = require('fs');
var bodyParser = require('body-parser');
//files
var pictures = require("./pictures");
var participants = require("./participants");
var settings = require("./settings");
//https
var https = require('https');
var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};
//styles
app.use('/public', express.static('public'));
//pug
app.set("view engine", "pug");
app.set("views", `./views`);
//body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//https server
var httpsServer = https.createServer(credentials, app);

//functions
//write to json file
function writeToJSON(file, object)
{
    let JSONfile = JSON.stringify(object);
    fs.writeFileSync(file, JSONfile);
}

app.get("/", (req, res) => {
    res.render("main", {
        pictures: pictures,
        settings: settings
    });
})

app.use(upload());

//upload a picture
app.post("/upload", (req, res, next) => {
    if(req.files)
    {
        const file = req.files.file;
        const filename = file.name;
        file.mv("./public/images/"+filename);
        const pathForURL = (`./public/images/${filename}`).replaceAll(" ", "%20");
        const newPicture = {id: pictures.length ? (parseInt(pictures[pictures.length - 1].id) + 1) : 1,src: pathForURL, author:req.body.author, title:req.body.title, desc: req.body.desc, price: req.body.price, isParticipate: req.body.isParticipate};
        pictures.push(newPicture);
        writeToJSON('./public/files/pictures.json', pictures);
        res.end(JSON.stringify(newPicture));
    }
    else
    {
        next();
    }
})

//delete a picture by id
app.post("/delete:id", (req, res, next) => {
    if(req.params.id)
    {
        let Index = pictures.map((picture)=>{
            return picture.id;
        }).indexOf(parseInt(req.body.id));
        fs.unlinkSync(pictures[Index].src.replaceAll("%20", " "));
        pictures.splice(Index, 1);
        writeToJSON('./public/files/pictures.json', pictures);
        res.end(JSON.stringify({msg:"success"}));
    }
    else
    {
        next();
    }
});

//edit a picture
app.post("/:id/edit", (req, res, next) => {
    if(req.params.id !== "settings")
    {
        const reqID = parseInt(req.params.id);
        let Index = pictures.map((picture)=>{
            return picture.id;
        }).indexOf(reqID);
        let pathForURL;
        if(req.files)
        {
            const file = req.files.file;
            let filename;
            filename = file.name;
            file.mv("./public/images/"+filename);
            pathForURL = (`./public/images/${filename}`).replaceAll(" ", "%20");
        }
        else
        {
            pathForURL = pictures[Index].src;
        }
        const newPicture = {id: reqID, src : pathForURL, author:req.body.author, title:req.body.title, desc: req.body.desc, price: req.body.price, isParticipate: req.body.isParticipate};
        pictures[Index] = newPicture;
        writeToJSON('./public/files/pictures.json', pictures);
        res.end(JSON.stringify(newPicture));
    }
    else
    {
        next();
    }
});

//go to picture by id
app.get("/:id", (req, res, next) => {
    let id = parseInt(req.params.id);
    let picture = null;
    for(let item of pictures)
    {
        if(item.id === id)
        {
            picture = item;
        }
    }
    if(picture !== null)
    {
        res.render("picture", {
            picture: picture
        });
    }
    else
    {
        next();
    }
});

/* participants */
app.get("/participants", (req, res) => {
    res.render("participants", {
        participants: participants
    });
});

//add
app.post("/participants/add", (req, res, next) => {
    if(req.body.name && req.body.money)
    {
        const body = req.body;
        const newParticipant = {id: participants.length ? ((participants[participants.length - 1].id) + 1) : 1, name: body.name, money: body.money};
        participants.push(newParticipant);
        writeToJSON("./public/files/participants.json", participants);
        res.end(JSON.stringify(newParticipant));
    }
    else
    {
        next();
    }
});

//delete
app.post("/participants/delete:id", (req, res, next) => {
   if(req.params.id)
   {
       const id = req.params.id;
       let Index = participants.map((participant)=>{
           return participant.id;
       }).indexOf(parseInt(id));
       participants.splice(Index, 1);
       writeToJSON("./public/files/participants.json", participants);
       res.end(JSON.stringify({msg:"success"}));
   }
   else
   {
       next();
   }
});

//edit
app.post("/participants/edit:id", (req, res, next) => {
    if(req.params.id)
    {
        const id = parseInt(req.params.id);
        let Index = participants.map((participant)=>{
            return participant.id;
        }).indexOf(id);
        participants[Index] = {id: participants[Index].id, name: req.body.name, money: req.body.money};
        writeToJSON("./public/files/participants.json", participants);
        res.end(JSON.stringify(req.body));
    }
    else
    {
        next();
    }
});

/* settings */
app.get("/settings", (req, res) => {
    res.end(JSON.stringify(settings));
})

app.post("/settings/edit", (req, res) => {
    settings = (req.body);
    writeToJSON("./public/files/settings.json", settings);
    res.end(JSON.stringify({msg:"success"}));
})

httpsServer.listen(443);

