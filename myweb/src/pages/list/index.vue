<template>
  <div>
    <ul class="list">
      <li v-for="(item,index) in list" :key="index" @click="getbookDetail(item._id)">
        <span class="index">{{index+1}}</span>
        <div class="listbox">
          <img :src="item.img" alt />
          <div>
            <h4 class="title">{{item.name}}</h4>
            <p class="author">{{item.author}}</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import api from "../../api";
export default {
  data() {
    return {
      list: [],
      flag:false
    };
  },
  methods: {
    getbookDetail(id){
      wx.navigateTo({
        url: `../detail/main?id=${id}`
      });
    }
  },
  mounted() {
    let that = this;
    let type = this.$root.$mp.query.type;
    let typename = "";
    wx.request({
      url: api.bookList,
      data: {
        type
      },
      header: {
        "content-type": "application/json"
      },
      success(res) {
        switch (type) {
          case "1":
            typename = "畅销榜";
            break;
          case "2":
            typename = "新书榜";
            break;
          case "3":
            typename = "童书榜";
            break;
          case "4":
            typename = "今日促销";
            break;
          case "5":
            typename = "特价书市";
            break;
          case "6":
            typename = "服装";
            break;
          case "7":
            typename = "当当超市";
            break;
          case "8":
            typename = "拼团";
            break;
          case "9":
            typename = "领券中心";
            break;
          default:
            typename = "云阅读";
            break;
        }
        wx.setNavigationBarTitle({
          title: typename
        });
        if (res.data.count===1) {
          res.data.data.map(item => {
            return (item.img = api.url + item.img.replace("\\", "/"));
          });
          that.list = res.data.data;
        }else{
          that.list = [];
          that.flag = true
        }
      }
    });
  }
};
</script>
<style scoped>
.list li {
  position: relative;
  border-top: 1px solid #dddddd;
}
.list .index {
  position: absolute;
  left: 0;
  top: 0;
  background-color: #ff4433;
  color: #fff;
  padding: 10rpx;
}
.list .listbox {
  display: flex;
  align-items: center;
}
</style>