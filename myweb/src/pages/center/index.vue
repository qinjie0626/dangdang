<template>
  <div class="box_center">
    <div class="header_top">
      <div class="bg_banner">
        <span v-if="nickname">{{nickname}}</span>
        <button v-if="!nickname" open-type="getUserInfo" @click="getLogin">登录</button>
        <button @click="getlogout">注销</button>
      </div>
    </div>
    <ul class="mycollect">
      <li v-for="(item,index) in mycollect" :key="index">
        <div>
          <p>{{item.count}}</p>
          <p>{{item.title}}</p>
        </div>
      </li>
    </ul>
    <div class="order">
      <div>
        <img src="../../../static/images/dingdan.png" alt /> 我的订单
      </div>
      <div class="right">
        <p class="p">查看全部购买商品</p>
        <img src="http://home.m.dangdang.com/images/rightarrow_new.png" alt />
      </div>
    </div>
    <ul class="operation">
      <li v-for="(item,index) in operation" :key="index">
        <div>
          <img :src="item.img" alt />
          <p>{{item.title}}</p>
        </div>
      </li>
    </ul>
    <div class="vip one">
      <img src="../../../static/images/vip.png" alt />
      会员中心
    </div>
    <ul class="coupon">
      <li v-for="(item,index) in coupon" :key="index" class="vip list">
        <div>
          <img :src="item.img" alt />
          {{item.title}}
        </div>
        <img src="http://home.m.dangdang.com/images/rightarrow_new.png" alt class="vipimg" />
      </li>
    </ul>
    <ul class="coupon">
      <li class="vip list">
        <div>
          <img src="../../../static/images/qiang.jpg" alt />
          万物更新，每满100减50
        </div>
        <img src="http://home.m.dangdang.com/images/rightarrow_new.png" alt class="vipimg" />
      </li>
      <li class="vip list">
        <div>
          <img src="../../../static/images/qiang.jpg" alt />
          【网易严选】开学季3折抢，顺丰配送
        </div>
        <img src="http://home.m.dangdang.com/images/rightarrow_new.png" alt class="vipimg" />
      </li>
      <li class="vip list">
        <div>
          <img src="../../../static/images/qiang.jpg" alt />
          学生练字帖8.8元起
        </div>
        <img src="http://home.m.dangdang.com/images/rightarrow_new.png" alt class="vipimg" />
      </li>
    </ul>
     <ul class="coupon">
      <li class="vip list">
        <div>
          <img src="../../../static/images/kefu.png" alt />
          客服反馈
        </div>
        <img src="http://home.m.dangdang.com/images/rightarrow_new.png" alt class="vipimg" />
      </li>
    </ul>
    <div class="m10 like">
      ————
      <span>根据您的偏好猜您可能喜欢</span> ————
    </div>
    <div class="likeList">
      <div v-for="(item,index) in books" :key="index" @click="getDetail(item._id)">
        <img class="image" :src="item.img" alt />
        <p class="text">{{item.describe}}</p>
        <span class="redbor" v-if="item.type==1">畅销榜</span>
        <span class="redbor" v-else-if="item.type==2">新品榜</span>
        <span class="redbor" v-else>童书榜</span>
        <span class="redback" v-if="item.statu==1">热卖</span>
        <span class="redback" v-else-if="item.statu==2">新品</span>
        <span class="redback" v-else>下架</span>
        <p class="price">￥{{item.price}}</p>
      </div>
    </div>
  </div>
