# ConvertX 部署指南

## Vercel 部署步骤

1. **准备工作**

首先确保你有：
- Vercel 账号
- GitHub 账号
- 项目的访问权限

2. **环境变量设置**

在 Vercel 项目设置中添加以下环境变量：
- `JWT_SECRET`: 用于 JWT 令牌加密的密钥
- `DATABASE_URL`: 数据库连接 URL
- `ALLOW_UNAUTHENTICATED`: 是否允许未认证访问
- `WEBROOT`: Web 根路径

3. **部署步骤**

a. 连接 GitHub 仓库：
- 登录 Vercel
- 点击 "New Project"
- 选择你的 GitHub 仓库
- 点击 "Import"

b. 配置项目：
- 选择框架预设为 "Other"
- 构建命令将自动使用 `package.json` 中的 `build` 脚本
- 输出目录设置为 `dist`

c. 环境变量：
- 在项目设置中添加所需的环境变量
- 确保敏感信息使用 Vercel Secrets

4. **注意事项**

- 确保所有依赖都正确列在 `package.json` 中
- 检查 `vercel.json` 配置是否正确
- 部署后检查日志确保没有错误

5. **监控与维护**

- 使用 Vercel 提供的分析工具监控应用性能
- 定期检查错误日志
- 及时更新依赖包

## 本地测试部署

在推送到 Vercel 之前，可以在本地测试构建：

```bash
# 安装依赖
bun install

# 构建项目
bun run build

# 测试构建结果
bun run start
```

## 常见问题解决

1. 构建失败：
- 检查依赖是否完整
- 查看构建日志
- 确认环境变量设置

2. 运行时错误：
- 检查环境变量
- 验证数据库连接
- 查看应用日志

3. 性能问题：
- 检查资源使用情况
- 优化数据库查询
- 考虑使用缓存

## 更新部署

当需要更新应用时：
1. 提交代码到 GitHub
2. Vercel 将自动触发新的部署
3. 检查部署日志
4. 验证新版本功能
