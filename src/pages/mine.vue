<template>
  <view class="mine-page">
    <!-- 顶部手机号 -->
    <view class="mine-header">187****9900</view>
    <view class="tool-box">
      <!-- 通过接口权限判断 -->
       <view v-if="true" class="my-xy" @click="goUserAgreement">
        用户协议
      </view>
    
      <button
        class="customer-service-btn"
        open-type="contact"
        show-message-card="true"
        send-message-title="您好，请问有什么可以帮您？"
        send-message-path="/pages/mine"
        send-message-img=""
      >
        客服
      </button>
      <view v-if="true" class="my-order" @click="showPicker = true">
        主体列表
      </view>
      <view class="address" @click="addressPopupShow = true"> 地址 </view>
    </view>
    <!-- 卡片区域 -->
    <view style="margin-top: 32rpx;display: flex; flex-direction: row; justify-content: space-between; align-items: center;">
      <view class="mine-card-title">全部订单</view>
      <view class="mine-more" @click.stop="goOrderList">查看更多</view>
    </view>
    <view class="mine-card">
      <view class="mine-card-left">
        <view class="mine-goods-list">
          <view
            v-for="g in goodsList"
            :key="g.id"
            class="mine-goods-item"
            @click="goOrderDetail(g)"
          >
            <view class="mine-goods-img"></view>
            <view class="mine-goods-name">{{ g.name }}</view>
          </view>
        </view>
      </view>
      <view class="mine-card-right">
        <view class="mine-status">订单状态</view>
        <view class="mine-amount">35.00元</view>
        <view class="mine-count">共7件</view>
      </view>
    </view>
    <u-picker
      :show="showPicker"
      :columns="[subjectList]"
      @confirm="onPickerConfirm"
      @cancel="showPicker = false"
    ></u-picker>
    <u-popup
      :show="addressPopupShow"
      mode="bottom"
      round="18"
      :customStyle="'background: #f5f5f5;'"
      :height="1000"
      @close="addressPopupShow = false"
    >
      <view class="address-popup">
        <view class="address-popup-header">
          <view class="address-popup-title">收货地址管理</view>
          <view class="address-popup-add" @click="onAddAddress">新增地址</view>
        </view>
        <view class="address-popup-list">
          <view class="address-card" v-for="item in addressList" :key="item.id">
            <view class="address-card-info">
              <view class="address-card-address">{{ item.address }}</view>
              <view class="address-card-user">
                <text>{{ item.name }}</text>
                <text class="address-card-phone">{{ item.phone }}</text>
              </view>
            </view>
            <view class="address-card-edit" @click="onEditAddress(item)"
              >修改</view
            >
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";

const goUserAgreement = () => {
  uni.navigateTo({ url: "/pages/user-agreement" });
};
const goOrderList = () => {
  uni.navigateTo({ url: "/pages/order-list" });
};
const subjectList = ["主体A", "主体B", "主体C"];
const showPicker = ref(false);
const currentSubject = ref(subjectList[0]);
const goodsList = ref([
  { id: 1, name: "奶油草莓" },
  { id: 2, name: "黑巧克力" },
  { id: 3, name: "唐师傅方店" },
]);
const addressPopupShow = ref(false);
const addressList = ref([
  { id: 1, address: "广场小区31-2-201", name: "张三", phone: "19800009999" },
  { id: 2, address: "广场小区31-2-201", name: "张三", phone: "19800009999" },
  { id: 3, address: "广场小区31-2-201", name: "张三", phone: "19800009999" },
  { id: 4, address: "广场小区31-2-201", name: "张三", phone: "19800009999" },
  { id: 5, address: "广场小区31-2-201", name: "张三", phone: "19800009999" },
]);

onMounted(() => {
  const token = uni.getStorageSync("USER_TOKEN");
  if (!token) {
    uni.setStorageSync("LOGIN_REDIRECT", "/pages/mine");
    uni.reLaunch({ url: "/pages/login" });
  }
});

function onPickerConfirm(e) {
  currentSubject.value = subjectList[e.indexs[0]];
  showPicker.value = false;
  //   fetchList()
}

