# 🚀 案管系统 - 启动说明

**项目路径**: `case-management-system/`  
**创建时间**: 2026-03-04  
**版本**: v1.0

---

## 📁 项目结构

```
case-management-system/
├── backend/                 # NestJS 后端
│   ├── src/
│   │   ├── cases/          # 案件模块
│   │   ├── auth/           # 认证模块
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── data/               # SQLite数据库目录
│   └── package.json
├── frontend/               # Vue 3 前端
│   ├── offline.html        # 主页面
│   ├── vue.global.js
│   ├── element-plus.css
│   └── element-plus.full.js
└── docs/                   # 文档
    ├── README.md
    ├── business-logic.md   # 业务逻辑
    ├── api-reference.md    # API文档
    └── deployment-guide.md # 部署指南
```

---

## ⚡ 快速启动

### 第一步：启动后端

```bash
cd case-management-system/backend
npm install
npm run start:dev
```

后端服务地址: http://localhost:3000/api

### 第二步：启动前端

```bash
cd case-management-system/frontend

# 方式1: Python
python -m http.server 8090

# 方式2: Node.js
npx serve -p 8090
```

前端访问地址: http://localhost:8090/offline.html

### 演示账号

- 用户名: `admin`
- 密码: `admin123`

---

## 📋 核心功能

### 案件生命周期（8个状态）

```
待处理-待立案 → 已立案-待保全 → 保全中-待处理 → 调解/判决结束-待履约 → 已结案-履约监督中 → [执行中] → 案件结束
```

**关键理解**: 执行是保障履约的手段，案件结束的唯一标志是**未履约金额 = 0**

### 5个Tab页面

1. **基本信息** - 案件编号、当事人信息
2. **立案与执保** - 立案信息、诉讼保全
3. **调解/判决** - 结案类型、调解/判决详情
4. **履约监督** - 还款情况、分期明细
5. **执行案件** - 执行立案、回款信息、执恢记录

---

## 🔌 API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/cases` | 案件列表 |
| GET | `/cases/:id` | 案件详情 |
| POST | `/cases` | 创建案件 |
| PUT | `/cases/:id` | 更新案件 |
| DELETE | `/cases/:id` | 删除案件 |
| GET | `/cases/stats/summary` | 统计数据 |
| POST | `/auth/login` | 登录 |

---

## 📊 数据模型

### 案件实体 (60+ 字段)

- 基本信息: caseNo, customerName, status, ...
- 立案信息: filingDate, civilCaseNo, judgeName, ...
- 执保信息: freezeDate, freezeAmount, ...
- 调解信息: closeType, orderAmount, negotiatedAmount, ...
- 判决信息: judgmentAmount, serviceDate, ...
- 履约监督: paidAmount, applyEnforcement, ...
- 执行案件: executionCaseNumber, courtDeduction, ...
- 执恢信息: hasRecovery, recoveryCaseNo, ...

---

## 📖 详细文档

- **业务逻辑**: `docs/business-logic.md`
- **API文档**: `docs/api-reference.md`
- **部署指南**: `docs/deployment-guide.md`

---

## ✅ 已完成确认

| # | 事项 | 状态 |
|---|------|------|
| 1 | 必填字段：阶段流转时填写 | ✓ |
| 2 | 未履约金额计算 | ✓ |
| 3 | 执行标的金额可修改 | ✓ |
| 4 | 状态流转逻辑 | ✓ |
| 5 | 执恢作为子流程 | ✓ |

---

**项目已归档完毕，可以直接使用！**
