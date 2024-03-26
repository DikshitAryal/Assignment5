const express = require("express");
const path = require("path");
const data = require("./Modules/collegeData.js");
const bodyParser = require('body-parser');

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get("/about", (req,res) => {
    res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/htmlDemo", (req,res) => {
    res.sendFile(path.join(__dirname, "/views/htmlDemo.html"));
});

app.get("/students", (req, res) => {
    if (req.query.course) {
        data.getStudentsByCourse(req.query.course).then((data) => {
            res.json(data);
        }).catch((err) => {
            res.json({ message: "no results" });
        });
    } else {
        data.getAllStudents().then((data) => {
            res.json(data);
        }).catch((err) => {
            res.json({ message: "no results" });
        });
    }
});

app.get("/student/:studentNum", (req, res) => {
    data.getStudentByNum(req.params.studentNum).then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json({message:"no results"});
    });
});

app.get("/tas", (req,res) => {
    data.getTAs().then((data)=>{
        res.json(data);
    });
});

app.get("/courses", (req,res) => {
    data.getCourses().then((data)=>{
        res.json(data);
    });
});

// GET /addStudent
app.get("/addStudent", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "addStudent.html"));
});

// POST /addStudent
app.post("/addStudent", (req, res) => {
    data.addStudent(req.body)
        .then(() => {
            res.redirect("/students");
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: "Internal Server Error" });
        });
}); 

app.use((req,res)=>{
    res.status(404).send("Page Not Found");
});

data.initialize().then(function(){
    app.listen(HTTP_PORT, function(){
        console.log("app listening on: " + HTTP_PORT)
    });
}).catch(function(err){
    console.log("unable to start server: " + err);
});
