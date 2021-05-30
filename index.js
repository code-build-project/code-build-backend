const express = require('express');
const MongoClient = require("mongodb").MongoClient;

let courses = require('./routes/courses')

const PORT = process.env.PORT || 4000;

const app = express();


app.use(courses)


const mongoClient = new MongoClient(
  "mongodb+srv://code-build:code-build@cluster0.3bdan.mongodb.net/todos",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

let dbmovies;

app.get('/', function(req, res) {
	const collection = dbmovies;
    collection.find({}).toArray(function(err, data){
        if(err) return console.log(err);
        res.send(data)
    });
});

mongoClient.connect((err, database) => {
  if(err) return console.log(err);
  app.listen(PORT, '127.0.1.1');
  console.log("Сервер запустился...");
  dbmovies = database.db("todos").collection("todos");
  courses.db = {
    courses: database.db("todos").collection("todos")
  }
  console.log(courses);
});