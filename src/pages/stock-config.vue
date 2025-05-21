<template>
  <view class="stock-config-page">
    <!-- 使用官方导航栏，不需要自定义实现 -->
    <view class="config-header">
      <view class="config-title">
        {{ filterText }}
      </view>
    </view>
    
    <view class="config-section">
      <view class="config-type-selector">
        <view class="tab-group">
          <view 
            :class="['tab-item', configType === 'batch' ? 'active' : '']" 
            @click="configType = 'batch'"
          >批量修改</view>
          <view 
            :class="['tab-item', configType === 'single' ? 'active' : '']" 
            @click="configType = 'single'"
          >单项修改</view>
        </view>
      </view>
      
      <!-- 批量修改区域 -->
      <view v-if="configType === 'batch'" class="batch-config">
        <view class="batch-item">
          <text>增加余量</text>
          <input type="number" v-model="batchAddNum" class="batch-input" />
        </view>
        <view class="batch-item">
          <text>减少余量</text>
          <input type="number" v-model="batchReduceNum" class="batch-input" />
        </view>
      </view>
      
      <!-- 单项修改区域 -->
      <view v-else class="single-config">
        <view
          v-for="(item, index) in stockList"
          :key="item.id"
          class="stock-item"
        >
          <view class="item-info">
            <view class="item-index">{{ index + 1 }}、{{ item.name }}</view>
            <view class="item-price-stock">
              <text class="item-price">{{ item.price }}元</text>
              <text class="item-stock">余量{{ item.stock }}</text>
            </view>
          </view>
          <view class="item-actions">
            <view 
              :class="['action-btn', 'add', item.actionType === 'add' ? 'active' : '']" 
              @click="selectAction(item, 'add')"
            >加</view>
            <view 
              :class="['action-btn', 'reduce', item.actionType === 'reduce' ? 'active' : '']" 
              @click="selectAction(item, 'reduce')"
            >减</view>
            <input type="number" v-model="item.modifyNum" class="modify-input" />
          </view>
        </view>
      </view>
    </view>
    
    <view class="bottom-btn-area">
      <button class="confirm-btn" @click="saveConfig">确 定</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { onLoad as uniOnLoad } from '@dcloudio/uni-app';

// 配置类型：batch(批量) 或 single(单项)
const configType = ref('batch');

// 批量增加/减少数量
const batchAddNum = ref('');
const batchReduceNum = ref('');

// 筛选参数
const filterParams = ref({
  status: '',
  name: '',
  cat1: '',
  cat2: '',
  cat3: '',
  catname1: '',
  catname2: '',
  catname3: '',
  sort: '',
  count: 58 // 默认58条
});

// 从URL获取参数
// 在<script setup>中需要特殊方式定义页面生命周期函数
defineExpose({
  onLoad(options) {
    console.log('页面参数:', options);
    
    // 更新筛选参数
    if (options) {
      Object.keys(options).forEach(key => {
        if (key in filterParams.value) {
          filterParams.value[key] = decodeURIComponent(options[key]);
        }
      });
    }
    
    console.log('处理后的筛选参数:', filterParams.value);
  }
});

// 或者使用uni-app提供的onLoad钩子（取二选一）
// uni-app提供的方法直接在setup中使用onLoad
uniOnLoad((options) => {
  console.log('uni页面参数:', options);
  
  // 更新筛选参数
  if (options) {
    Object.keys(options).forEach(key => {
      if (key in filterParams.value) {
        filterParams.value[key] = decodeURIComponent(options[key]);
      }
    });
  }
  
  console.log('uni处理后的筛选参数:', filterParams.value);
});

// 格式化展示的筛选条件文本
const filterText = computed(() => {
  const parts = [];
  
  // 添加商品状态
  if (filterParams.value.status === 'onsale') {
    parts.push('在售');
  } else if (filterParams.value.status === 'soldout') {
    parts.push('售罄');
  }
  
  // 添加商品名称
  if (filterParams.value.name) {
    parts.push(`"${filterParams.value.name}"`);
  }
  
  // 添加分类信息 - 使用传递过来的实际分类名称
  if (filterParams.value.catname1) {
    parts.push(filterParams.value.catname1);
  }
  
  if (filterParams.value.catname2) {
    parts.push(filterParams.value.catname2);
  }
  
  if (filterParams.value.catname3) {
    parts.push(filterParams.value.catname3);
  }
  
  // 添加排序信息
  if (filterParams.value.sort) {
    parts.push(filterParams.value.sort === 'asc' ? '余量升序' : '余量降序');
  }
  
  // 如果没有任何筛选条件
  if (parts.length === 0) {
    parts.push('全部商品');
  }
  
  // 拼接最终文本
  return `配置商品来自：${parts.join('、')}`;
});

