<template>
  <div class="box">
    <img :src="list.img" alt class="banner_img" />
    <div class="fontbox">
      <div class="title">
        <span class="redbox">当当自营</span>
        <span>{{list.name}}</span>
      </div>
      <p class="describe">{{list.describe}}</p>
      <p class="price">
        <sapn>￥</sapn>
        {{list.price}}
      </p>
    </div>
    <div class="author">
      <span>作者</span>
      {{list.author}}著
    </div>
    <div class="bottom_box">
      <div>立即购买</div>
      <div @click="getCar">加入购物车</div>
    </div>
  </div>
</template>
<script>
import api from "../../api";
export default {
  data() {
    return {
      list: {},
      // arr: wx.getStorageSync("arr") ? wx.getStorageSync("arr") : []
    };
  },
  methods: {
    getCar() {
      // let obj = {
      //   _id: this.list._id,
      //   name: this.list.name,
      //   flag: false,
      //   price: this.list.price,
      //   img: this.list.img,
      //   value: 1
      // };
      // if (this.arr.length === 0) {
      //   this.arr.push(obj);
      //   wx.setStorage({
      //     key: "arr",
      //     data: this.arr
      //   });
      //   return;
      // } else {
      //   let i;
      //   let bool = this.arr.some((item, index) => {
      //     if (item._id == obj._id) {
      //       i = index;
      //       return true;
      //     } else {
      //       return false;
      //     }
      //   });
      //   if (bool) {
      //     this.arr[i].value += obj.value;
      //   } else {
      //     this.arr.push(obj);
      //   }
      //   wx.setStorage({
      //     key: "arr",
      //     data: this.arr
      //   });
      // }
      let nickname = wx.getStorageSync("nickname");
      if (nickname) {
        wx.request({
          url: api.shoppingCar,
          data: {
            id: this.list._id
          },
          header: {
            "content-type": "application/json"
          },
          success(res) {
            console.log(res);
          }
        });
        wx.switchTab({
          url: "../car/main"
        });
      } else {
        wx.showModal({
          title: "提示",
          content: "请先登录",
          success(res) {
            if (res.confirm) {
              wx.switchTab({
                url: "../center/main"
              });
            } else if (res.cancel) {
              wx.switchTab({
                url: "../center/main"
              });
            }
          }
        });
      }
    }
  },
  mounted() {
    let that = this;
    let id = this.$root.$mp.query.id;
    wx.request({
      url: api.bookOne,
      data: {
        id
      },
      header: {
        "content-type": "application/json"
      },
      success(res) {
        res.data.map(item => {
          return (item.img = api.url + item.img.replace("\\", "/"));
        });
        wx.setNavigationBarTitle({
          title: res.data[0].name
        });
        that.list = res.data[0];
      }
    });
  }
};
</script>
<style scoped>
.box {
  background-color: #f7f7f7;
  padding-bottom: 50px;
}
.banner_img {
  width: 100%;
  height: 420px;
  border-bottom: 1px solid #ddd;
}
.fontbox {
  padding: 10px 15px;
  background-color: #fff;
}
.title {
  font-size: 18px;
  color: #333;
  padding-bottom: 10px;
}
.title .redbox {
  color: #fff;
  background-color: #f83320;
  font-size: 14px;
  padding: 5px;
  border-radius: 50px;
  margin-right: 20px;
}
.describe {
  font-size: 16px;
  color: #5d6564;
}
.price {
  color: #f83320;
  font-size: 16px;
}
.price span {
  font-size: 18px;
}
.author {
  background-color: #fff;
  margin: 10px 0;
  padding: 10px 15px;
  color: #4d525d;
}
.author span {
  color: #969696;
  padding-right: 20px;
}
.bottom_box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background-color: #fff;
  display: flex;
}
.bottom_box div {
  width: 50%;
  text-align: center;
  line-height: 50px;
  background-color: #ffbe23;
  color: #fff;
  border-radius: 50px;
}
.bottom_box div:last-child {
  background-color: #f3554b;
}
</style>