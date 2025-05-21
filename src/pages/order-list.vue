<template>
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
</template>

<script setup>
import { ref } from 'vue';

const goodsList = ref([
  { id: 1, name: "奶油草莓" },
  { id: 2, name: "黑巧克力" },
  { id: 3, name: "唐师傅方店" },
]);
function goOrderDetail(item) {
  uni.navigateTo({ url: "/pages/order-detail?id=" + item.id });
}
</script>
<style scoped>
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
}
.mine-more {
  color: #4fc08d;
  font-size: 26rpx;
  margin-bottom: 10rpx;
  font-weight: 600;
}
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
</style>
