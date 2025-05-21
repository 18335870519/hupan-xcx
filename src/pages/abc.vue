<template>
  <view class="delivery-station-page">
    <!-- 顶部用户信息 -->
    <view class="user-info">
      <text class="user-name">张三(配送专员)19980900099</text>
    </view>

    <!-- 状态标签栏 -->
    <view class="status-tabs">
      <view
        v-for="(tab, index) in statusTabs"
        :key="index"
        :class="['status-tab', currentTab === index ? 'active' : '']"
        @click="changeTab(index)"
      >
        {{tab.name}}
      </view>
    </view>

    <!-- 订单列表 - 待取货 -->
    <view class="order-list" v-if="currentTab === 0">
      <!-- 订单卡片 -->
      <u-card
        v-for="item in displayOrders"
        :key="item.id"
        :title="false"
        :head="false"
        :foot="false"
        :border="false"
        :padding="'6rpx 20rpx'"
        class="order-card"
      >
        <template #body>
          <view class="order-header">
            <text class="order-time u-font-sm">订单剩余时间：<text class="u-type-warning">{{item.time}}</text></text>
          </view>
          
          <!-- 商品列表 -->
          <view class="order-goods-list" v-if="item.goods && item.goods.length > 0">
            <view class="order-goods-item" v-for="(good, gidx) in item.goods" :key="good.id">
              <text class="order-number">{{gidx + 1}}. </text>
              <text class="order-goods-name">{{good.name}}<text :class="['u-type-' + good.statusType]">({{good.status}})</text></text>
            </view>
          </view>
          
          <!-- 消息提示 -->
          <view
            v-if="item.message"
            class="order-message"
          >
            <text>{{item.message}}</text>
          </view>
          
          <!-- 操作按钮 -->
          <view class="order-action">
            <u-button 
              v-if="item.goods"
              type="success" 
              size="mini" 
              :customStyle="{width: '120rpx', height: '60rpx', marginLeft: 'auto', backgroundColor: '#07c160'}"
              @click="showPickupConfirm(item.id)"
            >取货</u-button>
            
            <u-button 
              v-if="item.message"
              type="success" 
              size="mini" 
              :customStyle="{width: '120rpx', height: '60rpx', marginLeft: 'auto', backgroundColor: '#07c160'}"
              @click="acceptOrder(item.id)"
            >接单</u-button>
          </view>
        </template>
      </u-card>
    </view>
    
    <!-- 订单列表 - 配送中 -->
    <view class="order-list delivering-order-list" v-if="currentTab === 1">
      <!-- 配送中订单卡片 -->
      <view class="delivery-card" v-for="item in deliveringOrders" :key="item.id">
        <view class="delivery-info">
          <view class="delivery-info-item">订单剩余时间：<text style="color: #333;">{{item.time}}</text></view>
          <view class="delivery-info-item">用户单号：<text style="color: #333;">{{item.orderNo}}</text></view>
          <view class="delivery-info-item">收货地址：<text style="color: #333;">{{item.address}}</text></view>
          <view class="delivery-info-item">收货人：<text style="color: #333;">{{item.receiver}}</text></view>
          <view class="delivery-info-item">收货人电话：<text style="color: #333;">{{item.receiverPhone}}</text></view>
          <view class="delivery-info-item">下单人电话：<text style="color: #333;">{{item.customerPhone}}</text></view>
        </view>
        <view class="location-btn">
          <u-button 
            plain
            :customStyle="{width: '140rpx', height: '60rpx', color: '#333', backgroundColor: '#f0f0f0', borderColor: '#ddd', borderRadius: '0'}"
            @click="viewLocation(item)"
          >直看定位</u-button>
        </view>
        <view class="deliver-btn">
          <u-button 
            :customStyle="{minWidth: '90rpx', height: '60rpx', backgroundColor: '#4cd964', color: '#fff', borderRadius: '0', fontSize: '28rpx', border: 'none', padding: '0 20rpx'}"
            @click="showDeliveredPopup(item)"
          >送达</u-button>
        </view>
      </view>
    </view>
    
    <!-- 订单列表 - 已送达 -->
    <view class="order-list delivered-order-list" v-if="currentTab === 2">
      <view class="delivered-tip">页面展示本月数据</view>
      <view class="delivered-card" v-for="item in deliveredOrders" :key="item.id">
        <view class="delivered-info-row">
          <text class="delivered-label">用户单号：</text>
          <text class="delivered-value">{{item.orderNo}}</text>
        </view>
        <view class="delivered-info-row">
          <text class="delivered-label">收货地址：</text>
          <text class="delivered-value">{{item.address || '-'}}</text>
        </view>
        <view class="delivered-info-row">
          <text class="delivered-label">送达形式：</text>
          <text class="delivered-value">{{item.deliverType || '-'}}</text>
        </view>
        <view class="delivered-info-row">
          <text class="delivered-label">送达时间：</text>
          <text class="delivered-value">{{item.deliverTime || '-'}}</text>
        </view>
        <view class="delivered-info-row">
          <text class="delivered-label">送达备注：</text>
          <text class="delivered-value">{{item.deliverRemark || '-'}}</text>
        </view>
      </view>
    </view>
    
    <!-- 空状态 -->
    <view v-if="displayOrders.length === 0 && currentTab === 0" class="empty-state">
      <image src="/static/empty-list.png" mode="aspectFit" class="empty-image"></image>
      <text class="empty-text">暂无待取货订单</text>
    </view>
    
    <view v-if="deliveringOrders.length === 0 && currentTab === 1" class="empty-state">
      <image src="/static/empty-list.png" mode="aspectFit" class="empty-image"></image>
      <text class="empty-text">暂无配送中订单</text>
    </view>
    
    <view v-if="deliveredOrders.length === 0 && currentTab === 2" class="empty-state">
      <image src="/static/empty-list.png" mode="aspectFit" class="empty-image"></image>
      <text class="empty-text">暂无已送达订单</text>
    </view>
    
    <!-- 取货确认弹窗 -->
    <u-popup
      :show="pickupPopupShow"
      mode="center"
      round="10"
      :closeable="true"
      :closeOnClickOverlay="false"
      @close="pickupPopupShow = false"
      :customStyle="'width: 80vw; background-color: #FFFFFF; border-radius: 12rpx;'"
    >
      <view class="pickup-popup">
        <view class="pickup-title">取货确认</view>
        <view class="pickup-content">
          <u-radio-group v-model="selectedPickupItem" class="pickup-radio-group">
            <view class="pickup-radio-list">
              <view 
                v-for="good in pickupGoods" 
                :key="good.id" 
                class="pickup-radio-item"
              >
                <u-radio 
                  :name="good.id" 
                  :disabled="good.status.includes('已取')"
                  shape="circle"
                  iconSize="26"
                  activeColor="#07c160"
                  inactiveColor="#c8c9cc"
                  :label="good.name + '(' + good.status + ')'"
                  :labelSize="0"
                ></u-radio>
              </view>
            </view>
          </u-radio-group>
        </view>
        <view class="pickup-footer">
          <u-button 
            type="success" 
            :customStyle="{width: '60%', height: '80rpx', backgroundColor: '#6dd46c', color: '#fff', borderRadius: '40rpx', border: 'none'}"
            @click="confirmPickup"
          >确认取货</u-button>
        </view>
      </view>
    </u-popup>
    
    <!-- 地图定位弹窗 -->
    <u-popup
      :show="mapPopupShow"
      mode="center"
      round="10"
      :closeOnClickOverlay="false"
      @close="mapPopupShow = false"
      :customStyle="'width: 90vw; background-color: #FFFFFF; border-radius: 0; padding: 0; overflow: hidden; position: relative;'"
    >
      <view class="map-popup">
        <view class="map-container">
          <map
            class="map"
            :latitude="mapLocation.latitude"
            :longitude="mapLocation.longitude"
            :markers="mapMarkers"
            :scale="16"
            :show-location="true"
            :enable-zoom="true"
            :enable-scroll="true"
          ></map>
        </view>
        <view class="map-footer">
          <u-button 
            type="success" 
            :customStyle="{width: '80%', height: '80rpx', backgroundColor: '#4cd964', color: '#fff', borderRadius: '40rpx', border: 'none', fontSize: '28rpx'}"
            @click="mapPopupShow = false"
          >关闭</u-button>
        </view>
      </view>
    </u-popup>

    <!-- 送达确认弹窗 -->
    <u-popup
      :show="deliveredPopupShow"
      mode="center"
      round="10"
      :closeOnClickOverlay="false"
      @close="deliveredPopupShow = false"
      :customStyle="'width: 90vw; background-color: #fff; border-radius: 16rpx; padding: 0; overflow: hidden;'"
      closeable
    >
      <view class="delivered-popup2">
        <view class="delivered-title2">确认送达</view>
        <view class="delivered-content2">
          <view class="delivered-info-row2">
            <text class="delivered-label2">用户单号：</text>
            <text class="delivered-value2">{{deliveredOrder.orderNo}}</text>
          </view>
          <view class="delivered-info-row2">
            <text class="delivered-label2">收货地址：</text>
            <text class="delivered-value2">{{deliveredOrder.address}}</text>
          </view>
          <view class="delivered-info-row2 delivered-radio-row">
            <text class="delivered-label2">送达形式：</text>
            <u-radio-group v-model="deliveredType" class="delivered-radio-group">
              <u-radio name="当面送达" label="当面送达" :customStyle="'margin-right: 24rpx;'" />
              <u-radio name="联系后放置" label="联系后放置" :customStyle="'margin-right: 24rpx;'" />
              <u-radio name="失联放置" label="失联放置" />
            </u-radio-group>
          </view>
          <view class="delivered-info-row2 delivered-textarea-row">
            <text class="delivered-label2">送达备注：</text>
            <view style="flex:1;display:flex;flex-direction:column;">
              <u-textarea style="border:1px solid #ccc;border-radius:8rpx;background:#f5f5f5;" v-model="deliveredRemark" placeholder="请输入送达备注" autoHeight maxlength="100" class="delivered-textarea" />
              <view class="delivered-textarea-count">{{deliveredRemark.length}}/100</view>
            </view>
          </view>
        </view>
        <view class="delivered-footer2">
          <u-button 
            type="success"
            :customStyle="{width: '80%', height: '80rpx', backgroundColor: '#4cd964', color: '#fff', borderRadius: '40rpx', border: 'none', fontSize: '28rpx'}"
            @click="confirmDelivered"
          >确认送达</u-button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentTab: 1,
      statusTabs: [
        { name: '待取货20' },
        { name: '配送中15' },
        { name: '已送达20' }
      ],
      pickupPopupShow: false,
      mapPopupShow: false,
      selectedPickupItem: '',
      activeOrderId: null,
      // 地图相关数据
      mapLocation: {
        latitude: 39.908823,
        longitude: 116.397470
      },
      mapMarkers: [],
      // 取货确认的固定商品数据
      pickupGoods: [
        { id: 1, name: '佳合供应JH9902', status: '已打包', statusType: 'success' },
        { id: 2, name: '凉皮供应JH1198', status: '已打包', statusType: 'success' },
        { id: 3, name: '煎饼供应JH2209', status: '已打包', statusType: 'success' },
        { id: 4, name: '油条供应JH3304', status: '已打包', statusType: 'success' }
      ],
      orderList: [
        {
          id: 1,
          time: '12分34秒',
          status: 'pending',
          goods: [
            { id: 1, name: '佳合供应JH9902', status: '已打包', statusType: 'success' },
            { id: 2, name: '凉皮供应JH1198', status: '已取消', statusType: 'info' },
            { id: 3, name: '煎饼供应JH2209', status: '已取', statusType: 'primary' },
            { id: 4, name: '油条供应JH3304', status: '待打包', statusType: 'warning' }
          ]
        },
        {
          id: 2,
          time: '34分23秒',
          status: 'new',
          message: '您有新的配送单需要接收'
        },
        {
          id: 3,
          time: '45分00秒', 
          status: 'delivering',
          goods: [
            { id: 5, name: '炸鸡供应JH5501', status: '配送中', statusType: 'primary' }
          ]
        },
        {
          id: 4,
          time: '08分12秒',
          status: 'delivered',
          goods: [
            { id: 6, name: '汉堡供应JH7702', status: '已送达', statusType: 'success' }
          ]
        }
      ],
      // 配送中订单数据
      deliveringOrders: [
        {
          id: 101,
          time: '3分12秒',
          orderNo: 'G778699',
          address: '卫华里29-2-201',
          receiver: '张三',
          receiverPhone: '18799990000',
          customerPhone: '18799990000',
          status: 'delivering'
        }
      ],
      // 已送达订单数据
      deliveredOrders: [
        {
          id: 201,
          orderNo: 'GG664495',
          address: '',
          deliverType: '',
          deliverTime: '',
          deliverRemark: ''
        }
      ],
      deliveredPopupShow: false,
      deliveredOrder: {},
      deliveredRemark: '',
      deliveredType: ''
    };
  },
  computed: {
    // 根据当前标签页过滤显示对应状态的订单
    displayOrders() {
      if (this.currentTab === 0) {
        return this.orderList.filter(order => order.status === 'pending' || order.status === 'new');
      } else if (this.currentTab === 1) {
        return this.orderList.filter(order => order.status === 'delivering');
      } else {
        return this.orderList.filter(order => order.status === 'delivered');
      }
    },
    // 取货确认商品列表 - 使用固定数据
    activeOrderGoods() {
      return this.pickupGoods;
    }
  },
  onLoad(options) {
    // 页面加载时处理参数
    console.log(options);
    
    // 可以根据参数设置初始选中的标签
    if (options.tab) {
      this.currentTab = parseInt(options.tab) || 0;
    }
  },
  methods: {
    // Tab切换
    changeTab(index) {
      this.currentTab = index;
      // 在实际应用中，这里可以请求后端数据
      uni.showToast({
        title: `切换到${this.statusTabs[index].name}`,
        icon: 'none'
      });
    },
    
    // 显示取货确认弹窗
    showPickupConfirm(orderId) {
      this.activeOrderId = orderId;
      this.selectedPickupItem = '';
      this.pickupPopupShow = true;
    },
    
    // 确认取货
    confirmPickup() {
      if (!this.selectedPickupItem) {
        uni.showToast({
          title: '请选择要取货的商品',
          icon: 'none'
        });
        return;
      }
      
      uni.showLoading({
        title: '处理中...'
      });
      
      setTimeout(() => {
        uni.hideLoading();
        
        // 更新商品状态
        const orderIndex = this.orderList.findIndex(o => o.id === this.activeOrderId);
        if (orderIndex > -1) {
          const goodIndex = this.orderList[orderIndex].goods.findIndex(g => g.id === this.selectedPickupItem);
          if (goodIndex > -1) {
            this.orderList[orderIndex].goods[goodIndex].status = '已取';
            this.orderList[orderIndex].goods[goodIndex].statusType = 'primary';
          }
        }
        
        // 关闭弹窗
        this.pickupPopupShow = false;
        
        uni.showToast({
          title: '取货成功',
          icon: 'success'
        });
        
        // 检查是否所有商品都已取，如果是则更新订单状态
        const order = this.orderList[orderIndex];
        const allPicked = order.goods.every(g => g.status.includes('已取') || g.status.includes('已取消'));
        if (allPicked) {
          this.orderList[orderIndex].status = 'delivering';
        }
      }, 1500);
    },
    
    // 接单操作
    acceptOrder(orderId) {
      uni.showLoading({
        title: '处理中...'
      });
      
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({
          title: '接单成功',
          icon: 'success'
        });
        
        // 实际应用中应该更新订单状态
        const orderIndex = this.orderList.findIndex(o => o.id === orderId);
        if (orderIndex > -1) {
          this.orderList[orderIndex].status = 'pending';
          this.orderList[orderIndex].goods = [
            { id: 7, name: '新接单商品JH8801', status: '待处理', statusType: 'warning' }
          ];
          delete this.orderList[orderIndex].message;
        }
      }, 1500);
    },
    
    // 配送完成
    deliveryComplete(orderId) {
      uni.showLoading({
        title: '处理中...'
      });
      
      setTimeout(() => {
        uni.hideLoading();
        
        // 更新订单状态
        const orderIndex = this.deliveringOrders.findIndex(o => o.id === orderId);
        if (orderIndex > -1) {
          const order = this.deliveringOrders[orderIndex];
          // 将该订单添加到已送达列表
          this.deliveredOrders.unshift({
            id: order.id,
            completedTime: this.getCurrentTime(),
            orderNo: order.orderNo,
            address: order.address,
            receiver: order.receiver,
            status: 'delivered'
          });
          // 从配送中列表移除
          this.deliveringOrders.splice(orderIndex, 1);
        }
        
        uni.showToast({
          title: '送达成功',
          icon: 'success'
        });
      }, 1500);
    },
    
    // 查看订单详情
    viewOrderDetail(orderId) {
      uni.navigateTo({
        url: `/pages/order-detail?id=${orderId}`
      });
    },
    
    // 获取当前时间
    getCurrentTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hour = String(now.getHours()).padStart(2, '0');
      const minute = String(now.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day} ${hour}:${minute}`;
    },
    
    // 查看定位
    viewLocation(item) {
      // 显示地图弹窗
      this.mapPopupShow = true;
      
      // 设置初始位置为北京市中心（实际项目中应该使用真实地址的坐标）
      this.mapLocation = {
        latitude: 39.08,
        longitude: 117.10
      };
      
      // 设置标记点
      this.mapMarkers = [{
        id: 1,
        latitude: 39.08,
        longitude: 117.10,
        title: item.address,
        iconPath: '/static/location-pin.png', // 确保该图标存在于项目中
        width: 30,
        height: 30,
        callout: {
          content: item.address,
          color: '#000000',
          fontSize: 12,
          borderRadius: 4,
          bgColor: '#ffffff',
          padding: 5,
          display: 'ALWAYS'
        }
      }];
    },
    showDeliveredPopup(item) {
      this.deliveredOrder = item;
      this.deliveredRemark = '';
      this.deliveredType = '';
      this.deliveredPopupShow = true;
    },
    confirmDelivered() {
      if (!this.deliveredType) {
        uni.showToast({ title: '请选择送达形式', icon: 'none' });
        return;
      }
      // 这里可以提交备注和送达形式等信息
      this.deliveredPopupShow = false;
      // 更新已送达订单信息
      this.deliveryComplete(this.deliveredOrder.id, this.deliveredType, this.deliveredRemark);
    }
  }
};
</script>

<style lang="scss" scoped>
.delivery-station-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 30rpx;
}

.user-info {
  padding: 20rpx;
  background-color: #ffffff;
  border-bottom: 2rpx solid #f0f0f0;
}

.user-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #333333;
}

.status-tabs {
  display: flex;
  background-color: #ffffff;
  margin-top: 0;
  border-bottom: 2rpx solid #eeeeee;
}

.status-tab {
  flex: 1;
  text-align: center;
  padding: 24rpx 0;
  font-size: 28rpx;
  color: #333333;
  position: relative;
}

.status-tab.active {
  color: #4cd964;
  background-color: #d8f8e0;
}

.order-list {
  padding: 20rpx;
  margin-top: 10rpx;
}

.order-card {
  background-color: #ffffff;
  border-radius: 12rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 20rpx;
}

.order-header {
  margin-bottom: 20rpx;
}

.order-time {
  font-size: 28rpx;
  color: #666666;
}

.order-goods-list {
  margin-bottom: 20rpx;
}

.order-goods-item {
  display: flex;
  padding: 10rpx 0;
}

.order-number {
  margin-right: 10rpx;
  color: #333333;
  font-size: 28rpx;
}

.order-goods-name {
  font-size: 28rpx;
  color: #333333;
  flex: 1;
}

.order-message {
  background-color: #f5f5f5;
  padding: 20rpx;
  margin: 20rpx 0;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #666666;
}

.order-action {
  display: flex;
  justify-content: flex-end;
  margin-top: 20rpx;
}

/* 配送中订单卡片样式 */
.delivery-card {
  background-color: #f0f0f0;
  border-radius: 0;
  padding: 20rpx;
  margin-bottom: 2rpx;
  position: relative;
}

.delivery-info {
  font-size: 28rpx;
  color: #666666;
  padding-right: 120rpx;
}

.delivery-info-item {
  margin-bottom: 10rpx;
  line-height: 1.6;
}

.location-btn {
  position: absolute;
  top: 16rpx;
  right: 16rpx;
}

.deliver-btn {
  position: absolute;
  bottom: 16rpx;
  right: 16rpx;
  z-index: 1;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
}

.empty-image {
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 20rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999999;
}

/* 取货确认弹窗样式 */
.pickup-popup {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 30rpx 0;
}

.pickup-title {
  text-align: center;
  font-size: 32rpx;
  font-weight: 500;
  color: #333333;
  padding: 20rpx;
  margin-bottom: 10rpx;
}

.pickup-content {
  padding: 20rpx 60rpx 30rpx;
  margin-bottom: 20rpx;
}

.pickup-radio-group {
  width: 100%;
}

.pickup-radio-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.pickup-radio-item {
  margin-bottom: 20rpx;
}

.pickup-footer {
  padding: 0 30rpx 20rpx;
  display: flex;
  justify-content: center;
}

.delivering-order-list {
  padding: 0;
}

/* 地图定位弹窗样式 */
.map-popup {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 2rpx solid #aaa;
}

.map-container {
  flex: 1;
  position: relative;
  width: 100%;
  height: 500rpx;
}

.map {
  width: 100%;
  height: 100%;
}

.map-footer {
  padding: 20rpx;
  display: flex;
  justify-content: center;
  background-color: #fff;
}

/* 送达确认弹窗样式 */
.delivered-popup2 {
  padding: 0 0 30rpx 0;
}
.delivered-title2 {
  text-align: center;
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
  padding: 30rpx 0 20rpx 0;
  border-bottom: 1rpx solid #eee;
}
.delivered-content2 {
  padding: 30rpx 40rpx 10rpx 40rpx;
}
.delivered-info-row2 {
  display: flex;
  align-items: flex-start;
  margin-bottom: 18rpx;
}
.delivered-label2 {
  width: 140rpx;
  color: #333;
  font-size: 28rpx;
  font-weight: 500;
  flex-shrink: 0;
}
.delivered-value2 {
  color: #333;
  font-size: 28rpx;
  word-break: break-all;
}
.delivered-radio-row {
  align-items: center;
}
.delivered-radio-group {
  display: flex;
  align-items: center;
  margin-left: 10rpx;
}
.delivered-textarea-row {
  align-items: flex-start;
}
.delivered-textarea {
  flex: 1;
  margin-left: 10rpx;
  min-height: 80rpx;
  background: #f5f5f5;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #333;
  padding: 10rpx;
  position: relative;
}
:deep(.u-textarea) {
  border: 1px solid #ccc !important;
  border-radius: 8rpx !important;
  background: #f5f5f5 !important;
}
.delivered-textarea-count {
  text-align: right;
  color: #999;
  font-size: 24rpx;
  margin-top: 4rpx;
  margin-right: 10rpx;
}
.delivered-footer2 {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30rpx;
}

/* 已送达页面样式 */
.delivered-order-list {
  padding: 0;
}
.delivered-tip {
  text-align: right;
  color: #888;
  font-size: 26rpx;
  margin: 10rpx 20rpx 10rpx 0;
}
.delivered-card {
  background: #ededed;
  border-radius: 18rpx;
  margin: 0 10rpx 20rpx 10rpx;
  padding: 30rpx 30rpx 20rpx 30rpx;
}
.delivered-info-row {
  display: flex;
  align-items: center;
  margin-bottom: 18rpx;
}
.delivered-label {
  width: 160rpx;
  color: #333;
  font-size: 28rpx;
  font-weight: 500;
}
.delivered-value {
  color: #333;
  font-size: 28rpx;
  word-break: break-all;
}
</style>