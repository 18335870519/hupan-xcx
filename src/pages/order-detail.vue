<template>
  <view class="order-detail-page">
    <!-- 订单状态栏 -->
    <view class="order-status-bar">
      <view class="order-status-left">
        <text class="order-status-title">订单状态</text>
        <text  v-if="isNotSupplier" class="order-status-desc">(预计12点32分前送达，如遇繁忙和乐天气会有延迟)</text>
      </view>
      <u-button
        v-if="isNotSupplier"
        class="order-invoice-btn"
        plain
        size="mini"
        shape="circle"
        @click="invoicePopupShow = true"
      >发票</u-button>
    </view>

    <!-- 商品明细 -->
    <view class="order-goods-card">
      <view v-for="item in goodsList" :key="item.id" class="order-goods-row">
        <view class="order-goods-img"></view>
        <view class="order-goods-info">
          <view class="order-goods-name">{{ item.name }}</view>
          <view class="order-goods-qty">数量：{{ item.qty }}</view>
        </view>
        <view class="order-goods-amount">￥{{ item.amount }}</view>
      </view>
      <view class="order-fee-row">
        <view>打包费</view>
        <view>￥2.00</view>
      </view>
      <view class="order-fee-row">
        <view>配送费</view>
        <view>￥3.00</view>
      </view>
      <view class="order-fee-row order-fee-total">
        <view>合计</view>
        <view>￥{{ totalAmount }}</view>
      </view>
    </view>

    <!-- 订单信息 -->
    <view class="order-info">
      <view>用户单号：1234567890</view>
      <view>下单时间：2024-06-01 12:00:00</view>
      <view>支付方式：微信支付</view>
      <view>支付时间：2024-06-01 12:01:00</view>
      <view>送达时间：2024-06-01 12:32:00</view>
      <view>收货人姓名：张三</view>
      <view>收货人电话：138****8888</view>
      <view>收货地址：北京市朝阳区某某路88号</view>
    </view>

    <!-- 底部操作栏 -->
    <view class="order-bottom-bar">
      <u-button class="order-btn" type="info" plain @click="refundPopupShow = true">{{ isNotSupplier ? '申请退款' : '退供退款' }}</u-button>
      <u-button class="order-btn" type="info" plain @click="refundDetailPopupShow = true">退款详情</u-button>
      <u-button v-if="isNotSupplier" class="order-btn" type="info" plain @click="cancelOrder">取消订单</u-button>
      <u-button v-if="isNotSupplier" class="order-btn order-btn-main" type="primary" @click="payOrder">立即支付</u-button>
      <u-button v-if="isNotSupplier" class="order-btn order-btn-green" type="success" plain @click="callRider">联系骑手</u-button>
    </view>

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
        <view class="refund-section">
          <view class="refund-label">退款原因</view>
          <u-radio-group v-if="isNotSupplier"  v-model="refundReason" class="refund-radio-group">
            <u-radio label="商品过期变质" name="商品过期变质"></u-radio>
            <u-radio label="其他" name="其他"></u-radio>
          </u-radio-group>
             <u-radio-group v-else  v-model="refundReason" class="refund-radio-group">
            <u-radio label="商品缺货" name="商品缺货"></u-radio>
          </u-radio-group>
        </view>
        <view v-if="isNotSupplier" class="refund-section">
          <u-textarea
            v-model="refundDesc"
            placeholder="退款详细描述100字内"
            maxlength="100"
            height="80"
            border="none"
            class="refund-textarea"
          ></u-textarea>
        </view>
        <view v-if="isNotSupplier" class="refund-section refund-upload-row">
          <u-upload
            :fileList="refundImages"
            @afterRead="afterRead"
            @delete="deleteImage"
            multiple
            maxCount="3"
            width="64"
            height="64"
            :previewFullImage="true"
            :showUploadList="true"
            :deletable="true"
            :capture="['album', 'camera']"
            class="refund-upload"
          >
            <view class="refund-upload-btn refund-upload-btn-square">
              <u-icon name="plus" size="32" color="#bbb"></u-icon>
            </view>
          </u-upload>
        </view>
        <u-button class="refund-submit-btn" type="success" @click="submitRefund">提 交</u-button>
      </view>
    </u-popup>

    <u-popup
      :show="invoicePopupShow"
      mode="bottom"
      round="18"
      :height="800"
      closeable
      @close="invoicePopupShow = false"
    >
      <view class="invoice-popup">
        <view class="invoice-popup-scroll">
          <view class="invoice-title">发票申请</view>
          <view class="invoice-section">
            <view class="invoice-label">抬头类型</view>
            <u-radio-group v-model="invoiceType" class="invoice-radio-group">
              <u-radio label="企业单位" name="company"></u-radio>
              <u-radio label="个人/非企业单位" name="person"></u-radio>
            </u-radio-group>
          </view>
          <view v-if="invoiceType === 'person'" class="invoice-section">
            <u-input v-model="personTitle" border="bottom" placeholder="抬头名称" />
            <u-input v-model="personEmail" border="bottom" placeholder="电子邮箱" />
          </view>
          <view v-else class="invoice-section">
            <u-input v-model="companyTitle" border="bottom" placeholder="公司抬头" />
            <u-input v-model="companyTax" border="bottom" placeholder="公司税号" @input="e => companyTax.value = e.toUpperCase()" />
            <u-input v-model="companyEmail" border="bottom" placeholder="电子邮箱" />
          </view>
          <view class="invoice-tip">
            提示：申请成功后电子发票会发送至您的邮箱
          </view>
        </view>
        <view class="invoice-popup-footer">
          <u-button class="invoice-submit-btn" type="success" @click="submitInvoice">提交</u-button>
        </view>
      </view>
    </u-popup>

    <u-popup
      :show="refundDetailPopupShow"
      mode="center"
      round="18"
      :overlayStyle="'background: rgba(0,0,0,0.25)'"
      :customStyle="'width: 90vw; max-width: 500rpx; min-height: 400rpx; background: #f5f5f5;'"
      closeable
      @close="refundDetailPopupShow = false"
    >
      <view class="refund-detail-popup">
        <view class="refund-detail-title">已退款详情</view>
        <view class="refund-detail-table">
          <view class="refund-detail-table-header">
            <text style="flex:2">商品名称</text>
            <text style="flex:1">数量(件)</text>
            <text style="flex:1">金额(元)</text>
          </view>
          <view class="refund-detail-table-row" v-for="item in refundDetailList" :key="item.id">
            <text style="flex:2">{{ item.name }}</text>
            <text style="flex:1">{{ item.qty }}</text>
            <text style="flex:1">{{ item.amount }}</text>
          </view>
        </view>
        <view class="refund-detail-reason">
          <text>退款原因：</text>
          <text class="refund-detail-reason-text">{{ refundDetailReason }}</text>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

