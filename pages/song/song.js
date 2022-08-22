import PubSub from 'pubsub-js'
import moment from 'moment'
import request from '../../utils/request'
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    songDetail:{},
    musicId: '',
    musicLink:'',
    currentTime: "00:00",
    durationTime: '00:00',
    currentWidth:0
  
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      let musicId = options.id
      this.getMusicInfo (musicId)
      this.setData({
        musicId
      })  
      //判断当前页面音乐是否在播放
      if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId){
        this.setData({
          isPlay: true
        })  
      }

    //背景播放实例
     this.backgroundAudioManager = wx.getBackgroundAudioManager();
     this.backgroundAudioManager.onPlay(()=>{
        this.changePlayState(true)
        //全局音乐播放状态
       
        appInstance.globalData.musicId = musicId
     })
     
     this.backgroundAudioManager.onPause(()=>{
      
      this.changePlayState(false)
    
     })
     this.backgroundAudioManager.onStop(()=>{
        this.changePlayState(false)
    
     })
     this.backgroundAudioManager.onTimeUpdate(()=>{
      let currentTime = moment(this.backgroundAudioManager.currentTime *1000).format('mm:ss')
      let currentWidth = this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration *450
        this.setData({
          currentTime,
          currentWidth
        })
     })
     this.backgroundAudioManager.onEnded(()=>{
      PubSub.publish('switchType','next')
      this.setData({
        currentWidth:0,
        currentTime: "00:00"
      
      }) 

     })
    
    
   

  },
  //修改播放状态
  changePlayState(isPlay){
    this.setData({
      isPlay: isPlay
    })
      //全局音乐播放状态
      appInstance.globalData.isMusicPlay = isPlay
  },


  //获取音乐详情
  async getMusicInfo (id){ 
    let songDetail = await request ('/song/detail',{ids:id})
    
    let durationTime = moment(songDetail.songs[0].dt).format('mm:ss')
    this.setData({
      songDetail:songDetail.songs[0],
      durationTime
    })

    //修改窗口标题 
    wx.setNavigationBarTitle({
      title: this.data.songDetail.name
    })
  },
//音乐播放
  handleMUsicPlay(){
    let isPlay = !this.data.isPlay;
    // this.setData({
    //   isPlay 
    // }) 
    let { musicId,musicLink } = this.data
    this.musicControl(isPlay,musicId,musicLink)
  },

  //控制播放暂停 功能函数
  async musicControl(isPlay,musicId,musicLink) {
  
    if(isPlay){ 
      //获取音乐播放链接
      if(!musicLink){
        let musicLinkData = await request('/song/url',{id:musicId});
         musicLink = musicLinkData.data[0].url

        this.setData({
          musicLink
        })
      }
      

      
      this.backgroundAudioManager.src =  musicLink;
      this.backgroundAudioManager.title = this.data.songDetail.name;
    }else{
      this.backgroundAudioManager.pause()
    }
  },

  //切歌回调
  handleSwitch(event){   
    let type  = event.currentTarget.id

    //暂停
    this.backgroundAudioManager.stop()
    //解绑之前回调,不然一致循环调用
    PubSub.unsubscribe('musicId')
    //订阅  song 的事件 获取 musicID
     PubSub.subscribe('musicId',(msg,musicId)=>{
      this.getMusicInfo (musicId)
      //播放
      this. musicControl(true,musicId)

  })
    
      //发布切换类型 to song
      PubSub.publish('switchType',type) 
      
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