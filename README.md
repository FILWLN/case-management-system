# 妗堢绯荤粺 v2.0 - 椤圭洰璇存槑鏂囨。

**椤圭洰鍚嶇О**: 妗堢绯荤粺  
**鐗堟湰**: v2.0  
**鍒涘缓鏃堕棿**: 2026-03-04  
**鎶€鏈爤**: Vue 3 + NestJS + TypeORM + SQLite

---

## 馃啎 v2.0 鏂板鍔熻兘

1. **鏈熸暟+杩樻鏃ラ厤缃?* - 鎸夐厤缃嚜鍔ㄧ敓鎴愯繕娆捐鍒掕〃鏍?2. **杩樻鏃ュ綍鍏ユ彁閱?* - 绔欏唴淇℃瘡鏃ユ彁閱掞紝鍚浠惰鎯呰烦杞?3. **璧勪骇鍖呰繍钀?* - 搴旇繕/瀹炶繕/閫炬湡鎸囨爣鍜屽浘琛ㄥ垎鏋?4. **搴曡〃涓婁紶缁存姢** - Excel瀵煎叆鑷姩缁存姢璧勪骇鍖?5. **OCR鏅鸿兘璇嗗埆** - 鍥剧墖/鏂囧瓧鎻愬彇鑷姩濉厖琛ㄥ崟

---

## 馃搧 椤圭洰缁撴瀯  

---

## 馃搧 椤圭洰缁撴瀯

```
case-management-system/
鈹溾攢鈹€ frontend/                       # 鍓嶇浠ｇ爜
鈹?  鈹溾攢鈹€ offline.html               # 涓婚〉闈紙绂荤嚎鍙敤锛?鈹?  鈹溾攢鈹€ element-plus.css           # UI妗嗘灦鏍峰紡
鈹?  鈹溾攢鈹€ element-plus.full.js       # UI妗嗘灦鑴氭湰
鈹?  鈹斺攢鈹€ vue.global.js              # Vue 3 杩愯鏃?鈹?鈹溾攢鈹€ backend/                        # 鍚庣浠ｇ爜
鈹?  鈹溾攢鈹€ src/
鈹?  鈹?  鈹溾攢鈹€ cases/                  # 妗堜欢妯″潡
鈹?  鈹?  鈹?  鈹溾攢鈹€ case.entity.ts      # 妗堜欢瀹炰綋
鈹?  鈹?  鈹?  鈹溾攢鈹€ repayment-installment.entity.ts  # 鍒嗘湡瀹炰綋
鈹?  鈹?  鈹?  鈹溾攢鈹€ repayment-plan.entity.ts         # 杩樻璁″垝瀹炰綋
鈹?  鈹?  鈹?  鈹溾攢鈹€ case-note.entity.ts              # 澶囨敞瀹炰綋
鈹?  鈹?  鈹?  鈹溾攢鈹€ cases.service.ts    # 妗堜欢鏈嶅姟
鈹?  鈹?  鈹?  鈹溾攢鈹€ cases.controller.ts # 妗堜欢鎺у埗鍣?鈹?  鈹?  鈹?  鈹斺攢鈹€ cases.module.ts     # 妗堜欢妯″潡
鈹?  鈹?  鈹溾攢鈹€ asset-packages/         # 璧勪骇鍖呮ā鍧?鈹?  鈹?  鈹?  鈹溾攢鈹€ asset-package.entity.ts
鈹?  鈹?  鈹?  鈹溾攢鈹€ asset-packages.service.ts
鈹?  鈹?  鈹?  鈹溾攢鈹€ asset-packages.controller.ts
鈹?  鈹?  鈹?  鈹斺攢鈹€ asset-packages.module.ts
鈹?  鈹?  鈹溾攢鈹€ notifications/          # 閫氱煡妯″潡
鈹?  鈹?  鈹?  鈹溾攢鈹€ notification.entity.ts
鈹?  鈹?  鈹?  鈹溾攢鈹€ notifications.service.ts
鈹?  鈹?  鈹?  鈹溾攢鈹€ notifications.controller.ts
鈹?  鈹?  鈹?  鈹斺攢鈹€ notifications.module.ts
鈹?  鈹?  鈹溾攢鈹€ shared/                 # 鍏变韩鏈嶅姟
鈹?  鈹?  鈹?  鈹斺攢鈹€ services/
鈹?  鈹?  鈹?      鈹溾攢鈹€ repayment-plan-generator.service.ts
鈹?  鈹?  鈹?      鈹斺攢鈹€ ocr.service.ts
鈹?  鈹?  鈹溾攢鈹€ auth/                   # 璁よ瘉妯″潡
鈹?  鈹?  鈹溾攢鈹€ app.module.ts           # 搴旂敤涓绘ā鍧?鈹?  鈹?  鈹斺攢鈹€ main.ts                 # 鍏ュ彛鏂囦欢
鈹?  鈹溾攢鈹€ package.json                # 渚濊禆閰嶇疆
鈹?  鈹斺攢鈹€ tsconfig.json               # TypeScript閰嶇疆
鈹?鈹溾攢鈹€ database/                       # 鏁版嵁搴撶浉鍏?鈹?  鈹斺攢鈹€ schema.sql                 # 鏁版嵁搴撶粨鏋勶紙鍙€夛級
鈹?鈹斺攢鈹€ docs/                          # 鏂囨。
    鈹溾攢鈹€ README.md                  # 椤圭洰璇存槑
    鈹溾攢鈹€ business-logic.md          # 涓氬姟閫昏緫姊崇悊
    鈹溾攢鈹€ api-reference.md           # API鎺ュ彛鏂囨。
    鈹斺攢鈹€ deployment-guide.md        # 閮ㄧ讲鎸囧崡
```

