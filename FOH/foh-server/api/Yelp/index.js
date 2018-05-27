/*jshint esversion: 6*/
const yelp = require('yelp-fusion')
const client = require('../protection/private.json')
const express = require('express')
const Router  = express.Router()
const clientId = client.clientId
const clientSecret = client.clientSecret
//const {searchYelp} = require('../yelp');
let result = ""
let paused = false

function searchYelp (serachCriteria)  {
  console.log(serachCriteria)
  usedNumbers =[]
  paused = true
  console.log('searching')
  return yelp.accessToken(clientId, clientSecret).then(response => {
    const client = yelp.client(response.jsonBody.access_token)

    client.search(serachCriteria).then(response => {
      const resultLength = response.jsonBody.businesses.length
      let resultNumber = Math.floor(Math.random() * resultLength)
      if(usedNumbers.indexOf(resultNumber) < 0){
        if(usedNumbers.indexOf(resultNumber))
        const firstResult = response.jsonBody.businesses[resultNumber]
        const prettyJson = JSON.stringify(firstResult, null, 4)
        result = prettyJson
        console.log(result)
        paused = false
      } else {
        searchYelp({
          term : req.body.searchBar,
          location: req.body.searchLocation,
        })
      }
    })
  }).catch(e => {
    console.log(e)
  })
}

Router.post('/', ( req, res ) =>{
  searchYelp({
    term : req.body.searchBar,
    location: req.body.searchLocation,
    price : req.body.searchPrice
  })
  waitForIt()
  function waitForIt(){
        if (paused) {
          console.log('waiting')
            setTimeout(function(){waitForIt()},100)
        } else {
          console.log('sending')
            res.send({result})
        }
  }
})

module.exports = Router
