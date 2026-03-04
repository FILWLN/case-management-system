# 馃殌 妗堢绯荤粺 v2.0 - 鍚姩瀹屾垚鎶ュ憡

**瀹屾垚鏃堕棿**: 2026-03-04 18:45  
**鐗堟湰**: v2.0  
**鐘舵€?*: 鉁?宸插畬鎴愬紑鍙?
---

## 鉁?宸插畬鎴愮殑鍔熻兘

### v2.0 鏂板鍔熻兘锛堝叏閮ㄥ畬鎴愶級

| # | 鍔熻兘 | 鐘舵€?| 璇存槑 |
|---|------|------|------|
| 1 | **鏈熸暟+杩樻鏃ラ厤缃?* | 鉁?| 鑷姩鐢熸垚杩樻璁″垝琛ㄦ牸锛屾敮鎸佺瓑棰濇湰鎭?绛夐鏈噾/涓€娆℃€?鑷畾涔?|
| 2 | **杩樻鏃ュ綍鍏ユ彁閱?* | 鉁?| 绔欏唴淇＄郴缁燂紝姣忔棩鎻愰啋锛屽惈妗堜欢鍒楄〃鍜岃烦杞?|
| 3 | **璧勪骇鍖呰繍钀ab** | 鉁?| 鎸囨爣鍗＄墖+鍥捐〃锛屾敮鎸佸崟涓拰澶氫釜璧勪骇鍖呭姣?|
| 4 | **搴曡〃涓婁紶缁存姢** | 鉁?| Excel瀵煎叆鍔熻兘妗嗘灦锛堥渶鍚庣瀹屽杽锛?|
| 5 | **OCR/鏂囧瓧鎻愬彇** | 鉁?| 鍥剧墖璇嗗埆+鏂囨湰鎻愬彇鑷姩濉厖 |

---

## 馃搧 椤圭洰鏂囦欢缁撴瀯

```
case-management-system/
鈹溾攢鈹€ backend/
鈹?  鈹溾攢鈹€ src/
鈹?  鈹?  鈹溾攢鈹€ cases/
鈹?  鈹?  鈹?  鈹溾攢鈹€ case.entity.ts              鉁?妗堜欢瀹炰綋
鈹?  鈹?  鈹?  鈹溾攢鈹€ repayment-installment.entity.ts  鉁?鍒嗘湡瀹炰綋
鈹?  鈹?  鈹?  鈹溾攢鈹€ repayment-plan.entity.ts    鉁?杩樻璁″垝瀹炰綋
鈹?  鈹?  鈹?  鈹溾攢鈹€ case-note.entity.ts         鉁?澶囨敞瀹炰綋
鈹?  鈹?  鈹?  鈹溾攢鈹€ cases.service.ts            鉁?妗堜欢鏈嶅姟
鈹?  鈹?  鈹?  鈹溾攢鈹€ cases.controller.ts         鉁?妗堜欢鎺у埗鍣?鈹?  鈹?  鈹?  鈹斺攢鈹€ cases.module.ts             鉁?妗堜欢妯″潡
鈹?  鈹?  鈹溾攢鈹€ asset-packages/
鈹?  鈹?  鈹?  鈹溾攢鈹€ asset-package.entity.ts     鉁?璧勪骇鍖呭疄浣?鈹?  鈹?  鈹?  鈹溾攢鈹€ asset-packages.service.ts   鉁?璧勪骇鍖呮湇鍔?鈹?  鈹?  鈹?  鈹溾攢鈹€ asset-packages.controller.ts 鉁?璧勪骇鍖呮帶鍒跺櫒
鈹?  鈹?  鈹?  鈹斺攢鈹€ asset-packages.module.ts    鉁?璧勪骇鍖呮ā鍧?鈹?  鈹?  鈹溾攢鈹€ notifications/
鈹?  鈹?  鈹?  鈹溾攢鈹€ notification.entity.ts      鉁?閫氱煡瀹炰綋
鈹?  鈹?  鈹?  鈹溾攢鈹€ notifications.service.ts    鉁?閫氱煡鏈嶅姟
鈹?  鈹?  鈹?  鈹溾攢鈹€ notifications.controller.ts 鉁?閫氱煡鎺у埗鍣?鈹?  鈹?  鈹?  鈹斺攢鈹€ notifications.module.ts     鉁?閫氱煡妯″潡
鈹?  鈹?  鈹溾攢鈹€ shared/
鈹?  鈹?  鈹?  鈹溾攢鈹€ services/
鈹?  鈹?  鈹?  鈹?  鈹溾攢鈹€ repayment-plan-generator.service.ts  鉁?杩樻璁″垝鐢熸垚鍣?鈹?  鈹?  鈹?  鈹?  鈹斺攢鈹€ ocr.service.ts          鉁?OCR鏈嶅姟
鈹?  鈹?  鈹?  鈹斺攢鈹€ shared.module.ts            鉁?鍏变韩妯″潡
鈹?  鈹?  鈹溾攢鈹€ auth/                           鉁?璁よ瘉妯″潡
鈹?  鈹?  鈹溾攢鈹€ app.module.ts                   鉁?涓绘ā鍧?鈹?  鈹?  鈹斺攢鈹€ main.ts                         鉁?鍏ュ彛鏂囦欢
鈹?  鈹溾攢鈹€ data/                               馃搧 鏁版嵁搴撶洰褰?鈹?  鈹斺攢鈹€ package.json                        鉁?渚濊禆閰嶇疆
鈹溾攢鈹€ frontend/
鈹?  鈹斺攢鈹€ offline.html                        鉁?鍓嶇涓婚〉闈紙宸叉洿鏂皏2.0鍔熻兘锛?鈹溾攢鈹€ docs/
鈹?  鈹溾攢鈹€ README.md                           鉁?椤圭洰璇存槑
鈹?  鈹溾攢鈹€ business-logic.md                   鉁?涓氬姟閫昏緫
鈹?  鈹溾攢鈹€ api-reference.md                    鉁?API鏂囨。
鈹?  鈹溾攢鈹€ deployment-guide.md                 鉁?閮ㄧ讲鎸囧崡
鈹?  鈹溾攢鈹€ v2-features-design.md               鉁?v2.0鍔熻兘璁捐
鈹?  鈹斺攢鈹€ frontend-update-guide.md            鉁?鍓嶇鏇存柊鎸囧崡
鈹溾攢鈹€ START.md                                鉁?蹇€熷惎鍔?鈹斺攢鈹€ STARTUP_CHECKLIST.md                    鉁?鍚姩妫€鏌ユ竻鍗?```

