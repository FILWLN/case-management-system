# 案管系统 v2.0 - 启动检查清单

## 📋 后端启动检查

### 1. 检查文件完整性
```bash
cd case-management-system/backend/src

# 必需文件列表
echo "=== 检查实体文件 ==="
ls cases/case.entity.ts
echo "✓ case.entity.ts"
ls cases/repayment-installment.entity.ts
echo "✓ repayment-installment.entity.ts"
ls cases/repayment-plan.entity.ts
echo "✓ repayment-plan.entity.ts"
ls cases/case-note.entity.ts
echo "✓ case-note.entity.ts"
ls asset-packages/asset-package.entity.ts
echo "✓ asset-package.entity.ts"
ls notifications/notification.entity.ts
echo "✓ notification.entity.ts"

echo "=== 检查服务文件 ==="
ls cases/cases.service.ts
echo "✓ cases.service.ts"
ls asset-packages/asset-packages.service.ts
echo "✓ asset-packages.service.ts"
ls notifications/notifications.service.ts
echo "✓ notifications.service.ts"
ls shared/services/repayment-plan-generator.service.ts
echo "✓ repayment-plan-generator.service.ts"
ls shared/services/ocr.service.ts
echo "✓ ocr.service.ts"

echo "=== 检查模块文件 ==="
ls app.module.ts
echo "✓ app.module.ts"
ls cases/cases.module.ts
echo "✓ cases.module.ts"
ls auth/auth.module.ts
echo "✓ auth.module.ts"
ls asset-packages/asset-packages.module.ts
echo "✓ asset-packages.module.ts"
ls notifications/notifications.module.ts
echo "✓ notifications.module.ts"
ls shared/shared.module.ts
echo "✓ shared.module.ts"
```

### 2. 安装依赖
```bash
cd case-management-system/backend
npm install
```

### 3. 编译检查
```bash
npm run build
```

**预期输出**: 无错误，生成dist目录

### 4. 启动服务
```bash
npm run start:dev
```

**预期输出**:
```
[Nest] 12345  - 2024/03/04 09:00:00     LOG  NestFactory    Starting Nest application...
[Nest] 12345  - 2024/03/04 09:00:00     LOG  InstanceLoader AppModule dependencies initialized
[Nest] 12345  - 2024/03/04 09:00:00     LOG  RoutesResolver CasesController {/api/cases}:
[Nest] 12345  - 2024/03/04 09:00:00     LOG  RoutesResolver AssetPackagesController {/api/asset-packages}:
[Nest] 12345  - 2024/03/04 09:00:00     LOG  RoutesResolver NotificationsController {/api/notifications}:
[Nest] 12345  - 2024/03/04 09:00:00     LOG  NestApplication  Application is running on: http://localhost:3000/api
```

---

## 🔌 API接口测试

### 测试1: 健康检查
```bash
curl http://localhost:3000/api/cases
```
**预期**: 返回401（未授权）

### 测试2: 登录
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```
**预期**: 返回access_token

### 测试3: 获取案件列表
```bash
curl http://localhost:3000/api/cases \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 测试4: 资产包接口
```bash
curl http://localhost:3000/api/asset-packages \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 测试5: 通知接口
```bash
curl http://localhost:3000/api/notifications \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎨 前端启动检查

### 1. 检查文件
```bash
cd case-management-system/frontend
ls offline.html
echo "✓ offline.html"
```

### 2. 启动静态服务器
```bash
# Python 3
python -m http.server 8090

# 或 Node.js
npx serve -p 8090

# 或 PHP
php -S localhost:8090
```

### 3. 访问测试
打开浏览器访问: http://localhost:8090/offline.html

**预期**: 
- 显示登录页面
- 登录后显示案件列表
- 侧边栏有：案件列表、新增案件、数据导入、资产包运营

---

## ✅ 功能验证清单

### v1.0 基础功能
- [ ] 登录/登出
- [ ] 案件列表
- [ ] 新增案件
- [ ] 编辑案件
- [ ] 案件详情（5个Tab）

### v2.0 新增功能
- [ ] 期数配置和自动生成还款计划
- [ ] 站内信通知（铃铛图标）
- [ ] 资产包运营页面
- [ ] 底表上传
- [ ] OCR识别

---

## 🔧 常见问题

### 问题1: 端口被占用
**解决**: 修改后端端口
```bash
PORT=3001 npm run start:dev
```

### 问题2: 数据库权限错误
**解决**: 创建data目录并授权
```bash
mkdir -p case-management-system/backend/data
chmod 755 case-management-system/backend/data
```

### 问题3: 前端无法访问后端API
**解决**: 检查CORS配置，确保后端允许前端域名

---

## 📊 系统状态

| 组件 | 状态 | 说明 |
|------|------|------|
| 后端服务 | ✅ 就绪 | NestJS + TypeORM + SQLite |
| 前端页面 | ✅ 就绪 | Vue 3 + Element Plus |
| 资产包模块 | ✅ 就绪 | 实体/服务/控制器 |
| 通知模块 | ✅ 就绪 | 站内信系统 |
| 还款计划 | ✅ 就绪 | 自动生成算法 |
| OCR服务 | ✅ 就绪 | 待接入真实API |

---

**启动命令汇总**:

```bash
# 终端1: 启动后端
cd case-management-system/backend
npm run start:dev

# 终端2: 启动前端
cd case-management-system/frontend
python -m http.server 8090

# 浏览器访问
open http://localhost:8090/offline.html
```
