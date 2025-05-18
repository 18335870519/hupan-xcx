<template>
  <view class="address-detail-page">
    <view class="address-detail-header">
      <text>地址变更</text>
      <!-- 可加返回按钮/更多按钮 -->
    </view>
    <view class="address-detail-section">
      <view class="address-detail-label">选择家庭地址</view>
      <view class="address-detail-select-row">
        <view class="address-detail-select-input-wrap" @click="showAreaPicker = true">
          <u-input
            v-model="area"
            placeholder="请选择小区"
            suffixIcon="arrow-down"
            class="address-detail-select-input"
            readonly
            disabled
            :border="false"
          />
        </view>
      </view>
      <view class="address-detail-select-row">
        <view class="address-detail-select-input-wrap" @click="showBuildingPicker = true">
          <u-input
            v-model="building"
            placeholder="几栋"
            suffixIcon="arrow-down"
            class="address-detail-select-input"
            disabled
            :border="false"
          />
        </view>
        <view class="address-detail-select-input-wrap" @click="showUnitPicker = true">
          <u-input
            v-model="unit"
            placeholder="几单元"
            suffixIcon="arrow-down"
            class="address-detail-select-input"
            disabled
            :border="false"
          />
        </view>
        <view class="address-detail-select-input-wrap" @click="showRoomPicker = true">
          <u-input
            v-model="room"
            placeholder="门牌号"
            suffixIcon="arrow-down"
            class="address-detail-select-input"
            disabled
            :border="false"
          />
        </view>
      </view>
      <!-- 小区选择器 -->
      <u-picker
        :show="showAreaPicker"
        :columns="[areaOptions.map(a => a.label)]"
        @confirm="onAreaConfirm"
        @cancel="showAreaPicker = false"
      />
      <!-- 栋选择器 -->
      <u-picker
        :show="showBuildingPicker"
        :columns="[buildingOptions]"
        @confirm="onBuildingConfirm"
        @cancel="showBuildingPicker = false"
      />
      <!-- 单元选择器 -->
      <u-picker
        :show="showUnitPicker"
        :columns="[unitOptions]"
        @confirm="onUnitConfirm"
        @cancel="showUnitPicker = false"
      />
      <!-- 门牌号选择器 -->
      <u-picker
        :show="showRoomPicker"
        :columns="[roomOptions]"
        @confirm="onRoomConfirm"
        @cancel="showRoomPicker = false"
      />
    </view>
    <view class="address-detail-greenbox">
      <view class="address-detail-label address-detail-greenbox-label">搜索其他地址(仅支持官方生活区服务)</view>
      <u-input
        v-model="searchAddress"
        placeholder="请输入地址"
        class="address-detail-greenbox-input"
        @input="onSearchInput"
      />
      <view v-if="searchList.length" class="address-search-list">
        <view
          v-for="item in searchList"
          :key="item.id"
          class="address-search-item"
          @click="onSelectSearch(item)"
        >
          {{ item.name }}
        </view>
      </view>
      <view class="address-detail-location-row">
        <view class="address-detail-location-text address-detail-greenbox-location-text">
          地址：{{ locationAddress }}
        </view>
      </view>
      <u-button class="address-detail-location-btn" @click="getLocation">当前定位</u-button>
      <u-textarea v-model="detail" placeholder="详细地址补充" class="address-detail-greenbox-textarea" />
    </view>
    <view class="address-detail-info">
      <view>收货人姓名：{{ name }}</view>
      <view>收货人电话：{{ phone }}</view>
    </view>
    <view class="address-detail-footer-fixed">
      <u-button class="address-detail-del" type="error" plain @click="deleteAddress">删除地址</u-button>
      <u-button class="address-detail-save" type="success" @click="saveAddress">保存地址</u-button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const area = ref('')
const building = ref('')
const unit = ref('')
const room = ref('')
const searchAddress = ref('')
const searchList = ref([])
const locationAddress = ref('广场东路便利利店门口迎宾街32号路迎宾街迎宾街迎宾街迎宾街')
const detail = ref('')
const name = ref('张三')
const phone = ref('17788678879')

// 四级联动假数据
const areaOptions = [
  {
    label: '广场小区',
    buildings: [
      {
        label: '1栋',
        units: [
          { label: '1单元', rooms: ['101', '102'] },
          { label: '2单元', rooms: ['201', '202'] }
        ]
      },
      {
        label: '2栋',
        units: [
          { label: '1单元', rooms: ['101', '102'] }
        ]
      }
    ]
  },
  {
    label: '幸福家园',
    buildings: [
      {
        label: '3栋',
        units: [
          { label: '1单元', rooms: ['301', '302'] }
        ]
      }
    ]
  }
]

const showAreaPicker = ref(false)
const showBuildingPicker = ref(false)
const showUnitPicker = ref(false)
const showRoomPicker = ref(false)

const buildingOptions = computed(() => {
  const found = areaOptions.find(a => a.label === area.value)
  return found ? found.buildings.map(b => b.label) : []
})
const unitOptions = computed(() => {
  const foundArea = areaOptions.find(a => a.label === area.value)
  const foundBuilding = foundArea?.buildings.find(b => b.label === building.value)
  return foundBuilding ? foundBuilding.units.map(u => u.label) : []
})
const roomOptions = computed(() => {
  const foundArea = areaOptions.find(a => a.label === area.value)
  const foundBuilding = foundArea?.buildings.find(b => b.label === building.value)
  const foundUnit = foundBuilding?.units.find(u => u.label === unit.value)
  return foundUnit ? foundUnit.rooms : []
})

