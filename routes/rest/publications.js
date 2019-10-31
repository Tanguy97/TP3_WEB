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
      if(publications===undefined){
        res.json([])
      }
      else res.json(publications)

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
    const publication = { title: title, month: month, year: year, authors: authors, venue: venue }
    servicePublication.createPublication(publication)((err, publications) => {
      //error code 400 bad request
      if (title == undefined || month === undefined || year == undefined || authors == undefined || venue == undefined)
        res.status(500).send({ errors: req.app.locals.t['ERRORS']['PUB_CREATE_ERROR'] })
      if (title.length < 5)
        res.status(400).send({ errors: req.app.locals.t['ERRORS']['PUB_AT_LEAST_5_CHAR_FORM'] })
      if (month > 0 && month > 11)
        res.status(400).send({ errors: req.app.locals.t['ERRORS']['MONTH_ERROR_FORM'] })
      if (year > 0)
        res.status(400).send({ errors: req.app.locals.t['ERRORS']['YEAR_NOT_INT_FORM'] })
      if (venue.length < 5)
        res.status(400).send({ errors: req.app.locals.t['ERRORS']['VENUE_AT_LEAST_5_CHAR_FORM'] })
      if (est_vide(authors))
        res.status(400).send({ errors: req.app.locals.t['ERRORS']['PUB_CREATE_ERROR'] })
      if (err) {
        if (req.app.locals.t['ERRORS']['’PUB_CREATE_ERROR'] != undefined) {
          res.status(500).send({ errors: [req.app.locals.t['ERRORS']['PUBS_ERROR']] })
        }
        else {
          res.status(500).send({ errors: [err.message] })
        }
      }
      else res.status(201).send(publication)
    })
  })
  return router
}
