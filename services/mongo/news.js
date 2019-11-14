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
  db.collection('news').find().toArray((err,res)=>{
    if (err) callback(err,null)
    else{
      const news = res
      .map(s => {
        const translatedText = getTranslation(language, s.text)
        const newCreatedAtDate = moment(s.createdAt, 'YYYY-MM-DD HH:mm:ss').toDate()
        return {
          ...s,
          text: translatedText,
          type: 'news',
          createdAt: newCreatedAtDate
        }
      })
      .filter(s => s.text.length>0)
      callback(null, news)
    }
  })
}

module.exports = db => {
  return {
    getNews: getNews(db)
  }
}
