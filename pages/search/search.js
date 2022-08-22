// pages/search/search.js
let timer = null;
import request from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent:'',
    hotList:[],
    searchContent:'',
    searchList: [], //模糊匹配数据
    historyList:[],
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getInitData()
  },

  //获取初始化数据
  async getInitData() {
    let placeholderData = await request('/search/default');
    let hotListData  =  await request('/search/hot/detail');

    this.setData({
      placeholderContent: placeholderData.data.showKeyword,
      hotList:  hotListData.data  
    })
  },
  //获取本地历史记录的功能函数
  getSearchHistory() {
    let history = wx.getStorage('historyList')
    if(history){
      this.setData({
        historyList:history
      })
    }
  },
  //搜索框表单改变回调
   handleInputChange(event){
      this.setData({
        searchContent:event.detail.value.trim()
      })

      this.getSearchInfo ()
  },


  //获取搜索信息函数
  async getSearchInfo () {
    //1.文本框为空 不执行
    if(!this.data.searchContent) {
      return ;
    }
    //3. 获取文本框内容,搜索历史
    let {searchContent,historyList} = this.data;

  
  
     //2.请求 搜索数据 
    if(timer) clearTimeout(timer);
       timer =   setTimeout(() => {
        this.getSearchList();
      }, 500);
    
    
    
 
      //4.插入历史记录
      if(historyList.indexOf(searchContent) !== -1){
        //如果输入 有历史记录 ,删除掉这个数据  再推入前方
        historyList.splice(historyList.indexOf(searchContent),1)
      }
      historyList.unshift(searchContent);
    this.setData({
        historyList
    })
    wx.setStorageSync('searchHistory', historyList)
  },
 
 //请求 搜索数据
async getSearchList(){
  let searchListData = await request('/search',{keywords:this.data.searchContent,limit:10})
  this.setData({
    searchList: searchListData.result.songs
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