<script setup>
import { ref, computed, onMounted } from 'vue'

// 假数据：一级分类（带图片）
const categoryOptions = [
  { label: '食品', value: '食品', icon: '/static/fyy/sp.png' },
  { label: '日用品', value: '日用品', icon: '/static/fyy/ryp.png' },
  { label: '餐饮', value: '餐饮', icon: '/static/fyy/cy.png' },
  { label: '服饰', value: '服饰', icon: '/static/fyy/fs.png' },
  { label: '五金', value: '五金', icon: '/static/fyy/wj.png' },
  { label: '电子文娱', value: '电子文娱', icon: '/static/fyy/dzwy.png' }
]
const cat2Map = {
  '食品': [
    { label: '零食', value: '零食' },
    { label: '饮品', value: '饮品' },
    { label: '生鲜', value: '生鲜' },
    { label: '粮油调料', value: '粮油调料' },
    { label: '保健品', value: '保健品' }
  ],
  '日用品': [
    { label: '厨品', value: '厨品' },
    { label: '洗护', value: '洗护' },
    { label: '清洁', value: '清洁' },
    { label: '家居', value: '家居' },
    { label: '文具', value: '文具' }
  ],
  '餐饮': [
    { label: '早餐', value: '早餐' },
    { label: '健康餐', value: '健康餐' },
    { label: '快餐', value: '快餐' },
    { label: '小炒', value: '小炒' },
    { label: '下午茶', value: '下午茶' },
    { label: '夜宵', value: '夜宵' }
  ],
  '服饰': [
    { label: '内搭', value: '内搭' },
    { label: '饰品', value: '饰品' },
    { label: '鞋履', value: '鞋履' },
    { label: '服装', value: '服装' },
    { label: '包袋', value: '包袋' }
  ],
  '五金': [
    { label: '交电类', value: '交电类' },
    { label: '金属类', value: '金属类' },
    { label: '机械类', value: '机械类' },
    { label: '电器工具', value: '电器工具' },
    { label: '建筑装饰', value: '建筑装饰' }
  ],
  '电子文娱': [
    { label: '潮玩', value: '潮玩' },
    { label: '运动', value: '运动' },
    { label: '配饰', value: '配饰' },
    { label: '工艺品', value: '工艺品' },
    { label: '5元专区', value: '5元专区' },
    { label: '电子设备', value: '电子设备' }
  ]
}
const cat3Map = {
  '零食': [
    { label: '肉制品', value: '肉制品' },
    { label: '糖制品', value: '糖制品' },
    { label: '膨化类', value: '膨化类' },
    { label: '果干类', value: '果干类' },
    { label: '素食品', value: '素食品' },
    { label: '速食类', value: '速食类' }
  ],
  '饮品': [
    { label: '酒', value: '酒' },
    { label: '水', value: '水' },
    { label: '果汁', value: '果汁' },
    { label: '碳酸饮料', value: '碳酸饮料' },
    { label: '功能饮料', value: '功能饮料' }
  ],
  '生鲜': [
    { label: '肉蛋', value: '肉蛋' },
    { label: '水产', value: '水产' },
    { label: '蔬菜', value: '蔬菜' },
    { label: '水果', value: '水果' },
    { label: '乳制品', value: '乳制品' }
  ],
  '粮油调料': [
    { label: '米面', value: '米面' },
    { label: '豆类', value: '豆类' },
    { label: '食用油', value: '食用油' },
    { label: '杂粮', value: '杂粮' },
    { label: '火锅料', value: '火锅料' },
    { label: '炒菜料', value: '炒菜料' }
  ],
  '厨品': [
    { label: '器皿', value: '器皿' },
    { label: '洗剂', value: '洗剂' }
  ],
  '洗护': [
    { label: '洗涤', value: '洗涤' },
    { label: '沐浴', value: '沐浴' },
    { label: '卫生品', value: '卫生品' }
  ],
  '清洁': [
    { label: '拖扫', value: '拖扫' },
    { label: '清洁剂', value: '清洁剂' }
  ],
  '家居': [
    { label: '储物', value: '储物' },
    { label: '床品', value: '床品' },
    { label: '小家电', value: '小家电' }
  ],
  '早餐': [
    { label: '蔬水', value: '蔬水' },
    { label: '蛋白', value: '蛋白' },
    { label: '饮品', value: '饮品' }
  ],
  '健康餐': [
    { label: '食材新鲜、少油少盐、拒绝化学添加、干净卫生', value: '食材新鲜、少油少盐、拒绝化学添加、干净卫生' },
  ],
  '快餐': [
    { label: '中式快餐', value: '中式快餐' },
    { label: '西式快餐', value: '西式快餐' }
  ],
  '小炒': [],
  '下午茶': [
    { label: '烘焙', value: '烘焙' },
    { label: '奶茶', value: '奶茶' },
    { label: '咖啡', value: '咖啡' },
    { label: '水果捞', value: '水果捞' }
  ],
  '夜宵': [
    { label: '卤味', value: '卤味' },
    { label: '烧烤', value: '烧烤' }
  ],
  '交电类': [
    { label: '锁具', value: '锁具' },
    { label: '门窗', value: '门窗' },
    { label: '家装', value: '家装' }
  ],
  '金属类': [
    { label: '大五金', value: '大五金' },
    { label: '小五金', value: '小五金' }
  ],
  '机械类': [
    { label: '机械用具', value: '机械用具' },
    { label: '零配件', value: '零配件' }
  ],
  '电器工具': [
    { label: '电器设备', value: '电器设备' },
    { label: '日用工具', value: '日用工具' },
    { label: '园艺工具', value: '园艺工具' }
  ],
  '建筑装饰': [
    { label: '管道类', value: '管道类' },
    { label: '防护设备', value: '防护设备' },
    { label: '装饰材料', value: '装饰材料' }
  ]
}

