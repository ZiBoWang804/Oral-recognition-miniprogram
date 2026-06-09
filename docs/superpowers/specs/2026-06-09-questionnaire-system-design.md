# 儿童口腔健康管理平台问卷子系统设计

## 1. 背景与目标

本项目是一个基于微信小程序与微信云开发的儿童口腔健康管理平台，现有核心业务围绕监护人建档儿童、医生扫码绑定、医生录入检查、监护人查看结果与宣教学习展开。

本设计新增一套完整的问卷子系统，满足以下目标：

- 监护人可在某个儿童详情页填写问卷。
- 问卷与具体儿童绑定，而不是仅绑定监护人或检查记录。
- 医生或管理员可在小程序内查看问卷统计与儿童明细结果。
- 医生或管理员可发布新的问卷。
- 医生或管理员可发布填写提醒，并跟踪填写完成情况。
- 问卷结果必须能够与儿童详细信息挂钩，便于后续研究与内在联系分析。
- 系统必须支持研究用明细导出。

## 2. 明确边界

本期已确认的业务边界如下：

- 填写角色：监护人。
- 绑定对象：儿童。
- 入口位置：监护人端儿童详情页。
- 问卷题目来源：云数据库配置，不写死在代码里。
- 作答规则：每个儿童对同一份问卷保留一份答案，但允许后续修改。
- 题型范围：单选、多选、填空。
- 管理后台形态：继续使用现有微信小程序做轻后台，不新建网页后台。
- 统计目标：医生查看自己关联儿童的结果，管理员查看全量结果。
- 提醒目标：支持按问卷、按未填写儿童或按自定义儿童范围发布提醒。

本期不纳入范围：

- 独立 Web 管理后台。
- 复杂可视化 BI 大屏。
- 推送到微信订阅消息之外的外部通知通道。
- 动态权限中心与完整 RBAC 后台。

## 3. 角色与权限

### 3.1 监护人

- 只能查看和填写自己儿童对应的问卷。
- 只能修改自己已提交的儿童问卷。
- 可以看到自己的提醒与填写状态。
- 不能访问问卷发布、统计、导出、全量明细相关功能。

### 3.2 医生

- 只能查看自己关联儿童的问卷结果、统计和提醒完成情况。
- 可进入轻后台查看问卷明细、查看统计、导出自己范围内数据。
- 是否允许医生发布提醒由权限标志控制。
- 默认不允许医生发布或编辑问卷定义。

### 3.3 管理员

- 可查看全量问卷、全量作答、全量统计和全量导出。
- 可创建、编辑、发布、结束问卷。
- 可发布提醒并查看提醒投递与完成情况。

## 4. 前端页面设计

### 4.1 监护人端

#### `pages/DetailNoGuardian/index`

新增问卷卡片区域，展示：

- 当前生效问卷标题。
- 填写状态：未填写、已填写、已过期。
- 最近填写时间。
- 未读提醒数量。

操作按钮：

- `填写问卷`
- `修改问卷`
- `查看已填写问卷`

#### `pages/QuestionnaireFill/index`

新增问卷填写页，负责：

- 根据 `childId` 获取当前生效问卷。
- 回显该儿童已存在答案。
- 动态渲染单选、多选、填空题。
- 校验必填项。
- 提交或更新答案。

页面分区：

- 问卷标题与说明。
- 儿童信息摘要。
- 题目列表。
- 提交区。

### 4.2 医生端

#### `pages/UserCenter/index`

新增轻后台入口：

- `问卷管理`
- `问卷统计`
- `填写提醒`

统一进入 `pages/QuestionnaireAdmin/index`。

#### `pages/Detail/index`

新增操作按钮：

- `查看该儿童问卷`

跳转至 `pages/QuestionnaireResponseDetail/index`。

### 4.3 管理员端

管理员复用医生端轻后台页面，但拥有更完整功能：

- 新建问卷。
- 编辑草稿问卷。
- 发布问卷。
- 结束问卷。
- 发布提醒。
- 查看全量统计。
- 导出全量研究数据。

### 4.4 轻后台页面清单

新增页面：

- `pages/QuestionnaireAdmin/index`
- `pages/QuestionnairePublish/index`
- `pages/QuestionnaireStats/index`
- `pages/QuestionnaireResponseList/index`
- `pages/QuestionnaireResponseDetail/index`
- `pages/ReminderManage/index`

## 5. 数据模型设计

本期必须使用 6 张核心表。

### 5.1 `Questionnaire`

用途：问卷头信息与版本信息。

建议字段：

- `_id`
- `title`
- `description`
- `status`
- `version`
- `targetRole`
- `bindType`
- `allowEditAfterSubmit`
- `publishStartAt`
- `publishEndAt`
- `createdBy`
- `createdAt`
- `updatedAt`

### 5.2 `QuestionnaireQuestion`

用途：标准题库明细，一题一条记录。

建议字段：

- `_id`
- `questionnaireId`
- `questionnaireVersion`
- `questionKey`
- `type`
- `title`
- `required`
- `sort`
- `status`
- `options`
- `createdAt`
- `updatedAt`