// 商品列表数据
const stockList = ref([
  { 
    id: 1, 
    name: '德芙巧克力一盒500g12条', 
    price: 35, 
    stock: 455, 
    modifyNum: '',
    actionType: '' // 新增：操作类型 'add'/'reduce'/''
  },
  { 
    id: 2, 
    name: '德芙巧克力一盒500g12条', 
    price: 35, 
    stock: 121, 
    modifyNum: '',
    actionType: '' // 新增：操作类型
  }
]);

// 选择操作类型（加/减）
function selectAction(item, action) {
  // 如果已经选中该操作，则取消选中
  if (item.actionType === action) {
    item.actionType = '';
  } else {
    // 否则设置为新的操作类型
    item.actionType = action;
  }
  console.log(`商品ID: ${item.id}, 操作类型: ${item.actionType}`);
}

// 保存配置
function saveConfig() {
  if (configType.value === 'batch') {
    // 批量修改逻辑 - 遍历所有商品统一处理
    const batchAddValue = parseInt(batchAddNum.value) || 0;
    const batchReduceValue = parseInt(batchReduceNum.value) || 0;
    
    // 验证输入
    if (batchAddValue <= 0 && batchReduceValue <= 0) {
      uni.showToast({
        title: '请输入有效的增加或减少数量',
        icon: 'none'
      });
      return;
    }
    
    // 更新结果统计
    const updatedStocks = [];
    let totalAdded = 0;
    let totalReduced = 0;
    
    // 遍历处理每个商品
    stockList.value.forEach(item => {
      let newStock = item.stock;
      
      // 记录旧值
      const oldStock = item.stock;
      
      // 处理增加
      if (batchAddValue > 0) {
        newStock += batchAddValue;
        totalAdded += batchAddValue;
      }
      
      // 处理减少
      if (batchReduceValue > 0) {
        if (newStock === 0) {
          // 已为0，不做处理
        } else if (newStock < batchReduceValue) {
          // 库存不足，减至0
          totalReduced += newStock;
          newStock = 0;
        } else {
          // 正常减少
          newStock -= batchReduceValue;
          totalReduced += batchReduceValue;
        }
      }
      
      // 记录变更
      if (newStock !== oldStock) {
        updatedStocks.push({
          id: item.id,
          oldStock: oldStock,
          newStock: newStock,
          change: newStock - oldStock
        });
        
        // 更新商品库存
        item.stock = newStock;
      }
    });
    
    // 显示批量修改结果
    if (updatedStocks.length > 0) {
      let message = '';
      if (totalAdded > 0) {
        message += `增加了${totalAdded}个库存`;
      }
      if (totalReduced > 0) {
        if (message) message += '，';
        message += `减少了${totalReduced}个库存`;
      }
      
      uni.showToast({
        title: message,
        icon: 'success',
        duration: 2000
      });
      
      // 清空输入
      batchAddNum.value = '';
      batchReduceNum.value = '';
      
      console.log('批量修改结果:', updatedStocks);
    } else {
      uni.showToast({
        title: '没有商品需要更新',
        icon: 'none'
      });
    }
  } else {
    // 单项修改 - 根据选定的操作类型和输入数值计算新库存
    const updatedStocks = [];
    let hasError = false;
    
    // 遍历处理每个商品的操作
    stockList.value.forEach(item => {
      // 只处理有操作类型和修改数量的商品
      if (item.actionType && item.modifyNum) {
        const changeValue = parseInt(item.modifyNum) || 0;
        
        // 验证输入值
        if (changeValue <= 0) {
          uni.showToast({
            title: `第${updatedStocks.length + 1}项请输入大于0的数量`,
            icon: 'none'
          });
          hasError = true;
          return; // 跳过此商品的处理
        }
        
        let newStock = item.stock;
        
        // 根据操作类型计算新库存
        if (item.actionType === 'add') {
          newStock = item.stock + changeValue;
        } else if (item.actionType === 'reduce') {
          // 检查减库存是否会导致负值
          if (item.stock === 0) {
            uni.showToast({
              title: `第${updatedStocks.length + 1}项库存已为0，无法减少`,
              icon: 'none'
            });
            hasError = true;
            return; // 跳过此商品的处理
          }
          
          // 确保不会减成负值
          if (item.stock < changeValue) {
            changeValue = item.stock; // 最多减到0
            newStock = 0;
          } else {
            newStock = item.stock - changeValue;
          }
        }
        
        // 添加到更新列表
        updatedStocks.push({
          id: item.id,
          oldStock: item.stock,
          newStock: newStock,
          change: item.actionType === 'add' ? changeValue : -changeValue
        });
      }
    });
    
    // 如果有错误，不继续处理
    if (hasError) return;
    
    // 如果没有要更新的商品
    if (updatedStocks.length === 0) {
      uni.showToast({
        title: '请选择操作类型并输入修改数量',
        icon: 'none'
      });
      return;
    }
    
    console.log('库存更新结果:', updatedStocks);
    
    // 更新本地库存数据（实际项目中这里可能是调用API保存）
    updatedStocks.forEach(update => {
      const item = stockList.value.find(i => i.id === update.id);
      if (item) {
        item.stock = update.newStock;
        item.modifyNum = ''; // 清空输入
        item.actionType = ''; // 重置操作类型
      }
    });
    
    uni.showToast({
      title: '库存修改成功',
      icon: 'success'
    });
  }
  
  // 实际项目中可能需要调用API提交数据
  // 完成后可以返回上一页
  // uni.navigateBack();
}
</script>