const goPay = () => {
  uni.navigateTo({ url: "/pages/order-detail" });
}
// 转换数据结构为模板所需格式
const categories = computed(() => {
  return categoryOptions.map(cat => {
    const children = cat2Map[cat.value] || []
    return {
      name: cat.label,
      icon: cat.icon,
      children: children.map(mid => {
        const subChildren = cat3Map[mid.value] || []
        return {
          name: mid.label,
          children: subChildren.map(sub => ({
            name: sub.label
          }))
        }
      })
    }
  })
})

const activeCat = ref(0)
const activeMid = ref(0)
const activeSub = ref(0)

// 商品假数据（增加购物车数量、状态）
const allGoods = ref([
  { cat: 0, mid: 0, sub: 0, list: [
    { id: 1, name: '乐事薯片', price: 5.5, desc: '香脆可口', stock: 10, cart: 0 },
    { id: 2, name: '品客薯片', price: 6, desc: '原味美味', stock: 0, cart: 0, status: '补货中' },
    { id: 3, name: '奥利奥', price: 4, desc: '巧克力夹心', stock: 8, cart: 0 },
    { id: 4, name: '旺旺雪饼', price: 3.5, desc: '童年回忆', stock: 12, cart: 0 },
    { id: 5, name: '好丽友派', price: 5, desc: '柔软蛋糕', stock: 7, cart: 0 },
    { id: 6, name: '卫龙辣条', price: 2.5, desc: '辣味十足', stock: 20, cart: 0 },
    { id: 7, name: '三只松鼠坚果', price: 12, desc: '健康坚果', stock: 6, cart: 0 },
    { id: 8, name: '百事可乐', price: 3, desc: '清爽饮料', stock: 15, cart: 0 },
    { id: 9, name: '可比克薯片', price: 4.5, desc: '多种口味', stock: 9, cart: 0 },
    { id: 10, name: '上好佳虾条', price: 3, desc: '酥脆美味', stock: 11, cart: 0 },
    { id: 11, name: '趣多多曲奇', price: 6.5, desc: '巧克力豆', stock: 5, cart: 0 },
    { id: 12, name: '达利园蛋黄派', price: 4.8, desc: '蛋香浓郁', stock: 13, cart: 0 },
    { id: 13, name: '徐福记沙琪玛', price: 5.2, desc: '松软香甜', stock: 10, cart: 0 },
    { id: 14, name: '良品铺子牛肉干', price: 15, desc: '高蛋白', stock: 4, cart: 0 },
    { id: 15, name: '甘源蚕豆', price: 3.8, desc: '香脆蚕豆', stock: 16, cart: 0 },
    { id: 16, name: '可乐果', price: 2.8, desc: '花生酥脆', stock: 18, cart: 0 },
    { id: 17, name: '米老头玉米棒', price: 2.2, desc: '玉米香甜', stock: 14, cart: 0 }
  ]},
  { cat: 0, mid: 0, sub: 1, list: [
    { id: 3, name: '奥利奥', price: 4, desc: '巧克力夹心', stock: 5, cart: 0 }
  ]},
  { cat: 0, mid: 1, sub: 0, list: [
    { id: 4, name: '可口可乐', price: 3, desc: '冰爽畅饮', stock: 8, cart: 0, status: '未在可售时间' }
  ]},
  { cat: 1, mid: 0, sub: 0, list: [
    { id: 5, name: '蓝月亮洗衣液', price: 18, desc: '洁净无残留', stock: 2, cart: 0 }
  ]},
  { cat: 2, mid: 0, sub: 0, list: [
    { id: 6, name: '纯棉T恤', price: 39, desc: '舒适透气', stock: 6, cart: 0 }
  ]}
])