// 存储URL参数
const routeParams = ref({})

// 使用onLoad钩子直接接收页面参数
onLoad((options) => {
  console.log(999, '页面参数:', options)
  routeParams.value = options || {}
})

// 检查URL参数中是否有type=gys
const isNotSupplier = computed(() => {
  return routeParams.value.type !== 'gys'
})


const goodsList = ref([
  { id: 1, name: '商品A', qty: 2, amount: 18.00 },
  { id: 2, name: '商品B', qty: 1, amount: 12.00 },
  { id: 3, name: '商品C', qty: 3, amount: 21.00 }
])

const totalAmount = computed(() => {
  // 商品金额+打包费2+配送费3
  let sum = goodsList.value.reduce((acc, cur) => acc + cur.amount, 0)
  return (sum + 2 + 3).toFixed(2)
})

const refundPopupShow = ref(false)
const refundGoods = ref([
  { id: 1, name: '商品A', qty: 1 },
  { id: 2, name: '商品B', qty: 1 },
  { id: 3, name: '商品C', qty: 1 }
])
const refundAmount = ref(10)
const refundReason = ref('商品过期变质')
const refundDesc = ref('')
const refundImages = ref([])
if(!isNotSupplier.value){
  refundReason.value = '商品缺货'
}
const invoicePopupShow = ref(false)
const invoiceType = ref('company')
const personTitle = ref('')
const personEmail = ref('')
const companyTitle = ref('')
const companyTax = ref('')
const companyEmail = ref('')