<style scoped lang="scss">
.stock-config-page {
  min-height: 100vh;
  background: #f7f7f7;
  display: flex;
  flex-direction: column;
}

.config-header {
  padding: 24rpx 30rpx;
  background: #fff;
  border-bottom: 1rpx solid #eee;
}

.config-title {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}

.config-section {
  padding: 30rpx;
  flex: 1;
}

.config-type-selector {
  margin-bottom: 36rpx;
}

.tab-group {
  display: flex;
  background: #f5f5f5;
  border-radius: 12rpx;
  overflow: hidden;
  padding: 4rpx;
  width: 80%;
  max-width: 500rpx;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 12rpx 24rpx;
  font-size: 28rpx;
  color: #666;
  transition: all 0.2s;
  border-radius: 10rpx;
  
  &.active {
    background: #4fc08d;
    color: white;
    font-weight: 500;
  }
  
  &:active {
    opacity: 0.8;
  }
}

.batch-config {
  background: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 30rpx;
}

.batch-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  font-size: 28rpx;
  color: #333;
}

.batch-input {
  width: 200rpx;
  height: 60rpx;
  border-radius: 8rpx;
  border: 1rpx solid #ddd;
  background: #f5f5f5;
  padding: 0 20rpx;
  text-align: center;
}

.single-config {
  background: #fff;
  border-radius: 12rpx;
  padding: 10rpx 20rpx;
}

.stock-item {
  padding: 24rpx 0;
  border-bottom: 1rpx solid #eee;
}

.stock-item:last-child {
  border-bottom: none;
}

.item-info {
  margin-bottom: 16rpx;
}

.item-index {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 8rpx;
}

.item-price-stock {
  display: flex;
  font-size: 26rpx;
}

.item-price {
  color: #333;
  margin-right: 30rpx;
}

.item-stock {
  color: #888;
}

.item-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.action-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8rpx;
  font-size: 26rpx;
  margin-left: 20rpx;
  color: #666;
  background: #f5f5f5;
  transition: all 0.2s;
  
  &.active {
    background: #4fc08d;
    color: white;
    font-weight: bold;
  }
  
  &.add.active {
    background: #4fc08d;
  }
  
  &.reduce.active {
    background: #ff6b6b;
  }
}

.modify-input {
  width: 160rpx;
  height: 60rpx;
  border-radius: 8rpx;
  border: 1rpx solid #ddd;
  background: #f5f5f5;
  padding: 0 20rpx;
  margin-left: 20rpx;
  text-align: center;
}

.bottom-btn-area {
  padding: 30rpx;
  position: sticky;
  bottom: 0;
}

.confirm-btn {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  background: #b4efc5;
  color: #222;
  font-size: 30rpx;
  font-weight: 500;
  border-radius: 12rpx;
  border: none;
  text-align: center;
}
</style> 