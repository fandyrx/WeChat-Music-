// pages/video/video.js

import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList:[],
    navId:'',
    videoList:[],
    vids:[],
    videoId:'',
    videoUpdateTime:[],
    isRefresh: false,
    offset: 0,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getVideoGroupListData()
 
  },

  //获取导航数据
  async getVideoGroupListData() {
    let videoGroupListData = await request('/video/group/list')
      
    this.setData({
      videoGroupList : videoGroupListData.data.slice(0,14),
      navId: videoGroupListData.data[0].id 
    })
    this.getVideoList(this.data.navId)
  },

  //导航数据 切换
  changeNav(e) {
    let navId = e.currentTarget.id;
    this.setData({
      navId: navId * 1,
      videoList:[],
      offset:0
    })
    wx.showLoading({
      title:'正在加载'
    })
    //获取视频数据
    this.getVideoList(this.data.navId)

  },  
  //获取视频列表数据
  async getVideoList(id,offset=0) {
    if(!id){
      return;
    }
        let videoListData =  await request('/video/group',{id:id,offset})
        wx.hideLoading();
       let index = 0;
       let videoList =  videoListData.datas.map(item=>{
        item.id = index ++;
        return item;
       })
       this.setData({
        videoList,
        //下拉取消
        isRefresh: false
       })
       
       //获取vid
       this.getVideoVid();
       //获取url地址 ,重新赋值 
      for(let i of this.data.videoList){
        //获取每个地址  怎么保证当前
         let videoUrl = await request('/video/url',{id:i.data.vid})
         //赋值 当前遍历出来的对象,添加属性
        i.videoUrl = videoUrl.urls
      } 
      this.setData({
        videoList,
        
       })
       
  },  

   getVideoVid(){
    
    let vids = []
    for(let i = 0 ; i < this.data.videoList.length;i++ ){
         let vid = this.data.videoList[i].data.vid
      vids.push( vid )
    }
    this.setData({
      vids
    })
  },
  //点击播放回调
  handlePlay(event){ 
    //获取点击的视频 vid
    let vid = event.currentTarget.id;
    let { videoUpdateTime } = this.data;
    
    //,有实例,暂停  
     this.vid !== vid && this.videoContext && this.videoContext.stop();
     //暂停后,当前获取的vid 存储到this.vid ,用于下一次验证
     this.vid = vid

     this.setData({
      videoId:vid
     })
    //创建实例对象 THIS. 接受
    this.videoContext = wx.createVideoContext(vid);
    
       //判断有无播放历史
    let videoItem = videoUpdateTime.find(item=>item.vid === vid)
    if(videoItem){ //之前有这个id

      this.videoContext.seek(videoItem.currentTime);
    }else{
      this.videoContext.play();
    }
   
  },

  //播放进度
  handleTimeUpdate(event) {
    let videoTimeObj = {vid:event.currentTarget.id,currentTime:event.detail.currentTime}
    let { videoUpdateTime } = this.data;

    let videoItem = videoUpdateTime.find(item=>item.vid === videoTimeObj.vid)
    if(videoItem){ //之前有这个id
      videoItem.currentTime = event.detail.currentTime
    }else{  //之前没有这个id
      videoUpdateTime.push(videoTimeObj)
    }
  
    this.setData({
      videoUpdateTime
    })
  },
//播放结束
handleEnded(event){
    let{videoUpdateTime } = this.data;
   
    videoUpdateTime.splice( videoUpdateTime.findIndex(item=>item.vid === event.currentTarget.id),1)
    this.setData({
      videoUpdateTime
    })
  },
 //下拉刷新
 handleRefresher() {
  
  this.getVideoList(this.data.navId)
  
 },
//触底
 handletolower() {
  let {offset} =this.data;
  if(offset < this.data.videoList.length){
    this.getVideoList(this.data.navId,offset)
    offset++
  }
  this.setData({
    offset
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
  onShareAppMessage({from}) {
    console.log(from);
    if(from === 'button'){
      return {
        title: '来自button的转发',
        page: '/pages/video/video',
        imageUrl: '/static/images/nvsheng.jpg'
      }
    }else {
      return {
        title: '来自menu的转发',
        page: '/pages/video/video',
        imageUrl: '/static/images/nvsheng.jpg'
      }
    }
  },

})