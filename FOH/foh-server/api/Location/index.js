/*jshint esversion: 6 */

const express = require('express')
const locationRouter = express.Router()
const db = require('../../models')
const { Location } = db

locationRouter.post('/', ( req, res ) => {
  Location.all(
    {
      where: {
        locationName : req.body.locationName
      }
    }
  )
    .then((locationList) => {
      if(locationList.length > 0){
        res.json(locationList)
      }
      else {
        Location.create(
          {
            locationName: req.body.locationName
          } )
        .then(location => {
          res.json(location)
        })
      }
    })
    .catch( err => {
      res.json(err)
    })
})

module.exports = locationRouter





// equipment.put('/:id', (req,res) => {
//   let path = req.path.split('/')[1];
//   Equipment.update({
//     name: req.body.name,
//     type: req.body.type,
//     cost: req.body.cost
//   },  {
//       where: {
//         id: path
//       }
//     })
//     .then(data => {
//       res.send('posted');
//     });
// });