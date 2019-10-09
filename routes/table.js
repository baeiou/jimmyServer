var sysTable=require("../model/sysTable.js");
sysTable.init();
sysTable.initFieldType();
function setApp(app) {
  app.get('/table/search',sysTable.searchTable);
  app.get('/table/getFields',sysTable.getFields);
  app.get('/table/getFieldType',sysTable.getFieldType);
}
module.exports = {
  setApp:setApp
}