const moment = require('moment')
const mongodb = require('mongodb')

/**
 * Fonction de rappel pour récupérer le nombre total de publications
 *
 * @callback numPublicationsCallback
 * @param {Error} err - Objet d'erreur
 * @param {Number} size - Nombre total de publications
 */

/**
 *  Obtenir le nombre total de publications
 *
 *  @param db - Base de données Mongo
 *  @param {numPublicationsCallback} callback - Fonction de rappel pour obtenir le résultat
 */
const getNumberOfPublications = db => callback => {
  // À COMPLÉTER
  db.collection('publications').find((err,publication)=>{
    if (err) callback(err, null)
    else callback(null, publication.length)
  })
}

/**
 * Fonction de rappel pour récupérer les publications.
 *
 * @callback publicationsCallback
 * @param {Error} err - Objet d'erreur
 * @param {Array} results - Tableau de publications
 */

/**
 *  Obtenir toutes les publications.
 *
 *  @param db - Base de données Mongo
 *  @param pagingOpts - Base de données Mongo
 *  @param {Object} pagingOpts - Options de pagination au format suivant:
 *    {
 *      pageNumber: <Number>,
 *      limit: <Number>,
 *      sort: [ [ <FIELDNAME>, <asc|desc> ], [ <FIELDNAME>, <asc|desc> ], ...]
 *    }
 *  @param {publicationsCallback} callback - Fonction de rappel pour obtenir le résultat
 */
const getPublications = db => pagingOpts => callback => {
  // À COMPLÉTER
  db.collection('publications').find((err, publication) => {
    if (err) {
      callback(err, null)
    } else {
      publication.sort(comparePublications(pagingOpts))
        .map(publication => {
          return {
            ...publication,
            month: (publication.month === undefined) ? undefined : moment().month(publication.month - 1).format('MMMM')
          }
        })

      if (pagingOpts === undefined || pagingOpts.pageNumber === undefined || pagingOpts.limit === undefined) {
        callback(null, publications)
      } else {
        const startIndex = (pagingOpts.pageNumber - 1) * pagingOpts.limit
        const endIndex = startIndex + pagingOpts.limit
        const topNPublications = publications.slice(startIndex, endIndex)
        callback(null, topNPublications)
      }
    }
  })
}

/**
 * Fonction de rappel pour obtenir la publication créée.
 *
 * @callback createdPublicationCallback
 * @param {Error} err - Objet d'erreur
 * @param {Object} result - Publication créée
 */

/**
 *  Création d'une publication dans la BD.
 *
 *  @param db - Base de données Mongo
 *  @param publication - Publication à ajouter dans la BD
 *  @param {createdPublicationCallback} callback - Fonction de rappel pour obtenir la publication créée
 */
const createPublication = db => publication => callback => {
  // À COMPLÉTER
  db.collection('publications').insert(publication,(err,publication)=>{
    if(err) callback(err,null)
    else callback(null,publication)
  })
}

/**
 *  Supprimer une publication avec un ID spécifique
 *
 *  @param db - Base de données Mongo
 *  @param id - Identificant à supprimer de la BD
 *  @param callback - Fonction de rappel qui valide la suppression
 */
const removePublication = db => id => callback => {
  // À COMPLÉTER
  db.collection('publications').remove({_id:id},(err)=>{
    if(err) callback(err)
    else callback(null)
  })
}

/**
 * Fonction de rappel pour récupérer les publications d'un projet.
 *
 * @callback projectPublicationsCallback
 * @param {Error} err - Objet d'erreur
 * @param {Array} result - Publications d'un projet
 */

/**
 *  Obtenir l'ensemble des publications d'un projet
 *
 *  @param db - Base de données Mongo
 *  @param {Array} pubIds - Publication ids
 *  @param {projectPublicationsCallback} callback - Fonction de rappel pour obtenir le résultat
 */
const getPublicationsByIds = db => pubIds => callback => {
  // À COMPLÉTER
  getPublications(fs)(undefined)((err, publications) => {
    if (err) {
      callback(err, null)
    } else {
      callback(null, publications.filter(publication => pubIds.includes(publication._id)).sort((p1, p2) => p1.year < p2.year ? 1 : -1))
    }
  })
}

module.exports = db => {
  return {
    getPublications: getPublications(db),
    createPublication: createPublication(db),
    removePublication: removePublication(db),
    getPublicationsByIds: getPublicationsByIds(db),
    getNumberOfPublications: getNumberOfPublications(db)
  }
}