---

## 馃殌 蹇€熷惎鍔?
### 1. 鍚姩鍚庣鏈嶅姟

```bash
cd backend
npm install
npm run build
npm run start:dev
```

鍚庣鏈嶅姟榛樿杩愯鍦? http://localhost:3000

### 2. 鍚姩鍓嶇椤甸潰

鐩存帴鎵撳紑 `frontend/offline.html` 鎴栦娇鐢ㄤ换鎰忛潤鎬佹湇鍔″櫒锛?
```bash
cd frontend
# 浣跨敤 Python 绠€鍗曟湇鍔″櫒
python -m http.server 8090
# 鎴栦娇鐢?Node.js
npx serve -p 8090
```

鍓嶇璁块棶鍦板潃: http://localhost:8090/offline.html

---

## 馃搵 鍔熻兘妯″潡

### 妗堜欢鐢熷懡鍛ㄦ湡锛?涓姸鎬侊級

```
寰呭鐞?寰呯珛妗?鈫?宸茬珛妗?寰呬繚鍏?鈫?淇濆叏涓?寰呭鐞?鈫?璋冭В/鍒ゅ喅缁撴潫-寰呭饱绾?鈫?宸茬粨妗?灞ョ害鐩戠潱涓?鈫?[鎵ц涓璢 鈫?妗堜欢缁撴潫
```

| 鐘舵€佸€?| 鏄剧ず鍚嶇О | 璇存槑 |
|--------|----------|------|
| pending | 寰呭鐞?寰呯珛妗?| 鍒氬綍鍏ワ紝绛夊緟绔嬫 |
| filing | 宸茬珛妗?寰呬繚鍏?| 宸插垎閰嶆鍙凤紝绛夊緟淇濆叏 |
| preservation | 淇濆叏涓?寰呭鐞?| 淇濆叏杩涜涓紝绛夊緟璋冭В/鍒ゅ喅 |
| mediation | 璋冭В缁撴潫-寰呭饱绾?| 璋冭В缁撴锛岀瓑寰呭饱绾?|
| judgment | 鍒ゅ喅缁撴潫-寰呭饱绾?| 鍒ゅ喅缁撴锛岀瓑寰呭饱绾?|
| closed | 宸茬粨妗?灞ョ害鐩戠潱涓?| 缁撴鍚庣洃鐫ｅ饱绾﹂樁娈?|
| execution | 鎵ц涓?| **寮哄埗鎵ц鎵嬫** |
| finished | 妗堜欢缁撴潫 | **灞ョ害瀹屾垚锛屾湭灞ョ害閲戦=0** |

### 鍏抽敭涓氬姟鐞嗚В

> **鎵ц 鈮?妗堜欢缁撴潫**  
> 鎵ц鏄繚闅滃€哄姟浜哄饱绾︾殑寮哄埗鎵嬫锛屾浠剁粨鏉熺殑鍞竴鏍囧織鏄細**鏈饱绾﹂噾棰?= 0**

```
灞ョ害鐩戠潱涓?    鈹?    鈹溾攢鈹€ 鍊哄姟浜轰富鍔ㄨ繕娆?鈹€鈹€鈹€鈹€鈹€鈫?鏈饱绾﹂噾棰?0 鈹€鈹€鈹€鈹€鈹€鈫?妗堜欢缁撴潫 鉁?    鈹?    鈹斺攢鈹€ 鍊哄姟浜轰笉灞ョ害 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈫?鐢宠寮哄埗鎵ц
                                  鈹?                                  鈻?                            鎵ц涓紙寮哄埗鎵嬫锛?                                  鈹?                                  鈹溾攢鈹€ 鎵ц鍥炴 鈫?璁″叆宸茶繕鎬婚 鈫?缁х画鐩戠潱
                                  鈹?                                  鈹斺攢鈹€ 缁堟湰/缁堢粨 鈫?鎵ф仮 鈫?鎭㈠鎵ц
```

