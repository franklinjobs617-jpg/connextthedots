# Printable 页面多语言添加 SOP

## 📋 概述

本文档说明如何为 `/printable-connect-the-dots/` 页面添加新语言支持。

## 🎯 需要修改的文件

1. `lib/printables-data-{locale}.ts` - 数据文件（新建）
2. `app/[locale]/printable-connect-the-dots/page.tsx` - 服务端页面
3. `app/[locale]/printable-connect-the-dots/PrintableClient.tsx` - 客户端组件

---

## 📝 详细步骤

### 步骤 1: 创建数据文件

**文件**: `lib/printables-data-{locale}.ts`

**操作**: 复制 `printables-data-es.ts` 并翻译

**需要翻译的内容**:
- 难度映射（Easy -> Fácil/Fácil/Médio 等）
- SEO 文本模板（defaultAltText, defaultSolutionAltText, defaultDescription）
- 所有项目的 title 和 description
- 类别名称（category）
- 年龄推荐（ageRecommendation）

**SEO 优化要点**:
```typescript
// 使用目标语言的核心关键词
const defaultAltText = `[核心关键词] + 描述`;
const defaultDescription = `自然融入 2-3 个关键词变体`;
```

---

### 步骤 2: 更新 page.tsx

**文件**: `app/[locale]/printable-connect-the-dots/page.tsx`

#### 2.1 导入新数据文件
```typescript
import { printablesData as dataXX, getAllPrintables as getAllXX } from "@/lib/printables-data-xx";
```

#### 2.2 更新 generateStaticParams
```typescript
export async function generateStaticParams() {
    return [
        { locale: "en" },
        { locale: "es" },
        { locale: "de" },
        { locale: "xx" }  // 添加新语言
    ];
}
```

#### 2.3 更新 generateMetadata
```typescript
const isXx = locale === "xx";

if (isXx) {
    title = "[新语言的 SEO 标题]";
    description = "[新语言的 SEO 描述]";
}
```

**SEO 标题要求**:
- 长度: 50-60 字符
- 包含 1-2 个主关键词
- 格式: `主关键词 | 功能描述`

**SEO 描述要求**:
- 长度: 150-160 字符
- 包含 3-5 个相关关键词
- 自然流畅，避免堆砌

#### 2.4 更新 Page 组件
```typescript
const isXx = locale === "xx";

if (isXx) {
    data = dataXX;
    allItems = getAllXX();
}
```

---

### 步骤 3: 更新 PrintableClient.tsx

**文件**: `app/[locale]/printable-connect-the-dots/PrintableClient.tsx`

#### 3.1 添加语言检测
```typescript
const isXx = locale === "xx";
```

#### 3.2 更新所有文本（共 10+ 处）

**需要更新的位置**:
1. JSON-LD (name, url)
2. 面包屑导航（Home, All Printables）
3. 页面标题和描述
4. 更新日期
5. 侧边栏标题（Filters, Difficulty Level）
6. 筛选器标签（All Levels, Easy, Medium, Hard, Extreme）
7. 内容区域标题
8. 结果计数文本
9. 底部 CTA（标题、描述、按钮）
10. 反馈模态框标题

**模式**:
```typescript
{isXx ? "新语言文本" : (isEs ? "西班牙语" : "英语")}
```

---

## ✅ 测试清单

- [ ] 访问 `/xx/printable-connect-the-dots/` 页面正常显示
- [ ] 所有文本已翻译为目标语言
- [ ] 筛选器功能正常工作
- [ ] SEO metadata 正确（查看页面源代码）
- [ ] JSON-LD 结构化数据正确
- [ ] 图片和链接正常加载
- [ ] 响应式布局正常

---

## 🎯 SEO 关键词使用原则

1. **关键词密度**: 2-3%（自然分布）
2. **避免堆砌**: 每个关键词的出现都应该有意义
3. **使用变体**: 使用同义词和相关词，而不是重复同一个词
4. **自然流畅**: 优先考虑用户体验，而不是 SEO

---

## 📌 注意事项

1. **保持一致性**: 确保所有文本使用相同的术语翻译
2. **测试完整性**: 测试所有筛选器和交互功能
3. **SEO 验证**: 使用 Google Search Console 验证 metadata
4. **性能检查**: 确保新数据文件不影响页面加载速度

---

## 🔄 完成后

1. 提交代码并创建 PR
2. 在测试环境验证
3. 使用 SEO 工具检查优化效果
4. 监控新语言页面的搜索表现
