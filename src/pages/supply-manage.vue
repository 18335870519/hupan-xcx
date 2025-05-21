<template>
  <view class="supply-manage-page">
    <!-- 移除自定义顶部导航栏，使用默认导航栏 -->
    <view class="user-info">
      <text class="user-main">张三(管理员)19980900099</text>
      <text class="user-status">上线/供应中/21:00关闭</text>
    </view>
    <view class="manage-btn-group">
      <button :class="['manage-btn', activeTab === 0 ? 'active' : '']" @click="showModal = true">运营管理</button>
      <button :class="['manage-btn', activeTab === 1 ? 'active' : '']" @click="showStockModal = true">库存管理</button>
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
          <u-button type="default" size="small" @click="showRefundPopup">退供退款</u-button>
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
              <view class="modal-table-cell" @click="goToOrderDetail">查看</view>
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
    <!-- 库存管理弹窗 -->
    <u-popup
      :show="showStockModal"
      mode="bottom"
      round="18"
      :customStyle="'min-height: 800rpx; background: #f7f7f7;'"
      closeable
      @close="showStockModal = false"
    >
      <view class="stock-popup">
        <view class="stock-popup-header">
          <u-radio-group v-model="stockTabRadio" class="stock-radio-group" direction="row">
            <u-radio :name="'onsale'" label="在售" customStyle="margin-right: 48rpx; font-size: 28rpx;"/>
            <u-radio :name="'soldout'" label="售罄" customStyle="font-size: 28rpx;"/>
          </u-radio-group>
        </view>
        <view class="stock-popup-row">
          <u-input v-model="stockQueryName" placeholder="商品名称" border="bottom"/>
        </view>
        <view class="stock-popup-row">
          <view class="cat-bar">
            <view v-for="(item, idx) in catLevel1" :key="item.id" :class="['cat-item', catIndex1 === idx ? 'active' : '']" @click="onCat1(idx)">{{ item.name }}</view>
          </view>
        </view>
        <view class="stock-popup-row">
          <view class="cat-bar">
            <view v-for="(item, idx) in catLevel2" :key="item.id" :class="['cat-item', catIndex2 === idx ? 'active' : '']" @click="onCat2(idx)">{{ item.name }}</view>
          </view>
        </view>
        <view class="stock-popup-row">
          <view class="cat-bar">
            <view v-for="(item, idx) in catLevel3" :key="item.id" :class="['cat-item', catIndex3 === idx ? 'active' : '']" @click="onCat3(idx)">{{ item.name }}</view>
          </view>
        </view>
        <view class="stock-popup-row" style="justify-content: flex-end;">
          <u-button type="success" size="mini" @click="onStockQuery">查询</u-button>
        </view>
        <view class="stock-divider"></view>
        <view class="stock-popup-stat">
          <view class="stock-list-bar">
            <view class="stock-list-bar-left" @click="toggleStockSort" style="flex:1;">
              <text class="stock-list-bar-label">余量</text>
              <u-icon :name="stockSortAsc ? 'arrow-up' : 'arrow-down'" color="#4fc08d" size="22" style="margin-left: 6rpx;"/>
            </view>
            <u-tag text="库存配置58条" type="success" size="medium" @click="navigateToDetails"/>
          </view>
        </view>
        <scroll-view class="stock-popup-list" scroll-y>
          <view v-for="(item, idx) in sortedStockList" :key="item.id" class="stock-popup-item">
            <view class="stock-popup-item-inner">
              <view class="stock-popup-item-title">{{ item.name }}</view>
              <view class="stock-popup-item-meta">
                <text class="stock-popup-item-price">{{ item.price }}元</text>
                <text class="stock-popup-item-stock">余量{{ item.stock }}</text>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </u-popup>



     <u-popup
      :show="refundPopupShow"
      mode="bottom"
      round="18"
      :safeAreaInsetBottom="false"
      :overlayStyle="'background: rgba(0,0,0,0.25)'"
      :height="1000"
      closeable
      @close="refundPopupShow = false"
    >
      <view class="refund-popup">
        <view class="refund-title">申请退款</view>
        <view class="refund-section">
          <view class="refund-label">选择退款商品与数量</view>
          <view v-for="(item, idx) in refundGoods" :key="item.id" class="refund-goods-row">
            <view class="refund-goods-name">{{ item.name }}</view>
            <view class="refund-goods-ctrl">
              <u-button
                size="mini"
                plain
                shape="circle"
                class="refund-qty-btn"
                @click="subRefundQty(idx)"
                :disabled="item.qty === 0"
              > - </u-button>
              <text class="refund-goods-qty">{{ item.qty }}</text>
              <u-button size="mini" plain shape="circle" class="refund-qty-btn" @click="addRefundQty(idx)">+</u-button>
            </view>
          </view>
        </view>
        <view class="refund-section refund-amount-row">
          <view class="refund-label">退款金额</view>
          <view class="refund-amount">￥{{ refundAmount }}</view>
        </view>
        <view class="refund-btn-box">
            <u-button class="refund-submit-btn" type="success" @click="submitRefund">提 交</u-button>
        </view>
      </view>
    </u-popup>






    
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
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
const showStockModal = ref(false)
const stockTabRadio = ref('onsale')
const stockQueryName = ref('')
// 三级联动假数据
const catData = [
  {
    id: 1, name: '全部',
    children: [
      { id: 11, name: '全部', children: [ { id: 111, name: '全部' }, { id: 112, name: '饼干' }, { id: 113, name: '饮料' }, { id: 114, name: '糖果' }, { id: 115, name: '坚果' }, { id: 116, name: '其他' } ] },
      { id: 12, name: '饼干', children: [ { id: 121, name: '巧克力' }, { id: 122, name: '威化' }, { id: 123, name: '曲奇' } ] },
      { id: 13, name: '饮料', children: [ { id: 131, name: '可乐' }, { id: 132, name: '雪碧' } ] },
    ]
  },
  {
    id: 2, name: '饼干',
    children: [
      { id: 21, name: '巧克力', children: [ { id: 211, name: '德芙' }, { id: 212, name: '费列罗' } ] },
      { id: 22, name: '威化', children: [ { id: 221, name: '雀巢' }, { id: 222, name: '健达' } ] },
    ]
  },
  {
    id: 3, name: '饮料',
    children: [
      { id: 31, name: '可乐', children: [ { id: 311, name: '可口可乐' }, { id: 312, name: '百事可乐' } ] },
      { id: 32, name: '雪碧', children: [ { id: 321, name: '雪碧' } ] },
    ]
  },
  {
    id: 4, name: '糖果',
    children: [
      { id: 41, name: '棒棒糖', children: [ { id: 411, name: '阿尔卑斯' } ] },
    ]
  },
  {
    id: 5, name: '坚果',
    children: [
      { id: 51, name: '核桃', children: [ { id: 511, name: '纸皮核桃' } ] },
    ]
  },
  {
    id: 6, name: '其他',
    children: [
      { id: 61, name: '其他', children: [ { id: 611, name: '其他' } ] },
    ]
  },
]
const catIndex1 = ref(0)
const catIndex2 = ref(0)
const catIndex3 = ref(0)
const catLevel1 = catData
const catLevel2 = ref(catData[0].children)
const catLevel3 = ref(catData[0].children[0].children)
function onCat1(idx) {
  catIndex1.value = idx
  catIndex2.value = 0
  catIndex3.value = 0
  catLevel2.value = catData[idx].children
  catLevel3.value = catData[idx].children[0].children
}
function onCat2(idx) {
  catIndex2.value = idx
  catIndex3.value = 0
  catLevel3.value = catLevel2.value[idx].children
}
function onCat3(idx) {
  catIndex3.value = idx
}
const stockList = ref([
  { id: 1, name: '德芙巧克力一盒500g12条', spec: '35元', price: 35, stock: 1009 },
  { id: 2, name: '德芙巧克力一盒500g12条', spec: '35元', price: 35, stock: 1009 },
    { id: 2, name: '德芙巧克力一盒500g12条', spec: '35元', price: 35, stock: 1009 },
      { id: 2, name: '德芙巧克力一盒500g12条', spec: '35元', price: 35, stock: 1009 },
        { id: 2, name: '德芙巧克力一盒500g12条', spec: '35元', price: 35, stock: 1009 }

])
function onStockQuery() {
  // 查询逻辑
}
const stockSortAsc = ref(true)
function toggleStockSort() {
  stockSortAsc.value = !stockSortAsc.value
}
const sortedStockList = computed(() => {
  const arr = [...stockList.value]
  arr.sort((a, b) => stockSortAsc.value ? a.stock - b.stock : b.stock - a.stock)
  return arr
})
function navigateToDetails() {
  // 构建需要传递的参数
  const params = {
    status: stockTabRadio.value, // 在售/售罄状态
    name: stockQueryName.value, // 商品名称
    cat1: catLevel1[catIndex1.value].id, // 一级分类ID
    cat2: catLevel2.value[catIndex2.value].id, // 二级分类ID
    cat3: catLevel3.value[catIndex3.value].id, // 三级分类ID
    catname1: catLevel1[catIndex1.value].name, // 一级分类名称
    catname2: catLevel2.value[catIndex2.value].name, // 二级分类名称
    catname3: catLevel3.value[catIndex3.value].name, // 三级分类名称
    sort: stockSortAsc.value ? 'asc' : 'desc' // 排序方式
  }
  
  // 将参数转换为查询字符串
  const queryStr = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
    
  // 跳转到库存配置页，携带查询参数
  uni.navigateTo({
    url: `/pages/stock-config?${queryStr}`
  })
}

