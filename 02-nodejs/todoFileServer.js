const express = require("express")
const fs = require("fs")
const app = express()

const bodyParser = require("body-parser")
app.use(bodyParser.json())

const fileRead = (req, res, next) => {
    fs.readFile("todos.json", "utf-8", (err, data) => {
        if (err) {
            res.status(500).send();
            return;
        }
        req.data = JSON.parse(data);
        next();
    });
}

app.get("/todos", fileRead, (req, res) => {
    res.status(200).json(req.data);
})

app.get("/todos/:id", fileRead, (req, res) => {
    let todo = req.data.find(i=>i.id===parseInt(req.params.id));
    if(!todo){
        res.status(404).send();
    }
    res.status(200).json(todo);
})

app.post("/todos", fileRead, (req, res) => {
    let todo = {
        "id": Math.ceil(Math.random()*10000),
        "title": req.body.title,
        "description": req.body.description
    }
    req.data.push(todo);
    fs.writeFile("todos.json", JSON.stringify(req.data), (err) => {
        if(err){
            res.status(404).json();
            return;
        }
        res.status(201).json(todo);
    })
})

app.put("/todos/:id", fileRead, (req, res) => {
    let id = parseInt(req.params.id)
    for(let i=0;i<req.data.length;i++){
        if(req.data[i].id===id){
          req.data[i].title = req.body.title;
          req.data[i].description = req.body.description;
          fs.writeFile("todos.json", JSON.stringify(req.data), (err) => {
            if(err){
                res.status(404).send();
                return
            }
            res.status(200).json(req.data[i]);
            return;
          })
        }
    }
})

app.delete("/todos/:id", fileRead, (req, res) => {
    const id = parseInt(req.params.id);
    for(let i=0;i<req.data.length;i++){
      if(req.data[i].id===id){
        req.data.splice(i ,1);
        fs.writeFile("todos.json", JSON.stringify(req.data), (err) => {
            if(err){
                res.status(404).send();
                return;
            }
            res.status(200).send();
            return;
        })
      }
    }
})

app.use((req, res) => {
    res.status(404).send('Not Found');
});

module.exports = app;