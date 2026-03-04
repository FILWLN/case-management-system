# 案管系统 v2.0 - 项目说明文档

**项目名称**: 案管系统  
**版本**: v2.0  
**创建时间**: 2026-03-04  
**技术栈**: Vue 3 + NestJS + TypeORM + SQLite

---

## 🆕 v2.0 新增功能

1. **期数+还款日配置** - 按配置自动生成还款计划表格
2. **还款日录入提醒** - 站内信每日提醒，含案件详情跳转
3. **资产包运营** - 应还/实还/逾期指标和图表分析
4. **底表上传维护** - Excel导入自动维护资产包
5. **OCR智能识别** - 图片/文字提取自动填充表单

---

## 📁 项目结构  

---

## 📁 项目结构

```
case-management-system/
├── frontend/                       # 前端代码
│   ├── offline.html               # 主页面（离线可用）
│   ├── element-plus.css           # UI框架样式
│   ├── element-plus.full.js       # UI框架脚本
│   └── vue.global.js              # Vue 3 运行时
│
├── backend/                        # 后端代码
│   ├── src/
│   │   ├── cases/                  # 案件模块
│   │   │   ├── case.entity.ts      # 案件实体
│   │   │   ├── repayment-installment.entity.ts  # 分期实体
│   │   │   ├── repayment-plan.entity.ts         # 还款计划实体
│   │   │   ├── case-note.entity.ts              # 备注实体
│   │   │   ├── cases.service.ts    # 案件服务
│   │   │   ├── cases.controller.ts # 案件控制器
│   │   │   └── cases.module.ts     # 案件模块
│   │   ├── asset-packages/         # 资产包模块
│   │   │   ├── asset-package.entity.ts
│   │   │   ├── asset-packages.service.ts
│   │   │   ├── asset-packages.controller.ts
│   │   │   └── asset-packages.module.ts
│   │   ├── notifications/          # 通知模块
│   │   │   ├── notification.entity.ts
│   │   │   ├── notifications.service.ts
│   │   │   ├── notifications.controller.ts
│   │   │   └── notifications.module.ts
│   │   ├── shared/                 # 共享服务
│   │   │   └── services/
│   │   │       ├── repayment-plan-generator.service.ts
│   │   │       └── ocr.service.ts
│   │   ├── auth/                   # 认证模块
│   │   ├── app.module.ts           # 应用主模块
│   │   └── main.ts                 # 入口文件
│   ├── package.json                # 依赖配置
│   └── tsconfig.json               # TypeScript配置
│
├── database/                       # 数据库相关
│   └── schema.sql                 # 数据库结构（可选）
│
└── docs/                          # 文档
    ├── README.md                  # 项目说明
    ├── business-logic.md          # 业务逻辑梳理
    ├── api-reference.md           # API接口文档
    └── deployment-guide.md        # 部署指南
```

---

## 🚀 快速启动

### 1. 启动后端服务

```bash
cd backend
npm install
npm run build
npm run start:dev
```

后端服务默认运行在: http://localhost:3000

### 2. 启动前端页面

直接打开 `frontend/offline.html` 或使用任意静态服务器：

```bash
cd frontend
# 使用 Python 简单服务器
python -m http.server 8090
# 或使用 Node.js
npx serve -p 8090
```

前端访问地址: http://localhost:8090/offline.html

---

## 📋 功能模块

### 案件生命周期（8个状态）

```
待处理-待立案 → 已立案-待保全 → 保全中-待处理 → 调解/判决结束-待履约 → 已结案-履约监督中 → [执行中] → 案件结束
```

| 状态值 | 显示名称 | 说明 |
|--------|----------|------|
| pending | 待处理-待立案 | 刚录入，等待立案 |
| filing | 已立案-待保全 | 已分配案号，等待保全 |
| preservation | 保全中-待处理 | 保全进行中，等待调解/判决 |
| mediation | 调解结束-待履约 | 调解结案，等待履约 |
| judgment | 判决结束-待履约 | 判决结案，等待履约 |
| closed | 已结案-履约监督中 | 结案后监督履约阶段 |
| execution | 执行中 | **强制执行手段** |
| finished | 案件结束 | **履约完成，未履约金额=0** |

### 关键业务理解

> **执行 ≠ 案件结束**  
> 执行是保障债务人履约的强制手段，案件结束的唯一标志是：**未履约金额 = 0**

```
履约监督中
    │
    ├── 债务人主动还款 ─────→ 未履约金额=0 ─────→ 案件结束 ✅
    │
    └── 债务人不履约 ───────→ 申请强制执行
                                  │
                                  ▼
                            执行中（强制手段）
                                  │
                                  ├── 执行回款 → 计入已还总额 → 继续监督
                                  │
                                  └── 终本/终结 → 执恢 → 恢复执行
```

---

## 📊 数据模型

### 案件实体 (Case) - 60+ 字段

#### 基本信息
- `caseNo`: 案件序号（必填）
- `caseType`: 案件类型（litigation/execution/preservation）
- `customerName`: 客户姓名（必填）
- `customerIdcard`: 身份证号（加密）
- `customerPhone`: 电话（加密）
- `status`: 案件状态

