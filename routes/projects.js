const express = require('express')
const router = express.Router()
const request = require('request')

// À COMPLÉTER
router.get('/',(req,res,next)=>{
  const url = 'http://localhost:3000/api/projects'
  request.get(url,(err,resultat,body)=>{
    if(err){
      next(err)
    }
    const projects = JSON.parse(body).map(val=>val["project"])
    res.render('projects.pug',{"projects": projects})
  })
})
module.exports = router