`type` 取值：

- `single`
- `multiple`
- `text`

### 5.3 `QuestionnaireResponse`

用途：某个儿童对某份问卷的一次主提交记录。

唯一键逻辑：

- `childId + questionnaireId`

建议字段：

- `_id`
- `questionnaireId`
- `questionnaireVersion`
- `childId`
- `guardianId`
- `submittedByUserId`
- `submitStatus`
- `submittedAt`
- `updatedAt`
- `childSnapshot`
- `guardianSnapshot`
- `doctorSnapshot`

其中快照用于研究分析，避免后续儿童基础资料被修改后影响历史分析结果。

### 5.4 `QuestionnaireAnswer`

用途：单题答案明细，一题一条记录。

建议字段：

- `_id`
- `responseId`
- `questionnaireId`
- `questionnaireVersion`
- `questionId`
- `questionKey`
- `questionType`
- `answerValue`
- `answerText`
- `sort`
- `createdAt`
- `updatedAt`

说明：

- 单选题使用 `answerValue` 存单个值。
- 多选题使用 `answerValue` 存数组。
- 填空题使用 `answerText` 存文本。

### 5.5 `QuestionnaireReminder`

用途：提醒任务主表。

建议字段：

- `_id`
- `questionnaireId`
- `title`
- `content`
- `targetType`
- `targetChildIds`
- `status`
- `publishAt`
- `createdBy`
- `createdAt`
- `updatedAt`

`targetType` 支持：

- `all_children_of_questionnaire`
- `unsubmitted_only`
- `custom_child_ids`

### 5.6 `QuestionnaireReminderReceipt`

用途：提醒投递、阅读、填写完成跟踪表。

建议字段：

- `_id`
- `reminderId`
- `questionnaireId`
- `childId`
- `guardianId`
- `delivered`
- `read`
- `readAt`
- `filled`
- `filledAt`
- `createdAt`
- `updatedAt`

## 6. 数据关联原则

问卷系统与现有业务模型的关联如下：

- 一个 `Child` 可对应多份不同问卷的 `QuestionnaireResponse`。
- 一个 `Questionnaire` 可被多个儿童填写。
- 一个 `Guardian` 可为自己多个儿童分别填写答案。
- 医生通过自己关联的儿童范围查看问卷结果。

研究分析必须同时依赖两类信息：

- 关联字段：`childId`、`guardianId`、`questionnaireId`
- 历史快照：`childSnapshot`、`guardianSnapshot`、`doctorSnapshot`

系统不得只保留关联字段而不保留快照。

## 7. 云函数设计

本期按完整子系统实现，不分先后批次，全部纳入本期范围。

### 7.1 问卷定义管理

- `getActiveQuestionnaireForChild`
- `listQuestionnaires`
- `getQuestionnaireDetail`
- `saveQuestionnaireDraft`
- `publishQuestionnaire`

### 7.2 问卷填写与查看

- `getQuestionnaireResponseForChild`
- `submitQuestionnaireResponse`
- `getQuestionnaireResponseDetail`

### 7.3 提醒发布与追踪

- `createQuestionnaireReminder`
- `listReminders`
- `getReminderReceipts`
- `markReminderRead`

### 7.4 统计分析

- `getQuestionnaireStatsSummary`
- `getQuestionnaireQuestionStats`
- `listQuestionnaireResponses`

### 7.5 导出研究数据

- `exportQuestionnaireResearchDataset`

## 8. 云函数职责摘要

### `getActiveQuestionnaireForChild`

输入：

- `childId`

输出：

- 当前生效问卷。
- 当前儿童是否已提交。
- 未读提醒数。

### `saveQuestionnaireDraft`

用于管理员创建或编辑问卷草稿，并同步写入：

- `Questionnaire`
- `QuestionnaireQuestion`

### `publishQuestionnaire`

用于发布问卷。

发布规则：

- 已发布问卷不允许原地随意改题。
- 修改应创建新版本问卷。

### `submitQuestionnaireResponse`

用于监护人提交或修改某儿童问卷。

必须完成：

- 角色校验。
- 儿童归属校验。
- 问卷状态校验。
- 题目与答案格式校验。
- `QuestionnaireResponse` 创建或更新。
- `QuestionnaireAnswer` 同步更新。
- 研究快照写入。
- 已填写提醒状态回写。

### `createQuestionnaireReminder`

用于医生或管理员发布提醒，并生成：

- `QuestionnaireReminder`
- `QuestionnaireReminderReceipt`

### `getQuestionnaireStatsSummary`

返回：

- 覆盖儿童数。
- 已填写人数。
- 未填写人数。
- 填写率。

### `getQuestionnaireQuestionStats`

返回：

- 单选题选项人数与比例。
- 多选题选项人数与比例。
- 填空题明细。

### `exportQuestionnaireResearchDataset`

生成并导出研究用明细数据文件。

建议输出：

- CSV 或 Excel 文件。
- 上传云存储后返回下载地址或 `fileID`。

