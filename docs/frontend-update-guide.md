# 案管系统 v2.0 - 前端功能更新清单

## 更新内容

### 1. 期数配置和自动生成还款计划
**位置**: 履约监督Tab
**新增组件**:
- 期数配置面板（总期数、还款日、还款方式、利率）
- 自动生成按钮
- 还款计划预览表格

**交互逻辑**:
```javascript
// 配置对象
repaymentConfig: {
  totalPeriods: 12,        // 总期数
  repaymentDay: 15,        // 每月还款日
  repaymentMethod: 'equal_interest', // 等额本息
  firstDueDate: '2024-04-15',
  interestRate: 6.5,
  totalAmount: 50000
}

// 生成计划
generatePlan() {
  // 根据配置生成分期列表
  // 等额本息/等额本金/一次性/自定义
}
```

---

### 2. 站内信通知系统
**位置**: 顶部导航栏
**新增组件**:
- 通知铃铛图标（带未读数量角标）
- 通知下拉面板
- 通知列表页面
- 案件详情弹窗（点击跳转）

**数据结构**:
```javascript
notification: {
  id: 1,
  type: 'repayment_reminder',
  title: '2024-03-04 还款提醒',
  content: '...',
  metaData: { caseIds: [1, 2, 3] },
  status: 'unread',
  createdAt: '2024-03-04 09:00'
}
```

---

### 3. 资产包运营Tab
**位置**: 新增侧边栏菜单"资产包运营"
**新增页面**:
- 资产包列表
- 资产包详情（指标卡片 + 图表）
- 资产包对比分析

**图表组件**:
- 饼图：还款状态分布
- 折线图：月度应还vs实还趋势
- 柱状图：多个资产包对比

**关键指标**:
- 总案件数/总金额
- 应还金额/实还金额/逾期金额
- 回收率
- 逾期率

---

### 4. 底表上传自动维护
**位置**: 资产包页面
**新增组件**:
- 文件上传组件（Excel）
- 字段映射配置
- 预览和确认

**处理流程**:
```
上传Excel → 解析 → 字段映射 → 预览 → 确认导入 → 生成资产包
```

---

### 5. OCR/文字提取
**位置**: 案件录入页面
**新增组件**:
- 图片上传区域
- 文本粘贴区域
- 识别结果预览
- 一键填充按钮

**支持类型**:
- 调解书识别
- 判决书识别
- 身份证识别
- 通用文本识别

---

## 依赖库

### 图表库
```html
<!-- 使用 Chart.js -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

### 文件上传
- 原生File API
- SheetJS（xlsx解析）

### OCR
- 后端API调用

---

## API接口

### 资产包
```
GET    /api/asset-packages           # 列表
GET    /api/asset-packages/:id       # 详情
GET    /api/asset-packages/:id/stats # 统计
POST   /api/asset-packages/compare   # 对比
POST   /api/asset-packages           # 创建
PUT    /api/asset-packages/:id       # 更新
DELETE /api/asset-packages/:id       # 删除
```

### 通知
```
GET    /api/notifications            # 列表
GET    /api/notifications/unread-count
PUT    /api/notifications/:id/read   # 标记已读
PUT    /api/notifications/read-all   # 全部已读
```

### 还款计划
```
POST   /api/cases/:id/repayment-plan # 创建计划
POST   /api/cases/:id/generate-installments # 生成分期
```

### OCR
```
POST   /api/ocr/recognize            # 图片识别
POST   /api/ocr/extract-text         # 文本提取
```

---

## 文件路径

前端主文件: `case-management-system/frontend/offline.html`

---

**更新状态**: 后端已完成，前端需更新