const goods = computed(() => {
  const found = allGoods.value.find(g => g.cat === activeCat.value && g.mid === activeMid.value && g.sub === activeSub.value)
  return found ? found.list : []
})

// 计算购物车总金额
const cartTotal = computed(() => {
  let total = 0
  allGoods.value.forEach(g => {
    g.list.forEach(item => {
      if (item.cart && item.stock > 0 && !item.status) {
        total += item.cart * item.price
      }
    })
  })
  return total.toFixed(2)
})

function onCat(idx) {
  activeCat.value = idx
  activeMid.value = 0
  activeSub.value = 0
}
function onMid(idx) {
  activeMid.value = idx
  activeSub.value = 0
}
function onSub(idx) {
  activeSub.value = idx
}
// 购物车加减
function addCart(item) {
  if (item.stock > item.cart && !item.status) {
    item.cart++;
    allGoods.value = [...allGoods.value];
  }
}
function subCart(item) {
  if (item.cart > 0) {
    item.cart--;
    allGoods.value = [...allGoods.value];
  }
}

// uView Toast 提示
function showCartToast() {
  uni.$u && uni.$u.toast ? uni.$u.toast('请先添加商品') : uni.showToast({ title: '请先添加商品', icon: 'none' })
}

const tabbarActive = ref(0)

const cartPopupShow = ref(false)
const toggleCartPopup = () => {
  cartPopupShow.value = !cartPopupShow.value
}
const cartGoods = computed(() =>
  allGoods.value.flatMap(g => g.list.filter(item => item.cart > 0))
)

// 结算弹窗显示状态
const checkoutPopupShow = ref(false)
const toggleCheckoutPopup = () => {
  const token = uni.getStorageSync('USER_TOKEN')
  if (!token) {
    uni.setStorageSync('LOGIN_REDIRECT', '/pages/index')
    uni.reLaunch({ url: '/pages/login' })
  }
  setTimeout(() => {
    checkoutPopupShow.value = !checkoutPopupShow.value
  }, 2000)
}

const payFailPopupShow = ref(false)
const payFailList = ref([])

// 支付方法
function zhifu() {
  // 假设库存校验逻辑
  const lackList = cartGoods.value.filter(item => item.cart > item.stock)
  if (lackList.length > 0) {
    payFailList.value = lackList
    payFailPopupShow.value = true
    checkoutPopupShow.value = false   // 关闭结算弹窗
    uni.showToast({
      title: '支付失败，下列商品库存不足',
      icon: 'none'
    })
    return
  }
  
  // ...正常支付逻辑
  checkoutPopupShow.value = false
  cartPopupShow.value = false
  // 清空购物车
  allGoods.value.forEach(g => {
    g.list.forEach(item => {
      item.cart = 0
    })
  })
  uni.showToast({
    title: '支付成功',
    icon: 'success'
  })
}

// 地址弹窗相关 state
const addressPopupShow = ref(false)
const addressList = ref([
  { id: 1, address: '广场小区31-2-201', name: '张三', phone: '19800009999' },
  { id: 2, address: '广场小区31-2-201', name: '李四', phone: '19800008888' },
  { id: 3, address: '广场小区31-2-201', name: '王五', phone: '19800007777' }
])
const selectedAddress = ref(addressList.value[0])

function onAddAddress() {
  uni.navigateTo({ url: "/pages/address-detail" });
}

function onEditAddress(item) {
  uni.navigateTo({ url: "/pages/address-detail?id=" + item.id });
}
function onSelectAddress(item) {
  selectedAddress.value = item
  addressPopupShow.value = false
}

