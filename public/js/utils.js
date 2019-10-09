String.prototype.formatHTML=function () {
  return this.replace(/"/g,"&quot;");
  //.replace(/'/g,"&#39;").replace(/&/g,"&#38;").replace(/</g,"&#60;").replace(/>/g,"&#62;").replace(/\r/g,"&#13;").replace(/\n/g,"&#10;")
}
function cc(url, params) {
  var r = "";
  $.ajax({
    url: url,
    type: "get",
    async: false,
    dataType: "text",
    success: function (data) {
      r = freemarker.render(data, params);
    }
  });
  return r;
}