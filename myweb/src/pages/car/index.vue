<template>
  <div class="carbox">
    <div class="commodity">
      <ul v-if="arr.length!=0">
        <li v-for="(item,index) in arr" :key="index">
          <div class="libox">
            <van-icon name="passed" :class="[item.flag?'active':'']" @click="checkedFun(index)" />
            <img :src="item.img" alt />
            <div class="right">
              <p class="title">{{item.name}}</p>
              <div class="storecontent">
                <p class="price">￥{{item.price}}</p>
                <van-stepper v-model="item.value" @change="onChangevalue($event,index)" />
              </div>
            </div>
          </div>
          <button class="detale" @click="getDetale(item._id)">删除</button>
        </li>
      </ul>
    </div>
    <div class="emptyCar" v-if="arr.length==0">
      <img src="../../../static/images/cart_null.gif" alt />
      <p class="font">您还没有购买任何商品</p>
      <div class="btn">
        <div>逛一逛</div>
        <div>我的收藏</div>
      </div>
    </div>
    <div class="closeon">
      <div class="flexdiv" @click="checkedAll">
        <van-icon name="passed" :class="[bool?'active':'']" />
        <p>全选</p>
      </div>
      <div class="flexdiv total">
        <p>合计：{{priceds|fprice}}</p>
        <p>(不含运费)</p>
      </div>
      <div class="up">去结算</div>
    </div>
  </div>
</template>
<script>
import api from "../../api";
export default {
  data() {
    return {
      // arr: wx.getStorageSync("arr") ? wx.getStorageSync("arr") : [],
      arr: [],
      bool: false
    };
  },
  onShow() {
    var nickname = wx.getStorageSync("nickname");
    if (nickname) {
      this.getShoppingList()
    } else {
      wx.showModal({
        title: "登录提示",
        content: "请先登录...",
        success(res) {
          if (res.confirm) {
            console.log("用户点击确定");
            wx.switchTab({
              url: "../center/main"
            });
          } else if (res.cancel) {
            wx.showToast({
              title: "正在跳转登录页面"
            });
            wx.switchTab({
              url: "../center/main"
            });
          }
        }
      });
    }
  },
  methods: {
    getShoppingList() {
      let that = this;
      wx.request({
        url: api.shoppingList,
        header: {
          "content-type": "application/json"
        },
        success(res) {
          res.data.forEach(item => {
            item.flag = false;
            item.img = api.url + item.img.replace("\\", "/");
          });
          that.arr = res.data;
        }
      });
    },
    onChangevalue(event, index) {
      this.arr[index].value = event.mp.detail;
    },
    checkedFun(i) {
      this.arr[i].flag = !this.arr[i].flag;
    },
    checkedAll() {
      this.bool = !this.bool;
      this.arr.forEach(item => {
        item.flag = this.bool;
      });
    },
    getDetale(id) {
      let _this = this
      wx.request({
        url: api.deleteshopping,
        data: {
          id
        },
        header: {
          "content-type": "application/json"
        },
        success(res) {
          if(res.data.code){
            _this.getShoppingList()
          }else{
            console.log(res.data.msg)
          }
        }
      });
    }
  },
  computed: {
    priceds() {
      let sum = 0;
      for (let i in this.arr) {
        if (this.arr[i].flag) {
          sum += this.arr[i].value * this.arr[i].price;
        }
      }
      return sum;
    }
  },
  filters: {
    fprice(n) {
      return n.toFixed(2) + "元";
    }
  },
  watch: {
    arr: {
      handler() {
        this.bool = this.arr.every(item => {
          return item.flag == true;
        });
        if (this.arr.length == 0) {
          this.bool = false;
        }
      },
      deep: true
    }
  }
};
</script>
<style scoped>
.active {
  color: #f60;
}
.carbox {
  min-height: 100vh;
  background-color: #f2f2f2;
  padding-bottom: 1.16rem;
}
.emptyCar {
  text-align: center;
  padding: 40px 0 20px;
  border: 1px solid #ddd;
  color: #777;
}
.emptyCar img {
  width: 40%;
  height: 130px;
}
.font {
  font-size: 14px;
  padding: 20px 0;
}
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn div {
  border-radius: 8px;
  border: 1px solid #777;
  width: 135px;
  height: 44px;
  margin-right: 20px;
  font-size: 18px;
  line-height: 44px;
}
.btn div:last-child {
  margin-right: 0;
}
.commodity {
  padding: 10px;
}
.commodity li {
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 16px;
  padding: 0 20px 0 5px;
  position: relative;
  overflow: hidden;
}
.commodity li .libox {
  display: flex;
  align-items: center;
  padding: 10px 0 20px 0;
}

.commodity li img {
  width: 120px;
  height: 120px;
  margin-right: 20px;
}
.right {
  flex: 1;
}
.storecontent {
  margin-top: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.storecontent .price {
  color: #fa0502;
}
.commodity li:last-child {
  margin-bottom: 0;
}
.detale {
  position: absolute;
  top: 30rpx;
  right: 40rpx;
  background: #f60;
  color: #fff;
  font-size: 12px;
}
.closeon {
  position: fixed;
  width: 100%;
  bottom: 0;
  height: 1.16rem;
  display: flex;
  border-top: 1px solid #ccc;
  padding-left: 0.4rem;
  background-color: #fff;
}
.compilebox {
  margin: 0 0.7rem;
}

.total {
  width: 2.3rem;
  font-size: 0.23rem;
  color: #adadad;
}

.total p {
  overflow: hidden;
  white-space: nowrap;
}
.flexdiv {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.flexdiv i {
  width: 0.47rem;
  height: 0.47rem;
  font-size: 0.47rem;
}
.up {
  position: absolute;
  right: 0;
  width: 2.3rem;
  height: 100%;
  text-align: center;
  background-color: #f60;
  line-height: 1.16rem;
  font-size: 0.35rem;
  color: #fff;
}
</style>