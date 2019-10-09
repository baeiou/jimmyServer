const knex = require("../utils/conn.js");
var tableCache = [];
var fieldType = [];

function init(callback, req, res, kw) {
  knex.select("ST02", "ST03", "ST04", "ST05", "ST07", "ST08").from(
      'sys_table').then(function (table) {
    tableCache = table;
    console.log("tableCache finish");
    if (typeof(callback) != "undefined") {
      callback(req, res, kw);
    }
  }).catch(function (err) {
    console.log(err);
    res.status(500).send('DATABASE ERROR: ' + err.message);
  });
}

function searchTable(req, res) {
  kw = req.query.kw;
  if (tableCache.length == 0) {
    init(_searchTable, req, res, kw);
  } else {
    _searchTable(req, res, kw);
  }
}

function _searchTable(req, res, kw) {
  var result = [];
  if (typeof(kw) != "undefined" && kw != "") {
    kw = kw.toLowerCase();
    for (var i = 0; i < tableCache.length; i++) {
      if ((tableCache[i].ST03.toLowerCase().indexOf(kw) > -1)
          || (tableCache[i].ST04.toLowerCase().indexOf(kw) > -1)) {
        obj = {};
        obj.label = tableCache[i].ST03 + " " + tableCache[i].ST04
        obj.value = tableCache[i].ST03;
        obj.db = tableCache[i].ST02;
        obj.type = tableCache[i].ST07;
        obj.primaryKey = tableCache[i].ST05;
        obj.lastModifyTime = tableCache[i].ST08;
        result.push(obj);
      }
    }
    res.json(result);
  } else {
    result.push({label: "", value: ""});
    res.json(result);
  }
}

function getFields(req, res) {
  var tableName = req.query.kw;
  var type = req.query.type;
  knex('sys_field')
  .leftJoin('sys_table', 'sys_field.SF00', '=', 'sys_table.ST00')
  .select('SF01', 'SF02', 'SF03', 'SF04', 'SF12').where("ST03", tableName).then(
      function (fields) {
        if("2"==type){
         var k2= knex('SYS_VIEWSQL')
          .leftJoin('sys_table', 'SYS_VIEWSQL.SV00', '=', 'sys_table.ST00')
          .select('SV01').where("ST03", tableName);
          k2.then(function (views) {
            fields[0].SV01=views[0].SV01;
            res.json(fields);
          });
        }else{
          res.json(fields);
        }
      }).catch(function (err) {
    console.log(err);
    res.status(500).send('DATABASE ERROR: ' + err.message);
  });
}

function getFieldType(req, res) {
    res.json(fieldType);
}

function initFieldType() {
  if (fieldType.length == 0) {
    knex('SYS_DATATYPE').select("SD00", "SD01", "SD02", "SD03").orderBy([
      {column: 'SD12', order: 'asc'}
    ]).then(function (data) {
      var item1 = {};
      item1.name = "STRING";
      item1.cn = "字符型";
      item1.type = "varchar";
      item1.length = 10;
      fieldType.push(item1);
      var item2 = {};
      item2.name = "NUMERIC";
      item2.cn = "数值型";
      item2.type = "numeric";
      item2.length = 16;
      fieldType.push(item2);
      var item3 = {};
      item3.name = "DATETIME";
      item3.cn = "日期型";
      item3.type = "datetime";
      item3.length = 0;
      fieldType.push(item3);
      var item4 = {};
      item4.name = "AUTO";
      item4.cn = "自增型";
      item4.type = "numeric";
      item4.length = 16;
      fieldType.push(item4);
      var item5 = {};
      item5.name = "GUID";
      item5.cn = "唯一号";
      item5.type = "varchar";
      item5.length = 36;
      fieldType.push(item5);
      for(var i=0;i<data.length;i++){
        var obj={};
        obj.name =data[i].SD00;
        obj.cn =data[i].SD01;
        obj.type =data[i].SD02;
        obj.length =data[i].SD03;
        fieldType.push(obj);
      }
      console.log("initFieldType finish");
    });
  }
}

module.exports = {
  init, init,
  searchTable: searchTable,
  getFields: getFields,
  getFieldType:getFieldType,
  initFieldType:initFieldType
}