function post(app,url,callBack) {
  app.post(url,function (req,res) {
    req.on('data',function (data) {
      var obj=JSON.parse(data);
      callBack(req,res,obj);
    });
  })
}
module.exports = {
  post:post
}