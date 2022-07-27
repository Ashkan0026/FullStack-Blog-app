const bodyParser = require('body-parser')
const fsPromises = require('fs').promises
const express = require('express')
const app = express()
const {handleGetReq, handlePostReq} = require('./controllers/controllers')

const PORT = process.env.PORT || 3700

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.set('view engine', 'ejs')


app.get('/', (req,res) => {
    handleGetReq(req,res)
})

app.post('/', (req,res) => {
    console.log('on post request')
    handlePostReq(req,res)
    handleGetReq(req,res)
})

app.get('/form', (req,res) => {
    res.render('form')
})

app.get('/about', (req,res) => {
    res.render('about')
})

const blogs = require('./database/blogs.json')
for(let i = 0;i<blogs.length;i++){
    app.get(`/${blogs[i].creator.toLowerCase().split(' ')[0].trim()}`, (req,res) => {
        res.render('blog', {blog:blogs[i]})
    })
}

for(let i = 0;i<blogs.length;i++){
    app.post(`/${blogs[i].creator.toLowerCase().split(' ')[0].trim()}`, (req,res) => {
        if(!req.body.person || !req.body.comment){
            res.status(404).redirect('/')
        }
        let newComment = {
            person : req.body.person,
            comment : req.body.comment
        }
        blogs[i].comments.push(newComment)
        fsPromises.writeFile('./database/blogs.json', JSON.stringify(blogs))
        res.render('blog',{blog:blogs[i]})
    })
}

app.listen(PORT,() => console.log('App is running on port '+PORT))