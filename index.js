const express = require('express')
const app = express()

let count="1";

app.get('/', (req, res) => {
  res.json({"changed" :count});
})

app.post("/uploadedFiles", (req, res) => {

  return res.send({"status" : "success"})

})

const background=function() {
    console.log('backgroung executed');
    setTimeout(background, 5000);
    count++;
}

background();