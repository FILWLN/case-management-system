# 妗堢绯荤粺 MVP - 椤圭洰褰掓。瀹屾垚

**褰掓。鏃堕棿**: 2026-03-04 17:20  
**椤圭洰璺緞**: `case-management-system/`  
**鐘舵€?*: 鉁?宸插畬鎴?
---

## 馃搧 褰掓。鏂囦欢娓呭崟

### 鍚庣 (backend/)
- 鉁?`src/cases/case.entity.ts` - 妗堜欢瀹炰綋锛?0+瀛楁锛?- 鉁?`src/cases/cases.service.ts` - 妗堜欢鏈嶅姟灞?- 鉁?`src/cases/cases.controller.ts` - 妗堜欢鎺у埗鍣?- 鉁?`src/cases/cases.module.ts` - 妗堜欢妯″潡
- 鉁?`src/cases/repayment-installment.entity.ts` - 鍒嗘湡杩樻瀹炰綋
- 鉁?`src/cases/case-note.entity.ts` - 妗堜欢澶囨敞瀹炰綋
- 鉁?`src/auth/auth.module.ts` - 璁よ瘉妯″潡
- 鉁?`src/auth/auth.service.ts` - 璁よ瘉鏈嶅姟
- 鉁?`src/auth/auth.controller.ts` - 璁よ瘉鎺у埗鍣?- 鉁?`src/auth/jwt.strategy.ts` - JWT绛栫暐
- 鉁?`src/auth/local.strategy.ts` - 鏈湴绛栫暐
- 鉁?`src/app.module.ts` - 搴旂敤涓绘ā鍧?- 鉁?`src/main.ts` - 鍏ュ彛鏂囦欢
- 鉁?`package.json` - 渚濊禆閰嶇疆

### 鍓嶇 (frontend/)
- 鉁?`offline.html` - 涓婚〉闈紙宸叉洿鏂扮姸鎬佹樉绀猴級
- 鈿狅笍 `vue.global.js` - 闇€浠庡師椤圭洰澶嶅埗
- 鈿狅笍 `element-plus.css` - 闇€浠庡師椤圭洰澶嶅埗
- 鈿狅笍 `element-plus.full.js` - 闇€浠庡師椤圭洰澶嶅埗

### 鏂囨。 (docs/)
- 鉁?`README.md` - 椤圭洰璇存槑
- 鉁?`business-logic.md` - 涓氬姟閫昏緫姊崇悊锛堝凡鏇存柊锛?- 鉁?`api-reference.md` - API鎺ュ彛鏂囨。
- 鉁?`deployment-guide.md` - 閮ㄧ讲鎸囧崡

### 鍚姩璇存槑
- 鉁?`START.md` - 蹇€熷惎鍔ㄦ寚鍗?
---

## 馃殌 濡備綍浣跨敤褰掓。椤圭洰

### 涓嬫缁х画鏃讹細

1. **鍚姩鍚庣**:
   ```bash
   cd case-management-system/backend
   npm install
   npm run start:dev
   ```

2. **鍚姩鍓嶇**:
   ```bash
   cd case-management-system/frontend
   python -m http.server 8090
   ```

3. **璁块棶**: http://localhost:8090/offline.html

---

## 馃搵 宸插畬鎴愮殑宸ヤ綔

### 涓氬姟閫昏緫纭
| # | 闂 | 纭缁撴灉 |
|---|------|----------|
| 1 | 蹇呭～瀛楁 | 闃舵娴佽浆鏃跺～鍐?|
| 2 | 鏈饱绾﹂噾棰濊绠?| `缁撴缁撴灉閲戦 - 宸茶繕鎬婚` |
| 3 | 鎵ц鏍囩殑閲戦 | 鍏佽鎵嬪姩淇敼 |
| 4 | 鐘舵€佹祦杞?| **鎵ц鏄墜娈碉紝灞ョ害瀹屾垚鎵嶆槸缁撴潫** |
| 5 | 鎵ф仮閫昏緫 | 浣滀负鎵ц妗堜欢鐨勫瓙娴佺▼ |

### 鏍稿績鐞嗚В
```diff
- 涔嬪墠锛氭墽琛屽畬姣?= 妗堜欢缁撴潫
+ 姝ｇ‘锛氬饱绾﹀畬鎴?= 妗堜欢缁撴潫
+ 鎵ц鏄繚闅滃€哄姟浜哄饱绾︾殑寮哄埗鎵嬫
```

---

## 馃摑 鏂囦欢璺緞

**瀹屾暣椤圭洰浣嶇疆**: `C:\Users\榫欐撤\.openclaw\workspace\case-management-system/`

**鍘熼」鐩綅缃?*: `C:\Users\榫欐撤\.openclaw\workspace\banan-case/`

---

**鉁?椤圭洰褰掓。瀹屾垚锛屼笅娆¤"缁х画妗堢绯荤粺"鍗冲彲缁х画宸ヤ綔锛?*
