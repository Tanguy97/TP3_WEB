const express = require('express')
const async = require('async')

module.exports = (serviceProjects, servicePublication) => {
  const router = express.Router()

  // À COMPLÉTER
  router.get('/',(req,res,next)=>{
    serviceProjects.getProjects("fr")((err,projects)=>{
      if(err){
        if(req.app.locals.t['ERRORS']['PROJECTS_ERROR']!=undefined){
          res.status(500).json({errors: [req.app.locals.t['ERRORS']['PROJECTS_ERROR']]})
        }
        else{
          res.status(500).json({errors: [err.message]})
        }
      }
      else{
        if(projects===undefined){
          res.json([])
        }
        res.json(projects)
      }
    })
  })

  router.get('/:id',(req,res,next)=>{
    serviceProjects.getProjectById(req.app.locals.t)("fr")(req.params.id)((err,project)=>{
      if(err){
        if(err.name==='NOT_FOUND') {
          if(req.app.locals.t['ERRORS']['PROJECT_NOT_FOUND']!=undefined){
            res.status(404).json({errors: [req.app.locals.t['ERRORS']['PROJECT_NOT_FOUND']+req.params.id]})
          }
          else{
            res.status(404).json({errors: [err.message]})
          }
        }
        else{
          if(req.app.locals.t['ERRORS']['PROJECT_ERROR']!=undefined){
            res.status(500).json({errors: [req.app.locals.t['ERRORS']['PROJECT_ERROR']]})
          }
          else{
            res.status(500).json({errors: [err.message]})
          }
        }
      }
      else{
        res.json(project)
      }
    })
  })
  return router
}
