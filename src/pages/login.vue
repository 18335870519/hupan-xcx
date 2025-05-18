<template>
  <view class="login-page">
    <view class="login-logo">
      <image src="/static/logo.png" mode="aspectFit" class="logo-img"></image>
    </view>
    <view class="login-title">欢迎登录</view>
    <view class="login-desc">请使用微信手机号一键登录</view>

    <view class="login-agree-row">
      <u-checkbox-group v-model="checkedArr">
        <u-checkbox name="agree" shape="circle" activeColor="#4fc08d" size="18">我已阅读并同意</u-checkbox>
      </u-checkbox-group>
      <text class="login-protocol-link" @click="showProtocol = true">《用户协议》</text>
    </view>

    <button
      class="login-btn"
      type="primary"
      open-type="getPhoneNumber"
      :disabled="!checkedArr.length"
      @getphonenumber="onGetPhoneNumber"
    >
      微信手机号一键登录
    </button>

    <!-- 协议弹窗 -->
    <u-popup :show="showProtocol" mode="center" round="16" @close="showProtocol = false">
      <view class="protocol-popup">
        <view class="protocol-title">用户协议</view>
        <scroll-view scroll-y class="protocol-content">
          <text>
            这里是用户协议内容。你可以在这里详细描述用户协议条款、隐私政策等内容。
          </text>
        </scroll-view>
        <u-button type="primary" size="small" class="protocol-btn" @click="showProtocol = false">我已阅读</u-button>
      </view>
    </u-popup>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const checkedArr = ref(['agree'])
const showProtocol = ref(false)

function onGetPhoneNumber(e) {
  if (e.detail.errMsg === 'getPhoneNumber:ok') {
    uni.showToast({ title: '登录成功', icon: 'success' })
    uni.setStorageSync('USER_TOKEN', '123')
    // 获取重定向参数
    const redirect = uni.getStorageSync('LOGIN_REDIRECT')
    if (redirect) {
      uni.removeStorageSync('LOGIN_REDIRECT')
      uni.reLaunch({ url: redirect })
    } else {
      uni.switchTab({ url: '/pages/index' })
    }
  } else {
    uni.showToast({ title: '授权失败', icon: 'none' })
  }
}

onMounted(() => {
  uni.setNavigationBarTitle({ title: '登录页' })
})
</script>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  background: #f7f7f7;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 40rpx;
}
.login-logo {
  margin-top: 120rpx;
  margin-bottom: 40rpx;
  .logo-img {
    width: 120rpx;
    height: 120rpx;
    border-radius: 24rpx;
    background: #e0e0e0;
  }
}
.login-title {
  font-size: 38rpx;
  font-weight: bold;
  color: #222;
  margin-bottom: 18rpx;
}
.login-desc {
  font-size: 26rpx;
  color: #888;
  margin-bottom: 60rpx;
}
.login-agree-row {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
  font-size: 22rpx;
  color: #666;
}
.login-protocol-link {
  color: #4fc08d;
  margin-left: 8rpx;
  text-decoration: underline;
}
.login-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  font-size: 30rpx;
  background: #4fc08d;
  color: #fff;
  border-radius: 44rpx;
  margin-bottom: 40rpx;
  font-weight: bold;
  letter-spacing: 2rpx;
  border: none;
}
.login-btn[disabled] {
  background: #e0e0e0 !important;
  color: #bbb !important;
}
.protocol-popup {
  width: 600rpx;
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx 24rpx 24rpx 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.protocol-title {
  font-size: 30rpx;
  font-weight: bold;
  margin-bottom: 18rpx;
  color: #222;
}
.protocol-content {
  max-height: 400rpx;
  font-size: 24rpx;
  color: #444;
  margin-bottom: 24rpx;
}
.protocol-btn {
  width: 220rpx;
  border-radius: 24rpx;
}
</style>