<template>
  <div>
    <div class="header_top"></div>
    <swiper autoplay class="banner">
      <swiper-item v-for="(item,index) in banner" :key="index">
        <img :src="item.img" alt />
      </swiper-item>
    </swiper>
    <ul class="navlist">
      <li v-for="(item,index) in classifyList" :key="index" @click="getbooklist(item.name)">
        <img :src="item.img" alt />
      </li>
    </ul>
    <div>
      <img class="banner_logo" src="http://img61.ddimg.cn/upload_img/00705/yhj/tslc-bt.jpg" alt />
      <img class="banner" :src="img" alt />
    </div>
    <ul class="books">
      <li v-for="(item,index) in booksList" :key="index" @click="getDatil(item._id)">
        <p class="title">{{item.name}}</p>
        <span class="redfont">{{item.state}}</span>
        <img :src="item.img" alt />
      </li>
    </ul>
  </div>
</template>

<script>
import api from "../../api";

export default {
  data() {
    return {
      classifyList: [],
      banner: [],
      booksList: [],
      img: ""
    };
  },
  methods: {
    getClassify() {
      let that = this;
      wx.request({
        url: api.classify,
        header: {
          "content-type": "application/json"
        },
        success(res) {
          res.data.map(item => {
            return (item.img = api.url + item.img.replace("\\", "/"));
          });
          that.classifyList = res.data;
        }
      });
    },
    getBanner() {
      let that = this;
      wx.request({
        url: api.banner,
        header: {
          "content-type": "application/json"
        },
        success(res) {
          res.data.map(item => {
            return (item.img = api.url + item.img.replace("\\", "/"));
          });
          that.banner = res.data;
          that.img = that.banner[0].img;
        }
      });
    },
    getBooks() {
      let that = this;
      wx.request({
        url: api.books,
        header: {
          "content-type": "application/json"
        },
        success(res) {
          res.data.map(item => {
            item.img = api.url + item.img.replace("\\", "/");
            if (item.state == 1) {
              item.state = "热卖";
            } else if (item.state == 2) {
              item.state = "促销";
            } else {
              item.state = "下架";
            }
            return item;
          });
          that.booksList = res.data;
        }
      });
    },
    getDatil(id) {
      wx.navigateTo({
        url: `../detail/main?id=${id}`
      });
    },
    getbooklist(type) {
      let typename = null;
      switch (type) {
        case "畅销榜":
          typename = 1;
          break;
        case "新书榜":
          typename = 2;
          break;
        case "童书榜":
          typename = 3;
          break;
        case "今日促销":
          typename = 4;
          break;
        case "特价书市":
          typename = 5;
          break;
        case "服装":
          typename = 6;
          break;
        case "当当超市":
          typename = 7;
          break;
        case "拼团":
          typename = 8;
          break;
        case "领券中心":
          typename = 9;
          break;
        default:
          typename = 10;
          break;
      }
      wx.navigateTo({
          url:`../list/main?type=${typename}`
      })
    }
  },
  mounted() {
    this.getClassify();
    this.getBanner();
    this.getBooks();
  },
  created() {
    // let app = getApp()
  }
};
</script>

<style scoped>
.banner {
  width: 100%;
  height: 220rpx;
}
.banner img {
  width: 100%;
  height: 100%;
}
.banner_logo {
  width: 100%;
  height: 69rpx;
}
.navlist {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
}
.navlist li {
  width: 20%;
  height: 160rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.navlist li img {
  width: 100%;
  height: 100%;
}
.books {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.books li {
  width: 33.33%;
  border-bottom: 1px solid #ddd;
  border-right: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  box-sizing: border-box;
  padding: 20rpx;
}
.books li img {
  width: 167rpx;
  height: 167rpx;
}
.books li .title {
  color: #333;
  font-size: 32rpx;
}
.books li .redfont {
  color: #ef2933;
  font-size: 24rpx;
}
.books li:nth-child(3n) {
  width: 33.34%;
  border-right: 0;
}
</style>
