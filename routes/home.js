const express = require('express')
const router = express.Router()
const request = require('request')
const moment = require('moment')

// À COMPLÉTER
const changeLang = (req,res,next)=>{
  let langue = req.query.clang
  if(langue===undefined){
    langue='fr'
  }
  moment.locale(langue)
  next()
}

router.get('/',changeLang,(req,res,next)=>{
  const langue = moment.locale()
  const url = 'http://localhost:3000/api/feed?clang='+langue
  request.get(url,(err,resultat,body)=>{
     const feeds = JSON.parse(body)
     res.render('index.pug',{"feeds": feeds})
  })
})
module.exports = router
