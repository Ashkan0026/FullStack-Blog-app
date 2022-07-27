const fsPromises = require('fs').promises
const express = require('express')

const handleGetReq = async (req,res) => {
    const firstData = await fsPromises.readFile('./database/blogs.json')
    const parsedData = JSON.parse(firstData)
    res.render('index', {blogs:parsedData})
}

const handlePostReq = async (req,res) => {

    if(!req.body.creator || !req.body.title || !req.body.text){
        res.status(404).json({msg:'Invalid post request, data is incomplete'})
        return ;
    }

    const newBlog = {
        creator : req.body.creator,
        title: req.body.title,
        text : req.body.text,
        date : new Date().toLocaleDateString(),
        comments : []
    }
    const data = await fsPromises.readFile('./database/blogs.json')
    const parsedData = JSON.parse(data)
    const newArr = [...parsedData, newBlog]
    await fsPromises.writeFile('./database/blogs.json', JSON.stringify(newArr))
}



module.exports = {handleGetReq, handlePostReq}