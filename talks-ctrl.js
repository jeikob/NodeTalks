var Sequelize = require('sequelize');

module.exports.getTalks = function(req, res) {
  var sequelize = connectToServer();
  var talksModel = sequelize.import(__dirname + "/talks-model.js");
  loadTalks(talksModel, res);
};

module.exports.createTalk = function(req, res) {
  var sequelize = connectToServer();
  var talksModel = sequelize.import(__dirname + "/talks-model.js");

  // write the new talk to the server
  return talksModel.sync().then(() => {
    // create an instance of the model and save to the db
    talksModel.create({name: req.body.name, type: req.body.type, desc: req.body.desc}, {
      fields: ['id', 'name', 'type', 'desc']
    }).then(data => {
      // reload the talks
      loadTalks(talksModel, res);
    });
  });
};

// Send a SELECT query to the database and return the response as JSON
function loadTalks(model, res) {
  return model.findAll({
    attributes: ['id', 'name', 'type', 'desc']
  }).then(result => {
    return res.json(result);
  });
}

function connectToServer() {
  return new Sequelize('database', 'username', 'password', {
    dialect: 'sqlite',
    storage: './talks.db'
  });
}