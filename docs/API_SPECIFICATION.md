# ShineStar API 规范文档

## 1. 概述

### 1.1 API 基础信息
- **基础URL**: `https://your-project.supabase.co`
- **认证方式**: Bearer Token (JWT)
- **数据格式**: JSON
- **字符编码**: UTF-8

### 1.2 认证流程
```javascript
// 获取访问令牌
const { data, error } = await supabase.auth.getSession();
const accessToken = data.session?.access_token;

// 在请求头中使用
const headers = {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
};
```

## 2. 用户认证 API

### 2.1 Google OAuth 登录
```javascript
// 请求
POST /auth/v1/token
Content-Type: application/json

{
  "grant_type": "id_token",
  "provider": "google",
  "id_token": "google_id_token"
}

// 响应
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "refresh_token_here",
  "expires_in": 3600,
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "google_id": "google_user_id",
    "display_name": "User Name",
    "avatar_url": "https://..."
  }
}
```

### 2.2 获取用户信息
```javascript
// 请求
GET /auth/v1/user
Authorization: Bearer {access_token}

// 响应
{
  "id": "uuid",
  "email": "user@example.com",
  "google_id": "google_user_id",
  "display_name": "User Name",
  "avatar_url": "https://...",
  "subscription_status": "free",
  "subscription_end": "2024-12-31T23:59:59Z",
  "language_preference": "en",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### 2.3 更新用户信息
```javascript
// 请求
PUT /rest/v1/users?id=eq.{user_id}
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "display_name": "New Name",
  "language_preference": "es",
  "subscription_status": "active"
}

