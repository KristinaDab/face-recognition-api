const Clarifai = require("clarifai");

// Add apiKey from your Clarifai API account (https://docs.clarifai.com/api-guide/api-overview)
// After deployment apiKey is added on heroku site setting for extra security
// therefore it needs to be accessed with process.env.API_CLARIFAI
const app = new Clarifai.App({
  apiKey: process.env.API_CLARIFAI,
});

const handleApiCall = (req, res) => {
  app.models.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
  .then(data => {
    res.json(data);
  })
  .catch(err => res.status(400).json('unable to work with API'))
}

// Update user image entries

const handleImage = (req, res, db) => {
  const { id } = req.body;

  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0]);
    })
    .catch((err) => res.status(400).json("unable to get entries"));
};

module.exports = {
  handleImage: handleImage,
  handleApiCall: handleApiCall
};
