const express = require('express')

module.exports = serviceTeam => {
  const router = express.Router()

  // À COMPLÉTER
  router.get('/',(req,res,next)=>{
    serviceTeam.getTeamMembers({})((err,members)=>{
      res.json(members)
    })
  })

  return router
}
