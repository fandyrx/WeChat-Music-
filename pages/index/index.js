// pages/index/index.js

import request from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg:'初始化数据',
    userInfo:{},
    hasUserInfo:false,
    bannerList:[],
    recommendList:[],
    topList:[]
  },
  toRecommendSong(){
    wx.navigateTo({
      url:'/pages/commend/commend'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad :async function(options) {
          //游客登录,获取COOKIe
          let visterCookie = await request("/register/anonimous") 
       
      
        //获取轮播图
        let result = await request('/banner',{type:2})
        this.setData({
          bannerList : result.banners
        });
        //获取推荐歌单
        let recommendData = await request("/personalized",{limit:10})
        this.setData({
          recommendList : recommendData.result
        });
        //获取排行榜数据
        let topList = await request('/toplist')
        
        let newArr = []
        for(let i = 0 ;i <= 5; i++){
          let topListId =topList.list[i].id;
          let topListItem = await request('/playlist/detail',{id:topListId});
          let top = { name: topListItem.playlist.name, 
            tracks:topListItem.playlist.tracks.slice(0, 3) }
            newArr.push(top);
            this.setData({
            topList: newArr
         })
        }
        //等待5次请求结束再获取数据,页面留白时间长
        // this.setData({
        //   topList : newArr
        // })
  },

  tologs(){
   wx.navigateTo({
      url: '/pages/logs/logs',
      success(){
        console.log('跳转成功');
      }
    })    
  },
  //获取用户信息；
  getUserProfile(){
      // 推荐使用 wx.getUserProfile 获取用户信息，开发者每次通过
      // 该接口获取用户个人信息均需用户确认
      // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息
        // 后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
        
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: false
          })
        }
      })
    },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})