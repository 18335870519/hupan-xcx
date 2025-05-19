<template>
  <view class="agreement-list">
    <view class="agreement-item">用户协议</view>
    <view class="agreement-item">隐私政策</view>
    <view class="agreement-item">免责声明</view>
    <view class="agreement-item">服务资质</view>
  </view>
</template>

<style scoped>
.agreement-list {
  background: #fff;
  padding: 32rpx 0;
}
.agreement-item {
  font-size: 28rpx;
  color: #222;
  padding: 24rpx 32rpx;
  border-bottom: 1rpx solid #ccc;
}
.agreement-item:last-child {
  border-bottom: none;
}
</style>
