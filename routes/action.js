var post=require("../utils/route.js");
var sysAction=require("../model/sysAction.js");
function  get(req, res) {
  sysAction.viewAction(req,res);
}
function postUpdate(req, res,data) {
  sysAction.updateAction(req,res,data);
}
function setApp(app) {
  app.get('/action', get);
  post.post(app,"/action/update",postUpdate);
}
module.exports = {
  setApp: setApp
}