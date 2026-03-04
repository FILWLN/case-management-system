# 妗堢绯荤粺 v2.0 - 鍓嶇鍔熻兘鏇存柊娓呭崟

## 鏇存柊鍐呭

### 1. 鏈熸暟閰嶇疆鍜岃嚜鍔ㄧ敓鎴愯繕娆捐鍒?**浣嶇疆**: 灞ョ害鐩戠潱Tab
**鏂板缁勪欢**:
- 鏈熸暟閰嶇疆闈㈡澘锛堟€绘湡鏁般€佽繕娆炬棩銆佽繕娆炬柟寮忋€佸埄鐜囷級
- 鑷姩鐢熸垚鎸夐挳
- 杩樻璁″垝棰勮琛ㄦ牸

**浜や簰閫昏緫**:
```javascript
// 閰嶇疆瀵硅薄
repaymentConfig: {
  totalPeriods: 12,        // 鎬绘湡鏁?  repaymentDay: 15,        // 姣忔湀杩樻鏃?  repaymentMethod: 'equal_interest', // 绛夐鏈伅
  firstDueDate: '2024-04-15',
  interestRate: 6.5,
  totalAmount: 50000
}

// 鐢熸垚璁″垝
generatePlan() {
  // 鏍规嵁閰嶇疆鐢熸垚鍒嗘湡鍒楄〃
  // 绛夐鏈伅/绛夐鏈噾/涓€娆℃€?鑷畾涔?}
```

---

### 2. 绔欏唴淇￠€氱煡绯荤粺
**浣嶇疆**: 椤堕儴瀵艰埅鏍?**鏂板缁勪欢**:
- 閫氱煡閾冮摏鍥炬爣锛堝甫鏈鏁伴噺瑙掓爣锛?- 閫氱煡涓嬫媺闈㈡澘
- 閫氱煡鍒楄〃椤甸潰
- 妗堜欢璇︽儏寮圭獥锛堢偣鍑昏烦杞級

**鏁版嵁缁撴瀯**:
```javascript
notification: {
  id: 1,
  type: 'repayment_reminder',
  title: '2024-03-04 杩樻鎻愰啋',
  content: '...',
  metaData: { caseIds: [1, 2, 3] },
  status: 'unread',
  createdAt: '2024-03-04 09:00'
}
```

---

### 3. 璧勪骇鍖呰繍钀ab
**浣嶇疆**: 鏂板渚ц竟鏍忚彍鍗?璧勪骇鍖呰繍钀?
**鏂板椤甸潰**:
- 璧勪骇鍖呭垪琛?- 璧勪骇鍖呰鎯咃紙鎸囨爣鍗＄墖 + 鍥捐〃锛?- 璧勪骇鍖呭姣斿垎鏋?
**鍥捐〃缁勪欢**:
- 楗煎浘锛氳繕娆剧姸鎬佸垎甯?- 鎶樼嚎鍥撅細鏈堝害搴旇繕vs瀹炶繕瓒嬪娍
- 鏌辩姸鍥撅細澶氫釜璧勪骇鍖呭姣?
**鍏抽敭鎸囨爣**:
- 鎬绘浠舵暟/鎬婚噾棰?- 搴旇繕閲戦/瀹炶繕閲戦/閫炬湡閲戦
- 鍥炴敹鐜?- 閫炬湡鐜?
---

### 4. 搴曡〃涓婁紶鑷姩缁存姢
**浣嶇疆**: 璧勪骇鍖呴〉闈?**鏂板缁勪欢**:
- 鏂囦欢涓婁紶缁勪欢锛圗xcel锛?- 瀛楁鏄犲皠閰嶇疆
- 棰勮鍜岀‘璁?
**澶勭悊娴佺▼**:
```
涓婁紶Excel 鈫?瑙ｆ瀽 鈫?瀛楁鏄犲皠 鈫?棰勮 鈫?纭瀵煎叆 鈫?鐢熸垚璧勪骇鍖?```

---

### 5. OCR/鏂囧瓧鎻愬彇
**浣嶇疆**: 妗堜欢褰曞叆椤甸潰
**鏂板缁勪欢**:
- 鍥剧墖涓婁紶鍖哄煙
- 鏂囨湰绮樿创鍖哄煙
- 璇嗗埆缁撴灉棰勮
- 涓€閿～鍏呮寜閽?
**鏀寔绫诲瀷**:
- 璋冭В涔﹁瘑鍒?- 鍒ゅ喅涔﹁瘑鍒?- 韬唤璇佽瘑鍒?- 閫氱敤鏂囨湰璇嗗埆

---

## 渚濊禆搴?
### 鍥捐〃搴?```html
<!-- 浣跨敤 Chart.js -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

### 鏂囦欢涓婁紶
- 鍘熺敓File API
- SheetJS锛坸lsx瑙ｆ瀽锛?
### OCR
- 鍚庣API璋冪敤

---

## API鎺ュ彛

### 璧勪骇鍖?```
GET    /api/asset-packages           # 鍒楄〃
GET    /api/asset-packages/:id       # 璇︽儏
GET    /api/asset-packages/:id/stats # 缁熻
POST   /api/asset-packages/compare   # 瀵规瘮
POST   /api/asset-packages           # 鍒涘缓
PUT    /api/asset-packages/:id       # 鏇存柊
DELETE /api/asset-packages/:id       # 鍒犻櫎
```

### 閫氱煡
```
GET    /api/notifications            # 鍒楄〃
GET    /api/notifications/unread-count
PUT    /api/notifications/:id/read   # 鏍囪宸茶
PUT    /api/notifications/read-all   # 鍏ㄩ儴宸茶
```

### 杩樻璁″垝
```
POST   /api/cases/:id/repayment-plan # 鍒涘缓璁″垝
POST   /api/cases/:id/generate-installments # 鐢熸垚鍒嗘湡
```

### OCR
```
POST   /api/ocr/recognize            # 鍥剧墖璇嗗埆
POST   /api/ocr/extract-text         # 鏂囨湰鎻愬彇
```

---

## 鏂囦欢璺緞

鍓嶇涓绘枃浠? `case-management-system/frontend/offline.html`

---

**鏇存柊鐘舵€?*: 鍚庣宸插畬鎴愶紝鍓嶇闇€鏇存柊
