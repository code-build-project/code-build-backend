const MongoClient = require("mongodb").MongoClient;

const uri = "mongodb+srv://code-build:code-build@cluster0.3bdan.mongodb.net/todos";

// useUnifiedTopology: true - оно указывает, что надо использовать единую топологию драйвера для node.js.
const mongoClient = new MongoClient(uri,{ useNewUrlParser: true, useUnifiedTopology: true });


module.exports = {
  connect: () => {
    return new Promise((resolve, reject) => {
      mongoClient.connect((err, database) => {
        if(err) return reject(err);
        resolve('Норм')
        console.log("К базе подключился...");
      });
    })
  }
};