// 退款弹窗相关状态
const refundPopupShow = ref(false)
const refundGoods = ref([
  { id: 1, name: '商品名称*数量(件)', price: 20, qty: 0 },
  { id: 2, name: '商品名称*数量(件)', price: 18, qty: 0 }
])
const refundReason = ref('商品过期变质')
const refundDesc = ref('')
const refundImages = ref([])

// 计算退款总金额
const refundAmount = computed(() => {
  return refundGoods.value.reduce((sum, item) => {
    return sum + (item.price * item.qty)
  }, 0)
})

// 显示退款弹窗
function showRefundPopup() {
  refundPopupShow.value = true
}

// 增加退款商品数量
function addRefundQty(index) {
  refundGoods.value[index].qty++
}

// 减少退款商品数量
function subRefundQty(index) {
  if (refundGoods.value[index].qty > 0) {
    refundGoods.value[index].qty--
  }
}

// 上传图片后的处理
function afterRead(event) {
  refundImages.value = [...refundImages.value, ...event.file]
}

// 删除图片
function deleteImage(event) {
  refundImages.value.splice(event.index, 1)
}

// 提交退款申请
function submitRefund() {
  // 验证是否选择了退款商品
  const hasSelectedGoods = refundGoods.value.some(item => item.qty > 0)
  if (!hasSelectedGoods) {
    uni.showToast({
      title: '请选择退款商品和数量',
      icon: 'none'
    })
    return
  }
  
  // 实际提交逻辑
  console.log('提交退款申请', {
    goods: refundGoods.value.filter(item => item.qty > 0),
    amount: refundAmount.value,
    reason: refundReason.value,
    description: refundDesc.value,
    images: refundImages.value
  })
  
  // 提交成功后关闭弹窗
  uni.showToast({
    title: '退款申请已提交',
    icon: 'success'
  })
  refundPopupShow.value = false
}

