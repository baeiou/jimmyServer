
function setApp(app,express) {
  app.use('/', express.static('public'));
}

module.exports = {
  setApp: setApp
}