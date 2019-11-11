const express = require('express')
const async = require('async')

module.exports = servicePublication => {
  const router = express.Router()

  // À COMPLÉTER
  router.get('/', (req, res, next) => {
    let page = req.query.page
    let limit = req.query.limit
    let order_by = req.query.order_by
    let sort_by = req.query.sort_by
    if (page === undefined) page = 1
    if (limit === undefined) limit = 10
    if (order_by === undefined) order_by = "desc"
    if (sort_by === undefined) sort_by = "date"
    else if (sort_by === "date") {
      var sorting_tab = [[publications.year, sort_by], [publications.month, sort_by]]
    }
    else if (sort_by === "title") {
      var sorting_tab = [[publications.title, sort_by]]
    }

    servicePublication.getPublications({ pageNumber: page, limit: limit, sorting: sorting_tab })((err, publications) => {
      if (err) {
        if(req.app.locals.t!==undefined && req.app.locals.t['ERRORS'] !==undefined && req.app.locals.t['ERRORS']['PUBS_ERROR'] !==undefined){
          res.status(500).json({ errors: [req.app.locals.t['ERRORS']['PUBS_ERROR']] })
        }
        else res.status(500).json({ errors: [err.message] })
      }

      else {
        servicePublication.getNumberOfPublications((err,numberPublication)=>{
          if(numberPublication===0) res.json({count:0, publications:[]})
          else res.json({count:numberPublication,publication:publications})
        })
      }

    })
  })

  const est_vide = function (arr) {
    if (arr.find(x => x.length == 0) != undefined) {
      return true
    }
    else return false
  }

  router.post('/', (req, res, next) => {
    let title
    let month
    let year
    let authors
    let venue
    let error=[]
    if(req.body!=undefined){
      title = req.body.title
      month = req.body.month
      year = req.body.year
      authors = req.body.authors
      venue = req.body.venue
      if (title == undefined && month === undefined && year == undefined && authors == undefined && venue == undefined ){
        if(req.app.locals.t!==undefined && req.app.locals.t['ERRORS'] !==undefined && req.app.locals.t['ERRORS']['PUB_CREATE_ERROR'] !==undefined){
          error.push(req.app.locals.t['ERRORS']['PUB_CREATE_ERROR'])
        }
        else error.push('PUB_CREATE_ERROR')
      }

      if (title===undefined||title.length < 5 ){
        if(req.app.locals.t!==undefined && req.app.locals.t['ERRORS'] !==undefined && req.app.locals.t['ERRORS']['PUB_AT_LEAST_5_CHAR_FORM'] !==undefined){
          error.push(req.app.locals.t['ERRORS']['PUB_AT_LEAST_5_CHAR_FORM'])
        }
        else error.push('PUB_AT_LEAST_5_CHAR_FORM')
      }

      if (month===undefined||(month < 0 || month > 11)||month.toString().match(/[0-9]+/g)===null  ){

        if(req.app.locals.t!==undefined && req.app.locals.t['ERRORS'] !==undefined && req.app.locals.t['ERRORS']['MONTH_ERROR_FORM'] !==undefined){
          error.push(req.app.locals.t['ERRORS']['MONTH_ERROR_FORM'])
        }
        else error.push('MONTH_ERROR_FORM')
      }

      if( year===undefined ||year.toString().match(/[0-9]+/g)===null ){
        if(req.app.locals.t!==undefined && req.app.locals.t['ERRORS'] !==undefined && req.app.locals.t['ERRORS']['YEAR_NOT_INT_FORM'] !==undefined){
          error.push(req.app.locals.t['ERRORS']['YEAR_NOT_INT_FORM'])
        }
        else error.push('YEAR_NOT_INT_FORM')
      }

      if (venue===undefined  || venue.length < 5){
        if(req.app.locals.t!==undefined && req.app.locals.t['ERRORS'] !==undefined && req.app.locals.t['ERRORS']['VENUE_AT_LEAST_5_CHAR_FORM'] !==undefined){
          error.push(req.app.locals.t['ERRORS']['VENUE_AT_LEAST_5_CHAR_FORM'])
        }
        else error.push('VENUE_AT_LEAST_5_CHAR_FORM')
      }

      if (authors==undefined ||est_vide(authors)  ||  authors.length==0){
        if(req.app.locals.t!==undefined && req.app.locals.t['ERRORS'] !==undefined && req.app.locals.t['ERRORS']['AUTHOR_EMPTY_FORM'] !==undefined){
          error.push(req.app.locals.t['ERRORS']['AUTHOR_EMPTY_FORM'])
        }
        else error.push('AUTHOR_EMPTY_FORM')
      }
      
      if (error.length!=0){
        res.status(400).json({ errors:error })
      }
      else{
        const publication = { title: title, month: month, year: year, authors: authors, venue: venue }
        servicePublication.createPublication(publication)((err, publications) => {
        if (err){
          if(req.app.locals.t!==undefined && req.app.locals.t['ERRORS'] !==undefined && req.app.locals.t['ERRORS']['PUB_CREATE_ERROR'] !==undefined){
            res.status(500).json({ errors:[ req.app.locals.t['ERRORS']['PUB_CREATE_ERROR']] })
          }
          else res.status(500).json({ errors: [err.message] })
        }
        else res.status(201).json(publications)
        })
      }
      
    }
    else { 
      if(req.app.locals.t!==undefined && req.app.locals.t['ERRORS'] !==undefined && req.app.locals.t['ERRORS']['EMPTY_PUBLICATION_FORM'] !==undefined){
        res.status(400).json({ errors:[ req.app.locals.t['ERRORS']['EMPTY_PUBLICATION_FORM']] })
      }
      else res.status(400).json({ errors: ['ERROR3_PUB_CREATE_ERROR!!!!!'] })
    }
  })
  router.delete('/:id', (req, res, next) => {
    servicePublication.removePublication(req.params.id)((err) => {
      if (err) {
        if(err.name==='NOT_FOUND'){
          if (req.app.locals.t!= undefined && req.app.locals.t['ERRORS']!= undefined && req.app.locals.t['ERRORS']['PUB_DELETE_ERROR'] != undefined) {
            res.status(404).json({errors: [req.app.locals.t['ERRORS']['PUB_DELETE_ERROR']]})
          }
          else res.status(404).json({errors: [err.message]})
        }
        else{
          if (req.app.locals.t!= undefined && req.app.locals.t['ERRORS']!= undefined && req.app.locals.t['ERRORS']['PUB_DELETE_ERROR'] != undefined) {
            res.status(500).json({ errors: [req.app.locals.t['ERRORS']['PUB_DELETE_ERROR']] })
          }
          else {
            res.status(500).json({ errors: [err.message] })
          }
        }
      }
      else res.status(200).send('done')
    })
  })
  return router
}
