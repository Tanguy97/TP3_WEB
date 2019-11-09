const MongoClient = require('mongodb').MongoClient
const yaml = require('js-yaml')
const fs = require('fs')
const config = require('./config.json')
const moment = require('moment')
const client = new MongoClient(config['dbUrl'], {useNewUrlParser: true})

async function main(){
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
    const newsYaml = yaml.safeLoad(fs.readFileSync('./data/news.yml', 'utf8'))
    const news = newsYaml.map(s => {
      const newCreatedAtDate = moment(s.createdAt, 'YYYY-MM-DD HH:mm:ss').toDate()
      return {
        ...s,
        text: {fr: s.text.fr, en: s.text.en},
        type: 'news',
        createdAt: newCreatedAtDate
      }
    })
    await db.collection('news').insertMany(news)
    console.log('Collection news créée')

    //Création de la collection seminars


  } catch (err) {
    console.log(err.stack)
  }
  //Fermeture de la connexion
  client.close();
  console.log('Disconnected')
}

main()
