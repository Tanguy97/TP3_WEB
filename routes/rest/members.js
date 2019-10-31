const express = require('express')

module.exports = serviceTeam => {
  const router = express.Router()

  // À COMPLÉTER
  router.get('/',(req,res,next)=>{
    serviceTeam.getTeamMembers((err,members)=>{
      if(err){
<<<<<<< HEAD
        if(t!= undefined)
          res.json({errors: [t['ERRORS']['MEMBERS_ERROR']]})
        else 
          err.message
=======
        if(req.app.locals.t['ERRORS']['MEMBERS_ERROR']!= undefined){
          res.status(500).json({errors: [req.app.locals.t['ERRORS']['MEMBERS_ERROR']]})
        }
        else{
          res.status(500).json({errors: [err.message]})
        }
>>>>>>> b68e6cf3a153e5534db8a392504293d8503210fa
      }
      else{
        res.json(members)
      }
    })
  })
  return router
}
