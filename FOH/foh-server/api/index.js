/*jshint esversion: 6 */
const express = require('express')
const Router  = express.Router()

Router.use('/Location', require('./Location'))

module.exports = Router