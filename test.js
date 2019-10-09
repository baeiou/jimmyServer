var sysTable=require("./model/sysTable.js");
var req={
  query:{
    kw:"V_ZHYQ_YQWY_CONTRACT_ZYXZROOMS",
    type:"2"
  }
};
var res={
  json:function (o) {
    console.log(JSON.stringify(o));
  }
};
sysTable.getFields(req,res);
