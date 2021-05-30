const { Router } = require('express');
const router = Router();

router.get('/courses', (req, res) => {
  const collection = router.db.courses;

  collection.find({}).toArray((err, data) =>{
      if(err) return console.log(err);
      res.send(data)
  });
})

module.exports = router;