const refundDetailPopupShow = ref(false)
const refundDetailList = ref([
  { id: 1, name: '商品A', qty: 1, amount: '18.00' },
  { id: 2, name: '商品B', qty: 2, amount: '24.00' }
])
const refundDetailReason = ref('商品过期变质')

function callRider() {
  uni.showModal({
    title: '拨打电话',
    content: '是否拨打骑手电话 18335870519？',
    confirmText: '拨打',
    success: (res) => {
      if (res.confirm) {
        uni.makePhoneCall({ phoneNumber: '18335870519' })
      }
    }
  })
}

function cancelOrder() {
  uni.showModal({
    title: '取消订单',
    content: '确定要取消该订单吗？',
    confirmText: '确定',
    cancelText: '再想想',
    success: (res) => {
      if (res.confirm) {
        // 这里执行订单取消逻辑
        uni.showToast({ title: '订单已取消', icon: 'success' })
      }
    }
  })
}

function payOrder() {
  // 这里调用微信支付逻辑，先用假提示
  uni.showToast({ title: '支付成功', icon: 'success' })
}

function subRefundQty(idx) {
  if (refundGoods.value[idx].qty > 0) refundGoods.value[idx].qty--
}
function addRefundQty(idx) {
  refundGoods.value[idx].qty++
}
function afterRead(event) {
  // event.file 是上传的图片对象
  refundImages.value.push({ url: event.file.url })
}
function deleteImage(event) {
  refundImages.value.splice(event.index, 1)
}
function submitRefund() {
  uni.showToast({ title: '已提交', icon: 'success' })
  refundPopupShow.value = false
}

function submitInvoice() {
  const emailReg = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  if (invoiceType.value === 'company') {
    if (!companyTitle.value) {
      uni.showToast({ title: '请填写公司抬头', icon: 'none' })
      return
    }
    if (!companyTax.value) {
      uni.showToast({ title: '请填写公司税号', icon: 'none' })
      return
    }
    const taxReg = /^[A-Z0-9]{15,20}$/
    if (!taxReg.test(companyTax.value.trim().toUpperCase())) {
      uni.showToast({ title: '税号格式不正确', icon: 'none' })
      return
    }
    if (!companyEmail.value) {
      uni.showToast({ title: '请填写电子邮箱', icon: 'none' })
      return
    }
    if (!emailReg.test(companyEmail.value.trim())) {
      uni.showToast({ title: '电子邮箱格式不正确', icon: 'none' })
      return
    }
  } else {
    if (!personTitle.value) {
      uni.showToast({ title: '请填写抬头名称', icon: 'none' })
      return
    }
    if (!personEmail.value) {
      uni.showToast({ title: '请填写电子邮箱', icon: 'none' })
      return
    }
    if (!emailReg.test(personEmail.value.trim())) {
      uni.showToast({ title: '电子邮箱格式不正确', icon: 'none' })
      return
    }
  }
  uni.showToast({ title: '已提交', icon: 'success' })
  invoicePopupShow.value = false
}

onMounted(() => {
  uni.setNavigationBarTitle({ title: '订单详情' })
})
</script>

