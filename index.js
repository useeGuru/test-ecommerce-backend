const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');
const dotenv = require('dotenv');

const userRoutes = require('./routes/user');
const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();

// Parse the body text
app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// Error
app.use((req, res) => {
  res.status(404).json({
    message: 'Error serving the request !'
  });
});

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });


// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
// const checkJwt = auth({
//   audience: '{yourApiIdentifier}',
//   issuerBaseURL: `https://{yourDomain}/`,
// });

// // This route doesn't need authentication
// app.get('/api/public', function(req, res) {
//   res.json({
//     message: 'Hello from a public endpoint! You don\'t need to be authenticated to see this.'
//   });
// });

// // This route needs authentication
// app.get('/api/private', checkJwt, function(req, res) {
//   res.json({
//     message: 'Hello from a private endpoint! You need to be authenticated to see this.'
//   });
// });

// const checkScopes = requiredScopes('read:messages');

// app.get('/api/private-scoped', checkJwt, checkScopes, function(req, res) {
//   res.json({
//     message: 'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.'
//   });
// });

// app.listen(3000, function() {
//   console.log('Listening on http://localhost:3000');
// });

