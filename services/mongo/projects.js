const { getTranslation } = require('../utils')
const ObjectId = require('mongodb').ObjectId

/**
 * Fonction de rappel pour récupérer les projets
 *
 * @callback projectsCallback
 * @param {Error} err - Objet d'erreur
 * @param {Array} results - Tableaux de projets
 */

/**
 *  Obtenir les projets.
 *
 *  @param db - Base de données Mongo
 *  @param {string} language - Langue courante (p.ex. 'fr', 'en', etc.)
 *  @param {projectsCallback} callback - Fonction de rappel pour obtenir le résultat
 */
const getProjects = db => language => callback => {
  db.collection('projects').find().toArray((err,proj)=>{
    if(err) callback(err,null)
    else{
      const projects = proj.map(project => {
        const translatedTitle = getTranslation(language, project.title)
        const translatedDescription = getTranslation(language, project.description)
        return {
          ...project,
          title: translatedTitle,
          description: translatedDescription,
          publications: (project.publications === undefined) ? [] : project.publications
        }
      })
    callback(null, projects)
    }
  })
}

/**
 * Fonction de rappel pour récupérer un projet particulier
 *
 * @callback projectCallback
 * @param {Error} err - Objet d'erreur
 * @param {Object} result - Un projet particulier
 */

/**
 *  Obtenir un projet selon un identificatn.
 *
 *  @param db - Base de donnée Mongo
 *  @param {Object} translationObj - Objet qui contient l'ensemble des traductions définies
 *  @param {string} language - Langue courante (p.ex. 'fr', 'en', etc.)
 *  @param {int} id - Identificant unique du projet à trouer
 *  @param {projectCallback} callback - Fonction de rappel pour obtenir le résultat
 */
const getProjectById = db => translationObj => language => id => callback => {
  // À COMPLÉTER
  db.collection('projects').findOne({_id: id},(err,res)=>{
    console.log(err,res)
    if(err) callback(err,null)
    else if (res==null) callback({name:'NOT_FOUND'},null)
    else{
      const translatedTitle = getTranslation(language, res.title)
      const translatedDescription = getTranslation(language, res.description)
      const project = {
        ...res,
        title: translatedTitle,
        description: translatedDescription,
        publications: (res.publications === undefined) ? [] : res.publications
      }
      callback(null,project)
    }
  })
}

module.exports = db => {
  return {
    getProjects: getProjects(db),
    getProjectById: getProjectById(db)
  }
}
