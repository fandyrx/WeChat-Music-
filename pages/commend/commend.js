import PubSub from 'pubsub-js'
import request from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:'',
    month:'',
    recommendList:[],
    index: 0
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
   
    //获取 顶部展示日期 
      this.setData({
        day:new Date().getDate() ,
        month: new Date().getMonth() + 1
      })
      // 判断是否登录
      let userInfo = wx.getStorageSync("userInfo")
      if(!userInfo){
        wx.showToast({
          title:'请先登录',
          icon:'error',
          success:()=>{
              wx.reLaunch({
                url:'/pages/login/login'
              })
          }
        })
      }
      this.getRecommendList()

     //订阅 song页面 发布的消息
     PubSub.subscribe('switchType',(msg,type)=>{
        let { recommendList,index } = this.data;
        console.log('当前索引',index, '数组长度'+ recommendList.dailySongs.length);
       
        if (type === 'pre'){
          //判断 索引等于0  为真 且  索引为数组长度  ,若执行,再到下方index-1.
          //索引不为0  false  后方不执行  直接 index-1 
          
          (index === 0 ) && (index = recommendList.dailySongs.length);
          index -= 1;
          
          
        }else{
          (index === recommendList.dailySongs.length -1 ) && (index = -1);
            index +=1
        }
        this.setData({
          index
        })
        let musicId = recommendList.dailySongs[index].id
        PubSub.publish('musicId',musicId)
     })
  },

  
  async getRecommendList(){
      let recommendListData =  await request ('/recommend/songs')
     
      this.setData({
        recommendList:recommendListData.data
      })
    },


    //跳转歌曲详情
    toSongDetail(event){
      let {song,index} = event.currentTarget.dataset;
      this.setData({
        index
      })
      
    
      wx.navigateTo({
        url:'/pages/song/song?id='+ JSON.stringify(song.id)
        
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