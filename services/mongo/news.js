const moment = require('moment')
const { getTranslation } = require('../utils')

/**
 * Fonction de rappel pour récupérer les nouvelles
 *
 * @callback newsCallback
 * @param {Error} err - Objet d'erreur
 * @param {Array} results - Tableaux de nouvelles
 */

/**
 *  Obtenir les nouvelles.
 *
 *  @param db - Base de données Mongo
 *  @param {string} language - Langue courante (p.ex. 'fr', 'en', etc.)
 *  @param {newsCallback} callback - Fonction de rappel pour obtenir le résultat
 */
const getNews = db => language => callback => {
  // À COMPLÉTER
<<<<<<< HEAD
  db.collection('news').find((err,news)=>{
    if (err)  callback(err, null)
    else{
      news.map(s => {
        const translatedText = db.collection('news').find({},{"text.language":1})
=======
  db.collection('news').find().toArray((err,res)=>{
    if (err) callback(err,null)
    else{
      const news = res.map(s => {
        const translatedText = getTranslation(language, s.text)
>>>>>>> e02a25633077709777c9d8dff0b541e409d8b978
        const newCreatedAtDate = moment(s.createdAt, 'YYYY-MM-DD HH:mm:ss').toDate()
        return {
          ...s,
          text: translatedText,
          type: 'news',
          createdAt: newCreatedAtDate
        }
      })
<<<<<<< HEAD
    callback(null, news)
    }
  }).toArray()
=======
      callback(null, news)
    }
  })
>>>>>>> e02a25633077709777c9d8dff0b541e409d8b978
}

module.exports = db => {
  return {
    getNews: getNews(db)
  }
}