---

## 馃搳 鏁版嵁妯″瀷

### 妗堜欢瀹炰綋 (Case) - 60+ 瀛楁

#### 鍩烘湰淇℃伅
- `caseNo`: 妗堜欢搴忓彿锛堝繀濉級
- `caseType`: 妗堜欢绫诲瀷锛坙itigation/execution/preservation锛?- `customerName`: 瀹㈡埛濮撳悕锛堝繀濉級
- `customerIdcard`: 韬唤璇佸彿锛堝姞瀵嗭級
- `customerPhone`: 鐢佃瘽锛堝姞瀵嗭級
- `status`: 妗堜欢鐘舵€?
#### 绔嬫淇℃伅
- `filingDate`: 绔嬫鏃ユ湡
- `civilCaseNo`: 姘戝垵妗堝彿
- `judgeName`: 鎵垮姙娉曞畼
- `judgeAssistant`: 娉曞畼鍔╃悊
- `clerk`: 涔﹁鍛?
#### 鎵т繚淇℃伅
- `freezeDate`: 鍐荤粨鏃ユ湡
- `freezeAmount`: 鐢宠鍐荤粨閲戦
- `actualFreezeAmount`: 瀹為檯鍐荤粨閲戦
- `noFreezeRequired`: 宸插崗鍟嗘棤闇€鍐荤粨

#### 璋冭В淇℃伅
- `disputeDate`: 杩濈害绾犵悍鍙戠敓鏃ユ湡
- `agreementDate`: 鍗忚绛剧讲鏃ユ湡
- `closeType`: 璋冭В缁撴鏂瑰紡
- `closeDate`: 璋冭В缁撴鏃ユ湡
- `orderAmount`: 璁㈠崟閲戦
- `negotiatedAmount`: 璁㈠崟澶栧崗鍟嗛噾棰?
#### 鍒ゅ喅淇℃伅
- `serviceDate`: 鍒ゅ喅涔﹂€佽揪鏃ユ湡
- `effectiveDate`: 鍒ゅ喅鐢熸晥鏃ユ湡
- `judgmentAmount`: 鍒ゅ喅閲戦

#### 灞ョ害鐩戠潱
- `paidAmount`: 宸茶繕鎬婚
- `applyEnforcement`: 鏄惁鐢宠寮哄埗鎵ц
- `repaymentMethod`: 杩樻鏂瑰紡

#### 鎵ц妗堜欢
- `executionCaseNumber`: 鎵ц妗堝彿
- `executionOriginalAmount`: 鎵ц鏍囩殑閲戦
- `courtDeduction`: 娉曢櫌鍒掓墸閲戦
- `voluntaryRepayment`: 褰撲簨浜轰富鍔ㄨ繕娆?
#### 鎵ф仮淇℃伅
- `hasRecovery`: 鏄惁鎵ф仮
- `recoveryCaseNo`: 鎵ф仮妗堝彿
- `recoveryAmount`: 鎵ф仮鏍囩殑閲戦

---

## 馃敘 閲戦璁＄畻閫昏緫

| 璁＄畻椤?| 鍏紡 |
|--------|------|
| 璋冭В缁撴灉閲戦 | = 璁㈠崟閲戦 + 璁㈠崟澶栧崗鍟嗛噾棰?|
| 鍒ゅ喅缁撴灉閲戦 | = 鍒ゅ喅涔︾‘瀹氶噾棰?|
| **鏈饱绾﹂噾棰?* | = 缁撴缁撴灉閲戦 - 宸茶繕鎬婚 |
| 鎵ц鏍囩殑閲戦 | 榛樿 = 鏈饱绾﹂噾棰濓紙鍙墜鍔ㄤ慨鏀癸級 |

**妗堜欢缁撴潫鏉′欢**: `鏈饱绾﹂噾棰?<= 0`

---

## 馃攲 API 鎺ュ彛

### 妗堜欢绠＄悊

| 鏂规硶 | 璺緞 | 璇存槑 |
|------|------|------|
| GET | `/cases` | 妗堜欢鍒楄〃锛堟敮鎸佸垎椤点€佺瓫閫夈€佹悳绱級 |
| GET | `/cases/:id` | 妗堜欢璇︽儏 |
| POST | `/cases` | 鍒涘缓妗堜欢 |
| PUT | `/cases/:id` | 鏇存柊妗堜欢 |
| DELETE | `/cases/:id` | 鍒犻櫎妗堜欢锛堣蒋鍒犻櫎锛?|
| GET | `/cases/stats/summary` | 缁熻鏁版嵁 |

