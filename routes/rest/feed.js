const express = require('express')

module.exports = serviceFeed => {
  const router = express.Router()

  // À COMPLÉTER
  router.get('/',(req,res,next)=>{
    serviceFeed.getFeeds({})({})((err,feeds)=>{
      if(err){
        if(req.app.locals.t['ERRORS']['FEEDS_ERROR']!=undefined){
          res.status(500).json({errors: [req.app.locals.t['ERRORS']['FEEDS_ERROR']]})
        }
        else{
          res.status(500).json({errors: err.message})
        }
      }
      else{
        if(feeds===undefined){
          res.json([])
        }
        else{
          res.json(feeds)
        }
      }
    })
  })
  return router
}