<style scoped lang="scss">
.order-detail-page {
  min-height: 100vh;
  background: #f7f7f7;
}
.order-status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 24rpx 24rpx 12rpx 24rpx;
  border-bottom: 1rpx solid #eee;
}
.order-status-left {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.order-status-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #222;
  margin-right: 12rpx;
  width: 120rpx;
}
.order-status-desc {
  width: 440rpx;
  font-size: 22rpx;
  color: #888;
  padding-right: 16rpx;
  margin-left: 8rpx;
}
.order-invoice-btn {
  margin-left: 16rpx;
  min-width: unset;
  width: auto;
  height: 38rpx;
  font-size: 22rpx;
  border-radius: 19rpx !important;
  padding: 0 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 38rpx;
}
.order-goods-card {
  background: #fff;
  border-radius: 16rpx;
  margin: 18rpx 18rpx 0 18rpx;
  padding: 18rpx 0 0 0;
  box-shadow: 0 2rpx 8rpx #e0e0e0;
}
.order-goods-row {
  display: flex;
  align-items: center;
  padding: 0 24rpx 18rpx 24rpx;
  border-bottom: 1rpx solid #f5f5f5;
}
.order-goods-img {
  width: 64rpx;
  height: 64rpx;
  background: #e0e0e0;
  border-radius: 10rpx;
  margin-right: 18rpx;
}
.order-goods-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.order-goods-name {
  font-size: 24rpx;
  color: #222;
  font-weight: bold;
}
.order-goods-qty {
  font-size: 22rpx;
  color: #888;
  margin-top: 4rpx;
}
.order-goods-amount {
  font-size: 24rpx;
  color: #222;
  font-weight: bold;
  min-width: 80rpx;
  text-align: right;
  padding-left: 12rpx;
}
.order-fee-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 24rpx;
  color: #444;
  padding: 8rpx 24rpx;
  border-bottom: 1rpx solid #f5f5f5;
}
.order-fee-total {
  font-weight: bold;
  color: #222;
  font-size: 26rpx;
  border-bottom: none;
}
.order-info {
  background: #fff;
  border-radius: 16rpx;
  margin: 18rpx 18rpx 0 18rpx;
  padding: 18rpx 24rpx;
  font-size: 24rpx;
  color: #444;
  line-height: 1.8;
}
.order-bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18rpx 12rpx 18rpx 12rpx;
  z-index: 100;
  box-shadow: 0 -2rpx 8rpx #e0e0e0;
  gap: 16rpx;
}
.order-btn {
  flex: 1;
  margin: 0;
  font-size: 26rpx;
  border-radius: 28rpx !important;
  font-weight: 500;
  height: 64rpx;
  min-width: 0;
  background: #f7f7f7;
  color: #888;
  border: 1rpx solid #e0e0e0;
  transition: all 0.2s;
}
.order-btn-main {
  background: #4fc08d !important;
  color: #fff !important;
  border: none !important;
  font-weight: bold;
}
.order-btn-green {
  color: #4fc08d !important;
  border: 1rpx solid #4fc08d !important;
  background: #e8f9f1 !important;
}
.order-btn[disabled] {
  background: #f0f0f0 !important;
  color: #bbb !important;
  border: 1rpx solid #e0e0e0 !important;
}
.refund-popup {
  background: #fff;
  border-radius: 18rpx;
  box-shadow: 0 8rpx 32rpx #0001;
  padding: 36rpx 28rpx 28rpx 28rpx;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  position: relative;
}
.refund-close-btn {
  position: absolute;
  right: 24rpx;
  top: 24rpx;
  z-index: 10;
}
.refund-title {
  text-align: center;
  font-size: 34rpx;
  font-weight: bold;
  margin-bottom: 22rpx;
  color: #222;
}
.refund-section {
  margin-bottom: 20rpx;
}
.refund-label {
  font-size: 24rpx;
  color: #222;
  margin-bottom: 8rpx;
}
.refund-goods-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10rpx;
}
.refund-goods-name {
  font-size: 24rpx;
  color: #444;
}
.refund-goods-ctrl {
  display: flex;
  align-items: center;
  gap: 10rpx;
}
.refund-qty-btn {
  min-width: 44rpx !important;
  height: 44rpx !important;
  border-radius: 50% !important;
  padding: 0 !important;
  font-size: 28rpx !important;
}
.refund-goods-qty {
  font-size: 24rpx;
  width: 36rpx;
  text-align: center;
}
.refund-amount-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.refund-amount {
  font-size: 26rpx;
  color: #222;
  font-weight: bold;
}
.refund-radio-group {
  display: flex;
  gap: 32rpx;
  margin-top: 8rpx;
}
.refund-textarea {
  background: #f5f5f5;
  border-radius: 10rpx;
  padding: 14rpx;
  font-size: 24rpx;
  color: #444;
}
.refund-upload-row {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.refund-upload-btn {
  width: 64rpx;
  height: 64rpx;
  background: #f0f0f0;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1rpx solid #e0e0e0;
}
.refund-upload-btn-square {
  border-radius: 8rpx !important;
}
.refund-submit-btn {
  margin-top: 24rpx;
  background: #7be495;
  color: #fff;
  font-size: 30rpx;
  border-radius: 24rpx;
  font-weight: bold;
  height: 80rpx;
  letter-spacing: 4rpx;
}
.invoice-popup {
  display: flex;
  flex-direction: column;
  height: 800rpx;
  min-height: 600rpx;
  background: #fff;
  border-radius: 18rpx 18rpx 0 0;
  padding: 0;
}
.invoice-popup-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 36rpx 28rpx 0 28rpx;
  display: flex;
  flex-direction: column;
}
.invoice-popup-footer {
  padding: 0 28rpx 28rpx 28rpx;
  background: #fff;
}
.invoice-title {
  text-align: center;
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 22rpx;
  color: #222;
}
.invoice-section {
  margin-bottom: 18rpx;
}
.invoice-label {
  font-size: 24rpx;
  color: #222;
  margin-bottom: 8rpx;
}
.invoice-radio-group {
  display: flex;
  gap: 32rpx;
  margin-top: 8rpx;
}
.invoice-tip {
  color: #888;
  font-size: 22rpx;
  margin: 32rpx 0 18rpx 0;
  text-align: center;
}
.invoice-submit-btn {
  background: #7be495;
  color: #fff;
  font-size: 30rpx;
  border-radius: 24rpx;
  font-weight: bold;
  height: 80rpx;
  letter-spacing: 4rpx;
}
.refund-detail-popup {
  background: #f5f5f5;
  border-radius: 18rpx;
  padding: 32rpx 24rpx 24rpx 24rpx;
  min-width: 300rpx;
  min-height: 400rpx;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.refund-detail-title {
  text-align: center;
  font-size: 30rpx;
  font-weight: bold;
  color: #222;
  margin-bottom: 24rpx;
}
.refund-detail-table {
  background: #fff;
  border-radius: 12rpx;
  padding: 18rpx 12rpx 8rpx 12rpx;
  margin-bottom: 18rpx;
  box-shadow: 0 2rpx 8rpx #e0e0e0;
}
.refund-detail-table-header {
  display: flex;
  font-size: 24rpx;
  color: #666;
  font-weight: 500;
  border-bottom: 1rpx solid #e0e0e0;
  padding-bottom: 8rpx;
  margin-bottom: 8rpx;
}
.refund-detail-table-row {
  display: flex;
  font-size: 24rpx;
  color: #333;
  padding: 6rpx 0;
  align-items: center;
}
.refund-detail-reason {
  font-size: 24rpx;
  color: #444;
  margin-top: 18rpx;
  display: flex;
  align-items: flex-start;
}
.refund-detail-reason-text {
  color: #666;
  margin-left: 8rpx;
  word-break: break-all;
}
</style>