function onAreaConfirm(e) {
  area.value = e.value[0]
  building.value = ''
  unit.value = ''
  room.value = ''
  showAreaPicker.value = false
}
function onBuildingConfirm(e) {
  building.value = e.value[0]
  unit.value = ''
  room.value = ''
  showBuildingPicker.value = false
}
function onUnitConfirm(e) {
  unit.value = e.value[0]
  room.value = ''
  showUnitPicker.value = false
}
function onRoomConfirm(e) {
  room.value = e.value[0]
  showRoomPicker.value = false
}

let searchTimer = null
function onSearchInput(val) {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    if (!val) {
      searchList.value = []
      return
    }
    // 这里用假数据模拟接口
    // 实际用uni.request请求后端
    // 假设接口返回 [{id, name}]
    uni.request({
      url: '你的地址搜索接口',
      data: { keyword: val },
      success: (res) => {
        searchList.value = res.data.list // 根据实际返回结构调整
      }
    })
  }, 300)
}

function onSelectSearch(item) {
  searchAddress.value = item.name
  locationAddress.value = item.name
  searchList.value = []
}

onLoad((options) => {
  // options.id 存在则为编辑，否则为新增
  // 可根据id请求详情
})

function getLocation() {
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      const { latitude, longitude } = res
      // 腾讯位置服务逆地理编码
      uni.showToast({ title: '获取定位成功 纬度：' + latitude + ' 经度：' + longitude, icon: 'success' })
    },
    fail: () => {
      uni.showToast({ title: '获取定位失败', icon: 'none' })
    }
  })
}
function deleteAddress() {
  uni.showModal({ title: '提示', content: '确定删除该地址？' })
}
function saveAddress() {
  uni.showToast({ title: '保存成功', icon: 'success' })
}
</script>

<style scoped lang="scss">
.address-detail-page {
  background: #f5f5f5;
  min-height: 100vh;
}
.address-detail-header {
  text-align: center;
  font-size: 32rpx;
  font-weight: bold;
  padding: 32rpx 0 18rpx 0;
  background: #f5f5f5;
}
.address-detail-section {
  padding: 0 24rpx 18rpx 24rpx;
}
.address-detail-label {
  font-size: 24rpx;
  color: #888;
  margin-bottom: 8rpx;
}
.address-detail-select-row {
  display: flex;
  gap: 12rpx;
  margin-bottom: 18rpx;
}
.address-detail-select-input-wrap {
  flex: 1;
}
.address-detail-select-input {
  pointer-events: none;
  color: #222 !important;
  font-size: 28rpx;
  background: #fff;
}
::v-deep .u-input__input[disabled] {
  color: #222 !important;
  background: #fff !important;
  opacity: 1 !important;
}
.address-detail-greenbox {
  background: #e6fbe6;
  border-radius: 18rpx;
  margin: 0 24rpx 18rpx 24rpx;
  padding: 24rpx 24rpx 24rpx 24rpx;
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  box-shadow: 0 4rpx 16rpx #b6f5b6aa;
}
.address-detail-greenbox-label {
  font-size: 28rpx;
  color: #222;
  font-weight: bold;
  margin-bottom: 8rpx;
}
.address-detail-greenbox-input {
  background: #fff !important;
  border-radius: 10rpx !important;
  font-size: 28rpx !important;
  color: #222 !important;
  border: 1rpx solid #b6f5b6 !important;
  padding: 0 18rpx !important;
}
.address-detail-greenbox-location-text {
  font-size: 26rpx;
  color: #222;
  font-weight: 500;
  margin-bottom: 0;
}
.address-detail-location-btn {
  width: 100%;
  margin: 0 0 0 0;
  border-radius: 12rpx !important;
  background: linear-gradient(90deg, #4fc08d 0%, #7be495 100%) !important;
  color: #fff !important;
  font-size: 30rpx !important;
  font-weight: bold !important;
  height: 64rpx !important;
  line-height: 64rpx !important;
  box-shadow: 0 2rpx 8rpx #b6f5b6aa;
  border: none !important;
  letter-spacing: 2rpx;
}
.address-detail-greenbox-textarea {
  background: #fff !important;
  border-radius: 10rpx !important;
  font-size: 28rpx !important;
  color: #222 !important;
  border: 1rpx solid #b6f5b6 !important;
  padding: 18rpx !important;
  min-height: 120rpx;
}
.address-detail-location-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.address-detail-info {
  margin: 18rpx 24rpx 0 24rpx;
  font-size: 24rpx;
  color: #222;
  line-height: 2;
  border-bottom: 1rpx solid #e0e0e0;
  padding-bottom: 18rpx;
}
.address-detail-footer-fixed {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  display: flex;
  justify-content: space-between;
  gap: 24rpx;
  padding: 24rpx 24rpx 32rpx 24rpx;
  border-top: 1rpx solid #eee;
  z-index: 99;
}
.address-detail-del {
  background: #fff !important;
  color: #e14c4c !important;
  border: 1rpx solid #e14c4c !important;
  font-weight: 600;
  flex: 1;
}
.address-detail-save {
  background: #4fc08d !important;
  color: #fff !important;
  font-weight: 600;
  flex: 1;
}
.address-search-list {
  background: #fff;
  border-radius: 10rpx;
  box-shadow: 0 2rpx 8rpx #b6f5b6aa;
  margin-top: 6rpx;
  max-height: 300rpx;
  overflow-y: auto;
  z-index: 10;
  position: absolute;
  left: 0; right: 0;
}
.address-search-item {
  padding: 18rpx 24rpx;
  font-size: 28rpx;
  color: #222;
  border-bottom: 1rpx solid #f0f0f0;
  cursor: pointer;
}
.address-search-item:last-child {
  border-bottom: none;
}
</style>
