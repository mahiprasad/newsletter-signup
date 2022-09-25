//jshint esverssion: 6
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
const port = process.env.PORT || 3000;
//-----------------------------------------------

//to use parsing of data from post req
app.use(bodyParser.urlencoded({ extended: true}));

//to use static local files on server
app.use(express.static("public"));

//to fetch html pages as a res
app.get('/', (req,res)=>{
    res.sendFile(__dirname + "/signup.html");
});

//this is where we play with data
app.post('/', (req,res)=>{
    const fname = req.body.fName;
    const lname = req.body.lName;
    const email = req.body.email;
    const data = {
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }

        ]
    };
    const jsonData = JSON.stringify(data);
    const url = "https://us14.api.mailchimp.com/3.0/lists/726ce6de46";
    const options = {
        method: "POST",
        //user:pass(api key)
        auth: "doge:<an api key here>"
    }
    const request = https.request(url, options, (response) => {

        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");}

        response.on("data", function(jdata){
            console.log(JSON.parse(jdata));
        })
    })
    request.write(jsonData);
    //when done with request
    request.end();
});

app.post('/failure', (req,res)=>{
    res.redirect("/");
});

//------------------------------------------------

app.listen(port, (req,res)=>{
    console.log("Server listening on port: " + port);
});




