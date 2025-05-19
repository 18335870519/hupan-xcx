<template>
  <view class="supply-manage-page">
    <!-- 移除自定义顶部导航栏，使用默认导航栏 -->
    <view class="user-info">
      <text class="user-main">张三(管理员)19980900099</text>
      <text class="user-status">上线/供应中/21:00关闭</text>
    </view>
    <view class="manage-btn-group">
      <button :class="['manage-btn', activeTab === 0 ? 'active' : '']" @click="showModal = true">运营管理</button>
      <button :class="['manage-btn', activeTab === 1 ? 'active' : '']" @click="activeTab = 1">库存管理</button>
    </view>
    <view class="sub-tab-bar">
      <view :class="['sub-tab', subTab === 0 ? 'active' : '']" @click="subTab = 0">等待打包3单</view>
      <view :class="['sub-tab', subTab === 1 ? 'active' : '']" @click="subTab = 1">等待取货2单</view>
      <view :class="['sub-tab', subTab === 2 ? 'active' : '']" @click="subTab = 2">取货/取消3单</view>
    </view>
    <!-- tab内容区 -->
    <view v-if="subTab === 0">
      <!-- 等待打包 -->
      <view class="order-card">
        <view class="order-info">
          <view>供应单号：</view>
          <view>订单剩余时间：</view>
          <view>订单明细：</view>
          <view>1，商品名称*数量(件) 20元</view>
          <view>退款明细：</view>
          <view>1，商品名称*数量(件) 18元</view>
        </view>
        <view class="order-btns">
          <u-button type="default" size="small">退供应退款</u-button>
          <u-button type="success" size="small">打包完成</u-button>
        </view>
      </view>
      <view class="order-card gray">
        <view class="order-info">
          <view>供应单号：</view>
          <view>订单剩余时间：</view>
        </view>
        <view class="order-btns">
          <u-button class="accept-btn" type="success" size="small">立即接单</u-button>
        </view>
      </view>
    </view>
    <view v-else-if="subTab === 1">
      <!-- 等待取货 -->
      <view class="order-card">
        <view class="order-info">
          <view>供应单号：</view>
          <view>分拣员：</view>
          <view>骑手：</view>
          <view>骑手电话：</view>
          <view>订单明细：</view>
          <view>1，商品名称*数量(件) 20元</view>
          <view>退款明细：</view>
          <view>1，商品名称*数量(件) 20元</view>
        </view>
      </view>
    </view>
    <view v-else-if="subTab === 2">
      <view class="order-tips">页面展示过去48小时数据</view>
      <!-- 取货/取消 -->
      <view class="order-card">
        <view class="order-info">
          <view>供应单号：</view>
          <view>供应单状态：</view>
          <view>退款全部：3</view>
          <view>取货时间：</view>
          <view>骑手：</view>
          <view>骑手电话：</view>
          <view>订单明细：</view>
          <view>1，商品名称*数量(件) 23元</view>
          <view>2，商品名称*数量(件) 20元</view>
          <view>退款明细：</view>
          <view>1，商品名称*数量(件) 23元</view>
        </view>
      </view>
    </view>
    <!-- 运营管理弹窗 -->
    <view v-if="showModal" class="modal-mask">
      <view class="modal-content">
        <view class="modal-close" @click="showModal = false">关闭弹窗</view>
        <view class="modal-title">运营管理</view>
        <view class="modal-row">
          <text>供应开关：</text>
          <u-radio-group v-model="supplySwitch" class="modal-radio-group" direction="row">
            <u-radio :name="'on'" label="开始供应" customStyle="margin-right: 32rpx;" />
            <u-radio :name="'off'" label="暂停供应" />
          </u-radio-group>
        </view>
        <view class="modal-row">
          <text>每日停供时间：</text>
          <view class="modal-select" @click="showTimePicker = true">{{ stopTime || '请选择' }}</view>
          <u-picker
            :show="showTimePicker"
            :columns="[stopTimeOptions]"
            @confirm="onTimePickerConfirm"
            @cancel="showTimePicker = false"
            keyName="label"
          />
        </view>
        <view class="modal-row">
          <text>供应单号</text>
          <input v-model="queryNo" class="modal-input" placeholder="" />
          <button class="modal-query-btn">查询</button>
        </view>
        <view class="modal-table-box">
          <view class="modal-table-div">
            <view class="modal-table-row modal-table-header">
              <view class="modal-table-cell">供应单号</view>
              <view class="modal-table-cell">操作</view>
            </view>
            <view class="modal-table-row">
              <view class="modal-table-cell">GY998807</view>
              <view class="modal-table-cell">查看</view>
            </view>
          </view>
        </view>
        <view class="modal-stat-box">
          <view class="modal-stat-div">
            <view class="modal-stat-row modal-stat-header">
              <view class="modal-stat-cell">自然月</view>
              <view class="modal-stat-cell">订单量</view>
              <view class="modal-stat-cell">销售额</view>
              <view class="modal-stat-cell">退款额</view>
              <view class="modal-stat-cell">结算额</view>
            </view>
            <view class="modal-stat-row">
              <view class="modal-stat-cell">本月</view>
              <view class="modal-stat-cell"></view>
              <view class="modal-stat-cell"></view>
              <view class="modal-stat-cell"></view>
              <view class="modal-stat-cell"></view>
            </view>
            <view class="modal-stat-row">
              <view class="modal-stat-cell">上月</view>
              <view class="modal-stat-cell"></view>
              <view class="modal-stat-cell"></view>
              <view class="modal-stat-cell"></view>
              <view class="modal-stat-cell"></view>
            </view>
          </view>
        </view>
        <button class="modal-confirm-btn" @click="showModal = false">确定</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
