const express = require('express')

module.exports = serviceTeam => {
  const router = express.Router()

  // À COMPLÉTER
  router.get('/',(req,res,next)=>{
    serviceTeam.getTeamMembers((err,members)=>{
      req.app.locals.t
      if(err){
        if(t['ERRORS']['MEMBERS_ERROR']!= undefined)
          res.json({errors: [t['ERRORS']['MEMBERS_ERROR']]})
        else 
          err.message
      }
      res.json(members)
    })
  })
  return router
}
