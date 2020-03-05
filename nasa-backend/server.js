// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
// Database Client
const client = require('./lib/client');
// Services

// Auth
const ensureAuth = require('./lib/auth/ensure-auth');
const createAuthRoutes = require('./lib/auth/create-auth-routes');
const request = require('superagent');
// Application Setup
const app = express();

app.use(morgan('dev')); // http logging
app.use(cors()); // enable CORS request
app.use(express.json()); // enable reading incoming json data

app.use(express.urlencoded({ extended: true }));


const authRoutes = createAuthRoutes({
    async selectUser(username) {
        const result = await client.query(`
            SELECT id, username, hash
            FROM users
            WHERE username = $1;
        `, [username]);
        return result.rows[0];
    },
    async insertUser(user, hash) {
        const result = await client.query(`
            INSERT into users (username, hash)
            VALUES ($1, $2)
            RETURNING id, username;
        `, [user.username, hash]);
        return result.rows[0];
    }
});




// setup authentication routes
app.use('/api/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api/me', ensureAuth);


// get the api by character name
app.get('/api/nasa', async(req, res) => {
    try {
        const data = await request.get(`https://eonet.sci.gsfc.nasa.gov/api/v2.1/events`);
        console.log(data);
        res.json(data.body);
    } catch (e) {
        console.error(e);
    }

});

app.get('/api/categories/:query', async(req, res) => {
    try {
        const data = await request.get(`https://eonet.sci.gsfc.nasa.gov/api/v2.1/categories/${req.params.query}`);
        //call responded with a buffer so data had to be passed through a buffer and parsed to get data.
        // const buff = new Buffer(data.body);
        res.json(data.body);
    } catch (e) {
        console.error(e);
    }

});

// get the favorites
app.get('/api/me/favorites', async(req, res) => {
    try {
        const myQuery = `
            SELECT * FROM favorites
            WHERE user_id=$1`;

        const favorites = await client.query(myQuery, [req.userId]);

        res.json(favorites.rows);
    } catch (e) {
        console.error(e);
    }

});

// add a new favorite
app.post('/api/me/favorites', async(req, res) => {
    try {
        const newFavorite = await client.query(`
            INSERT INTO favorites (title, date, user_id)
            values ($1, $2, $3)
            RETURNING *
        
        `, [req.body.title, req.body.date, req.userId]);

        res.json(newFavorite.rows[0]);

    } catch (e) {
        console.error(e);
    }

});

// delete a favorite
app.delete('/api/me/favorites/:id', async(req, res) => {
    // get the id that was passed in the route:

    try {
        const result = await client.query(`
            DELETE from favorites 
            WHERE id=$1
            RETURNING *
        `, [req.params.id]);


        res.json(result.rows[0]);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
});


app.listen(process.env.PORT, () => {
    console.log('listening at ', process.env.PORT);
});