function fetchList() {
  // 模拟接口请求，不同主体返回不同商品
  goodsList.value = [];
  setTimeout(() => {
    goodsList.value = [
      { id: 1, name: "奶油草莓" },
      { id: 2, name: "黑巧克力" },
      { id: 3, name: "唐师傅方店" },
    ];
  }, 400);
}

function goOrderDetail(item) {
  uni.navigateTo({ url: "/pages/order-detail?id=" + item.id });
}

function onAddAddress() {
  uni.navigateTo({ url: "/pages/address-detail" });
}

function onEditAddress(item) {
  uni.navigateTo({ url: "/pages/address-detail?id=" + item.id });
}
</script>

<style scoped lang="scss">
.mine-page {
  min-height: 100vh;
  background: #fff;
}
.mine-header {
  font-size: 34rpx;
  color: #181818;
  padding: 32rpx 24rpx 18rpx 24rpx;
}
.mine-card-title {
  font-size: 30rpx;
  padding-left: 24rpx;
  font-weight: bold;
  margin-bottom: 18rpx;
  margin-top: 0;
}
.mine-card {
  background: #fff;
  border: 1rpx solid #000;
  border-radius: 16rpx;
  margin: 0 18rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12rpx 0 12rpx 0;
  box-shadow: 0 2rpx 8rpx #e0e0e0;
}
.mine-card-left {
  flex: 2;
  display: flex;
  align-items: center;
  padding-left: 24rpx;
}
.mine-goods-list {
  display: flex;
  align-items: center;
}
.mine-goods-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20rpx;
  min-width: 80rpx;
}
.mine-goods-img {
  width: 80rpx;
  height: 80rpx;
  background: #e0e0e0;
  border-radius: 10rpx;
  margin-bottom: 2rpx;
}
.mine-goods-name {
  font-size: 24rpx;
  color: #333;
  text-align: center;
}
.mine-more {
  color: #4fc08d;
  font-size: 26rpx;
  margin-bottom: 10rpx;
  font-weight: 600;
  padding-right: 24rpx;
}
.mine-card-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  padding-right: 24rpx;
  font-size: 26rpx;
  color: #444;
  height: 100%;
  .mine-status {
    margin-bottom: 8rpx;
  }
  .mine-amount {
    font-weight: bold;
    margin-bottom: 8rpx;
    font-size: 28rpx;
  }
  .mine-count {
    color: #888;
    font-size: 22rpx;
  }
}
.tool-box {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 0 24rpx;
  color: #4fc08d;
  font-size: 26rpx;
  margin-bottom: 16rpx;
  font-weight: 600;
}
.my-xy {
    color: #888;
}
.my-order {
  margin-right: 24rpx;
}
.customer-service-btn {
  background: none !important;
  border: none !important;
  color: #4fc08d !important;
  font-size: 26rpx !important;
  font-weight: 600 !important;
  padding: 0 !important;
  margin-right: 24rpx !important;
  box-shadow: none !important;
  line-height: 1.5 !important;
  height: auto !important;
  min-width: unset !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
}
.address-popup {
  background: #f5f5f5;
  border-radius: 18rpx;
  padding: 0 0 24rpx 0;
  min-width: 320rpx;
  min-height: 500rpx;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.address-popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 24rpx 0 24rpx;
}
.address-popup-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #222;
}
.address-popup-add {
  font-size: 26rpx;
  color: #4fc08d;
  font-weight: 600;
  padding: 8rpx 0 8rpx 24rpx;
  cursor: pointer;
}
.address-popup-list {
  margin-top: 18rpx;
  padding: 0 18rpx;
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  overflow-y: auto;
  max-height: 700rpx;
}
.address-card {
  background: #fff;
  border-radius: 12rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 18rpx 0 18rpx 18rpx;
  box-shadow: 0 2rpx 8rpx #e0e0e0;
}
.address-card-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.address-card-address {
  font-size: 26rpx;
  color: #222;
  margin-bottom: 8rpx;
}
.address-card-user {
  display: flex;
  flex-direction: row;
  gap: 24rpx;
  font-size: 24rpx;
  color: #444;
}
.address-card-phone {
  margin-left: 8rpx;
}
.address-card-edit {
  margin-right: 16rpx;
  background: #7be495;
  color: #fff;
  font-size: 26rpx;
  font-weight: 600;
  padding: 0 16rpx;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>

