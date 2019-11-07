const express = require('express')
const async = require('async')

module.exports = (serviceProjects, servicePublication) => {
  const router = express.Router()

  // À COMPLÉTER
  router.get('/',(req,res,next)=>{
    let langue = req.query.clang
    if(langue===undefined){
      langue = 'fr'
    }
    serviceProjects.getProjects(langue)((err,projects)=>{
      if(err){
        if(req.app.locals.t!=undefined){
          if(req.app.locals.t['ERRORS']['PROJECTS_ERROR']!=undefined){
            res.status(500).json({errors: [req.app.locals.t['ERRORS']['PROJECTS_ERROR']]})
          }
          else{
            res.status(500).json({errors: [err.message]})
          }
        }
        else{
          res.status(500).json({errors: [err.message]})
        }
      }
      else{
        if(projects===undefined){
          res.json([])
        }
        else{
          projects = projects.map(currentProject =>{
            const formatProject = {project: currentProject,publications: []}
            servicePublication.getPublicationsByIds(currentProject["publications"])((err,publications)=>{
              formatProject["publications"]=publications
            })
            return formatProject
          })
          res.json(projects)
        }
      }
    })
  })

  router.get('/:id',(req,res,next)=>{
    let langue = req.query.clang
    if(langue===undefined){
      langue = 'fr'
    }
    serviceProjects.getProjectById(req.app.locals.t)(langue)(req.params.id)((err,project)=>{
      if(err){
        if(err.name==='NOT_FOUND') {
          if(req.app.locals.t!=undefined){
            if(req.app.locals.t['ERRORS']['PROJECT_NOT_FOUND']!=undefined){
              res.status(404).json({errors: [req.app.locals.t['ERRORS']['PROJECT_NOT_FOUND']+req.params.id]})
            }
            else{
              res.status(404).json({errors: [err.message]})
            }
          }
          else{
            res.status(404).json({errors: [err.message]})
          }
        }
        else{
          if(req.locals.t!=undefined){
            if(req.app.locals.t['ERRORS']['PROJECT_ERROR']!=undefined){
              res.status(500).json({errors: [req.app.locals.t['ERRORS']['PROJECT_ERROR']]})
            }
            else{
              res.status(500).json({errors: [err.message]})
            }
          }
          else{
            res.status(500).json({errors: [err.message]})
          }
        }
      }
      else{
        const formatProject = {project: project,publications:[]}
        servicePublication.getPublicationsByIds(project["publications"])((err,publications)=>{
          formatProject["publications"]=publications
        })
        res.json(formatProject)
      }
    })
  })
  return router
}