// 修改 goToAddress 为弹出弹窗
function goToAddress() {
  addressPopupShow.value = true
}

onMounted(() => {
  // 让第一个商品库存不足
  const first = allGoods.value[0].list[0]
  first.cart = 3
  first.stock = 1
})
</script>

<template>
  <view class="page">
    <view class="category-fixed">
      <!-- 一级分类 横向圆形图片卡片 -->
      <view class="cat-card-bar">
        <scroll-view scroll-x class="cat-card-scroll">
          <view class="cat-card-list">
            <view v-for="(cat, idx) in categories" :key="cat.name" class="cat-card-item" :class="{active: idx===activeCat}" @click="onCat(idx)">
              <image :src="cat.icon" class="cat-card-img" />
              <text class="cat-card-name">{{cat.name}}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 二级、三级分类 -->
      <view class="triple-bar">
        <scroll-view scroll-x class="triple-list">
             <view class="cat-card-list-second">
          <view v-for="(mid, idx) in categories[activeCat].children" :key="mid.name" class="cat-card-item" :class="{active: idx===activeMid}" @click="onMid(idx)">
              <text class="cat-card-name">{{mid.name}}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <view v-if="categories[activeCat].children[activeMid].children.length > 0" class="triple-sub-bar">
            <scroll-view scroll-x class="triple-sub-list">
          <view v-for="(sub, idx) in categories[activeCat].children[activeMid].children" :key="sub.name" class="triple-sub-item" :class="{active: idx===activeSub}" @click="onSub(idx)">
            {{sub.name}}
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- 商品列表 -->
    <view class="goods-list">
      <view v-if="goods.length === 0" class="goods-empty">暂无商品</view>
      <view v-for="item in goods" :key="item.id" class="goods-card">
        <view class="goods-img"></view>
        <view class="goods-info">
          <view class="goods-title">{{item.name}}</view>
          <view class="goods-price">￥{{item.price}}</view>
        </view>
        <view class="goods-ctrl">
          <template v-if="item.status === '未在可售时间'">
            <view class="goods-status">未在可售时间</view>
          </template>
          <template v-else-if="item.status === '补货中' || item.stock === 0">
            <view class="goods-status">补货中</view>
          </template>
          <template v-else>
            <view class="goods-btns">
              <u-icon name="minus-circle" size="22" color="#bbb" @click="subCart(item)" />
              <text class="goods-count">{{item.cart}}</text>
              <u-icon name="plus-circle" size="22" color="#4fc08d" @click="addCart(item)" />
            </view>
          </template>
        </view>
      </view>
      <view class="h-92"></view>
    </view>

    <!-- 购物车弹窗 -->
    <u-popup
      mode="bottom"
      :round="20"
      :safeAreaInsetBottom="false"
      :show="cartPopupShow"
      @close="cartPopupShow = false"
      overlayStyle="z-index: 1001"
      customStyle="z-index: 1002"
      closeable
    >
      <view class="cart-popup">
        <view class="cart-popup-header">
          <view class="cart-popup-title">购物车</view>
        </view>
        <scroll-view class="cart-popup-scroll" scroll-y="true">
          <view v-for="item in cartGoods" :key="item.id" class="cart-popup-item">
            <view class="cart-popup-img"></view>
            <view class="cart-popup-info">
              <view class="cart-popup-name">{{ item.name }}</view>
              <view class="cart-popup-price">￥{{ item.price }}</view>
            </view>
            <view class="cart-popup-btns">
              <u-icon name="minus-circle" size="22" color="#bbb" @click="subCart(item)" />
              <text class="cart-popup-count">{{ item.cart }}</text>
              <u-icon name="plus-circle" size="22" color="#4fc08d" @click="addCart(item)" />
            </view>
          </view>
        </scroll-view>
        <view class="cart-bar">
          <view class="cart-total"><text class="cart-total-num">合计：￥{{cartTotal}}</text></view>
          <view class="cart-btn cart-black"
            :class="{ 'cart-btn-disabled': Number(cartTotal) === 0 }"
            @click="Number(cartTotal) === 0 ? showCartToast() : toggleCartPopup()"
          >查看购物车</view>
          <view class="cart-btn cart-green"
            :class="{ 'cart-btn-disabled': Number(cartTotal) === 0 }"
            @click="Number(cartTotal) === 0 ? showCartToast() : toggleCheckoutPopup()"
          >立即购买</view>
        </view>
      </view>
    </u-popup>

    <!-- 结算弹窗 -->
    <u-popup
      mode="bottom"
      :round="28"
      :safeAreaInsetBottom="false"
      :show="checkoutPopupShow"
      @close="checkoutPopupShow = false"
      overlayStyle="z-index: 2003"
      :height="1200"
      customStyle="z-index: 2004;"
      closeable
    >
      <view class="checkout-popup">
        <view class="checkout-header">
          <view class="checkout-header-row">
            <text class="checkout-title">收货地址</text>
            <text class="checkout-edit" @click="goToAddress()">更改</text>
          </view>
          <view class="checkout-addr">{{ selectedAddress?.address || '{地址信息}' }}</view>
          <view class="checkout-user">{{ selectedAddress?.name || '{收货人姓名}' }}  {{ selectedAddress?.phone || '{收货人手机号}' }}</view>
        </view>
        <view class="checkout-delivery">
          立即配送：预计配送时长32分钟
        </view>
        <view class="checkout-goods-scroll">
          <scroll-view class="checkout-goods-scroll" scroll-y="true">
            <view class="checkout-goods">
              <view v-for="item in cartGoods" :key="item.id" class="checkout-goods-item">
                <view class="checkout-goods-img"></view>
                <view class="checkout-goods-info">
                  <view class="checkout-goods-name">{{item.name}}</view>
                  <view class="checkout-goods-count">×{{item.cart}}</view>
                </view>
                <view class="checkout-goods-price">￥{{(item.price * item.cart).toFixed(2)}}</view>
              </view>
            </view>
            <view class="checkout-fee-row">
              <view>打包费</view>
              <view>￥2.00</view>
            </view>
            <view class="checkout-fee-row">
              <view>配送费</view>
              <view>￥3.00</view>
            </view>
          </scroll-view>
        </view>
        <view class="cart-bar">
          <view class="cart-total"><text class="cart-total-num">合计：￥{{(Number(cartTotal)).toFixed(2)}}</text></view>
          <view class="cart-btn cart-green" @click="zhifu">立即支付</view>
        </view>
      </view>
    </u-popup>

    <!-- 支付失败弹窗 -->
    <u-popup
      mode="bottom"
      :round="28"
      :safeAreaInsetBottom="false"
      :show="payFailPopupShow"
      @close="payFailPopupShow = false"
      overlayStyle="z-index: 2003"
      :height="1000"
      customStyle="z-index: 2004;"
      closeable
    >
      <view class="checkout-popup">
        <view class="checkout-header">
          <view class="checkout-header-row">
            <text class="checkout-title">支付失败，下列商品库存不足</text>
          </view>
        </view>
        <view class="checkout-goods-scroll">
          <scroll-view class="checkout-goods-scroll" scroll-y="true">
            <view class="checkout-goods">
              <view v-for="item in payFailList" :key="item.id" class="checkout-goods-item">
                <view class="checkout-goods-img"></view>
                <view class="checkout-goods-info">
                  <view class="checkout-goods-name">{{item.name}}</view>
                  <view class="checkout-goods-count">缺少{{item.cart - item.stock}}</view>
                </view>
                <view class="checkout-goods-price">￥{{(item.price * (item.cart - item.stock)).toFixed(2)}}</view>
              </view>
            </view>
          </scroll-view>
        </view>
             <view class="checkout-header">
          <view class="checkout-header-row">
            <text class="checkout-title">剩余商品如下：</text>
          </view>
        </view>
        <view class="checkout-goods-scroll">
          <scroll-view class="checkout-goods-scroll" scroll-y="true">
            <view class="checkout-goods">
              <view v-for="item in payFailList" :key="item.id" class="checkout-goods-item">
                <view class="checkout-goods-img"></view>
                <view class="checkout-goods-info">
                  <view class="checkout-goods-name">{{item.name}}</view>
                  <view class="checkout-goods-count">缺少{{item.cart - item.stock}}</view>
                </view>
                <view class="checkout-goods-price">￥{{(item.price * (item.cart - item.stock)).toFixed(2)}}</view>
              </view>
            </view>
          </scroll-view>
            <view class="cart-bar">
        <view class="total-num">剩余商品：￥{{cartTotal}}</view>
          <view class="cart-btn cart-green"
            :class="{ 'cart-btn-disabled': Number(cartTotal) === 0 }"
            @click="goPay"
          >立即支付</view>
        </view>
        </view>
      </view>
    </u-popup>

    <!-- 地址管理弹窗 -->
    <u-popup
      :show="addressPopupShow"
      mode="bottom"
      round="18"
      :customStyle="'background: #f5f5f5;'"
      :height="1000"
      @close="addressPopupShow = false"
    >
      <view class="address-popup-ui">
        <view class="address-popup-header-ui">
          <view class="address-popup-title-ui">收货地址管理</view>
          <view class="address-popup-add-ui" @click="onAddAddress">新增地址</view>
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

    <!-- 底部购物车栏 -->
    <view class="cart-bar">
      <view class="cart-total"><text class="cart-total-num">合计：￥{{cartTotal}}</text></view>
      <view class="cart-btn cart-black"
        :class="{ 'cart-btn-disabled': Number(cartTotal) === 0 }"
        @click="Number(cartTotal) === 0 ? showCartToast() : toggleCartPopup()"
      >查看购物车</view>
      <view class="cart-btn cart-green"
        :class="{ 'cart-btn-disabled': Number(cartTotal) === 0 }"
        @click="Number(cartTotal) === 0 ? showCartToast() : toggleCheckoutPopup()"
      >立即购买</view>
    </view>
  </view>