</template>
<script>
import api from "../../api";
export default {
  data() {
    return {
      nickname: wx.getStorageSync("nickname")
        ? wx.getStorageSync("nickname")
        : null,
      books: [],
      mycollect: [
        {
          title: "收藏的商品",
          count: 0
        },
        {
          title: "关注的店铺",
          count: 0
        },
        {
          title: "我的足迹",
          count: 0
        }
      ],
      operation: [
        {
          title: "待付款",
          img: "/static/images/dan1.png"
        },
        {
          title: "待收货",
          img: "/static/images/dan2.png"
        },
        {
          title: "退换货",
          img: "/static/images/dan3.png"
        }
      ],
      coupon: [
        {
          title: "我的礼券",
          img: "/static/images/wd1.png"
        },
        {
          title: "积分抵现",
          img: "/static/images/wd2.png"
        },
        {
          title: "我的电子书",
          img: "/static/images/wd3.png"
        },
        {
          title: "我的礼品卡",
          img: "/static/images/wd4.png"
        },
        {
          title: "收货地址",
          img: "/static/images/wd5.png"
        }
      ]
    };
  },
  methods: {
    getDetail(id){
      wx.navigateTo({
        url: `../detail/main?id=${id}`
      });
    },
    getLogin() {
      let _this = this;
      wx.getUserInfo({
        success: function(res) {
          _this.nickname = res.userInfo.nickName;
          wx.setStorage({
            key: "nickname",
            data: _this.nickname
          });
        }
      });
    },
    getlogout() {
      this.nickname = null;
      wx.removeStorageSync("nickname");
    },
    getBooks() {
      var _this = this;
      wx.request({
        url: api.books, 
        header: {
          "content-type": "application/json"
        },
        success(res) {
          res.data.map((item, index) => {
            return  item.img = api.url + item.img.replace("\\", "/");
          });
          _this.books = res.data;
        }
      });
    }
  },
  mounted() {
    this.getBooks();
  }
};
</script>
<style scoped>
.box_center {
  background-color: #eeeeee;
}
.header_top {
  width: 100%;
  height: 220rpx;
  background: url("http://img61.ddimg.cn/upload_img/00610/home/user-bg.jpg")
    no-repeat;
  background-size: 100% 220rpx;
  text-align: center;
}
.bg_banner {
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.bg_banner button,
.bg_banner span {
  outline: none;
  background-color: transparent;
  border: 1px solid #fff;
  border-radius: 100rpx;
  color: #fff;
  text-align: center;
  font-size: 32rpx;
  width: 220rpx;
  height: 80rpx;
  line-height: 80rpx;
  margin-top: 10px;
}
.mycollect {
  display: flex;
  border-bottom: 1px solid #ddd;
  background-color: #fff;
}
.mycollect li {
  flex: 1;
  display: flex;
  text-align: center;
  justify-content: center;
  flex-direction: column;
  padding: 10rpx 0;
  padding-right: 20rpx;
  height: 92rpx;
  box-sizing: border-box;
  font-size: 28rpx;
  color: #333;
}
.mycollect li div {
  border-right: 1px solid #ddd;
}
.mycollect li:nth-child(3) div {
  border-right: 0;
}
.order {
  display: flex;
  padding: 20rpx;
  box-sizing: border-box;
  font-size: 28rpx;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
}
.right {
  display: flex;
}
.order img {
  width: 50rpx;
  height: 50rpx;
  margin-right: 10rpx;
  vertical-align: middle;
}
.right img {
  width: 15rpx;
  height: 30rpx;
  margin-right: 0;
  margin-left: 10rpx;
}
.order .p {
  font-size: 12px;
}
.operation {
  display: flex;
  background-color: #fff;
}
.operation li {
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  padding-top: 10px;
  font-size: 14px;
}
.operation li img {
  width: 50rpx;
  height: 50rpx;
}
.coupon{
  margin-bottom: 10px;
}
.vip {
  background-color: #fff;
  padding: 20rpx;
  box-sizing: border-box;
  font-size: 28rpx;

}
.one {
  margin: 10px 0;
}
.vip img {
  width: 50rpx;
  height: 50rpx;
  margin-right: 10rpx;
  vertical-align: middle;
}
.list {
  border-bottom: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
}
.list:last-child {
  border-bottom: 0;
}
.vip .vipimg {
  width: 15rpx;
  height: 30rpx;
  margin-right: 0;
  margin-left: 10rpx;
}
.m10 {
  margin: 10px 0;
}

.like {
  font-size: 14px;
  text-align: center;
  color: gray;
}

.like img {
  width: 25px;
  height: 25px;
  vertical-align: middle;
  margin: 0 5px;
}
.likeList {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

.likeList > div {
  width: 48%;
  margin-right: 5px;
  margin-top: 5px;
  background: white;
}

.image {
  width: 100%;
  height: 120px;
}

.redbor {
  border: 1px solid red;
  color: red;
  font-size: 14px;
  margin: 0 5px;
}

.redback {
  background: red;
  border: 1px solid red;
  color: white;
  font-size: 14px;
}

.price {
  color: red;
  margin: 5px 0;
}

.text {
  overflow: hidden;

  text-overflow: ellipsis;

  display: -webkit-box;

  -webkit-box-orient: vertical;

  -webkit-line-clamp: 2;
  margin: 5px 0;
}

.find {
  height: 60px !important;
  line-height: 60px !important;
}
</style>