const activeTab = ref(0)
const subTab = ref(0)
const showModal = ref(false)
const supplySwitch = ref('on')
const stopTime = ref('')
const showTimePicker = ref(false)
// 生成0:00-24:00每15分钟的时间段
const stopTimeOptions = Array.from({length: 97}, (_, i) => {
  const h = String(Math.floor(i / 4)).padStart(2, '0')
  const m = String((i % 4) * 15).padStart(2, '0')
  return `${h}:${m}`
})
const queryNo = ref('')
function onTimePickerConfirm(e) {
  stopTime.value = e.value[0]
  showTimePicker.value = false
}
function onStopTimeChange() {}
</script>

<style scoped lang="scss">
.supply-manage-page {
  min-height: 100vh;
  background: #f7f7f7;
}
.user-info {
  padding: 32rpx 24rpx 0 24rpx;
  display: flex;
  flex-direction: column;
  .user-main {
    font-size: 32rpx;
    font-weight: bold;
    color: #222;
    margin-bottom: 4rpx;
  }
  .user-status {
    color: #888;
    font-size: 24rpx;
    margin-top: 0;
  }
}
.manage-btn-group {
  display: flex;
  justify-content: flex-start;
  margin: 18rpx 24rpx 0 24rpx;
  gap: 24rpx;
  .manage-btn {
    flex: none;
    min-width: 140rpx;
    height: 56rpx;
    line-height: 56rpx;
    font-size: 22rpx;
    border: none;
    outline: none;
    border-radius: 16rpx;
    background: #fff;
    color: #222;
    font-weight: 500;
    box-shadow: 0 2rpx 8rpx #e0e0e0;
    transition: background 0.2s, color 0.2s;
    margin: 0;
    padding: 0 32rpx;
    &.active {
      background: #222;
      color: #fff;
      font-weight: bold;
      box-shadow: 0 4rpx 16rpx #bbb;
    }
  }
}
.sub-tab-bar {
  display: flex;
  margin: 18rpx 24rpx 0 24rpx;
  .sub-tab {
    flex: 1;
    text-align: center;
    padding: 10rpx 0;
    font-size: 24rpx;
    color: #666;
    background: #e8f7ee;
    border-radius: 12rpx 12rpx 0 0;
    margin-right: 8rpx;
    &.active {
      background: #7be495;
      color: #222;
      font-weight: bold;
    }
    &:last-child {
      margin-right: 0;
    }
  }
}
.order-card {
  background: #fff;
  border-radius: 18rpx;
  margin: 24rpx 24rpx 0 24rpx;
  box-shadow: 0 2rpx 8rpx #e0e0e0;
  padding: 18rpx 18rpx 12rpx 18rpx;
  border: 2rpx solid #222;
  .order-info {
    font-size: 28rpx;
    color: #222;
    margin-bottom: 12rpx;
    view {
      margin-bottom: 4rpx;
    }
  }
  .order-btns {
    display: flex;
    justify-content: space-between;
    gap: 24rpx;
    :deep(.u-button--small) {
      min-width: 90px;
      width: 90px;
      height: 30px;
      padding: 0px 8px;
      font-size: 12px;
    }
    .u-button--small + .u-button--small {
      margin-left: 24rpx;
    }
    .refund-btn {
      background: #fff !important;
      color: #333 !important;
      border: 1.5rpx solid #bdbdbd !important;
      border-radius: 32rpx !important;
      font-size: 26rpx !important;
      font-weight: 500 !important;
      height: 56rpx !important;
      line-height: 56rpx !important;
      box-shadow: 0 2rpx 8rpx #f2f2f2;
      letter-spacing: 1rpx;
      transition: background 0.2s;
    }
    .refund-btn:active {
      background: #f5f5f5 !important;
    }
    .pack-btn {
      background: linear-gradient(90deg, #34e27a 0%, #21c35b 100%) !important;
      color: #fff !important;
      border: none !important;
      border-radius: 32rpx !important;
      font-size: 26rpx !important;
      font-weight: 600 !important;
      height: 56rpx !important;
      line-height: 56rpx !important;
      box-shadow: 0 4rpx 12rpx #d6f5e2;
      letter-spacing: 1rpx;
    }
    .accept-btn {
      background: linear-gradient(90deg, #34e27a 0%, #21c35b 100%) !important;
      color: #fff !important;
      border: none !important;
      border-radius: 32rpx !important;
      font-size: 26rpx !important;
      font-weight: 600 !important;
      height: 56rpx !important;
      line-height: 56rpx !important;
      box-shadow: 0 4rpx 12rpx #d6f5e2;
      letter-spacing: 1rpx;
    }
  }
  &.gray {
    background: #eaeaea;
    .order-btns {
      .accept-btn {
        background: #21c35b !important;
        color: #fff !important;
      }
    }
  }
}
.order-tips {
  text-align: right;
  margin: 18rpx 24rpx 0 24rpx;
  color: #444;
  font-size: 24rpx;
}
.modal-mask {
  position: fixed;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.18);
  z-index: 9999;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.modal-content {
  width: 92vw;
  background: #f7f7f7;
  border-radius: 28rpx 28rpx 0 0;
  box-shadow: 0 4rpx 32rpx #bbb;
  padding: 32rpx 24rpx 24rpx 24rpx;
  position: relative;
  min-height: 600rpx;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.modal-close {
  position: absolute;
  right: 32rpx;
  top: 24rpx;
  color: #888;
  font-size: 24rpx;
  cursor: pointer;
}
.modal-title {
  text-align: center;
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 24rpx;
  color: #222;
}
.modal-row {
  display: flex;
  align-items: center;
  margin-bottom: 18rpx;
  font-size: 24rpx;
  color: #222;
  .modal-radio {
    margin-left: 18rpx;
    font-size: 22rpx;
    color: #444;
    input[type="radio"] {
      margin-right: 6rpx;
    }
  }
  .modal-select {
    margin-left: 8rpx;
    font-size: 22rpx;
    border-radius: 8rpx;
    border: 1rpx solid #ccc;
    padding: 4rpx 12rpx;
    background: #fff;
    min-width: 120rpx;
    color: #222;
  }
  .modal-input {
    margin-left: 8rpx;
    font-size: 22rpx;
    border-radius: 8rpx;
    border: 1rpx solid #ccc;
    padding: 4rpx 12rpx;
    background: #fff;
    flex: 1;
  }
  .modal-query-btn {
    margin-left: 8rpx;
    background: #b6f5c6;
    color: #222;
    border: none;
    border-radius: 8rpx;
    font-size: 22rpx;
    padding: 8rpx 22rpx;
    font-weight: 600;
    box-shadow: 0 2rpx 8rpx #e0e0e0;
  }
}
.modal-table-box {
  margin: 18rpx 0 0 0;
  overflow-x: auto;
}
.modal-table-div {
  width: 100%;
  background: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  margin-top: 0;
  box-sizing: border-box;
}
.modal-table-row {
  display: flex;
  border-bottom: 1rpx solid #ccc;
}
.modal-table-row:last-child {
  border-bottom: none;
}
.modal-table-header {
  background: #f5f5f5;
  font-weight: 600;
}
.modal-table-cell {
  flex: 1;
  text-align: center;
  font-size: 22rpx;
  padding: 10rpx 0;
  border-right: 1rpx solid #ccc;
}
.modal-table-cell:last-child {
  border-right: none;
}
.modal-stat-box {
  margin: 18rpx 0 0 0;
  overflow-x: auto;
}
.modal-stat-div {
  width: 100%;
  background: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  margin-top: 0;
  box-sizing: border-box;
}
.modal-stat-row {
  display: flex;
  border-bottom: 1rpx solid #ccc;
}
.modal-stat-row:last-child {
  border-bottom: none;
}
.modal-stat-header {
  background: #f5f5f5;
  font-weight: 600;
}
.modal-stat-cell {
  flex: 1;
  text-align: center;
  font-size: 22rpx;
  padding: 10rpx 0;
  border-right: 1rpx solid #ccc;
}
.modal-stat-cell:last-child {
  border-right: none;
}
.modal-confirm-btn {
  margin: 32rpx 0 0 0;
  background: linear-gradient(90deg, #34e27a 0%, #21c35b 100%);
  color: #fff;
  border: none;
  border-radius: 16rpx;
  font-size: 26rpx;
  font-weight: 700;
  height: 56rpx;
  line-height: 56rpx;
  box-shadow: 0 4rpx 12rpx #d6f5e2;
  letter-spacing: 2rpx;
}
.modal-radio-group {
  margin-left: 18rpx;
  font-size: 22rpx;
  color: #444;
  display: flex;
  align-items: center;
}
</style> 