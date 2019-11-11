const MongoClient = require('mongodb').MongoClient
const yaml = require('js-yaml')
const fs = require('fs')
const config = require('./config.json')
const moment = require('moment')
const client = new MongoClient(config['dbUrl'], {useNewUrlParser: true})

const initDb = async function(){
  try {
    //Connection à la base de donnée
    await client.connect()
    console.log('Connected to database')
    const db = client.db(config['dbName'])

    //Supression des collections existantes
    const oldCollections = await db.listCollections().toArray()
    if(oldCollections.length>0){
      oldCollections.map(collection => {
        db.collection(collection['name']).drop((err,res)=>{if (err) throw err })
      })
    }
    console.log('Anciennes collections supprimées')

    //Création de la collection news
    await db.createCollection('news')
    const news = yaml.safeLoad(fs.readFileSync('./data/news.yml', 'utf8'))
    await db.collection('news').insertMany(news)
    console.log('Collection news créée')

    //Création de la collection seminars
    await db.createCollection('seminars')
    const seminars = yaml.safeLoad(fs.readFileSync('./data/seminars.yml', 'utf8'))
    await db.collection('seminars').insertMany(seminars)
    console.log('Collection seminars créée')

    //Création de la collection members
    await db.createCollection('members')
    const members = yaml.safeLoad(fs.readFileSync('./data/team.yml', 'utf8'))
    await db.collection('members').insertMany(members)
    console.log('Collection members créée')

    //Création de la collection publication
    await db.createCollection('publications')
    const publications = yaml.safeLoad(fs.readFileSync('./data/publications.yml', 'utf8'))
    await db.collection('publications').insertMany(publications)
    console.log('Collection publications créée')

    //Création de la collection projects
    await db.createCollection('projects')
    const projectsBadId = yaml.safeLoad(fs.readFileSync('./data/projects.yml', 'utf8'))
    const projects = await Promise.all(projectsBadId.map(async project=>{
      if(project['publications']!=undefined){
        try{
          project['publications'] = await Promise.all(project['publications'].map(async key =>{
            try{
              const id = await db.collection('publications').findOne({key: key},{projection: {_id: 1}})
              return id['_id']
            }catch(err) {
              console.log(err.stack)
            }
          }))
        }catch(err) {
          console.log(err.stack)
        }
      }
      return project
    }))
    await db.collection('projects').insertMany(projects)
    console.log('Collection projects créée')

    //Suppression des key de publication
    await db.collection('publications').updateMany({},{$unset:{key:""}})

    console.log("Database ready")
    return db
  } catch (err) {
    console.log(err.stack)
  }
}

module.exports = {
  initDb: initDb
}
