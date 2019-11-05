const express = require('express')
const router = express.Router()
const request = require('request')

// À COMPLÉTER
router.get('/',(req,res,next)=>{
  const url = 'http://localhost:3000/api/members'
  request.get(url,(err,resultat,body)=>{
    if(err){
      next(err)
    }
    const team = JSON.parse(body)
    res.render('team.pug',{"members": team})
  })
})
module.exports = router
