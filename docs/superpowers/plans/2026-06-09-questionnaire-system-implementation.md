# Questionnaire System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved child-bound questionnaire subsystem in staged deliveries, with guardian filling, doctor/admin management, reminders, statistics, and research export, while keeping code review strict and each phase independently reviewable.

**Architecture:** Implement the questionnaire backend as a single multi-action cloudfunction `questionnaireService` with internal handlers grouped by concern, following the repo’s existing `quickstartFunctions` routing pattern to avoid duplicating permission, query, and serialization logic across many tiny cloudfunctions. Frontend additions stay inside the existing mini-program, using a small `miniprogram/services/questionnaire.js` wrapper plus dedicated pages for guardian fill flow and doctor/admin lightweight management pages.

**Tech Stack:** WeChat mini-program native pages, WeChat cloudfunctions, `@cloudbase/node-sdk`, built-in Node `node:test` for pure helper tests, PowerShell 7, Overstory builder/scout lanes, Codex final review.

---

## File Map

### New backend files

- Create: `cloudfunctions/questionnaireService/config.json`
- Create: `cloudfunctions/questionnaireService/package.json`
- Create: `cloudfunctions/questionnaireService/index.js`
- Create: `cloudfunctions/questionnaireService/lib/context.js`
- Create: `cloudfunctions/questionnaireService/lib/guards.js`
- Create: `cloudfunctions/questionnaireService/lib/models.js`
- Create: `cloudfunctions/questionnaireService/lib/serializers.js`
- Create: `cloudfunctions/questionnaireService/lib/csv.js`
- Create: `cloudfunctions/questionnaireService/handlers/definition.js`
- Create: `cloudfunctions/questionnaireService/handlers/response.js`
- Create: `cloudfunctions/questionnaireService/handlers/reminder.js`
- Create: `cloudfunctions/questionnaireService/handlers/stats.js`
- Create: `cloudfunctions/questionnaireService/handlers/export.js`

### New frontend files

- Create: `miniprogram/services/questionnaire.js`
- Create: `miniprogram/pages/QuestionnaireFill/index.js`
- Create: `miniprogram/pages/QuestionnaireFill/index.json`
- Create: `miniprogram/pages/QuestionnaireFill/index.wxml`
- Create: `miniprogram/pages/QuestionnaireFill/index.wxss`
- Create: `miniprogram/pages/QuestionnaireAdmin/index.js`
- Create: `miniprogram/pages/QuestionnaireAdmin/index.json`
- Create: `miniprogram/pages/QuestionnaireAdmin/index.wxml`
- Create: `miniprogram/pages/QuestionnaireAdmin/index.wxss`
- Create: `miniprogram/pages/QuestionnairePublish/index.js`
- Create: `miniprogram/pages/QuestionnairePublish/index.json`
- Create: `miniprogram/pages/QuestionnairePublish/index.wxml`
- Create: `miniprogram/pages/QuestionnairePublish/index.wxss`
- Create: `miniprogram/pages/QuestionnaireStats/index.js`
- Create: `miniprogram/pages/QuestionnaireStats/index.json`
- Create: `miniprogram/pages/QuestionnaireStats/index.wxml`
- Create: `miniprogram/pages/QuestionnaireStats/index.wxss`
- Create: `miniprogram/pages/QuestionnaireResponseList/index.js`
- Create: `miniprogram/pages/QuestionnaireResponseList/index.json`
- Create: `miniprogram/pages/QuestionnaireResponseList/index.wxml`
- Create: `miniprogram/pages/QuestionnaireResponseList/index.wxss`
- Create: `miniprogram/pages/QuestionnaireResponseDetail/index.js`
- Create: `miniprogram/pages/QuestionnaireResponseDetail/index.json`
- Create: `miniprogram/pages/QuestionnaireResponseDetail/index.wxml`
- Create: `miniprogram/pages/QuestionnaireResponseDetail/index.wxss`
- Create: `miniprogram/pages/ReminderManage/index.js`
- Create: `miniprogram/pages/ReminderManage/index.json`
- Create: `miniprogram/pages/ReminderManage/index.wxml`
- Create: `miniprogram/pages/ReminderManage/index.wxss`

### New tests

- Create: `tests/questionnaire/router.test.js`
- Create: `tests/questionnaire/response-shaping.test.js`
- Create: `tests/questionnaire/reminder-targeting.test.js`
- Create: `tests/questionnaire/stats-aggregation.test.js`
- Create: `tests/questionnaire/export-flattening.test.js`

