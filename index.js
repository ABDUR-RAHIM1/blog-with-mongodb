const express = require('express')
const mongoose = require("mongoose")
const bodyParser = require('body-parser')
const app = express()
const port = 8000
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const mongoURL = `mongodb+srv://abrar:3NUfKV42ivL3fxNm@cluster0.ekd31bu.mongodb.net/admin1?retryWrites=true&w=majority`;

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    post: {
        type: String,
        required: true
    },
    CreateDate: {
        type: Date,
        default: Date.now
    }
})

const myBlog = new mongoose.model("myBlog", blogSchema)

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

app.post("/addPost", (req, res) => {
    const blog = req.body;
    const newPost = new myBlog({
        title: blog.title,
        post: blog.post
    })
    newPost.save()
        .then(result => {
            // res.send("post Successfull")
            res.redirect('/');
        })
})

app.get("/post", (req, res) => {
    myBlog.find()
        .then(result => {
            res.send(result)
        })
        .catch(error => {
            console.log("Error", error)
        })
})

app.delete("/postDelete/:id", (req, res) => {
    const id = req.params.id
    myBlog.findByIdAndDelete(id)
    .then((result)=>{
        res.redirect('/'); 

    })
    .catch(err => console.log("error", err))
})

//  connect mongoDB database 

const connectDb = async () => {
    try {
        await mongoose.connect(mongoURL)
        console.log("mongodb is Connect ")
    } catch (error) {
        console.log("Connection problem on your server", error)
    }
}

app.listen(port, async () => {
    console.log(`app listening on port : http://localhost:${port}`)
    await connectDb()
})