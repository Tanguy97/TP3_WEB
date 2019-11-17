const express = require('express')
const router = express.Router()
const moment = require('moment')
const request = require('request')


// À COMPLÉTER
const renderPublication =  (req, res, next) => {
  let error = []
  if (req.errors!==undefined ) error=req.errors['errors']
  let publication
  let page = req.query.page
  let limit = req.query.limit
  let order_by = req.query.order_by
  let sort_by = req.query.sort_by
  if (req.post || !page) page = 1
  if (!limit) limit = 10
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
    const pageOpt = { "pageNumber": page, "limit": limit,'sortBy':sort_by,'orderBy':order_by }
    const numPage = Math.ceil(count/ limit)
    const month = moment.months()
    res.render('publication.pug', { "publications": publication, "pubFormErrors": error, "pagingOptions": pageOpt, "numberOfPages": numPage, "monthNames": month })
  })
}
router.get('/',renderPublication)

router.post('/',(req, res, next) => {
  const url = 'http://localhost:3000/api/publications'
  const option = {
    url:url,
    form:req.body
  }
  req.post=true;
  request.post(option, (err, resultat, body) => {
    if (err) {
      next(err)
    }
    if(resultat.statusCode===400){
      error = JSON.parse(body)
      req.errors = error
    }
    next()
  })
},renderPublication)

module.exports = router