### Existing files to modify

- Modify: `package.json`
- Modify: `miniprogram/app.json`
- Modify: `miniprogram/pages/DetailNoGuardian/index.js`
- Modify: `miniprogram/pages/DetailNoGuardian/index.wxml`
- Modify: `miniprogram/pages/DetailNoGuardian/index.wxss`
- Modify: `miniprogram/pages/Detail/index.js`
- Modify: `miniprogram/pages/Detail/index.wxml`
- Modify: `miniprogram/pages/UserCenter/index.js`
- Modify: `miniprogram/pages/UserCenter/index.wxml`

## Phase Boundaries And Review Gates

- Phase 1 delivers backend scaffolding, action routing, service wrapper, and automated helper tests only.
- Phase 2 delivers the guardian questionnaire entry and fill/update flow only.
- Phase 3 delivers admin/doctor publish, reminder, and response list/detail pages only.
- Phase 4 delivers stats, research export, and hardening only.
- Each phase must be implemented in a separate worker dispatch or separate Codex execution block.
- No phase may be merged until Codex reviews the candidate diff, validates scope, and records verification results.

## Task 1: Foundation, Routing, And Verification Harness

**Files:**
- Create: `cloudfunctions/questionnaireService/**`
- Create: `miniprogram/services/questionnaire.js`
- Create: `tests/questionnaire/router.test.js`
- Modify: `package.json`

- [ ] **Step 1: Write the failing router and wrapper tests**

```js
// tests/questionnaire/router.test.js
const test = require('node:test');
const assert = require('node:assert/strict');

const { routeAction, normalizeActionError } = require('../../cloudfunctions/questionnaireService/index');

test('routeAction resolves a known questionnaire action', async () => {
  const result = await routeAction(
    { action: 'definition.listQuestionnaires' },
    { definition: { listQuestionnaires: async () => ({ ok: true }) } }
  );

  assert.deepEqual(result, { ok: true });
});

test('routeAction rejects unknown actions with a stable error payload', async () => {
  await assert.rejects(
    () => routeAction({ action: 'missing.action' }, {}),
    /Unsupported questionnaire action/
  );
});

test('normalizeActionError exposes a stable code and message', () => {
  const error = normalizeActionError(new Error('boom'));
  assert.equal(error.code, 'QUESTIONNAIRE_SERVICE_ERROR');
  assert.match(error.message, /boom/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
node --test tests/questionnaire/router.test.js
```

Expected: FAIL because `cloudfunctions/questionnaireService/index.js` does not exist yet.

- [ ] **Step 3: Add the questionnaire service router and frontend wrapper**

```js
// cloudfunctions/questionnaireService/index.js
const definition = require('./handlers/definition');
const response = require('./handlers/response');
const reminder = require('./handlers/reminder');
const stats = require('./handlers/stats');
const exportHandlers = require('./handlers/export');

const actionMap = {
  definition,
  response,
  reminder,
  stats,
  export: exportHandlers,
};

function normalizeActionError(error) {
  return {
    code: error.code || 'QUESTIONNAIRE_SERVICE_ERROR',
    message: error.message || 'Questionnaire service failed',
  };
}

async function routeAction(event, handlers = actionMap) {
  const [group, action] = String(event.action || '').split('.');
  const scoped = handlers[group];

  if (!scoped || typeof scoped[action] !== 'function') {
    throw new Error(`Unsupported questionnaire action: ${event.action}`);
  }

  return scoped[action](event);
}

exports.routeAction = routeAction;
exports.normalizeActionError = normalizeActionError;
exports.main = async (event) => {
  try {
    return await routeAction(event);
  } catch (error) {
    return normalizeActionError(error);
  }
};
```

```js
// miniprogram/services/questionnaire.js
function callQuestionnaire(action, data = {}) {
  return wx.cloud.callFunction({
    name: 'questionnaireService',
    data: { action, ...data },
  });
}

module.exports = {
  callQuestionnaire,
};
```

```json
// package.json
{
  "name": "child-query-function",
  "version": "1.0.0",
  "description": "微信云函数-查询Child表",
  "main": "index.js",
  "scripts": {
    "test:questionnaire": "node --test tests/questionnaire/*.test.js"
  },
  "dependencies": {
    "wx-server-sdk": "~2.7.0"
  }
}
```

