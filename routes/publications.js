const express = require('express')
const router = express.Router()
const moment = require('moment')
const request = require('request')


// À COMPLÉTER
router.get('/', (req, res, next) => {
  let error = []
  let publication
  let page = req.query.page
  let limit = req.query.limit
  let order_by = req.query.order_by
  let sort_by = req.query.sort_by
  if (page === undefined) page = 1
  if (limit === undefined) limit = 10
  if (order_by === undefined) order_by = "desc"
  if (sort_by === undefined) sort_by = "date"
  const url = 'http://localhost:3000/api/publications'+'?limit='+limit+'&page='+page+'&sort_by='+sort_by+'&order_by='+order_by
  request.get(url, (err, resultat, body) => {
    if (err) {
      error = JSON.parse(body)
      next(err)
    }
    publication = JSON.parse(body)["publication"]
    const count = JSON.parse(body)["count"]
    if (sort_by === undefined) sort_by = "date"
    else if (sort_by === "date") {
      var sorting_tab = [[publication.year, sort_by], [publication.month, sort_by]]
    }
    else if (sort_by === "title") {
      var sorting_tab = [[publication.title, sort_by]]
    }
    const pageOpt = { "pageNumber": page, "limit": limit, "sorting": sorting_tab }
    const numPage = Math.ceil(count/ limit)
    const month = moment.months()
    res.render('publication.pug', { "publications": publication, "pubFormErrors": error, "pagingOptions": pageOpt, "numberOfPages": numPage, "monthNames": month })
  })
})

router.post('/', (req, res, next) => {
  const url = 'http://localhost:3000/api/publications'
  request.post(url, (err, resultat, body) => {
    if (err) {
      error = JSON.parse(body)
      next(err)
    }
  })
})

module.exports = router
