const express = require('express')

module.exports = serviceTeam => {
  const router = express.Router()

  // À COMPLÉTER
  router.get('/',(req,res,next)=>{
    serviceTeam.getTeamMembers((err,members)=>{
      if(err){
        if(req.app.locals.t['ERRORS']['MEMBERS_ERROR']!= undefined){
          res.status(500).json({errors: [req.app.locals.t['ERRORS']['MEMBERS_ERROR']]})
        }
        else{
          res.status(500).json(err.message)
        }
      }
      res.json(members)
    })
  })
  return router
}
