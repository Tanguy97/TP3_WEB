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
        if (req.app.locals.t['ERRORS']['PUBS_ERROR'] != undefined) {
          res.status(500).json({ errors: [req.app.locals.t['ERRORS']['PUBS_ERROR']] })
        }
        else {
          res.status(500).json({ errors: [err.message] })
        }
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
    let title = req.body.title
    let month = req.body.month
    let year = req.body.year
    let authors = req.body.authors
    let venue = req.body.venue

    if (title == undefined || month === undefined || year == undefined || authors == undefined || venue == undefined || publication==undefined)
      res.status(400).json({ errors:[ req.app.locals.t['ERRORS']['PUB_CREATE_ERROR']] })
    //error code 400 bad request
    else if (title.length < 5)
      res.status(400).json({ errors:[ req.app.locals.t['ERRORS']['PUB_AT_LEAST_5_CHAR_FORM'] ]})
    else if (month > 0 && month > 11)
      res.status(400).json({ errors: [req.app.locals.t['ERRORS']['MONTH_ERROR_FORM']] })
    else if (year.match(/[0-9]+/g))
      res.status(400).json({ errors:[ req.app.locals.t['ERRORS']['YEAR_NOT_INT_FORM']] })
    else if (venue.length < 5)
      res.status(400).json({ errors: [req.app.locals.t['ERRORS']['VENUE_AT_LEAST_5_CHAR_FORM']] })
    else if (est_vide(authors))
      res.status(400).json({ errors: [req.app.locals.t['ERRORS']['AUTHOR_EMPTY_ERROR']] })
    else {
      const publication = { title: title, month: month, year: year, authors: authors, venue: venue }

      servicePublication.createPublication(publication)((err, publications) => {

      if (err) {
        if (req.app.locals.t['ERRORS']['PUB_CREATE_ERROR'] != undefined) {
          res.status(500).json({ errors: [req.app.locals.t['ERRORS']['PUBS_ERROR']] })
        }
        else {
          res.status(500).json({ errors: [err.message] })
        }
      }
      else res.status(201).send()
      })
    }
    
  })

  router.delete('/:id', (req, res, next) => {
    servicePublication.getPublicationsByIds(req.params.id)((err, publication) => {
      if(publication===undefined)
        res.status(404).json({ errors: [req.app.locals.t['ERRORS']['PUBS_NOT_FOUND_ERROR']] })
    })
    servicePublication.removePublication(req.params.id)((err) => {
      if (err) {
        if (req.app.locals.t['ERRORS']['PUB_DELETE_ERROR'] != undefined) {
          res.status(500).json({ errors: [req.app.locals.t['ERRORS']['PUBS_ERROR']] })
        }
        else {
          res.status(500).json({ errors: [err.message] })
        }
      }
      else res.status(200).send()
  })
})
return router
}