// 在script setup部分添加跳转方法
function goToOrderDetail() {
  uni.navigateTo({
    url: '/pages/order-detail?type=gys'
  })
}
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
.stock-popup {
  display: flex;
  flex-direction: column;
  padding: 32rpx 28rpx 24rpx 28rpx;
  box-sizing: border-box;
}
.stock-popup-header {
  margin-bottom: 18rpx;
  margin-top: 8rpx;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.stock-popup-row {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}
.stock-popup-stat {
  margin-bottom: 16rpx;
  display: flex;
  justify-content: flex-end;
}
.stock-popup-list {
  height: 400rpx;
  overflow-y: auto;
  background: #fff;
  border-radius: 12rpx;
  margin-top: 8rpx;
}
.stock-popup-item {
  font-size: 24rpx;
  margin-bottom: 16rpx;
  color: #222;
  padding: 10rpx 0 8rpx 0;
  border-bottom: 1rpx solid #eee;
}
.stock-radio-group {
  margin-bottom: 12rpx;
  margin-top: 8rpx;
  font-size: 28rpx;
  .u-radio {
    margin-right: 48rpx;
  }
}
// uview u-input输入框边框美化
:deep(.u-input__content__field-wrapper__field) {
  border: 1px solid #ccc !important;
  border-radius: 8rpx;
  padding: 8rpx 16rpx;
  background: #fff;
}
.cat-bar {
  display: flex;
  align-items: center;
  background: #fff;
  border: 2rpx solid #4fc08d;
  border-radius: 16rpx;
  margin-bottom: 12rpx;
  padding: 0 12rpx;
  min-height: 48rpx;
  margin-top: 0;
  width: 100%;
}
.cat-item {
  font-size: 26rpx;
  color: #666;
  margin: 0 16rpx;
  padding: 8rpx 0;
  cursor: pointer;
  transition: color 0.2s;
}
.cat-item.active {
  color: #ff9900;
  font-weight: bold;
}
// 查询按钮宽度美化
:deep(.stock-popup-row .u-button) {
  width: 160rpx !important;
  min-width: 160rpx !important;
  font-size: 28rpx;
  box-sizing: border-box;
}
:deep(.u-button--primary) {
  width: 180rpx !important;
}
.stock-divider {
  width: 100%;
  height: 1px;
  background: #eaeaea;
  margin: 12px 0;
}
.stock-list-bar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12rpx;
  margin-top: 0;
}
.stock-list-bar-left {
  display: flex;
  align-items: center;
  font-size: 26rpx;
  color: #222;
  cursor: pointer;
  font-weight: bold;
  flex: 1;
}
.stock-list-bar-label {
  color: #222;
  font-size: 26rpx;
}
.stock-list-bar-btn {
  min-width: 120rpx;
  font-size: 24rpx;
  height: 44rpx;
  border-radius: 12rpx;
}
.stock-popup-item {
  background: #fff;
  border-radius: 18rpx;
  box-shadow: 0 2rpx 8rpx #e0e0e0;
  border: 2rpx solid #4fc08d;
  padding: 4rpx 20rpx 4rpx 20rpx;
  display: flex;
  flex-direction: column;
}
.stock-popup-item-inner {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}
.stock-popup-item-title {
  font-size: 24rpx;
  font-weight: bold;
  color: #222;
}
.stock-popup-item-meta {
  display: flex;
  gap: 24rpx;
  font-size: 24rpx;
  color: #888;
}
.stock-popup-item-spec {
  color: #888;
}
.stock-popup-item-price {
  color: #4fc08d;
}
.stock-popup-item-stock {
  color: #888;
}
.refund-popup {
  height: 800rpx;
  padding: 32rpx 28rpx 24rpx 28rpx;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
}
.refund-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 24rpx;
  color: #222;
}
.refund-section {
  margin-bottom: 18rpx;
}
.refund-label {
  font-size: 24rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
  color: #222;
}
.refund-goods-row {
  display: flex;
  align-items: center;
  margin-bottom: 8rpx;
}
.refund-goods-name {
  flex: 1;
  font-size: 24rpx;
  color: #222;
}
.refund-goods-ctrl {
  display: flex;
  align-items: center;
}
.refund-qty-btn {
  width: 48rpx;
  height: 48rpx;
  border: 1rpx solid #bdbdbd;
  border-radius: 50%;
  margin: 0 8rpx;
}
.refund-goods-qty {
  font-size: 24rpx;
  color: #222;
}
.refund-amount-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8rpx;
}
.refund-amount {
  font-size: 24rpx;
  color: #4fc08d;
}
.refund-radio-group {
  margin-bottom: 12rpx;
}
.refund-textarea {
  width: 100%;
  height: 80rpx;
  border: none;
  padding: 8rpx 16rpx;
  background: #fff;
}
.refund-upload-row {
  margin-bottom: 16rpx;
}
.refund-upload {
  width: 64rpx;
  height: 64rpx;
  border: 1rpx solid #bdbdbd;
  border-radius: 50%;
  margin: 0 8rpx;
}
.refund-upload-btn {
  width: 64rpx;
  height: 64rpx;
  border: none;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.refund-upload-btn-square {
  width: 48rpx;
  height: 48rpx;
  border: none;
  border-radius: 50%;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.refund-submit-btn {
  width: 100%;
  background: linear-gradient(90deg, #34e27a 0%, #21c35b 100%);
  color: #fff;
  border: none;
  border-radius: 16rpx;
  font-size: 26rpx;
  font-weight: 700;
  height: 80rpx;
  line-height: 80rpx;
  box-shadow: 0 4rpx 12rpx #d6f5e2;
  letter-spacing: 2rpx;
  position: absolute;
  bottom: 30rpx;
  left: 0;
  right: 0;
  margin: 0 28rpx;
}
.refund-btn-box {
  position: absolute;
  bottom: 30rpx;
  left: 0;
  right: 0;
  margin: 0 28rpx;
}
</style> 