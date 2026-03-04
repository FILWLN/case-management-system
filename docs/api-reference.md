# API 鎺ュ彛鏂囨。

**鍩虹URL**: `http://localhost:3000/api`  
**璁よ瘉鏂瑰紡**: JWT Token

---

## 璁よ瘉鐩稿叧

### 鐧诲綍
```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**鍝嶅簲**:
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

## 妗堜欢绠＄悊

### 鑾峰彇妗堜欢鍒楄〃

```http
GET /cases?page=1&pageSize=10&caseType=litigation&status=pending&keyword=寮犱笁
Authorization: Bearer {token}
```

**鏌ヨ鍙傛暟**:

| 鍙傛暟 | 绫诲瀷 | 蹇呭～ | 璇存槑 |
|------|------|------|------|
| page | number | 鍚?| 椤电爜锛岄粯璁? |
| pageSize | number | 鍚?| 姣忛〉鏉℃暟锛岄粯璁?0 |
| caseType | string | 鍚?| 妗堜欢绫诲瀷: litigation/execution/preservation |
| status | string | 鍚?| 妗堜欢鐘舵€? pending/filing/preservation/mediation/judgment/closed/execution/finished |
| hasExecution | boolean | 鍚?| 鏄惁鏈夋墽琛屾浠?|
| keyword | string | 鍚?| 鎼滅储鍏抽敭璇嶏紙妗堝彿/濮撳悕/韬唤璇佸彿锛?|

**鍝嶅簲**:
```json
{
  "list": [
    {
      "id": 1,
      "caseNo": "JD-2024-001",
      "caseType": "litigation",
      "customerName": "寮犱笁",
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

### 鑾峰彇妗堜欢璇︽儏

```http
GET /cases/{id}
Authorization: Bearer {token}
```

**鍝嶅簲**:
```json
{
  "id": 1,
  "caseNo": "JD-2024-001",
  "caseType": "litigation",
  "customerName": "寮犱笁",
  "customerIdcard": "110101198503151234",
  "customerPhone": "13800138001",
  "status": "closed",
  
  "filingDate": "2024-01-15",
  "civilCaseNo": "(2024)娓濇皯鍒?01鍙?,
  "judgeName": "鐜嬫硶瀹?,
  
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

### 鍒涘缓妗堜欢

```http
POST /cases
Content-Type: application/json
Authorization: Bearer {token}

{
  "caseNo": "JD-2024-002",
  "caseType": "litigation",
  "customerName": "鏉庡洓",
  "customerIdcard": "310101199001012345",
  "customerPhone": "13900139001",
  "status": "pending"
}
```

**璇锋眰瀛楁璇存槑**:

| 瀛楁 | 绫诲瀷 | 蹇呭～ | 璇存槑 |
|------|------|------|------|
| caseNo | string | 鏄?| 妗堜欢搴忓彿 |
| caseType | string | 鏄?| 妗堜欢绫诲瀷 |
| customerName | string | 鏄?| 瀹㈡埛濮撳悕 |
| status | string | 鍚?| 妗堜欢鐘舵€侊紝榛樿pending |
| customerIdcard | string | 鍚?| 韬唤璇佸彿 |
| customerPhone | string | 鍚?| 鐢佃瘽 |
| ... | ... | ... | 鍏朵粬瀛楁瑙佷笟鍔￠€昏緫鏂囨。 |

---

### 鏇存柊妗堜欢

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

### 鍒犻櫎妗堜欢

```http
DELETE /cases/{id}
Authorization: Bearer {token}
```

**璇存槑**: 杞垹闄わ紝isDeleted瀛楁璁剧疆涓?

---

### 鑾峰彇缁熻鏁版嵁

```http
GET /cases/stats/summary
Authorization: Bearer {token}
```

**鍝嶅簲**:
```json
{
  "total": 100,
  "pending": 20,
  "execution": 15,
  "closed": 30
}
```

---

## 鏁版嵁瀛楁鏄犲皠

### 鍓嶇 鈫?鍚庣瀛楁瀵圭収

| 鍓嶇瀛楁 | 鍚庣瀛楁 | 璇存槑 |
|----------|----------|------|
| form.caseNo | caseNo | 妗堜欢搴忓彿 |
| form.customerName | customerName | 瀹㈡埛濮撳悕 |
| form.filing.filingDate | filingDate | 绔嬫鏃ユ湡 |
| form.filing.civilCaseNo | civilCaseNo | 姘戝垵妗堝彿 |
| form.preservation.freezeAmount | freezeAmount | 鍐荤粨閲戦 |
| form.mediation.orderAmount | orderAmount | 璁㈠崟閲戦 |
| form.mediation.negotiatedAmount | negotiatedAmount | 鍗忓晢閲戦 |
| form.judgmentInfo.judgmentAmount | judgmentAmount | 鍒ゅ喅閲戦 |
| form.repayment.paidAmount | paidAmount | 宸茶繕鎬婚 |
| form.execution.caseNumber | executionCaseNumber | 鎵ц妗堝彿 |
| form.execution.hasRecovery | hasRecovery | 鏄惁鎵ф仮 |

---

## 鐘舵€佹灇涓?
### 妗堜欢绫诲瀷 (caseType)
- `litigation` - 璇夎妗堜欢
- `execution` - 鎵ц妗堜欢
- `preservation` - 璇変繚妗堜欢

### 妗堜欢鐘舵€?(status)
- `pending` - 寰呭鐞?寰呯珛妗?- `filing` - 宸茬珛妗?寰呬繚鍏?- `preservation` - 淇濆叏涓?寰呭鐞?- `mediation` - 璋冭В缁撴潫-寰呭饱绾?- `judgment` - 鍒ゅ喅缁撴潫-寰呭饱绾?- `closed` - 宸茬粨妗?灞ョ害鐩戠潱涓?- `execution` - 鎵ц涓?- `finished` - 妗堜欢缁撴潫

### 璋冭В缁撴鏂瑰紡
- `鍜岃В`
- `璋冭В`
- `鍑嗚鎾よ瘔`
- `鎸夋挙璇夊鐞哷

### 鎵ц缁撴鏂瑰紡
- `涓嶄簣鎵ц`
- `椹冲洖鐢宠`
- `鎵ц瀹屾瘯`
- `缁堢粨鎵ц`
- `缁堢粨鏈鎵ц绋嬪簭`
- `閿€妗坄

---

## 閿欒鐮?
| 鐘舵€佺爜 | 璇存槑 |
|--------|------|
| 200 | 鎴愬姛 |
| 401 | 鏈巿鏉冿紝Token鏃犳晥鎴栬繃鏈?|
| 403 | 绂佹璁块棶锛屾潈闄愪笉瓒?|
| 404 | 璧勬簮涓嶅瓨鍦?|
| 422 | 鍙傛暟楠岃瘉澶辫触 |
| 500 | 鏈嶅姟鍣ㄥ唴閮ㄩ敊璇?|

---

## 閲戦璁＄畻

### 鏈饱绾﹂噾棰濊绠?```
鏈饱绾﹂噾棰?= 缁撴缁撴灉閲戦 - 宸茶繕鎬婚

鍏朵腑锛?- 璋冭В缁撴: 缁撴缁撴灉閲戦 = orderAmount + negotiatedAmount
- 鍒ゅ喅缁撴: 缁撴缁撴灉閲戦 = judgmentAmount
```

### 妗堜欢缁撴潫鏉′欢
```
褰?鏈饱绾﹂噾棰?<= 0 鏃讹紝妗堜欢鐘舵€佽嚜鍔ㄥ彉涓?finished
```
