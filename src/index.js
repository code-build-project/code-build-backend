const express = require('express');
const mongoClient = require('./mongoDb/mongoClient');

let courses = require('./routes/courses')

const PORT = process.env.PORT || 4000;

const app = express();


app.use(courses)


app.get('/', function(req, res) {
	const collection = dbmovies;
    collection.find({}).toArray(function(err, data){
        if(err) return console.log(err);
        res.send(data)
    });
});

mongoClient.connect().then(() => {
  console.log('Вроде тут тож прошло')
  app.listen(PORT, '127.0.1.1');
  console.log('Сервер запустился...')
})

// mongoClient.connect((err, database) => {
//   if(err) return console.log(err);
//   app.listen(PORT, '127.0.1.1');
//   console.log("Сервер запустился...");
//   dbmovies = database.db("todos").collection("todos");
//   courses.db = {
//     courses: database.db("todos").collection("todos")
//   }
//   console.log(courses);
// });