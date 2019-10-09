const knex = require("../utils/conn.js");

function viewAction(req, res) {
  var kws = req.query.kw.split(" ");
  var k = knex.select('SE00', 'SE01', 'SE02', 'SE03', 'SE04', 'SE05', 'SE06',
      'SE07', 'SE08', 'SE09', 'SE14', 'SE15',
      'SE16', 'SE31', 'ADDEVENT', 'SE36', 'SF00', 'SF01', 'SF02', 'SF03',
      'SF04', 'SF06', 'SF07', 'SF28', 'SR03').from('sys_event')
  .leftJoin('SYS_FUNCTION', 'SYS_FUNCTION.SF05', 'sys_event.SE01')
  .leftJoin('SYS_REDIRECT', function () {
    this.on(' SYS_REDIRECT.SR06', '=', 'sys_event.SE01').andOn(
        'SYS_REDIRECT.SR01', '=', 'sys_event.SE07')
  })
  .where('SE01', '=', kws[0]);
  if (kws.length < 2) {
    k = k.andWhere('SE08', '=', "1");
  } else {
    k = k.andWhere('SE02', '=', kws[1]);
  }
  k.then(function (event) {
    var p1=/^\d+$/g;
    if(event.length>0 && p1.test(event[0].SR03)){
      knex('SYS_PAGE').where('SP00', event[0].SR03).select('SP04','SP05','SP09').then(function (page) {
        if(page.length>0){
          event[0].SP04=page[0].SP04;
          event[0].SP05=page[0].SP05;
          event[0].SP09=page[0].SP09;
          res.json(event);
        }else{
          res.json(event);
        }
      });
    }else{
      res.json(event);
    }
  })
  .catch(function (err) {
    console.log(err);
    res.status(500).send('DATABASE ERROR: ' + err.message);
  })
};

function updateAction(req, res, data) {
  var se01 = data.se01;
  var se02 = data.se02;
  var se03 = data.se03;
  var se04 = data.se04;
  var se05 = data.se05;
  var se14 = data.se14;
  var se15 = data.se15;
  var k = knex('sys_event').where('SE01', se01).andWhere('SE02', se02).update(
      {SE03: se03, SE04: se04, SE05: se05, SE14: se14, SE15: se15});
  k.then(function (resp) {
    var id = resp[0];
    if(typeof(data.sp09)!="undefined" ){
      var k2=knex('SYS_PAGE').where('SP00', data.sr03).update({SP09:data.sp09});
      k2.then(function (resp) {

      })
    }
    res.json({result: "OK!"});
  })
}

module.exports = {
  viewAction: viewAction,
  updateAction: updateAction
}