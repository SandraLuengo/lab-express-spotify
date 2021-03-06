const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

hbs.registerPartials(__dirname + '/views/partials');

const SpotifyWebApi = require('spotify-web-api-node');

const clientId = 'da9aa0e9ff6e4218b4da71958c55161f',
    clientSecret = '32d76dd61b624e938152360c256e7095';

const spotifyApi = new SpotifyWebApi({
    clientId: clientId,
    clientSecret: clientSecret
});


spotifyApi.clientCredentialsGrant()
    .then(function (data) {
        spotifyApi.setAccessToken(data.body['access_token']);
    }, function (err) {
        console.log('Something went wrong when retrieving an access token', err);
    });


app.get('/', (req, res, next) => {
    res.render('index');
});

app.get('/albums/:artistId', (req, res, next) => {
    let id = req.params.artistId;
    spotifyApi.getArtistAlbums(id)
        .then(data => {
            const albums = data.body.items;
            res.render('albums', { albums })
        })
        .catch(err => {
            console.error(err);
        })

});

app.get('/tracks/:albumId', (req, res, next) => {
    let id = req.params.albumId;
    spotifyApi.getAlbumTracks(id, { limit : 5, offset : 1 })
        .then(data => {
            
            const tracks = data.body.items;
            res.render('tracks', { tracks })
        })
        .catch(err => {
            console.error(err);
        })

});

app.post('/artists', (req, res, next) => {
    let artist = req.body.artist;
    spotifyApi.searchArtists(artist)
        .then(data => {

            const artists = data.body.artists.items;
            res.render('artists', { artists })
        })
        .catch(err => {
            console.log(`Error en el Seachr a la api ${err}`);
        })
})


app.listen(3000);