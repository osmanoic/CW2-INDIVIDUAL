const fs = require('fs');
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');

const app = express();

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

app.use(express.json());

MongoClient.connect('mongodb+srv://Osman:k3nya123@cluster0.fmq6x1k.mongodb.net', (error, client) => {
    db = client.db('COURSEWORK');
});

// show index.html in the site root folder
app.use(express.static("./"));

app.param('collectionName', (req, res, next, collectionName)=>{
    req.collection = db.collection(collectionName);
    return next();
});

// logger that prints requests to the conosle
app.use((req, res, next)=>{
    console.log('LOGGING: req URL: ' + req.url);
    return next();
});

// get route that returns lessons
app.get('/collection/:collectionName', (req, res, next)=>{
    req.collection.find({}).toArray((e, results) => {
        if (e) return next();
        res.send(results);
    });
});



app.listen(3000,()=>{
    console.log('Express.js server is running at localhost:3000')

});

// returns images from the static folder named 'static'
app.use((req, res, next)=>{
    const filePath = path.join(__dirname, 'static', req.url); 
    fs.stat(filePath, (error, fileInfo)=>{
        if(error){
            res.send('Error: requested image doesn\'t exist. Please check file name.');
            return;
        }

        if(fileInfo.isFile()){
            res.sendFile(filePath);
        } else {
            next();
        }
    });
});