- [ ] **Step 4: Add empty handler modules with stable exports**

```js
// cloudfunctions/questionnaireService/handlers/definition.js
exports.listQuestionnaires = async () => ({ items: [] });
exports.getQuestionnaireDetail = async () => ({ questionnaire: null, questions: [] });
exports.saveQuestionnaireDraft = async () => ({ ok: true });
exports.publishQuestionnaire = async () => ({ ok: true });
exports.getActiveQuestionnaireForChild = async () => ({ questionnaire: null, responseStatus: null, unreadReminderCount: 0 });
```

```js
// cloudfunctions/questionnaireService/handlers/response.js
exports.getQuestionnaireResponseForChild = async () => ({ questionnaire: null, questions: [], response: null, answers: [] });
exports.submitQuestionnaireResponse = async () => ({ ok: true });
exports.getQuestionnaireResponseDetail = async () => ({ response: null, answers: [] });
```

```js
// cloudfunctions/questionnaireService/handlers/reminder.js
exports.createQuestionnaireReminder = async () => ({ ok: true });
exports.listReminders = async () => ({ items: [] });
exports.getReminderReceipts = async () => ({ items: [] });
exports.markReminderRead = async () => ({ ok: true });
```

```js
// cloudfunctions/questionnaireService/handlers/stats.js
exports.getQuestionnaireStatsSummary = async () => ({ totalChildren: 0, submittedChildren: 0, unsubmittedChildren: 0, submitRate: 0 });
exports.getQuestionnaireQuestionStats = async () => ({ items: [] });
exports.listQuestionnaireResponses = async () => ({ items: [], total: 0 });
```

```js
// cloudfunctions/questionnaireService/handlers/export.js
exports.exportQuestionnaireResearchDataset = async () => ({ fileId: '', downloadUrl: '' });
```

- [ ] **Step 5: Run tests and syntax checks**

Run:

```powershell
node --test tests/questionnaire/router.test.js
git -C D:\wzb\BTEY\BTEY diff --check
node --check D:\wzb\BTEY\BTEY\cloudfunctions\questionnaireService\index.js
node --check D:\wzb\BTEY\BTEY\miniprogram\services\questionnaire.js
```

Expected:

- router test PASS
- diff check clean
- syntax checks succeed

- [ ] **Step 6: Commit**

```powershell
git add package.json tests/questionnaire/router.test.js cloudfunctions/questionnaireService miniprogram/services/questionnaire.js
git commit -m "Establish questionnaire service routing and verification harness"
```

## Task 2: Guardian Fill Flow On Child Detail

**Files:**
- Modify: `miniprogram/app.json`
- Modify: `miniprogram/pages/DetailNoGuardian/index.js`
- Modify: `miniprogram/pages/DetailNoGuardian/index.wxml`
- Modify: `miniprogram/pages/DetailNoGuardian/index.wxss`
- Create: `miniprogram/pages/QuestionnaireFill/**`
- Create: `tests/questionnaire/response-shaping.test.js`
- Modify: `cloudfunctions/questionnaireService/handlers/definition.js`
- Modify: `cloudfunctions/questionnaireService/handlers/response.js`
- Modify: `cloudfunctions/questionnaireService/lib/{context.js,guards.js,models.js,serializers.js}`

- [ ] **Step 1: Write the failing response-shaping test**

```js
// tests/questionnaire/response-shaping.test.js
const test = require('node:test');
const assert = require('node:assert/strict');

const { buildGuardianFillPayload } = require('../../cloudfunctions/questionnaireService/lib/serializers');

test('buildGuardianFillPayload hydrates questions and answer map for edit flow', () => {
  const payload = buildGuardianFillPayload({
    questionnaire: { _id: 'q1', title: '问卷' },
    questions: [{ _id: 'qq1', questionKey: 'q1', type: 'single', title: '是否刷牙' }],
    response: { _id: 'r1' },
    answers: [{ questionKey: 'q1', answerValue: 'yes' }],
  });

  assert.equal(payload.questionnaire._id, 'q1');
  assert.equal(payload.answerMap.q1, 'yes');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
node --test tests/questionnaire/response-shaping.test.js
```

Expected: FAIL because `buildGuardianFillPayload` does not exist yet.

- [ ] **Step 3: Implement guardian-facing backend actions**

