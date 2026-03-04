# API 接口文档

**基础URL**: `http://localhost:3000/api`  
**认证方式**: JWT Token

---

## 认证相关

### 登录
```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**响应**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

---

## 案件管理

### 获取案件列表

```http
GET /cases?page=1&pageSize=10&caseType=litigation&status=pending&keyword=张三
Authorization: Bearer {token}
```

**查询参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 否 | 页码，默认1 |
| pageSize | number | 否 | 每页条数，默认10 |
| caseType | string | 否 | 案件类型: litigation/execution/preservation |
| status | string | 否 | 案件状态: pending/filing/preservation/mediation/judgment/closed/execution/finished |
| hasExecution | boolean | 否 | 是否有执行案件 |
| keyword | string | 否 | 搜索关键词（案号/姓名/身份证号） |

**响应**:
```json
{
  "list": [
    {
      "id": 1,
      "caseNo": "JD-2024-001",
      "caseType": "litigation",
      "customerName": "张三",
      "status": "pending",
      "hasExecutionCase": false,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "pageSize": 10
}
```

---

### 获取案件详情

```http
GET /cases/{id}
Authorization: Bearer {token}
```

**响应**:
```json
{
  "id": 1,
  "caseNo": "JD-2024-001",
  "caseType": "litigation",
  "customerName": "张三",
  "customerIdcard": "110101198503151234",
  "customerPhone": "13800138001",
  "status": "closed",
  
  "filingDate": "2024-01-15",
  "civilCaseNo": "(2024)渝民初001号",
  "judgeName": "王法官",
  
  "closeTypeCategory": "mediation",
  "closeDate": "2024-02-01",
  
  "orderAmount": 50000,
  "negotiatedAmount": 5000,
  "paidAmount": 30000,
  
  "hasExecutionCase": true,
  "executionCaseNumber": "ZX-2024-001",
  
  "installments": [
    {
      "id": 1,
      "installmentNo": 1,
      "dueDate": "2024-03-01",
      "dueAmount": 10000,
      "paidAmount": 10000,
      "status": "paid"
    }
  ]
}
```

---

### 创建案件

```http
POST /cases
Content-Type: application/json
Authorization: Bearer {token}

{
  "caseNo": "JD-2024-002",
  "caseType": "litigation",
  "customerName": "李四",
  "customerIdcard": "310101199001012345",
  "customerPhone": "13900139001",
  "status": "pending"
}
```

**请求字段说明**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| caseNo | string | 是 | 案件序号 |
| caseType | string | 是 | 案件类型 |
| customerName | string | 是 | 客户姓名 |
| status | string | 否 | 案件状态，默认pending |
| customerIdcard | string | 否 | 身份证号 |
| customerPhone | string | 否 | 电话 |
| ... | ... | ... | 其他字段见业务逻辑文档 |

---

### 更新案件

```http
PUT /cases/{id}
Content-Type: application/json
Authorization: Bearer {token}

{
  "status": "closed",
  "closeTypeCategory": "mediation",
  "closeDate": "2024-02-01",
  "orderAmount": 50000,
  "paidAmount": 30000
}
```

---

### 删除案件

```http
DELETE /cases/{id}
Authorization: Bearer {token}
```

**说明**: 软删除，isDeleted字段设置为1

---

### 获取统计数据

```http
GET /cases/stats/summary
Authorization: Bearer {token}
```

**响应**:
```json
{
  "total": 100,
  "pending": 20,
  "execution": 15,
  "closed": 30
}
```

---

## 数据字段映射

### 前端 ↔ 后端字段对照

| 前端字段 | 后端字段 | 说明 |
|----------|----------|------|
| form.caseNo | caseNo | 案件序号 |
| form.customerName | customerName | 客户姓名 |
| form.filing.filingDate | filingDate | 立案日期 |
| form.filing.civilCaseNo | civilCaseNo | 民初案号 |
| form.preservation.freezeAmount | freezeAmount | 冻结金额 |
| form.mediation.orderAmount | orderAmount | 订单金额 |
| form.mediation.negotiatedAmount | negotiatedAmount | 协商金额 |
| form.judgmentInfo.judgmentAmount | judgmentAmount | 判决金额 |
| form.repayment.paidAmount | paidAmount | 已还总额 |
| form.execution.caseNumber | executionCaseNumber | 执行案号 |
| form.execution.hasRecovery | hasRecovery | 是否执恢 |

---

## 状态枚举

### 案件类型 (caseType)
- `litigation` - 诉讼案件
- `execution` - 执行案件
- `preservation` - 诉保案件

### 案件状态 (status)
- `pending` - 待处理-待立案
- `filing` - 已立案-待保全
- `preservation` - 保全中-待处理
- `mediation` - 调解结束-待履约
- `judgment` - 判决结束-待履约
- `closed` - 已结案-履约监督中
- `execution` - 执行中
- `finished` - 案件结束

### 调解结案方式
- `和解`
- `调解`
- `准许撤诉`
- `按撤诉处理`

### 执行结案方式
- `不予执行`
- `驳回申请`
- `执行完毕`
- `终结执行`
- `终结本次执行程序`
- `销案`

---

## 错误码

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 401 | 未授权，Token无效或过期 |
| 403 | 禁止访问，权限不足 |
| 404 | 资源不存在 |
| 422 | 参数验证失败 |
| 500 | 服务器内部错误 |

---

## 金额计算

### 未履约金额计算
```
未履约金额 = 结案结果金额 - 已还总额

其中：
- 调解结案: 结案结果金额 = orderAmount + negotiatedAmount
- 判决结案: 结案结果金额 = judgmentAmount
```

### 案件结束条件
```
当 未履约金额 <= 0 时，案件状态自动变为 finished
```
