# 妗堢绯荤粺 v2.0 - 鍚姩妫€鏌ユ竻鍗?
## 馃搵 鍚庣鍚姩妫€鏌?
### 1. 妫€鏌ユ枃浠跺畬鏁存€?```bash
cd case-management-system/backend/src

# 蹇呴渶鏂囦欢鍒楄〃
echo "=== 妫€鏌ュ疄浣撴枃浠?==="
ls cases/case.entity.ts
echo "鉁?case.entity.ts"
ls cases/repayment-installment.entity.ts
echo "鉁?repayment-installment.entity.ts"
ls cases/repayment-plan.entity.ts
echo "鉁?repayment-plan.entity.ts"
ls cases/case-note.entity.ts
echo "鉁?case-note.entity.ts"
ls asset-packages/asset-package.entity.ts
echo "鉁?asset-package.entity.ts"
ls notifications/notification.entity.ts
echo "鉁?notification.entity.ts"

echo "=== 妫€鏌ユ湇鍔℃枃浠?==="
ls cases/cases.service.ts
echo "鉁?cases.service.ts"
ls asset-packages/asset-packages.service.ts
echo "鉁?asset-packages.service.ts"
ls notifications/notifications.service.ts
echo "鉁?notifications.service.ts"
ls shared/services/repayment-plan-generator.service.ts
echo "鉁?repayment-plan-generator.service.ts"
ls shared/services/ocr.service.ts
echo "鉁?ocr.service.ts"

echo "=== 妫€鏌ユā鍧楁枃浠?==="
ls app.module.ts
echo "鉁?app.module.ts"
ls cases/cases.module.ts
echo "鉁?cases.module.ts"
ls auth/auth.module.ts
echo "鉁?auth.module.ts"
ls asset-packages/asset-packages.module.ts
echo "鉁?asset-packages.module.ts"
ls notifications/notifications.module.ts
echo "鉁?notifications.module.ts"
ls shared/shared.module.ts
echo "鉁?shared.module.ts"
```

### 2. 瀹夎渚濊禆
```bash
cd case-management-system/backend
npm install
```

### 3. 缂栬瘧妫€鏌?```bash
npm run build
```

**棰勬湡杈撳嚭**: 鏃犻敊璇紝鐢熸垚dist鐩綍

### 4. 鍚姩鏈嶅姟
```bash
npm run start:dev
```

**棰勬湡杈撳嚭**:
```
[Nest] 12345  - 2024/03/04 09:00:00     LOG  NestFactory    Starting Nest application...
[Nest] 12345  - 2024/03/04 09:00:00     LOG  InstanceLoader AppModule dependencies initialized
[Nest] 12345  - 2024/03/04 09:00:00     LOG  RoutesResolver CasesController {/api/cases}:
[Nest] 12345  - 2024/03/04 09:00:00     LOG  RoutesResolver AssetPackagesController {/api/asset-packages}:
[Nest] 12345  - 2024/03/04 09:00:00     LOG  RoutesResolver NotificationsController {/api/notifications}:
[Nest] 12345  - 2024/03/04 09:00:00     LOG  NestApplication  Application is running on: http://localhost:3000/api
```

---

## 馃攲 API鎺ュ彛娴嬭瘯

### 娴嬭瘯1: 鍋ュ悍妫€鏌?```bash
curl http://localhost:3000/api/cases
```
**棰勬湡**: 杩斿洖401锛堟湭鎺堟潈锛?
### 娴嬭瘯2: 鐧诲綍
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```
**棰勬湡**: 杩斿洖access_token

### 娴嬭瘯3: 鑾峰彇妗堜欢鍒楄〃
```bash
curl http://localhost:3000/api/cases \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 娴嬭瘯4: 璧勪骇鍖呮帴鍙?```bash
curl http://localhost:3000/api/asset-packages \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 娴嬭瘯5: 閫氱煡鎺ュ彛
```bash
curl http://localhost:3000/api/notifications \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 馃帹 鍓嶇鍚姩妫€鏌?
### 1. 妫€鏌ユ枃浠?```bash
cd case-management-system/frontend
ls offline.html
echo "鉁?offline.html"
```

### 2. 鍚姩闈欐€佹湇鍔″櫒
```bash
# Python 3
python -m http.server 8090

# 鎴?Node.js
npx serve -p 8090

# 鎴?PHP
php -S localhost:8090
```

### 3. 璁块棶娴嬭瘯
鎵撳紑娴忚鍣ㄨ闂? http://localhost:8090/offline.html

**棰勬湡**: 
- 鏄剧ず鐧诲綍椤甸潰
- 鐧诲綍鍚庢樉绀烘浠跺垪琛?- 渚ц竟鏍忔湁锛氭浠跺垪琛ㄣ€佹柊澧炴浠躲€佹暟鎹鍏ャ€佽祫浜у寘杩愯惀

---

## 鉁?鍔熻兘楠岃瘉娓呭崟

### v1.0 鍩虹鍔熻兘
- [ ] 鐧诲綍/鐧诲嚭
- [ ] 妗堜欢鍒楄〃
- [ ] 鏂板妗堜欢
- [ ] 缂栬緫妗堜欢
- [ ] 妗堜欢璇︽儏锛?涓猅ab锛?
### v2.0 鏂板鍔熻兘
- [ ] 鏈熸暟閰嶇疆鍜岃嚜鍔ㄧ敓鎴愯繕娆捐鍒?- [ ] 绔欏唴淇￠€氱煡锛堥搩閾涘浘鏍囷級
- [ ] 璧勪骇鍖呰繍钀ラ〉闈?- [ ] 搴曡〃涓婁紶
- [ ] OCR璇嗗埆

---

## 馃敡 甯歌闂

### 闂1: 绔彛琚崰鐢?**瑙ｅ喅**: 淇敼鍚庣绔彛
```bash
PORT=3001 npm run start:dev
```

### 闂2: 鏁版嵁搴撴潈闄愰敊璇?**瑙ｅ喅**: 鍒涘缓data鐩綍骞舵巿鏉?```bash
mkdir -p case-management-system/backend/data
chmod 755 case-management-system/backend/data
```

### 闂3: 鍓嶇鏃犳硶璁块棶鍚庣API
**瑙ｅ喅**: 妫€鏌ORS閰嶇疆锛岀‘淇濆悗绔厑璁稿墠绔煙鍚?
---

## 馃搳 绯荤粺鐘舵€?
| 缁勪欢 | 鐘舵€?| 璇存槑 |
|------|------|------|
| 鍚庣鏈嶅姟 | 鉁?灏辩华 | NestJS + TypeORM + SQLite |
| 鍓嶇椤甸潰 | 鉁?灏辩华 | Vue 3 + Element Plus |
| 璧勪骇鍖呮ā鍧?| 鉁?灏辩华 | 瀹炰綋/鏈嶅姟/鎺у埗鍣?|
| 閫氱煡妯″潡 | 鉁?灏辩华 | 绔欏唴淇＄郴缁?|
| 杩樻璁″垝 | 鉁?灏辩华 | 鑷姩鐢熸垚绠楁硶 |
| OCR鏈嶅姟 | 鉁?灏辩华 | 寰呮帴鍏ョ湡瀹濧PI |

---

**鍚姩鍛戒护姹囨€?*:

```bash
# 缁堢1: 鍚姩鍚庣
cd case-management-system/backend
npm run start:dev

# 缁堢2: 鍚姩鍓嶇
cd case-management-system/frontend
python -m http.server 8090

# 娴忚鍣ㄨ闂?open http://localhost:8090/offline.html
```
