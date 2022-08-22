import config from "./config"

export default (url,data={},method="get")=>{
 return new Promise((resolve,reject)=>{
  wx.request({
    url: config.host + url,
    data,
    method,
    success:(res)=>{
     
      resolve(res.data);
    },
    fail:(err)=>{
      console.log(err);
      reject(err)
    }
  })
 })
}