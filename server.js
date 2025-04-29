
const express = require('express');
const app = express();
const PORT = 8080;

const bodyParser = require('body-parser')
const cognitoAuth = require('./services/cognito_auth')
const fileUpload = require('express-fileupload');

// Use environment variables in .env file
require('dotenv').config()

// Separated routes for each resource
const userRouter = require('./routes/user')
const recipeRouter = require('./routes/recipe')
const mealRouter = require('./routes/meal')
const journeyRouter = require('./routes/journey')
const bodyRouter = require('./routes/body')
const mindRouter = require('./routes/mind')
const imageRouter = require('./routes/image')
const fitnessRouter = require('./routes/fitness')




const baseRoute = process.env.NODE_ENV === 'production' ? '' : 'dev/'
const bpJsonOptions = {
    limit: '50mb',
    extended: true,
    verify: (req, _, buf) => {
        req.rawBody = buf
    },
}

app.use(bodyParser.json(bpJsonOptions)).use(
    bodyParser.urlencoded({ limit: '50mb', extended: true })
)
app.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    abortOnLimit: true,
}));



const cognitoAuthMiddleware = cognitoAuth.getVerifyMiddleware()


const cors = require('cors')

let allowedOrigins = []
if (process.env.NODE_ENV === 'production') {
    allowedOrigins = [
        'https://portal.floka.co',
        'https://myprogram.portal.floka.co',
        'https://www.floka.ca',
    ]
} else {
    allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:5173',
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5500",
        "https://cdpn.io",
        'https://www.floka.ca',
        'https://portal.floka.co',
        'https://myprogram.portal.floka.co',
        'http://test.portal.floka.co.s3-website.ca-central-1.amazonaws.com',
        'http://test2.portal.floka.co.s3-website.ca-central-1.amazonaws.com',
        'http://test3.portal.floka.co.s3-website.ca-central-1.amazonaws.com',
        'http://myprogram.portal.floka.co.s3-website.ca-central-1.amazonaws.com',
        'https://d3ljokk1y6gebi.cloudfront.net',
        'https://d3vyzhy51wcj5u.cloudfront.net',
        'https://d3bwvrv42ipfnh.cloudfront.net',
        'https://dtaun8i2n8few.cloudfront.net',
        'https://d1auorb79nfwel.cloudfront.net',
        'https://d2hz5d2116ynxs.cloudfront.net'
    ]
}

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin: Like mobile apps or curl requests
            if (!origin) return callback(null, true)

            if (allowedOrigins.indexOf(origin) === -1) {
                const msg =
                    'The CORS policy for this site does not allow access from the specified Origin.'
                return callback(new Error(msg), false)
            }

            return callback(null, true)
        },
    })
)


// Define a basic route
app.use(`/${baseRoute}user`, cognitoAuthMiddleware, userRouter)
   .use(`/${baseRoute}meal`, cognitoAuthMiddleware, mealRouter)
   .use(`/${baseRoute}fitness`, cognitoAuthMiddleware, fitnessRouter)
   .use(`/${baseRoute}recipe`, cognitoAuthMiddleware, recipeRouter)
   .use(`/${baseRoute}journey`, cognitoAuthMiddleware, journeyRouter)
   .use(`/${baseRoute}body`, cognitoAuthMiddleware, bodyRouter)
   .use(`/${baseRoute}mind`, cognitoAuthMiddleware, mindRouter)
   .use(`/${baseRoute}images`, cognitoAuthMiddleware, imageRouter)

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});