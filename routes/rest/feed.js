const express = require('express')

module.exports = serviceFeed => {
  const router = express.Router()

  // À COMPLÉTER
  router.get('/',(req,res,next)=>{
    let langue = req.query.clang
    if(langue===undefined){
      langue = 'fr'
    }
    const date = new Date('2019-09')
    serviceFeed.getFeeds(date)(langue)((err,feeds)=>{
      if(err){
        if(req.app.locals.t!=undefined && req.app.locals.t['ERRORS']!=undefined && req.app.locals.t['ERRORS']['FEEDS_ERROR']!=undefined){
          res.status(500).json({errors: [req.app.locals.t['ERRORS']['FEEDS_ERROR']]})
        }
        else{
          res.status(500).json({errors: [err.message]})
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
