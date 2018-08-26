const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose')
mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track')

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

//new Schema
var Schema= mongoose.Schema;
var userSchema= new Schema({
  username: String
});
var exSchema= new Schema({
  userId:{type:String, required:true},
  description:{type:String, required:true},
  duration:{type: Number, required:true},
  date: Date
});

// models
var User= mongoose.model("User",userSchema);
var Exercise= mongoose.model("Exercise", exSchema);

// Not found middleware
// app.use((req, res, next) => {
//   return next({status: 404, message: 'not found'})
// })

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

//add user
app.post("/api/exercise/new-user",function(req, res){
    User.create({username:req.body.username}, function(err, data){
      res.json({username:req.body.username,_id:data._id});
    });
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