</template>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background: #f7f7f7;
  display: flex;
  flex-direction: column;
}
.cat-card-bar {
  background: #b6f5c6;
  border-radius: 24rpx;
  margin: 24rpx 24rpx 0 24rpx;
  padding: 16rpx 0 8rpx 0;
  overflow: hidden;
}
.triple-bar {
  border: 4rpx solid #eaeaea;
  border-radius: 24rpx;
  margin: 24rpx 24rpx 0 24rpx;
  padding: 16rpx 0 16rpx 0;
}
.cat-card-scroll {
  overflow-x: auto;
}
.cat-card-list,
.cat-card-list-second,
.triple-list,
.triple-sub-list {
  min-width: 0;
  box-sizing: border-box;
  padding-left: 12rpx;
  padding-right: 12rpx;
}
.cat-card-list {
  display: flex;
  align-items: center;
  width: 100%;
  padding-left: 0;
  padding-right: 0;
}
.cat-card-list-second {
  display: flex;
  align-items: center;
  line-height: 34rpx;
}
.cat-card-item {
  flex: 1 1 0%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 0;
  min-width: 0;
  cursor: pointer;
  .cat-card-img {
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
    margin-bottom: 8rpx;
    object-fit: cover;
  }
  .cat-card-name {
    font-size: 24rpx;
    color: #333;
    margin-top: 2rpx;
  }
  &.active .cat-card-name {
    color: #4fc08d;
    font-weight: bold;
  }
}
.triple-sub-bar {
  background: #fff;
  box-shadow: 0 2rpx 8rpx #f0f1f2;
  padding: 0 0 8rpx 0;
  margin-top: 12rpx;
}
.triple-item {
  display: inline-block;
  font-size: 28rpx;
  color: #4fc08d;
  background: #fff;
  border: 2rpx solid #4fc08d;
  border-radius: 28rpx;
  padding: 12rpx 38rpx;
  font-weight: 600;
  margin: 0;
  box-shadow: 0 2rpx 8rpx #e0f7ef11;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s, border 0.2s;
  cursor: pointer;
  &.active {
    color: #fff;
    background: #4fc08d;
    border: 2rpx solid #4fc08d;
    box-shadow: 0 4rpx 16rpx #4fc08d33;
    font-weight: bold;
  }
}
/* 新增三级分类样式 */
.triple-sub-list {
  display: flex;
  flex-direction: row;
  padding: 8rpx 32rpx 0 32rpx; // 左右各32rpx
  white-space: nowrap;
  border-top: 1rpx dashed #e0e0e0;
  overflow-x: auto;
  height: 60rpx;
}
.triple-sub-item {
  display: inline-block;
  font-size: 24rpx;
  color: #4fc08d;
  margin-right: 18rpx;
  padding: 6rpx 12rpx;
  border-radius: 12rpx;
  background: #e8f9f1;
  border: 1rpx solid #b6f5c6;
  transition: background 0.2s, color 0.2s, border 0.2s;
  &.active {
    color: #fff;
    background: #4fc08d;
    border: 1rpx solid #4fc08d;
    font-weight: bold;
    box-shadow: 0 2rpx 8rpx #4fc08d22;
  }
}
.goods-list {
  flex: 1;
  padding: 18rpx 24rpx 0 24rpx;
  margin-top: 336rpx;
}
.goods-empty {
  text-align: center;
  color: #bbb;
  font-size: 28rpx;
  margin-top: 60rpx;
}
.goods-card {
  display: flex;
  background: #fff;
  border-radius: 24rpx;
  margin-bottom: 28rpx;
  box-shadow: 0 2rpx 12rpx #f0f1f2;
  padding: 28rpx 24rpx 20rpx 24rpx;
  align-items: center;
  min-height: 120rpx;
}
.goods-img {
  width: 100rpx;
  height: 100rpx;
  border-radius: 16rpx;
  margin-right: 28rpx;
  background: #e0e0e0;
}
.goods-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.goods-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #222;
}
.goods-desc {
  font-size: 24rpx;
  color: #888;
  margin-top: 6rpx;
}
.goods-ctrl {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 120rpx;
}
.goods-price {
  color: #4fc08d;
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
}
.goods-btns {
  display: flex;
  align-items: center;
  border-radius: 24rpx;
  padding: 4rpx 18rpx;
  min-width: 120rpx;
  min-height: 48rpx;
  gap: 12rpx;
}
.goods-count {
  font-size: 32rpx;
  color: #333;
  margin: 0 12rpx;
  font-weight: bold;
  min-width: 36rpx;
  text-align: center;
}
:deep(.goods-btns .u-icon) {
  width: 40rpx !important;
  height: 40rpx !important;
  font-size: 40rpx !important;
  line-height: 40rpx !important;
}
.goods-status {
  color: #ff7f50;
  font-size: 26rpx;
  font-weight: bold;
  margin-top: 8rpx;
  letter-spacing: 2rpx;
}
.cart-bar {
  z-index: 2002;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 0 0 0 0;
  height: 90rpx;
  border-top: 1rpx solid #e0e0e0;
  .cart-total {
    flex: 1;
    font-size: 32rpx;
    color: #111;
    font-weight: bold;
    padding-left: 24rpx;
    .cart-total-num {
      font-size: 32rpx;
      color: #111;
      font-weight: bold;
    }
  }
  .cart-btn {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    font-weight: bold;
    padding: 0 32rpx;
    border-radius: 0;
  }
  .cart-black {
    background: #111;
    color: #fff;
  }
  .cart-green {
    background: #7be495;
    color: #111;
  }
}
.page,
.cat-card-bar,
.triple-bar,
.triple-sub-bar {
  max-width: 100vw;
  overflow-x: hidden;
}
.cat-card-scroll,
.triple-list,
.triple-sub-list {
  overflow-x: auto;
}
.u-popup {
  z-index: 2001 !important;
}
.cart-popup {
  padding: 32rpx 24rpx 24rpx 24rpx;
  min-height: 400rpx;
  max-height: 600rpx;
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
  padding-bottom: 120rpx;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.cart-popup-header {
  position: relative;
  margin-bottom: 24rpx;
}
.cart-popup-title {
  text-align: center;
  font-size: 32rpx;
  font-weight: bold;
}

.cart-popup-item {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 16rpx;
  margin-bottom: 18rpx;
  padding: 16rpx 12rpx;
  box-shadow: 0 2rpx 8rpx #f0f1f2;
}
.cart-popup-img {
  width: 80rpx;
  height: 80rpx;
  border-radius: 12rpx;
  background: #e0e0e0;
  margin-right: 16rpx;
}
.cart-popup-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.cart-popup-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #222;
}
.cart-popup-price {
  font-size: 24rpx;
  color: #4fc08d;
  margin-top: 6rpx;
}
.cart-popup-btns {
  display: flex;
  align-items: center;
  background: #f6f8fa;
  border-radius: 20rpx;
  padding: 0 8rpx;
}
.cart-popup-count {
  font-size: 26rpx;
  color: #333;
  margin: 0 6rpx;
}

