# 添加新翻译关键词 SOP (标准操作流程)

## 📋 目标
确保新增的翻译关键词在所有支持的语言中保持一致性和完整性。

---

## ✅ 前置检查清单

在开始之前,请确认:
- [ ] 已阅读《多语言实现文档.md》
- [ ] 了解项目当前支持的语言: `en`, `de`, `es`
- [ ] 确定新关键词所属的模块(如 `header`, `footer`, `pricing` 等)
- [ ] 准备好所有语言的翻译内容

---

## 🔄 标准操作流程

### 步骤 1: 确定关键词位置

**1.1 识别所属模块**

根据功能确定关键词应该放在哪个模块:
- 导航相关 → `header`
- 页脚相关 → `footer`
- 价格相关 → `pricing`
- 首页英雄区 → `hero`
- 常见问题 → `faq`
- 其他...

**1.2 检查是否需要创建新模块**

如果现有模块都不合适,可以创建新模块。

---

### 步骤 2: 编辑英语翻译文件 (基准文件)

**文件路径**: `messages/en.json`

**操作**:
1. 打开 `messages/en.json`
2. 找到对应的模块
3. 添加新的键值对

**示例**:
```json
{
  "header": {
    "logo": "ConnectTheDots",
    "home": "Home",
    "newKey": "New Translation Text"  ← 添加这里
  }
}
```

**注意事项**:
- ✅ 使用驼峰命名法 (camelCase): `newFeature`, `loginButton`
- ✅ 键名要有描述性: `submitButton` 而不是 `btn1`
- ✅ 确保 JSON 格式正确,最后一项不要有逗号
- ✅ 如果包含 HTML,确保标签闭合: `<strong>text</strong>`

---

### 步骤 3: 同步到德语翻译文件

**文件路径**: `messages/de.json`

**操作**:
1. 打开 `messages/de.json`
2. 找到**完全相同的位置**
3. 添加**相同的键名**,但使用德语翻译

**示例**:
```json
{
  "header": {
    "logo": "ConnectTheDots",
    "home": "Startseite",
    "newKey": "Neuer Übersetzungstext"  ← 德语翻译
  }
}
```

**翻译建议**:
- 使用专业翻译工具 (DeepL, Google Translate)
- 保持与英语版本相同的语气和风格
- 如果有 HTML 标签,保持标签不变,只翻译文本内容

---

### 步骤 4: 同步到西班牙语翻译文件

**文件路径**: `messages/es.json`

**操作**:
1. 打开 `messages/es.json`
2. 找到**完全相同的位置**
3. 添加**相同的键名**,但使用西班牙语翻译

**示例**:
```json
{
  "header": {
    "logo": "ConnectTheDots",
    "home": "Inicio",
    "newKey": "Nuevo texto de traducción"  ← 西班牙语翻译
  }
}
```

---

### 步骤 5: 验证 JSON 格式

**使用在线工具验证**:
- [JSONLint](https://jsonlint.com/)
- VS Code 内置 JSON 验证

**常见错误**:
- ❌ 最后一项有逗号: `"key": "value",}`
- ❌ 缺少引号: `{key: "value"}`
- ❌ 使用单引号: `{'key': 'value'}`
- ❌ 键名重复

**正确格式**:
```json
{
  "module": {
    "key1": "value1",
    "key2": "value2",
    "key3": "value3"
  }
}
```

---

### 步骤 6: 在代码中使用新关键词

**在 React 组件中使用**:

```typescript
"use client";

import { useTranslations } from "next-intl";

export default function MyComponent() {
    const t = useTranslations("header"); // 加载模块

    return (
        <div>
            <p>{t("newKey")}</p>  {/* 使用新关键词 */}
        </div>
    );
}
```

**TypeScript 类型提示**:
- next-intl 会自动提供类型提示
- 如果键名不存在,开发时会有警告

---

### 步骤 7: 测试所有语言

**测试清单**:
- [ ] 访问 `/en/页面路径` - 检查英语显示
- [ ] 访问 `/de/页面路径` - 检查德语显示
- [ ] 访问 `/es/页面路径` - 检查西班牙语显示
- [ ] 检查控制台是否有缺失翻译的警告
- [ ] 验证文本显示是否正确,无乱码

**调试技巧**:
```bash
# 启动开发服务器
npm run dev

# 打开浏览器控制台查看警告
```

---

## 📝 完整示例

### 场景: 添加"联系我们"按钮翻译

**步骤 1**: 确定位置 → `header` 模块

**步骤 2**: 编辑 `messages/en.json`
```json
{
  "header": {
    "logo": "ConnectTheDots",
    "home": "Home",
    "contactUs": "Contact Us"  ← 新增
  }
}
```

**步骤 3**: 编辑 `messages/de.json`
```json
{
  "header": {
    "logo": "ConnectTheDots",
    "home": "Startseite",
    "contactUs": "Kontaktiere uns"  ← 新增
  }
}
```

**步骤 4**: 编辑 `messages/es.json`
```json
{
  "header": {
    "logo": "ConnectTheDots",
    "home": "Inicio",
    "contactUs": "Contáctanos"  ← 新增
  }
}
```

**步骤 5**: 在组件中使用
```typescript
const t = useTranslations("header");

<button>{t("contactUs")}</button>
```

---

## 🚨 常见错误及解决方案

### 错误 1: 键名不一致
**问题**: 英语用 `contactUs`,德语用 `contact_us`
**解决**: 所有语言必须使用完全相同的键名

### 错误 2: 模块名称错误
**问题**: `useTranslations("Header")` (大写)
**解决**: 使用小写 `useTranslations("header")`

### 错误 3: JSON 格式错误
**问题**: 多余的逗号或缺少引号
**解决**: 使用 JSONLint 验证

### 错误 4: 翻译缺失
**问题**: 只添加了英语,忘记添加其他语言
**解决**: 按照 SOP 完成所有语言

### 错误 5: HTML 标签错误
**问题**: `<strong>文本<strong>` (未闭合)
**解决**: 确保标签正确闭合 `<strong>文本</strong>`

---

## 📊 质量检查清单

在提交代码前,请确认:

- [ ] 所有 3 个语言文件都已更新 (en, de, es)
- [ ] 键名在所有文件中完全一致
- [ ] JSON 格式验证通过
- [ ] 翻译内容准确且符合语境
- [ ] 已在浏览器中测试所有语言
- [ ] 控制台无错误或警告
- [ ] HTML 标签(如有)正确闭合
- [ ] 代码中正确使用了新关键词

---

## 🔧 工具推荐

### 翻译工具
- **DeepL**: https://www.deepl.com/ (推荐,质量高)
- **Google Translate**: https://translate.google.com/

### JSON 验证工具
- **JSONLint**: https://jsonlint.com/
- **VS Code**: 内置 JSON 验证

### 对比工具
- **VS Code Diff**: 对比不同语言文件的结构
- **JSON Diff**: https://www.jsondiff.com/

---

## 📞 需要帮助?

如果遇到问题:
1. 检查《多语言实现文档.md》
2. 查看现有翻译文件的示例
3. 使用 JSON 验证工具检查格式
4. 在开发环境中测试

---

## 🎯 最佳实践

1. **批量添加**: 如果有多个关键词,一次性完成所有语言
2. **保持同步**: 确保所有语言文件的结构完全一致
3. **语义化命名**: 使用有意义的键名,方便维护
4. **模块化组织**: 相关的翻译放在同一模块
5. **定期审查**: 定期检查是否有未使用的翻译键

---

**版本**: 1.0
**最后更新**: 2026-03-16
**维护者**: 开发团队
