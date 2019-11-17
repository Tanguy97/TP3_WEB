const moment = require('moment')
const { getTranslation } = require('../utils')

/**
 * Fonction de rappel pour récupérer les séminaires
 *
 * @callback seminarCallback
 * @param {Error} err - Objet d'erreur
 * @param {Array} result - Séminaires
 */

/**
 *  Obtenir l'ensemble des séminaires.
 *
 *  @param db - Base de données Mongo
 *  @param {Object} query - Requête particulière sous le format suivant:
 *    { from: <DATE>, sort: { field: <string>, order: <ASC|DESC> } }
 *  @param {string} language - Langue courante (p.ex. 'fr', 'en', etc.)
 *  @param {seminarCallback} callback - Fonction de rappel pour obtenir le résultat
 */
const getSeminars = db => query => language => callback => {
  // À COMPLÉTER
  const sort={}
  if(query.sort!=undefined){
    sort[query.sort.field]=1
    if (query.sort.order==='DESC') sort[query.sort.field]=-1
  }
  else sort['createdAt']=1
  db.collection('seminars').find({}).sort(sort).toArray(((err,sem)=>{
    if(err) {
      callback(err,null)
    }
    else {
      const seminars = sem.map(s=>{
        const translatedTitle = getTranslation(language, s.title)
        const translatedDescription = getTranslation(language, s.description)
        const newDate = moment(s.date, 'YYYY-MM-DD HH:mm:ss').toDate()
        const newCreatedAtDate = moment(s.createdAt, 'YYYY-MM-DD HH:mm:ss').toDate()
        return {
          ...s,
          title: translatedTitle,
          description: translatedDescription,
          type: 'seminar',
          date: newDate,
          createdAt: newCreatedAtDate
        }
      })
      if (query !== undefined && query.from !== undefined) {
        callback(null,seminars.filter(s => s.date > query.from))
      } else {
        callback(null,seminars)
      }
    }
  }))
}

module.exports = db => {
  return {
    getSeminars: getSeminars(db)
  }
}
