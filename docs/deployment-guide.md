# 部署指南

## 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- SQLite3（已包含在依赖中）

---

## 后端部署

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 配置环境变量（可选）

创建 `.env` 文件：

```env
# 数据库
DB_TYPE=sqlite
DB_DATABASE=./data/case-management.db

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# 服务器
PORT=3000
```

### 3. 编译项目

```bash
npm run build
```

### 4. 启动服务

**开发模式**（自动重启）：
```bash
npm run start:dev
```

**生产模式**：
```bash
npm run start:prod
```

服务将运行在 http://localhost:3000

---

## 前端部署

### 方式一：静态文件服务（推荐）

直接使用浏览器打开 `frontend/offline.html`，或使用任意静态服务器：

```bash
cd frontend

# Python 3
python -m http.server 8090

# Node.js
npx serve -p 8090

# PHP
php -S localhost:8090
```

访问 http://localhost:8090/offline.html

### 方式二：Nginx

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

## 数据库初始化

TypeORM 会自动创建表结构，无需手动执行 SQL。

如需查看表结构，可参考：

```sql
-- 案件主表
CREATE TABLE cases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  caseNo VARCHAR(100) NOT NULL,
  caseType VARCHAR(20) NOT NULL,
  customerName VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  -- ... 其他字段
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 分期还款表
CREATE TABLE repayment_installments (
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

## 系统目录结构

```
case-management-system/
├── backend/
│   ├── dist/              # 编译输出
│   ├── src/
│   ├── data/              # SQLite数据库
│   │   └── case-management.db
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── offline.html
│   ├── vue.global.js
│   ├── element-plus.css
│   └── element-plus.full.js
└── docs/
    ├── README.md
    ├── business-logic.md
    ├── api-reference.md
    └── deployment-guide.md
```

---

## 常见问题

### 1. 端口被占用

修改后端端口：
```bash
PORT=3001 npm run start:dev
```

或修改前端服务器端口。

### 2. CORS 跨域问题

后端已配置 CORS，如需修改：

```typescript
// backend/src/main.ts
app.enableCors({
  origin: ['http://localhost:8090', 'http://your-domain.com'],
  credentials: true,
});
```

### 3. 数据库权限错误

确保 `backend/data` 目录有写权限：
```bash
mkdir -p backend/data
chmod 755 backend/data
```

---

## 生产环境部署

### 使用 PM2 管理后端服务

```bash
npm install -g pm2

# 启动
cd backend
pm2 start dist/main.js --name case-management-api

# 查看状态
pm2 status

# 重启
pm2 restart case-management-api

# 停止
pm2 stop case-management-api
```

### Docker 部署

创建 `Dockerfile`：

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]
```

构建并运行：
```bash
docker build -t case-management-api .
docker run -d -p 3000:3000 -v $(pwd)/data:/app/data case-management-api
```

---

## 更新部署

### 后端更新

```bash
cd backend
git pull
npm install
npm run build
pm2 restart case-management-api
```

### 前端更新

直接替换 `frontend` 目录下的文件即可。

---

**部署完成！**