```js
// cloudfunctions/questionnaireService/lib/serializers.js
function buildGuardianFillPayload({ questionnaire, questions, response, answers, unreadReminderCount = 0 }) {
  const answerMap = {};

  for (const item of answers || []) {
    answerMap[item.questionKey] = item.answerValue ?? item.answerText ?? '';
  }

  return {
    questionnaire,
    questions,
    response,
    answerMap,
    unreadReminderCount,
  };
}

module.exports = {
  buildGuardianFillPayload,
};
```

```js
// cloudfunctions/questionnaireService/handlers/definition.js
exports.getActiveQuestionnaireForChild = async (event) => {
  // enforce guardian scope and return questionnaire summary for child detail
};
```

```js
// cloudfunctions/questionnaireService/handlers/response.js
exports.getQuestionnaireResponseForChild = async (event) => {
  // load questionnaire, questions, existing response, answers, and unread reminders
};

exports.submitQuestionnaireResponse = async (event) => {
  // create or update QuestionnaireResponse + QuestionnaireAnswer + reminder receipt
};
```

- [ ] **Step 4: Add guardian UI entry and fill page**

```js
// miniprogram/pages/DetailNoGuardian/index.js
const { callQuestionnaire } = require('../../services/questionnaire');

Page({
  async loadQuestionnaireStatus() {
    const res = await callQuestionnaire('definition.getActiveQuestionnaireForChild', {
      childId: this.data._id,
    });

    this.setData({
      questionnaireSummary: res.result.questionnaire,
      questionnaireResponseStatus: res.result.responseStatus,
      questionnaireUnreadReminderCount: res.result.unreadReminderCount,
    });
  },

  openQuestionnaireFill() {
    wx.navigateTo({
      url: `/pages/QuestionnaireFill/index?childId=${this.data._id}`,
    });
  },
});
```

```xml
<!-- miniprogram/pages/DetailNoGuardian/index.wxml -->
<view class="card questionnaire-card" wx:if="{{questionnaireSummary}}">
  <view class="card-title">问卷调查</view>
  <view class="info-row">
    <view class="info-label">当前问卷</view>
    <view class="info-value">{{questionnaireSummary.title}}</view>
  </view>
  <view class="info-row">
    <view class="info-label">填写状态</view>
    <view class="info-value">{{questionnaireResponseStatus.exists ? '已填写' : '未填写'}}</view>
  </view>
  <button class="show-code-btn" bindtap="openQuestionnaireFill">
    {{questionnaireResponseStatus.exists ? '修改问卷' : '填写问卷'}}
  </button>
</view>
```

```js
// miniprogram/pages/QuestionnaireFill/index.js
const { callQuestionnaire } = require('../../services/questionnaire');

Page({
  data: {
    childId: '',
    questionnaire: null,
    questions: [],
    answerMap: {},
    submitting: false,
  },

  async onLoad(options) {
    this.setData({ childId: options.childId });
    await this.loadForm();
  },

  async loadForm() {
    const res = await callQuestionnaire('response.getQuestionnaireResponseForChild', {
      childId: this.data.childId,
    });

    this.setData({
      questionnaire: res.result.questionnaire,
      questions: res.result.questions,
      answerMap: res.result.answerMap || {},
    });
  },
});
```

- [ ] **Step 5: Run tests and smoke validation**

Run:

```powershell
node --test tests/questionnaire/response-shaping.test.js
git -C D:\wzb\BTEY\BTEY diff --check
node --check D:\wzb\BTEY\BTEY\miniprogram\pages\QuestionnaireFill\index.js
node --check D:\wzb\BTEY\BTEY\miniprogram\pages\DetailNoGuardian\index.js
```

Manual smoke:

- Open a child detail page as guardian
- Confirm questionnaire card renders
- Enter fill page
- Save once
- Re-enter and confirm answers rehydrate

- [ ] **Step 6: Commit**

```powershell
git add miniprogram/app.json miniprogram/pages/DetailNoGuardian miniprogram/pages/QuestionnaireFill miniprogram/services/questionnaire.js tests/questionnaire/response-shaping.test.js cloudfunctions/questionnaireService
git commit -m "Add guardian questionnaire fill and edit flow"
```

## Task 3: Doctor/Admin Management, Publish, And Reminder Flow

