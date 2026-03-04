# 馃殌 妗堢绯荤粺 - 鍚姩璇存槑

**椤圭洰璺緞**: `case-management-system/`  
**鍒涘缓鏃堕棿**: 2026-03-04  
**鐗堟湰**: v1.0

---

## 馃搧 椤圭洰缁撴瀯

```
case-management-system/
鈹溾攢鈹€ backend/                 # NestJS 鍚庣
鈹?  鈹溾攢鈹€ src/
鈹?  鈹?  鈹溾攢鈹€ cases/          # 妗堜欢妯″潡
鈹?  鈹?  鈹溾攢鈹€ auth/           # 璁よ瘉妯″潡
鈹?  鈹?  鈹溾攢鈹€ app.module.ts
鈹?  鈹?  鈹斺攢鈹€ main.ts
鈹?  鈹溾攢鈹€ data/               # SQLite鏁版嵁搴撶洰褰?鈹?  鈹斺攢鈹€ package.json
鈹溾攢鈹€ frontend/               # Vue 3 鍓嶇
鈹?  鈹溾攢鈹€ offline.html        # 涓婚〉闈?鈹?  鈹溾攢鈹€ vue.global.js
鈹?  鈹溾攢鈹€ element-plus.css
鈹?  鈹斺攢鈹€ element-plus.full.js
鈹斺攢鈹€ docs/                   # 鏂囨。
    鈹溾攢鈹€ README.md
    鈹溾攢鈹€ business-logic.md   # 涓氬姟閫昏緫
    鈹溾攢鈹€ api-reference.md    # API鏂囨。
    鈹斺攢鈹€ deployment-guide.md # 閮ㄧ讲鎸囧崡
```

---

## 鈿?蹇€熷惎鍔?
### 绗竴姝ワ細鍚姩鍚庣

```bash
cd case-management-system/backend
npm install
npm run start:dev
```

鍚庣鏈嶅姟鍦板潃: http://localhost:3000/api

### 绗簩姝ワ細鍚姩鍓嶇

```bash
cd case-management-system/frontend

# 鏂瑰紡1: Python
python -m http.server 8090

# 鏂瑰紡2: Node.js
npx serve -p 8090
```

鍓嶇璁块棶鍦板潃: http://localhost:8090/offline.html

### 婕旂ず璐﹀彿

- 鐢ㄦ埛鍚? `admin`
- 瀵嗙爜: `admin123`

---

## 馃搵 鏍稿績鍔熻兘

### 妗堜欢鐢熷懡鍛ㄦ湡锛?涓姸鎬侊級

```
寰呭鐞?寰呯珛妗?鈫?宸茬珛妗?寰呬繚鍏?鈫?淇濆叏涓?寰呭鐞?鈫?璋冭В/鍒ゅ喅缁撴潫-寰呭饱绾?鈫?宸茬粨妗?灞ョ害鐩戠潱涓?鈫?[鎵ц涓璢 鈫?妗堜欢缁撴潫
```

**鍏抽敭鐞嗚В**: 鎵ц鏄繚闅滃饱绾︾殑鎵嬫锛屾浠剁粨鏉熺殑鍞竴鏍囧織鏄?*鏈饱绾﹂噾棰?= 0**

### 5涓猅ab椤甸潰

1. **鍩烘湰淇℃伅** - 妗堜欢缂栧彿銆佸綋浜嬩汉淇℃伅
2. **绔嬫涓庢墽淇?* - 绔嬫淇℃伅銆佽瘔璁间繚鍏?3. **璋冭В/鍒ゅ喅** - 缁撴绫诲瀷銆佽皟瑙?鍒ゅ喅璇︽儏
4. **灞ョ害鐩戠潱** - 杩樻鎯呭喌銆佸垎鏈熸槑缁?5. **鎵ц妗堜欢** - 鎵ц绔嬫銆佸洖娆句俊鎭€佹墽鎭㈣褰?
---

## 馃攲 API 鎺ュ彛

| 鏂规硶 | 璺緞 | 璇存槑 |
|------|------|------|
| GET | `/cases` | 妗堜欢鍒楄〃 |
| GET | `/cases/:id` | 妗堜欢璇︽儏 |
| POST | `/cases` | 鍒涘缓妗堜欢 |
| PUT | `/cases/:id` | 鏇存柊妗堜欢 |
| DELETE | `/cases/:id` | 鍒犻櫎妗堜欢 |
| GET | `/cases/stats/summary` | 缁熻鏁版嵁 |
| POST | `/auth/login` | 鐧诲綍 |

---

## 馃搳 鏁版嵁妯″瀷

### 妗堜欢瀹炰綋 (60+ 瀛楁)

- 鍩烘湰淇℃伅: caseNo, customerName, status, ...
- 绔嬫淇℃伅: filingDate, civilCaseNo, judgeName, ...
- 鎵т繚淇℃伅: freezeDate, freezeAmount, ...
- 璋冭В淇℃伅: closeType, orderAmount, negotiatedAmount, ...
- 鍒ゅ喅淇℃伅: judgmentAmount, serviceDate, ...
- 灞ョ害鐩戠潱: paidAmount, applyEnforcement, ...
- 鎵ц妗堜欢: executionCaseNumber, courtDeduction, ...
- 鎵ф仮淇℃伅: hasRecovery, recoveryCaseNo, ...

---

## 馃摉 璇︾粏鏂囨。

- **涓氬姟閫昏緫**: `docs/business-logic.md`
- **API鏂囨。**: `docs/api-reference.md`
- **閮ㄧ讲鎸囧崡**: `docs/deployment-guide.md`

---

## 鉁?宸插畬鎴愮‘璁?
| # | 浜嬮」 | 鐘舵€?|
|---|------|------|
| 1 | 蹇呭～瀛楁锛氶樁娈垫祦杞椂濉啓 | 鉁?|
| 2 | 鏈饱绾﹂噾棰濊绠?| 鉁?|
| 3 | 鎵ц鏍囩殑閲戦鍙慨鏀?| 鉁?|
| 4 | 鐘舵€佹祦杞€昏緫 | 鉁?|
| 5 | 鎵ф仮浣滀负瀛愭祦绋?| 鉁?|

---

**椤圭洰宸插綊妗ｅ畬姣曪紝鍙互鐩存帴浣跨敤锛?*