## 9. 后台交互设计

### 9.1 `QuestionnaireAdmin`

后台首页展示：

- 问卷卡片列表。
- 当前生效问卷数。
- 已填写人数。
- 未填写人数。
- 填写率。
- 快速入口：新建问卷、发布提醒、查看未填写名单、导出研究数据。

### 9.2 `QuestionnaireStats`

统计页展示：

- 问卷概览。
- 按题统计。
- 筛选器。

筛选维度至少支持：

- 年龄范围。
- 性别。
- 独生情况。
- 婚生情况。
- 监护关系。
- 监护人学历。
- 家庭收入区间。
- 关联医生。
- 填写状态。

### 9.3 `QuestionnaireResponseList`

明细列表一行对应一个儿童作答记录，展示：

- 儿童编号。
- 儿童姓名。
- 年龄。
- 性别。
- 独生情况。
- 监护关系。
- 监护人学历。
- 家庭收入。
- 关联医生。
- 填写状态。
- 提交时间。

### 9.4 `QuestionnaireResponseDetail`

单个答卷详情页展示：

- 儿童信息。
- 监护人信息。
- 检查信息。
- 全部问卷答案。

### 9.5 `QuestionnairePublish`

支持：

- 新建草稿。
- 编辑草稿。
- 发布问卷。
- 结束问卷。
- 复制为新版本。
- 预览问卷。

### 9.6 `ReminderManage`

支持：

- 查看提醒列表。
- 发布提醒。
- 查看提醒完成情况。
- 查看未填写儿童名单。

## 10. 导出设计

导出功能必须支持研究使用。

导出入口可放在：

- `QuestionnaireAdmin`
- `QuestionnaireStats`
- `QuestionnaireResponseList`

导出筛选项建议支持：

- 问卷。
- 版本。
- 填写状态。
- 年龄范围。
- 性别。
- 关联医生。
- 时间范围。
- 是否包含儿童快照。
- 是否包含监护人快照。
- 是否包含检查结果。

导出优先级：

- 优先支持明细导出。
- 次级支持题目统计导出。

## 11. 提醒设计

提醒在监护人端至少通过两层方式可见：

- 儿童详情页中的问卷卡片状态提示。
- 问卷填写页顶部的提醒内容展示。

本期可不单独建设完整消息中心，但必须保证提醒可见、可读、可追踪填写完成。

## 12. 权限与安全要求

权限校验不能只依赖前端。

所有云函数都必须在服务端校验：

- 当前登录用户角色。
- 当前儿童是否归属该监护人。
- 当前儿童是否在该医生可查看范围内。
- 当前管理员是否具备发布或导出权限。

系统必须防止：

- 监护人访问非本人儿童问卷。
- 医生查看非自己关联儿童数据。
- 普通用户调用管理接口。

## 13. 兼容现有代码的落地原则

问卷功能应遵循当前项目已有技术路径：

- 前端继续使用小程序原生页面、`wx.cloud.callFunction`、本地缓存与页面跳转模式。
- 云函数继续采用微信云开发与 `@cloudbase/node-sdk`。
- 尽量减少对现有 tabBar 结构的破坏。
- 入口优先挂在现有儿童详情页和用户中心。

## 14. 产品与数据治理原则

为避免后期研究数据混乱，本项目锁定以下规则：

- 已发布问卷不允许直接原地改题。
- 修改题目应通过复制新版本实现。
- 问卷、儿童资料、检查信息必须能在后台页面中互相跳转。
- 统计与研究导出必须支持按儿童信息筛选。
- 问卷结果必须与儿童详细信息形成稳定关联。

## 15. 风险与注意事项

### 15.1 现有角色体系风险

当前项目角色主要通过本地缓存 `Type` 区分，后端权限边界仍较薄。问卷子系统落地时必须补齐服务端校验，否则会存在越权风险。

### 15.2 现有数据模型一致性风险

现有项目部分云函数命名、字段命名和关系写法不完全统一。问卷子系统实施前应先统一实际使用的儿童、监护人、医生主键关系，避免在新功能中继续放大历史不一致问题。

### 15.3 导出性能风险

如果单次导出范围过大，云函数可能面临超时或内存压力。建议导出功能支持分页聚合或后台生成文件后返回下载链接。

### 15.4 已发布问卷治理风险

若没有版本冻结机制，研究数据会因题目变化失去可比性，因此版本管理必须在首版就落实。

## 16. 验收标准

问卷子系统完成后，应至少满足以下验收标准：

- 监护人可以从儿童详情页进入并完成问卷填写。
- 同一儿童对同一问卷可重复修改，最终只保留一份主作答记录。
- 医生可查看自己关联儿童的问卷明细与统计。
- 管理员可创建、发布、结束新问卷。
- 医生或管理员可发布提醒，并看到未填写名单。
- 统计结果可按儿童详细信息筛选。
- 可导出研究用明细数据，且包含儿童相关信息与问卷答案。
- 服务端权限校验有效，用户不能越权访问他人问卷数据。