**Files:**
- Modify: `miniprogram/pages/UserCenter/index.js`
- Modify: `miniprogram/pages/UserCenter/index.wxml`
- Modify: `miniprogram/pages/Detail/index.js`
- Modify: `miniprogram/pages/Detail/index.wxml`
- Create: `miniprogram/pages/QuestionnaireAdmin/**`
- Create: `miniprogram/pages/QuestionnairePublish/**`
- Create: `miniprogram/pages/QuestionnaireResponseList/**`
- Create: `miniprogram/pages/QuestionnaireResponseDetail/**`
- Create: `miniprogram/pages/ReminderManage/**`
- Create: `tests/questionnaire/reminder-targeting.test.js`
- Modify: `cloudfunctions/questionnaireService/handlers/{definition.js,response.js,reminder.js}`

- [ ] **Step 1: Write the failing reminder targeting test**

```js
// tests/questionnaire/reminder-targeting.test.js
const test = require('node:test');
const assert = require('node:assert/strict');

const { expandReminderTargets } = require('../../cloudfunctions/questionnaireService/handlers/reminder');

test('expandReminderTargets uses unsubmitted children when targetType is unsubmitted_only', async () => {
  const ids = await expandReminderTargets({
    targetType: 'unsubmitted_only',
    allChildIds: ['c1', 'c2', 'c3'],
    submittedChildIds: ['c2'],
  });

  assert.deepEqual(ids, ['c1', 'c3']);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```powershell
node --test tests/questionnaire/reminder-targeting.test.js
```

Expected: FAIL because `expandReminderTargets` does not exist yet.

- [ ] **Step 3: Implement admin/doctor backend handlers**

```js
// cloudfunctions/questionnaireService/handlers/definition.js
exports.listQuestionnaires = async (event) => {
  // doctor scope: linked children only
  // admin scope: all questionnaires
};

exports.saveQuestionnaireDraft = async (event) => {
  // write Questionnaire + QuestionnaireQuestion rows
};

exports.publishQuestionnaire = async (event) => {
  // freeze current draft as published version
};
```

```js
// cloudfunctions/questionnaireService/handlers/reminder.js
async function expandReminderTargets({ targetType, targetChildIds = [], allChildIds = [], submittedChildIds = [] }) {
  if (targetType === 'custom_child_ids') return targetChildIds;
  if (targetType === 'all_children_of_questionnaire') return allChildIds;
  return allChildIds.filter((id) => !submittedChildIds.includes(id));
}

exports.expandReminderTargets = expandReminderTargets;
exports.createQuestionnaireReminder = async (event) => {
  // create reminder and receipts in scoped child range
};
```

- [ ] **Step 4: Build the lightweight management pages**

```js
// miniprogram/pages/UserCenter/index.js
gotoQuestionnaireAdmin() {
  wx.navigateTo({ url: '/pages/QuestionnaireAdmin/index' });
}
```

```xml
<!-- miniprogram/pages/UserCenter/index.wxml -->
<view class="setting_item" bindtap="gotoQuestionnaireAdmin">
  <view class="left">
    <view class="setting_text">问卷管理</view>
  </view>
</view>
```

```js
// miniprogram/pages/QuestionnaireAdmin/index.js
const { callQuestionnaire } = require('../../services/questionnaire');

Page({
  data: {
    questionnaires: [],
  },

  async onShow() {
    const res = await callQuestionnaire('definition.listQuestionnaires');
    this.setData({ questionnaires: res.result.items || [] });
  },
});
```

```js
// miniprogram/pages/ReminderManage/index.js
const { callQuestionnaire } = require('../../services/questionnaire');

