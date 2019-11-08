const express = require('express')

module.exports = serviceTeam => {
  const router = express.Router()

  // À COMPLÉTER
  router.get('/',(req,res,next)=>{
    serviceTeam.getTeamMembers((err,members)=>{
      if(err){
        if(req.app.locals.t!=undefined && req.app.locals.t['ERRORS']!= undefined && req.app.locals.t['ERRORS']['MEMBERS_ERROR']!= undefined){
          res.status(500).json({errors: [req.app.locals.t['ERRORS']['MEMBERS_ERROR']]})
        }
        else{
          res.status(500).json({errors: [err.message]})
        }
      }
      else{
        res.json(members)
      }
    })
  })
  return router
}
