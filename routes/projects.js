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

router.get('/:id',(req,res,next)=>{
  const id = req.params.id
  const url = 'http://localhost:3000/api/projects/' + id
  request.get(url,(err,resultat,body)=>{
    if(err){
      next(err)
    }
    const project= JSON.parse(body)
    res.render('project.pug',{"project": project.project,"publications": project.publications})
  })
})
module.exports = router
