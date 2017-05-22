const express = require('express')
const path = require('path')
const app = express()

const PORT = process.env.PORT || 5000

// pug lyfe
app.set('view engine', 'pug')
app.set('views', __dirname + '/views')

// server static assets from /public
app.use('/public', express.static(path.join(__dirname, '/public')))

// routes
app.get('/temperature', (req, res) => {
	res.render('temperature-data');
})

// serve it up
app.listen(PORT, () => console.log(`Serving up something good at localhost:${PORT}...`))
