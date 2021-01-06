const { MONGODB , API_KEY } = require('./config.js');
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const {register} = require('./controllers/registeration');



app.use(bodyParser.json());

app.get('/register' , (req,res, next)=>{
    res.sendFile(path.join(__dirname+'/static/register.html'));
})


app.post( '/register', register);


mongoose.connect(MONGODB , {
  useNewUrlParser: true,
	useUnifiedTopology: true,
}).then(()=>{
  console.log("Connected!");
  app.listen(3000);
}).catch(err=>console.log(err));