#### 立案信息
- `filingDate`: 立案日期
- `civilCaseNo`: 民初案号
- `judgeName`: 承办法官
- `judgeAssistant`: 法官助理
- `clerk`: 书记员

#### 执保信息
- `freezeDate`: 冻结日期
- `freezeAmount`: 申请冻结金额
- `actualFreezeAmount`: 实际冻结金额
- `noFreezeRequired`: 已协商无需冻结

#### 调解信息
- `disputeDate`: 违约纠纷发生日期
- `agreementDate`: 协议签署日期
- `closeType`: 调解结案方式
- `closeDate`: 调解结案日期
- `orderAmount`: 订单金额
- `negotiatedAmount`: 订单外协商金额

#### 判决信息
- `serviceDate`: 判决书送达日期
- `effectiveDate`: 判决生效日期
- `judgmentAmount`: 判决金额

#### 履约监督
- `paidAmount`: 已还总额
- `applyEnforcement`: 是否申请强制执行
- `repaymentMethod`: 还款方式

#### 执行案件
- `executionCaseNumber`: 执行案号
- `executionOriginalAmount`: 执行标的金额
- `courtDeduction`: 法院划扣金额
- `voluntaryRepayment`: 当事人主动还款

#### 执恢信息
- `hasRecovery`: 是否执恢
- `recoveryCaseNo`: 执恢案号
- `recoveryAmount`: 执恢标的金额

---

## 🔢 金额计算逻辑

| 计算项 | 公式 |
|--------|------|
| 调解结果金额 | = 订单金额 + 订单外协商金额 |
| 判决结果金额 | = 判决书确定金额 |
| **未履约金额** | = 结案结果金额 - 已还总额 |
| 执行标的金额 | 默认 = 未履约金额（可手动修改） |

**案件结束条件**: `未履约金额 <= 0`

---

## 🔌 API 接口

### 案件管理

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/cases` | 案件列表（支持分页、筛选、搜索） |
| GET | `/cases/:id` | 案件详情 |
| POST | `/cases` | 创建案件 |
| PUT | `/cases/:id` | 更新案件 |
| DELETE | `/cases/:id` | 删除案件（软删除） |
| GET | `/cases/stats/summary` | 统计数据 |

### 查询参数

```
GET /cases?page=1&pageSize=10&caseType=litigation&status=pending&keyword=张三
```

---

## 🎨 前端页面结构

### 5个Tab页面

1. **基本信息**: 案件编号、当事人信息
2. **立案与执保**: 立案信息、诉讼保全
3. **调解/判决**: 结案类型、调解/判决详情
4. **履约监督**: 还款情况、分期明细、冻结/解冻
5. **执行案件**: 执行立案、回款信息、执恢记录

### 数据转换

前端使用嵌套对象存储表单数据，通过转换函数与后端扁平化字段对接：

```javascript
// 提交时转换
const apiData = formToApiData(form);
// { filing: { filingDate: '2024-01-01' } } → { filingDate: '2024-01-01' }

// 接收时转换
const formData = apiDataToForm(apiData);
// { filingDate: '2024-01-01' } → { filing: { filingDate: '2024-01-01' } }
```

---

## 🔐 演示账号

- 用户名: `admin`
- 密码: `admin123`

---

## 📝 开发记录

### 2026-03-04 业务逻辑确认

1. ✅ 必填字段：阶段流转时该阶段字段需全部填写
2. ✅ 未履约金额计算：`结案结果金额 - 已还总额`
3. ✅ 执行标的金额：允许手动修改
4. ✅ 状态流转：8个详细状态，执行是手段，履约完成是结束标志
5. ✅ 执恢逻辑：作为执行案件的子流程

---

## 📄 文件清单

| 文件 | 说明 |
|------|------|
| `frontend/offline.html` | 前端主页面 |
| `frontend/vue.global.js` | Vue 3 运行时 |
| `frontend/element-plus.css` | Element Plus 样式 |
| `frontend/element-plus.full.js` | Element Plus 脚本 |
| `backend/src/cases/case.entity.ts` | 案件实体（60+字段） |
| `backend/src/cases/cases.service.ts` | 案件服务层 |
| `backend/src/cases/cases.controller.ts` | 案件控制器 |
| `backend/package.json` | 后端依赖配置 |
| `docs/business-logic.md` | 业务逻辑梳理 |
| `docs/api-reference.md` | API接口文档 |
| `docs/deployment-guide.md` | 部署指南 |

---

## 🛠️ 技术依赖

### 后端
- @nestjs/common: ^10.0.0
- @nestjs/typeorm: ^10.0.0
- typeorm: ^0.3.17
- sqlite3: ^5.1.6
- @nestjs/jwt: ^10.0.0
- bcrypt: ^5.1.0

### 前端
- Vue 3 (全局构建)
- Element Plus (全局构建)

---

**项目已归档，可直接使用。**