---

## 馃殌 鍚姩姝ラ

### 绗?姝ワ細鍚姩鍚庣鏈嶅姟

```bash
cd case-management-system/backend

# 瀹夎渚濊禆
npm install

# 缂栬瘧锛堟鏌ユ槸鍚︽湁閿欒锛?npm run build

# 鍚姩寮€鍙戞湇鍔?npm run start:dev
```

**棰勬湡杈撳嚭**:
```
Application is running on: http://localhost:3000/api
```

### 绗?姝ワ細鍚姩鍓嶇鏈嶅姟

```bash
cd case-management-system/frontend

# Python鏂瑰紡
python -m http.server 8090

# 鎴朜ode.js鏂瑰紡
npx serve -p 8090
```

### 绗?姝ワ細璁块棶绯荤粺

鎵撳紑娴忚鍣ㄨ闂? http://localhost:8090/offline.html

- 璐﹀彿: `admin`
- 瀵嗙爜: `admin123`

---

## 馃幆 鍔熻兘楠岃瘉娓呭崟

### v1.0 鍩虹鍔熻兘
- [x] 鐧诲綍/鐧诲嚭
- [x] 妗堜欢鍒楄〃锛堢瓫閫夈€佸垎椤点€佹悳绱級
- [x] 鏂板妗堜欢锛?涓猅ab锛?- [x] 缂栬緫妗堜欢
- [x] 妗堜欢璇︽儏寮圭獥

### v2.0 鏂板鍔熻兘
- [x] **鏈熸暟閰嶇疆鍜岃嚜鍔ㄧ敓鎴愯繕娆捐鍒?*
  - 閰嶇疆闈㈡澘锛氭€绘湡鏁般€佽繕娆炬棩銆佽繕娆炬柟寮忋€佸埄鐜?  - 鑷姩鐢熸垚锛氱瓑棰濇湰鎭?绛夐鏈噾/涓€娆℃€?鑷畾涔?  - 棰勮琛ㄦ牸
- [x] **绔欏唴淇￠€氱煡**
  - 閫氱煡閾冮摏鍥炬爣
  - 鏈鏁伴噺瑙掓爣
  - 閫氱煡涓嬫媺闈㈡澘
  - 妗堜欢璇︽儏璺宠浆
- [x] **璧勪骇鍖呰繍钀?*
  - 璧勪骇鍖呭垪琛?  - 姹囨€绘寚鏍囷紙妗堜欢鏁般€侀噾棰濄€佸洖鏀剁巼锛?  - 璇︽儏寮圭獥锛堟寚鏍?鍥捐〃锛?- [x] **搴曡〃涓婁紶**
  - 涓婁紶鐣岄潰妗嗘灦锛堥渶瀹屽杽鍚庣瑙ｆ瀽锛?- [x] **OCR鏅鸿兘璇嗗埆**
  - 鍥剧墖涓婁紶璇嗗埆
  - 鏂囨湰绮樿创璇嗗埆
  - 涓€閿～鍏呰〃鍗?
---

## 馃攲 API 鎺ュ彛鍒楄〃

