/**
 * Fonction de rappel pour récupérer les membres du laboratoire.
 *
 * @callback teamCallback
 * @param {Error} err - Objet d'erreur
 * @param {Array} results - Tableau de membres
 */

const getTeamMembers = db => callback => {
  // À COMPLÉTER
  const content=db.collection('team').find()
  const team= ((content === null) ? [] : content)
    .map(s => {
      sort((m1, m2) => {
        if (m1.lastname === m2.lastname) {
          return (m1.firstname < m2.firstname) ? -1 : (m1.firstname > m2.firstname) ? 1 : 0
        } else {
          return (m1.lastname < m2.lastname) ? -1 : 1
        }
      })
    callback(null, team)
  })
}

module.exports = db => {
  return {
    getTeamMembers: getTeamMembers(db)
  }
}
