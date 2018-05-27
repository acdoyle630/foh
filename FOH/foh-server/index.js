/*jshint esversion: 6*/

//server
const express = require('express')
const app = express()
const PORT = process.env.PORT || 8000
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const db = require('./models')
const { User } = db
const KEY = 'key'

//User Auth
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

//password hashing
const saltRounds = 10
const bcrypt = require('bcrypt')

app.use(cookieParser())
app.use(bodyParser.json({extended: true}))

//startup Session
app.use(session({
  secret: 'letTheRythmJust',
  name: KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {},
}))


//set up passport
app.use(passport.initialize())
app.use(passport.session())


passport.use(new LocalStrategy (
  function(username, password, done) {
    console.log('RUN BEFORE SERIALZING')
    User.findOne({
      where: {
        username: username
      }
    })
    .then ( user => {
      console.log('testing user')
      if (user === null) {
        console.log('USER AUTH FAILED')
        return done(null, false, {message: 'bad username'})
      }
      else {
        console.log('username found')
        bcrypt.compare(password, user.password)
        .then(res => {
          console.log('user name and pw okay')
          if (res) { return done(null, user) }
          else {
            console.log('password bad')
            return done(null, false, {message: 'bad password'})
          }
        })
      }
    })
    .catch(err => {
      console.log('error: ', err)
    })
  }
))

passport.serializeUser(function(user, done) {
  console.log("ENTERED SERIALIZE")
  console.log('SERIALIZE', user)
  done(null, {
    id: user.id,
    username: user.username,
  })
})

// is not deserializing user in produdtion == cannot get req.user == cannot search events in database by user_id ----
// deserial works in development

passport.deserializeUser(function(user, done) {
  console.log('DESERIALIZE' , user)
  done(null, user)
})

app.use('/api', require('./api'))

app.post('/login', (req, res) => {
  console.log(req.body)
  passport.authenticate('local', (err, user) => {
    console.log('ENTERED AUTHETICATE')
    if (err) return res.json({ err })

    if (!user) return res.json({ message: 'invalid' })

    req.logIn(user, (error) => {
      if (err) return res.json({ error })

      return res.json({ username: user.username })
    })
  })(req, res)
})

app.get('/logout', function(req, res){
  console.log('LOGOUT')
  req.logout()
  res.json({successLogOut: true})
})

app.listen(PORT, () =>{
  console.log(`server listening on port: ${PORT}`)
  //db.sequelize.sync({forceSync: true})
})