// 响应
{
  "id": "uuid",
  "display_name": "New Name",
  "language_preference": "es",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

## 3. 想法记录 API

### 3.1 创建想法记录
```javascript
// 请求
POST /rest/v1/ideas
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "我的想法标题",
  "content": "想法内容",
  "content_type": "text", // text, voice, image
  "media_url": "https://storage.supabase.co/...",
  "file_size": 1024000,
  "duration": 120, // 音频时长（秒）
  "ocr_text": "从图片识别的文字",
  "transcript": "语音转文字结果",
  "tags": ["business", "technology"],
  "date": "2024-12-01"
}

// 响应
{
  "id": "uuid",
  "user_id": "user_uuid",
  "title": "我的想法标题",
  "content": "想法内容",
  "content_type": "text",
  "media_url": "https://storage.supabase.co/...",
  "file_size": 1024000,
  "duration": 120,
  "ocr_text": "从图片识别的文字",
  "transcript": "语音转文字结果",
  "tags": ["business", "technology"],
  "date": "2024-12-01",
  "created_at": "2024-12-01T10:00:00Z",
  "updated_at": "2024-12-01T10:00:00Z"
}
```

### 3.2 获取想法列表
```javascript
// 请求
GET /rest/v1/ideas?user_id=eq.{user_id}&date=eq.{date}&order=created_at.desc
Authorization: Bearer {access_token}

// 响应
[
  {
    "id": "uuid",
    "user_id": "user_uuid",
    "title": "想法标题",
    "content": "想法内容",
    "content_type": "text",
    "media_url": "https://storage.supabase.co/...",
    "file_size": 1024000,
    "duration": 120,
    "ocr_text": "从图片识别的文字",
    "transcript": "语音转文字结果",
    "tags": ["business", "technology"],
    "date": "2024-12-01",
    "created_at": "2024-12-01T10:00:00Z",
    "updated_at": "2024-12-01T10:00:00Z"
  }
]
```

### 3.3 更新想法记录
```javascript
// 请求
PUT /rest/v1/ideas?id=eq.{idea_id}
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "更新的标题",
  "content": "更新的内容",
  "tags": ["updated", "tags"]
}

// 响应
{
  "id": "uuid",
  "title": "更新的标题",
  "content": "更新的内容",
  "tags": ["updated", "tags"],
  "updated_at": "2024-12-01T11:00:00Z"
}
```

### 3.4 删除想法记录
```javascript
// 请求
DELETE /rest/v1/ideas?id=eq.{idea_id}
Authorization: Bearer {access_token}

// 响应
{
  "success": true,
  "message": "想法记录已删除"
}
```

## 4. 文件上传 API

### 4.1 上传文件
```javascript
// 请求
POST /storage/v1/object/upload
Authorization: Bearer {access_token}
Content-Type: multipart/form-data

FormData:
- file: (binary file)
- bucket: "ideas"
- path: "user_id/filename.ext"

// 响应
{
  "id": "file_id",
  "name": "filename.ext",
  "bucket_id": "bucket_id",
  "owner": "user_id",
  "created_at": "2024-12-01T10:00:00Z",
  "updated_at": "2024-12-01T10:00:00Z",
  "last_accessed_at": "2024-12-01T10:00:00Z",
  "metadata": {
    "size": 1024000,
    "mimetype": "image/jpeg"
  }
}
```

### 4.2 获取文件URL
```javascript
// 请求
GET /storage/v1/object/sign/ideas/user_id/filename.ext
Authorization: Bearer {access_token}

// 响应
{
  "signedURL": "https://storage.supabase.co/...",
  "expiresIn": 3600
}
```

## 5. AI分析 API

### 5.1 批量分析
```javascript
// 请求
POST /functions/v1/analyze-ideas
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "user_id": "user_uuid",
  "time_range": {
    "start": "2024-12-01",
    "end": "2024-12-07"
  },
  "analysis_type": "comprehensive" // comprehensive, feasibility, suggestion
}

// 响应
{
  "analysis_id": "uuid",
  "status": "processing", // processing, completed, failed
  "progress": 50,
  "estimated_completion": "2024-12-01T10:30:00Z"
}
```

### 5.2 获取分析结果
```javascript
// 请求
GET /rest/v1/ai_analyses?idea_id=eq.{idea_id}&analysis_type=eq.comprehensive
Authorization: Bearer {access_token}

// 响应
{
  "id": "uuid",
  "idea_id": "idea_uuid",
  "analysis_type": "comprehensive",
  "content": {
    "summary": "本周您记录了15个想法，主要集中在产品创新和技能提升两个领域...",
    "key_insights": [
      "您的想法主要集中在技术实现方面",
      "有3个想法具有较高的商业价值",
      "建议优先考虑市场验证"
    ],
    "recommendations": [
      "建议对高价值想法进行深入调研",
      "可以考虑寻找合作伙伴",
      "建议制定详细的执行时间表"
    ],
    "feasibility_score": 75,
    "priority_ranking": [
      {
        "idea_id": "uuid",
        "title": "想法标题",
        "priority_score": 85,
        "reason": "具有高商业价值和可行性"
      }
    ]
  },
  "confidence": 0.85,
  "status": "completed",
  "created_at": "2024-12-01T10:00:00Z"
}
```

### 5.3 生成执行计划
```javascript
// 请求
POST /functions/v1/generate-action-plan
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "analysis_id": "analysis_uuid",
  "user_feedback": {
    "selected_ideas": ["idea_uuid_1", "idea_uuid_2"],
    "preferences": {
      "timeline": "8_weeks",
      "budget": "medium",
      "team_size": "small"
    }
  }
}

// 响应
{
  "plan_id": "uuid",
  "action_plan": {
    "timeline": {
      "week_1": ["市场调研", "用户访谈"],
      "week_2_3": ["原型设计", "技术验证"],
      "week_4_6": ["MVP开发", "测试反馈"],
      "week_7_8": ["产品发布", "市场推广"]
    },
    "resources": {
      "time": "每周20小时",
      "budget": "$5000",
      "team": "2-3人团队"
    },
    "milestones": [
      {
        "week": 1,
        "task": "完成市场调研报告",
        "deliverables": ["调研报告", "用户画像"]
      },
      {
        "week": 3,
        "task": "完成原型设计",
        "deliverables": ["产品原型", "技术方案"]
      }
    ],
    "risks": [
      {
        "risk": "技术实现难度",
        "probability": "medium",
        "impact": "high",
        "mitigation": "提前技术验证，准备备选方案"
      }
    ]
  },
  "created_at": "2024-12-01T10:00:00Z"
}
```

## 6. 订阅管理 API

### 6.1 检查订阅状态
```javascript
// 请求
GET /rest/v1/users?id=eq.{user_id}&select=subscription_status,subscription_end,trial_start
Authorization: Bearer {access_token}

// 响应
{
  "subscription_status": "active", // free, trial, active, expired
  "subscription_end": "2024-12-31T23:59:59Z",
  "trial_start": "2024-12-01T00:00:00Z"
}
```

### 6.2 处理Google Pay支付
```javascript
// 请求
POST /functions/v1/process-google-pay
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "payment_data": {
    "paymentMethodData": {
      "tokenizationData": {
        "token": "google_pay_token"
      }
    }
  },
  "amount": 5.00,
  "currency": "USD"
}

// 响应
{
  "success": true,
  "payment_id": "uuid",
  "subscription": {
    "status": "active",
    "start_date": "2024-12-01T00:00:00Z",
    "end_date": "2024-12-08T00:00:00Z"
  }
}
```

### 6.3 取消订阅
```javascript
// 请求
POST /functions/v1/cancel-subscription
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "reason": "用户主动取消"
}

// 响应
{
  "success": true,
  "message": "订阅已取消，将在当前周期结束后生效",
  "effective_date": "2024-12-08T00:00:00Z"
}
```

## 7. 错误处理

### 7.1 错误响应格式
```javascript
{
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "details": {
      "field": "具体字段",
      "value": "错误值"
    }
  }
}
```

### 7.2 常见错误码
| 错误码 | HTTP状态码 | 描述 |
|--------|------------|------|
| `AUTH_REQUIRED` | 401 | 需要认证 |
| `INVALID_TOKEN` | 401 | 无效的访问令牌 |
| `PERMISSION_DENIED` | 403 | 权限不足 |
| `RESOURCE_NOT_FOUND` | 404 | 资源不存在 |
| `VALIDATION_ERROR` | 422 | 数据验证失败 |
| `RATE_LIMIT_EXCEEDED` | 429 | 请求频率超限 |
| `INTERNAL_ERROR` | 500 | 服务器内部错误 |

### 7.3 错误处理示例
```javascript
// 客户端错误处理
try {
  const { data, error } = await supabase
    .from('ideas')
    .insert(newIdea);
  
  if (error) {
    switch (error.code) {
      case 'AUTH_REQUIRED':
        // 重新登录
        await handleReauth();
        break;
      case 'VALIDATION_ERROR':
        // 显示验证错误
        showValidationError(error.details);
        break;
      default:
        // 显示通用错误
        showError(error.message);
    }
  }
} catch (err) {
  // 网络错误处理
  handleNetworkError(err);
}
```

## 8. 实时功能

### 8.1 实时订阅
```javascript
// 订阅想法记录变化
const subscription = supabase
  .channel('ideas')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'ideas',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    console.log('想法记录变化:', payload);
    // 更新UI
    updateIdeasList(payload);
  })
  .subscribe();
```

### 8.2 分析进度更新
```javascript
// 订阅分析进度
const analysisSubscription = supabase
  .channel('analysis_progress')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'ai_analyses',
    filter: `id=eq.${analysisId}`
  }, (payload) => {
    console.log('分析进度更新:', payload);
    // 更新进度条
    updateProgressBar(payload.new.progress);
  })
  .subscribe();
```

## 9. 性能优化

### 9.1 分页查询
```javascript
// 分页获取想法列表
const { data, error } = await supabase
  .from('ideas')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
  .range(0, 19); // 每页20条
```

### 9.2 批量操作
```javascript
// 批量删除想法
const { data, error } = await supabase
  .from('ideas')
  .delete()
  .in('id', ['uuid1', 'uuid2', 'uuid3']);
```

### 9.3 缓存策略
```javascript
// 缓存配置
const cacheConfig = {
  ideas: {
    ttl: 300000, // 5分钟
    maxSize: 100
  },
  analysis: {
    ttl: 600000, // 10分钟
    maxSize: 50
  }
};
```

---

**文档版本**：v1.0  
**最后更新**：2024年12月  
**维护者**：开发团队 