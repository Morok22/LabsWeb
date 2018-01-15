var ObjectID = require('mongodb').ObjectID;
var _dirname = 'D:/laba10';
module.exports = function(app, db) {
  app.get('/', (req, res) => {
    res.sendFile(_dirname + '/index.html');
  });
  app.get('/admin.html', (req, res) => {
    res.sendFile(_dirname + '/admin.html');
  });
  app.get('/contacts.html', (req, res) => {
    res.sendFile(_dirname + '/contacts.html');
  });
  app.get('/coments.html', (req, res) => {
    res.sendFile(_dirname + '/coments.html');
  });

  app.get('/news.html', (req, res) => {
    res.sendFile(_dirname + '/news.html');
  });
  app.get('/plan.html', (req, res) => {
    res.sendFile(_dirname + '/plan.html');
  });
};