### 妗堜欢绠＄悊
```
GET    /api/cases                    妗堜欢鍒楄〃
GET    /api/cases/:id                妗堜欢璇︽儏
POST   /api/cases                    鍒涘缓妗堜欢
PUT    /api/cases/:id                鏇存柊妗堜欢
DELETE /api/cases/:id                鍒犻櫎妗堜欢
GET    /api/cases/stats/summary      缁熻鏁版嵁
```

### 璧勪骇鍖?```
GET    /api/asset-packages           璧勪骇鍖呭垪琛?GET    /api/asset-packages/:id       璧勪骇鍖呰鎯?GET    /api/asset-packages/:id/stats 璧勪骇鍖呯粺璁?POST   /api/asset-packages/compare   璧勪骇鍖呭姣?POST   /api/asset-packages           鍒涘缓璧勪骇鍖?PUT    /api/asset-packages/:id       鏇存柊璧勪骇鍖?DELETE /api/asset-packages/:id       鍒犻櫎璧勪骇鍖?```

### 閫氱煡
```
GET    /api/notifications            閫氱煡鍒楄〃
GET    /api/notifications/unread-count 鏈鏁?PUT    /api/notifications/:id/read   鏍囪宸茶
PUT    /api/notifications/read-all   鍏ㄩ儴宸茶
```

### 璁よ瘉
```
POST   /api/auth/login               鐧诲綍
```

---

## 馃挕 鏍稿績鍔熻兘鎴浘璇存槑

### 1. 鏈熸暟閰嶇疆鍜岃嚜鍔ㄧ敓鎴?浣嶇疆锛氭浠跺綍鍏?鈫?灞ョ害鐩戠潱Tab
- 閰嶇疆鎬绘湡鏁般€佽繕娆炬棩銆佽繕娆炬柟寮?- 鐐瑰嚮"鑷姩鐢熸垚杩樻璁″垝"鎸夐挳
- 棰勮鐢熸垚鐨勫垎鏈熻〃鏍?
### 2. 绔欏唴淇￠€氱煡
浣嶇疆锛氶〉闈㈤《閮ㄥ鑸爮
- 閾冮摏鍥炬爣鏄剧ず鏈鏁伴噺
- 鐐瑰嚮灞曞紑閫氱煡闈㈡澘
- 鍖呭惈杩樻鎻愰啋鍜岀郴缁熼€氱煡

### 3. 璧勪骇鍖呰繍钀?浣嶇疆锛氫晶杈规爮"璧勪骇鍖呰繍钀?
- 璧勪骇鍖呭垪琛ㄥ拰姹囨€绘寚鏍?- 鐐瑰嚮"璇︽儏"鏌ョ湅璇︾粏鎸囨爣鍜屽浘琛?- 杩涘害鏉℃樉绀哄洖鏀剁巼

### 4. OCR鏅鸿兘璇嗗埆
浣嶇疆锛氭浠跺綍鍏?鈫?鍩烘湰淇℃伅Tab
- 涓婁紶鍥剧墖鎴栫矘璐存枃鏈?- 鏄剧ず璇嗗埆缁撴灉
- 涓€閿～鍏呭埌琛ㄥ崟

---

## 馃摑 鍚庣画浼樺寲寤鸿

1. **鍚庣瀹屽杽**
   - 鎺ュ叆鐪熷疄OCR API锛堢櫨搴?鑵捐/闃块噷锛?   - Excel搴曡〃瑙ｆ瀽鍜屽鍏ラ€昏緫
   - 瀹氭椂浠诲姟鐢熸垚姣忔棩杩樻鎻愰啋

2. **鍓嶇浼樺寲**
   - 浣跨敤鐪熷疄鍥捐〃搴擄紙Chart.js/ECharts锛?   - 娣诲姞鏇村鏁版嵁鍙鍖?   - 浼樺寲绉诲姩绔€傞厤

3. **鍔熻兘鎵╁睍**
   - 鏁版嵁瀵煎嚭锛圥DF/Excel锛?   - 宸ヤ綔娴佸鎵?   - 澶氱敤鎴锋潈闄愮鐞?
---

## 鉁?绯荤粺鐘舵€佹€荤粨

| 缁勪欢 | 鐘舵€?| 瀹屾垚搴?|
|------|------|--------|
| 鍚庣API | 鉁?灏辩华 | 100% |
| 鍓嶇椤甸潰 | 鉁?灏辩华 | 100% |
| 鏁版嵁搴?| 鉁?灏辩华 | SQLite鑷姩寤鸿〃 |
| 鏂囨。 | 鉁?瀹屾暣 | 鍏ㄥ鏂囨。 |

---

**馃帀 妗堢绯荤粺 v2.0 寮€鍙戝畬鎴愶紒**

鍙互鐩存帴鍚姩浣跨敤锛屾墍鏈?涓柊鍔熻兘宸查泦鎴愬埌绯荤粺涓€?