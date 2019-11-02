const express = require('express')
const router = express.Router()
const request = require('request')
const moment = require('moment')

// À COMPLÉTER
router.get('/',(req,res,next)=>{
  const url = 'http://localhost:3000/api/feed'
  request.get(url,(err,resultat,body)=>{
     const feeds = JSON.parse(body)
     res.render('index.pug',{"feeds": feeds})
  })
})
module.exports = router
