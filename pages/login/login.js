// pages/login/login.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:"",
    password:""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  handleInput(e){
    let type = e.currentTarget.id;
    //获取 id 和 data 同名,所以直接[type]变量 命名使用
    this.setData({
      [type] : e.detail.value
    })
  },
  async login() {
    
    let {phone,password} = this.data;
    if(!phone) {
      wx.showToast({
      title:'手机不能为空',
      icon:'error'
    })
    return;
    }

    let phoneReg = /^1[3-9]\d{9}$/
    if(!phoneReg.test(phone)){
      wx.showToast({
        title:'手机格式错误',
        icon:'error'
      })
      return;
    } 
     
 
    if(!password) {
      wx.showToast({
      title:'密码不能为空',
      icon:'error'
    })
    return;
    }
   
 //后端
  let result = await request('/login/cellphone',{phone ,password}) 
  if(result.code === 200){
    wx.showToast({
      title:'登录成功',
      icon:"none"
    })
    //存储用户信息
    wx.setStorageSync('userInfo',JSON.stringify(result.profile))
    //切换tab栏 只能用这个方法switchTab  但是页面会缓存,reLaunch是关闭所有页面再跳转
    wx.reLaunch({
      url:'/pages/personal/personal'
    })
  }else if(result.code === 400){
    wx.showToast({
      title:'手机号错误',
      icon:'error'
    })
  }else if(result.code === 502){
    wx.showToast({
      title:'密码错误',
      icon:'error'
    })
  }else{
    wx.showToast({
      title:'登录失败',
      icon:'error'
    })
  }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})