Page({
  async publishReminder(payload) {
    await callQuestionnaire('reminder.createQuestionnaireReminder', payload);
  },
});
```

- [ ] **Step 5: Run tests and smoke validation**

Run:

```powershell
node --test tests/questionnaire/reminder-targeting.test.js
git -C D:\wzb\BTEY\BTEY diff --check
node --check D:\wzb\BTEY\BTEY\miniprogram\pages\QuestionnaireAdmin\index.js
node --check D:\wzb\BTEY\BTEY\miniprogram\pages\ReminderManage\index.js
```

Manual smoke:

- Confirm questionnaire admin entry appears only for doctor/admin role
- Open questionnaire list
- Save a draft questionnaire
- Publish a reminder against one questionnaire

- [ ] **Step 6: Commit**

```powershell
git add miniprogram/pages/UserCenter miniprogram/pages/Detail miniprogram/pages/QuestionnaireAdmin miniprogram/pages/QuestionnairePublish miniprogram/pages/QuestionnaireResponseList miniprogram/pages/QuestionnaireResponseDetail miniprogram/pages/ReminderManage tests/questionnaire/reminder-targeting.test.js cloudfunctions/questionnaireService
git commit -m "Add questionnaire management and reminder workflows"
```

## Task 4: Statistics, Research Export, And Review Hardening

**Files:**
- Create: `miniprogram/pages/QuestionnaireStats/**`
- Create: `tests/questionnaire/stats-aggregation.test.js`
- Create: `tests/questionnaire/export-flattening.test.js`
- Modify: `cloudfunctions/questionnaireService/handlers/{stats.js,export.js,response.js}`
- Modify: `cloudfunctions/questionnaireService/lib/{csv.js,serializers.js,models.js}`

- [ ] **Step 1: Write the failing stats and export tests**

```js
// tests/questionnaire/stats-aggregation.test.js
const test = require('node:test');
const assert = require('node:assert/strict');

const { summarizeQuestionStats } = require('../../cloudfunctions/questionnaireService/handlers/stats');

test('summarizeQuestionStats counts single choice answers by option value', () => {
  const summary = summarizeQuestionStats([
    { questionKey: 'q1', questionType: 'single', answerValue: 'yes' },
    { questionKey: 'q1', questionType: 'single', answerValue: 'no' },
    { questionKey: 'q1', questionType: 'single', answerValue: 'yes' },
  ]);

  assert.equal(summary.q1.options.yes.count, 2);
  assert.equal(summary.q1.options.no.count, 1);
});
```

```js
// tests/questionnaire/export-flattening.test.js
const test = require('node:test');
const assert = require('node:assert/strict');

const { buildResearchRows } = require('../../cloudfunctions/questionnaireService/lib/csv');

test('buildResearchRows flattens snapshots and answers into one export row per child', () => {
  const rows = buildResearchRows([
    {
      childSnapshot: { child_name: '张三', child_age: 7 },
      guardianSnapshot: { study: '本科' },
      answers: [{ questionKey: 'q1', answerValue: 'yes' }],
    },
  ]);

  assert.equal(rows[0].child_name, '张三');
  assert.equal(rows[0].guardian_study, '本科');
  assert.equal(rows[0].q1, 'yes');
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```powershell
node --test tests/questionnaire/stats-aggregation.test.js tests/questionnaire/export-flattening.test.js
```

Expected: FAIL because `summarizeQuestionStats` and `buildResearchRows` do not exist yet.

- [ ] **Step 3: Implement stats and export helpers**

```js
// cloudfunctions/questionnaireService/handlers/stats.js
function summarizeQuestionStats(answerRows) {
  const summary = {};
  // aggregate single, multiple, and text answers into questionnaire-level stats
  return summary;
}

exports.summarizeQuestionStats = summarizeQuestionStats;
exports.getQuestionnaireStatsSummary = async (event) => {
  // return totalChildren, submittedChildren, unsubmittedChildren, submitRate
};
exports.getQuestionnaireQuestionStats = async (event) => {
  // return per-question stats under current scope filters
};
exports.listQuestionnaireResponses = async (event) => {
  // return child-linked response rows with filters
};
```

```js
// cloudfunctions/questionnaireService/lib/csv.js
function buildResearchRows(records) {
  return records.map((record) => {
    const row = {
      child_name: record.childSnapshot?.child_name || '',
      child_age: record.childSnapshot?.child_age || '',
      guardian_study: record.guardianSnapshot?.study || '',
    };

    for (const answer of record.answers || []) {
      row[answer.questionKey] = Array.isArray(answer.answerValue)
        ? answer.answerValue.join('|')
        : answer.answerValue ?? answer.answerText ?? '';
    }

    return row;
  });
}

module.exports = {
  buildResearchRows,
};
```

- [ ] **Step 4: Build the statistics page and export action**

```js
// miniprogram/pages/QuestionnaireStats/index.js
const { callQuestionnaire } = require('../../services/questionnaire');

Page({
  data: {
    summary: null,
    questionStats: [],
    filters: {},
  },

  async onLoad(options) {
    const questionnaireId = options.questionnaireId;
    const [summaryRes, statsRes] = await Promise.all([
      callQuestionnaire('stats.getQuestionnaireStatsSummary', { questionnaireId }),
      callQuestionnaire('stats.getQuestionnaireQuestionStats', { questionnaireId }),
    ]);

    this.setData({
      summary: summaryRes.result,
      questionStats: statsRes.result.items || [],
    });
  },
});
```

```js
// cloudfunctions/questionnaireService/handlers/export.js
exports.exportQuestionnaireResearchDataset = async (event) => {
  // collect scoped response rows, flatten to CSV, upload, and return fileId/downloadUrl
};
```

- [ ] **Step 5: Run tests, scout review, and final hardening**

Run:

```powershell
node --test tests/questionnaire/*.test.js
git -C D:\wzb\BTEY\BTEY diff --check
node --check D:\wzb\BTEY\BTEY\cloudfunctions\questionnaireService\handlers\stats.js
node --check D:\wzb\BTEY\BTEY\cloudfunctions\questionnaireService\handlers\export.js
```

Then dispatch scout review:

```powershell
sd create --title "Questionnaire phase 4 review" --type task --priority P2 --description "Read-only review of stats/export patch for scope, regressions, and style"
```

Expected scout checks:

- verify filters map to approved spec
- verify export includes snapshots and answers
- verify no unreviewed widening outside questionnaire files

- [ ] **Step 6: Commit**

```powershell
git add miniprogram/pages/QuestionnaireStats tests/questionnaire/stats-aggregation.test.js tests/questionnaire/export-flattening.test.js cloudfunctions/questionnaireService
git commit -m "Add questionnaire statistics and research export"
```

## Task 5: Orchestrated Execution And Review Protocol

**Files:**
- Modify: `.omx/codex-claude-orchestrator-project-config.md`
- Modify: `docs/superpowers/plans/2026-06-09-questionnaire-system-implementation.md`

- [ ] **Step 1: Create a tracker task for each implementation phase**

```powershell
sd create --title "Questionnaire phase 1 foundations" --type task --priority P2 --description "Implement questionnaire service routing and test harness"
sd create --title "Questionnaire phase 2 guardian flow" --type task --priority P2 --description "Implement guardian questionnaire entry and fill flow"
sd create --title "Questionnaire phase 3 admin and reminder flow" --type task --priority P2 --description "Implement questionnaire admin, publish, and reminder pages"
sd create --title "Questionnaire phase 4 stats and export" --type task --priority P2 --description "Implement questionnaire stats and research export"
```

- [ ] **Step 2: Write a bounded Overstory spec before each Claude worker run**

```powershell
ov spec write <task-id> --body "Goal: implement only Task N from docs/superpowers/plans/2026-06-09-questionnaire-system-implementation.md. Scope: <explicit file list>. Constraints: no unrelated refactors, no lockfile churn, no push. Deliverable: candidate commit plus self-check report." --agent codex
```

- [ ] **Step 3: Run Claude builder only on the active phase**

```powershell
ov sling <task-id> --headless --runtime claude --capability builder --name questionnaire-phase-<n> --files <comma-separated-scope>
```

- [ ] **Step 4: Review the candidate branch before any integration**

```powershell
ov status --json
ov mail list --json
git -C .overstory\worktrees\questionnaire-phase-<n> diff --stat
git -C .overstory\worktrees\questionnaire-phase-<n> log --oneline -n 5
ov merge --branch overstory/questionnaire-phase-<n>/<task-id> --dry-run --json
```

- [ ] **Step 5: Integrate or reject with Codex ownership**

Expected review decision rules:

- reject if scope widened beyond the phase files
- reject if verification claims are missing
- reject if UI changes were not syntax-checked and smoke-tested
- integrate only after Codex re-reads the diff and verification notes

- [ ] **Step 6: Push only after each phase lands cleanly on `main`**

```powershell
git push origin main
```

## Self-Review

- Spec coverage: the plan covers backend structure, guardian fill flow, doctor/admin management, reminders, statistics, export, and staged review gates from the approved questionnaire design.
- Placeholder scan: no `TBD`, `TODO`, or unbounded “handle later” steps remain in the plan.
- Type consistency: backend logical actions are grouped under `questionnaireService` with stable action names (`definition.*`, `response.*`, `reminder.*`, `stats.*`, `export.*`) and the same naming is used across frontend wrappers, tests, and phase tasks.