/* 结算弹窗样式 */
.checkout-popup {
  margin-top: 48rpx;
  padding: 32rpx 24rpx 24rpx 24rpx;
  height: 100%;
  min-height: unset;
  max-height: unset;
  position: relative;
  box-sizing: border-box;
  padding-bottom: 120rpx;
  border-radius: 28rpx 28rpx 0 0;
  background: #fff;
  display: flex;
  flex-direction: column;
}
.checkout-header {
  margin-bottom: 16rpx;
  background: #f7f7f7;
  border-radius: 20rpx 20rpx 0 0;
  padding: 18rpx 16rpx 10rpx 16rpx;
  position: relative;
  flex-shrink: 0;
}
.checkout-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.checkout-close {
  position: absolute;
  right: 18rpx;
  top: 18rpx;
  z-index: 10;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2rpx 8rpx #e0e0e0;
}
.checkout-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #222;
}
.checkout-edit {
  color: #4fc08d;
  font-size: 26rpx;
}
.checkout-addr {
  font-size: 24rpx;
  color: #888;
  margin-top: 4rpx;
}
.checkout-user {
  font-size: 24rpx;
  color: #888;
  margin-top: 2rpx;
}
.checkout-delivery {
  background: #b6f5c6;
  color: #222;
  font-size: 26rpx;
  text-align: center;
  padding: 14rpx 0;
  border-radius: 10rpx;
  margin: 12rpx 0 18rpx 0;
  font-weight: 500;
  flex-shrink: 0;
}
.checkout-goods-scroll {
  height: 300rpx;
  margin-bottom: 8rpx;
}
.checkout-goods {
  margin: 0 0 12rpx 0;
  font-size: 28rpx;
  color: #222;
  flex-shrink: 0;
}
.checkout-goods-item {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 12rpx;
  margin-bottom: 10rpx;
  padding: 0 0 0 0;
  min-height: 80rpx;
}
.checkout-goods-img {
  width: 64rpx;
  height: 64rpx;
  border-radius: 10rpx;
  background: #e0e0e0;
  margin-right: 16rpx;
}
.checkout-goods-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.checkout-goods-name {
  font-size: 26rpx;
  color: #222;
  font-weight: bold;
}
.checkout-goods-count {
  font-size: 24rpx;
  color: #888;
  margin-top: 2rpx;
}
.checkout-goods-price {
  font-size: 26rpx;
  color: #222;
  font-weight: bold;
  min-width: 80rpx;
  text-align: right;
  padding-right: 12rpx;
}
.checkout-line {
  border-bottom: 1rpx solid #e0e0e0;
  margin: 8rpx 0 8rpx 0;
}
.checkout-fee-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 26rpx;
  color: #444;
  margin: 4rpx 0;
  padding-right: 18rpx;
}
.checkout-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1rpx solid #e0e0e0;
  padding-top: 18rpx;
  margin-top: 18rpx;
}
.checkout-total {
  font-size: 32rpx;
  font-weight: bold;
  color: #222;
}
.checkout-pay-btn {
  width: 200rpx;
  text-align: center;
  font-size: 28rpx;
  font-weight: bold;
  border-radius: 12rpx;
}
.checkout-content-scroll {
  flex: 1 1 auto;
  overflow-y: auto;
  min-height: 0;
}
.cart-btn-disabled {
  background: #eee !important;
  color: #bbb !important;
  pointer-events: auto !important;
  cursor: not-allowed !important;
  opacity: 0.7;
}
.cart-popup-scroll {
  height: 400rpx;
}

/* 分类栏粘性定位 */
.category-fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 100;
  background: #f7f7f7;
}
.h-92 {
  height: 92rpx;
}
.empty-box {
  height: 92rpx;
  width: 100%;
  padding-bottom: 196rpx;
}

.address-popup-ui {
  background: #fff;
  border-radius: 18rpx;
  padding: 0 0 24rpx 0;
  min-width: 320rpx;
  min-height: 500rpx;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.address-popup-header-ui {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 24rpx 0 24rpx;
}
.address-popup-title-ui {
  font-size: 30rpx;
  font-weight: bold;
  color: #222;
}
.address-popup-add-ui {
  font-size: 26rpx;
  color: #4fc08d;
  font-weight: 600;
  cursor: pointer;
}
.address-popup-list {
  margin-top: 18rpx;
  padding: 0 18rpx;
  display: flex;
  flex-direction: column;
  gap: 18rpx;
  overflow-y: auto;
  height: 900rpx;
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
.total-num {
  font-size: 28rpx;
  color: #000;
  font-weight: bold;
  text-align: left;
  padding-left: 24rpx;
}
</style>