### 鏌ヨ鍙傛暟

```
GET /cases?page=1&pageSize=10&caseType=litigation&status=pending&keyword=寮犱笁
```

---

## 馃帹 鍓嶇椤甸潰缁撴瀯

### 5涓猅ab椤甸潰

1. **鍩烘湰淇℃伅**: 妗堜欢缂栧彿銆佸綋浜嬩汉淇℃伅
2. **绔嬫涓庢墽淇?*: 绔嬫淇℃伅銆佽瘔璁间繚鍏?3. **璋冭В/鍒ゅ喅**: 缁撴绫诲瀷銆佽皟瑙?鍒ゅ喅璇︽儏
4. **灞ョ害鐩戠潱**: 杩樻鎯呭喌銆佸垎鏈熸槑缁嗐€佸喕缁?瑙ｅ喕
5. **鎵ц妗堜欢**: 鎵ц绔嬫銆佸洖娆句俊鎭€佹墽鎭㈣褰?
### 鏁版嵁杞崲

鍓嶇浣跨敤宓屽瀵硅薄瀛樺偍琛ㄥ崟鏁版嵁锛岄€氳繃杞崲鍑芥暟涓庡悗绔墎骞冲寲瀛楁瀵规帴锛?
```javascript
// 鎻愪氦鏃惰浆鎹?const apiData = formToApiData(form);
// { filing: { filingDate: '2024-01-01' } } 鈫?{ filingDate: '2024-01-01' }

// 鎺ユ敹鏃惰浆鎹?const formData = apiDataToForm(apiData);
// { filingDate: '2024-01-01' } 鈫?{ filing: { filingDate: '2024-01-01' } }
```

---

## 馃攼 婕旂ず璐﹀彿

- 鐢ㄦ埛鍚? `admin`
- 瀵嗙爜: `admin123`

---

## 馃摑 寮€鍙戣褰?
### 2026-03-04 涓氬姟閫昏緫纭

1. 鉁?蹇呭～瀛楁锛氶樁娈垫祦杞椂璇ラ樁娈靛瓧娈甸渶鍏ㄩ儴濉啓
2. 鉁?鏈饱绾﹂噾棰濊绠楋細`缁撴缁撴灉閲戦 - 宸茶繕鎬婚`
3. 鉁?鎵ц鏍囩殑閲戦锛氬厑璁告墜鍔ㄤ慨鏀?4. 鉁?鐘舵€佹祦杞細8涓缁嗙姸鎬侊紝鎵ц鏄墜娈碉紝灞ョ害瀹屾垚鏄粨鏉熸爣蹇?5. 鉁?鎵ф仮閫昏緫锛氫綔涓烘墽琛屾浠剁殑瀛愭祦绋?
---

## 馃搫 鏂囦欢娓呭崟

| 鏂囦欢 | 璇存槑 |
|------|------|
| `frontend/offline.html` | 鍓嶇涓婚〉闈?|
| `frontend/vue.global.js` | Vue 3 杩愯鏃?|
| `frontend/element-plus.css` | Element Plus 鏍峰紡 |
| `frontend/element-plus.full.js` | Element Plus 鑴氭湰 |
| `backend/src/cases/case.entity.ts` | 妗堜欢瀹炰綋锛?0+瀛楁锛?|
| `backend/src/cases/cases.service.ts` | 妗堜欢鏈嶅姟灞?|
| `backend/src/cases/cases.controller.ts` | 妗堜欢鎺у埗鍣?|
| `backend/package.json` | 鍚庣渚濊禆閰嶇疆 |
| `docs/business-logic.md` | 涓氬姟閫昏緫姊崇悊 |
| `docs/api-reference.md` | API鎺ュ彛鏂囨。 |
| `docs/deployment-guide.md` | 閮ㄧ讲鎸囧崡 |

---

## 馃洜锔?鎶€鏈緷璧?
### 鍚庣
- @nestjs/common: ^10.0.0
- @nestjs/typeorm: ^10.0.0
- typeorm: ^0.3.17
- sqlite3: ^5.1.6
- @nestjs/jwt: ^10.0.0
- bcrypt: ^5.1.0

### 鍓嶇
- Vue 3 (鍏ㄥ眬鏋勫缓)
- Element Plus (鍏ㄥ眬鏋勫缓)

---

**椤圭洰宸插綊妗ｏ紝鍙洿鎺ヤ娇鐢ㄣ€?*
