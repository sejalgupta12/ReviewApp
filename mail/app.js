const nodemailer = require('nodemailer');
const OAuth2 = require('OAuth2');
const express=require('express');
const logger=require('morgan');
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017';
let DB;
MongoClient.connect(url, function(err, client) {

    console.log(err)

    DB = client.db("Review");

})


app.use(logger());
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));



app.use(session({
    secret: 'drtfgyuhinj'
}));



var sess;
app.get('/', function(req, res) {
    sess = req.session;

    if (sess.email) {
        res.redirect('/dashboard');
    } else {
        res.redirect('/login');
    }

})


app.post("/register", function(req, res) {
    let task = req.body;

    var query = { email: task.email };
    DB.collection("user").find(query).toArray(function(err, result) {
        if (err) throw err;

        if (!result.length) {
            DB.collection("user").insertOne(task, function(err, r) {
                res.json(r);
            })
        } else console.log("Email id already registered");


    });





})




app.post("/login", function(req, res) {

    sess = req.session;
    let detail = req.body;

    var query = { email: detail.email, password: detail.password };
    DB.collection("user").find(query).toArray(function(err, result) {
        if (err) throw err;

        if (result.length) {


            sess.email = req.body.email;
            console.log(sess.email);
            console.log(result);



            res.json(sess.email);


        } else console.log("Invalid User");


    });

})

app.post("/dashboard", function(req, res) {

    req.session.destroy(function(err) {
        if (err) {
            console.log("Rrrrruuuuuuuuuuuuuuuuuuuuuuuuuu");
            console.log(err);
        } else {
            // res.redirect('./');
            res.json("logout");
        }
    });
})




const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'sejalgupta218@gmail.com',
    clientId: '918216903443-4b9j06fdg4gkg7qevi5ti679osdde5pf.apps.googleusercontent.com',
      clientSecret: 'BkvKe1nGElyewerM7gXERKa-',
      refreshToken: '1/0n0j7L8dTqWyf5aO4ZiHpQH-R_wqoz0tibVIdn4JLCk',
       accessToken: 'ya29.GlvsBaj4r0d-RSiw6nrInfenX-7dKptMuovkjhPCQ7OTRrkZjR5GJEy6V3pBS9l2pmItTz3E0xRf68osQfUTNfFMz5WnU57A5GMu5g1m8nnXw-mWGRYCFo5ziHQa'
    },
    tls:{
        rejectUnauthorized:false
    }
  });

    // let mailOptions = {
    //     from: '"sejal" <sejalgupta218@gmail.com>', // sender address
    //     to: 'rishigargabu@gmail.com', // list of receivers
    //     subject: 'Nodemailer', // Subject line
    //     text: 'hello rishi', // plain text body
    // };

    // // send mail with defined transport object
    // transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //         return console.log(error);
    //     }
    //     console.log('Message sent');
      
    // });






    app.post('/send',function(req,res){
        console.log("Send api called");
        rand=Math.floor((Math.random() * 100) + 54);
    host=req.get('host');
    link="http://"+req.get('host')+"/verify?id="+rand;
    mailOptions={
        to : req.body.email,
        subject : "Please confirm your Email account",
        html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
    }
    console.log(mailOptions);
    transporter.sendMail(mailOptions, function(error, response){
     if(error){
            console.log(error);
        res.end("error");
     }else{
            console.log("Message sent: " + response.message);
        res.json("sent");
         }
});
});


app.get('/verify',function(req,res){
    console.log(req.protocol+":/"+req.get('host'));
    if((req.protocol+"://"+req.get('host'))==("http://"+host))
    {
        console.log("Domain is matched. Information is from Authentic email");
        if(req.query.id==rand)
        {
            console.log("email is verified");
            res.end("<h1>Email "+mailOptions.to+" is been Successfully verified");
        }
        else
        {
            console.log("email is not verified");
            res.end("<h1>Bad Request</h1>");
        }
    }
    else
    {
        res.end("<h1>Request is from unknown source");
    }
    });
    





    app.listen(8080,function(){
        console.log("server started");
    });