# 閮ㄧ讲鎸囧崡

## 鐜瑕佹眰

- Node.js >= 18.0.0
- npm >= 9.0.0
- SQLite3锛堝凡鍖呭惈鍦ㄤ緷璧栦腑锛?
---

## 鍚庣閮ㄧ讲

### 1. 瀹夎渚濊禆

```bash
cd backend
npm install
```

### 2. 閰嶇疆鐜鍙橀噺锛堝彲閫夛級

鍒涘缓 `.env` 鏂囦欢锛?
```env
# 鏁版嵁搴?DB_TYPE=sqlite
DB_DATABASE=./data/case-management.db

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# 鏈嶅姟鍣?PORT=3000
```

### 3. 缂栬瘧椤圭洰

```bash
npm run build
```

### 4. 鍚姩鏈嶅姟

**寮€鍙戞ā寮?*锛堣嚜鍔ㄩ噸鍚級锛?```bash
npm run start:dev
```

**鐢熶骇妯″紡**锛?```bash
npm run start:prod
```

鏈嶅姟灏嗚繍琛屽湪 http://localhost:3000

---

## 鍓嶇閮ㄧ讲

### 鏂瑰紡涓€锛氶潤鎬佹枃浠舵湇鍔★紙鎺ㄨ崘锛?
鐩存帴浣跨敤娴忚鍣ㄦ墦寮€ `frontend/offline.html`锛屾垨浣跨敤浠绘剰闈欐€佹湇鍔″櫒锛?
```bash
cd frontend

# Python 3
python -m http.server 8090

# Node.js
npx serve -p 8090

# PHP
php -S localhost:8090
```

璁块棶 http://localhost:8090/offline.html

### 鏂瑰紡浜岋細Nginx

```nginx
server {
    listen 80;
    server_name case-management.local;
    root /path/to/case-management-system/frontend;
    index offline.html;
    
    location / {
        try_files $uri $uri/ /offline.html;
    }
    
    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 鏁版嵁搴撳垵濮嬪寲

TypeORM 浼氳嚜鍔ㄥ垱寤鸿〃缁撴瀯锛屾棤闇€鎵嬪姩鎵ц SQL銆?
濡傞渶鏌ョ湅琛ㄧ粨鏋勶紝鍙弬鑰冿細

```sql
-- 妗堜欢涓昏〃
CREATE TABLE cases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  caseNo VARCHAR(100) NOT NULL,
  caseType VARCHAR(20) NOT NULL,
  customerName VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  -- ... 鍏朵粬瀛楁
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 鍒嗘湡杩樻琛?CREATE TABLE repayment_installments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  caseId INTEGER NOT NULL,
  installmentNo INTEGER NOT NULL,
  dueDate DATE NOT NULL,
  dueAmount DECIMAL(15,2) NOT NULL,
  paidAmount DECIMAL(15,2) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 绯荤粺鐩綍缁撴瀯

```
case-management-system/
鈹溾攢鈹€ backend/
鈹?  鈹溾攢鈹€ dist/              # 缂栬瘧杈撳嚭
鈹?  鈹溾攢鈹€ src/
鈹?  鈹溾攢鈹€ data/              # SQLite鏁版嵁搴?鈹?  鈹?  鈹斺攢鈹€ case-management.db
鈹?  鈹溾攢鈹€ package.json
鈹?  鈹斺攢鈹€ tsconfig.json
鈹溾攢鈹€ frontend/
鈹?  鈹溾攢鈹€ offline.html
鈹?  鈹溾攢鈹€ vue.global.js
鈹?  鈹溾攢鈹€ element-plus.css
鈹?  鈹斺攢鈹€ element-plus.full.js
鈹斺攢鈹€ docs/
    鈹溾攢鈹€ README.md
    鈹溾攢鈹€ business-logic.md
    鈹溾攢鈹€ api-reference.md
    鈹斺攢鈹€ deployment-guide.md
```

---

## 甯歌闂

### 1. 绔彛琚崰鐢?
淇敼鍚庣绔彛锛?```bash
PORT=3001 npm run start:dev
```

鎴栦慨鏀瑰墠绔湇鍔″櫒绔彛銆?
### 2. CORS 璺ㄥ煙闂

鍚庣宸查厤缃?CORS锛屽闇€淇敼锛?
```typescript
// backend/src/main.ts
app.enableCors({
  origin: ['http://localhost:8090', 'http://your-domain.com'],
  credentials: true,
});
```

### 3. 鏁版嵁搴撴潈闄愰敊璇?
纭繚 `backend/data` 鐩綍鏈夊啓鏉冮檺锛?```bash
mkdir -p backend/data
chmod 755 backend/data
```

---

## 鐢熶骇鐜閮ㄧ讲

### 浣跨敤 PM2 绠＄悊鍚庣鏈嶅姟

```bash
npm install -g pm2

# 鍚姩
cd backend
pm2 start dist/main.js --name case-management-api

# 鏌ョ湅鐘舵€?pm2 status

# 閲嶅惎
pm2 restart case-management-api

# 鍋滄
pm2 stop case-management-api
```

### Docker 閮ㄧ讲

鍒涘缓 `Dockerfile`锛?
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]
```

鏋勫缓骞惰繍琛岋細
```bash
docker build -t case-management-api .
docker run -d -p 3000:3000 -v $(pwd)/data:/app/data case-management-api
```

---

## 鏇存柊閮ㄧ讲

### 鍚庣鏇存柊

```bash
cd backend
git pull
npm install
npm run build
pm2 restart case-management-api
```

### 鍓嶇鏇存柊

鐩存帴鏇挎崲 `frontend` 鐩綍涓嬬殑鏂囦欢鍗冲彲銆?
---

**閮ㄧ讲瀹屾垚锛?*
