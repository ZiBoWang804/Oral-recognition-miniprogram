# Oral-recognition-miniprogram

兵团口腔医院儿童口腔健康管理平台微信小程序项目。

## 项目说明

这是一个基于微信小程序原生框架与微信云开发实现的儿童口腔健康管理平台，当前主要包含以下能力：

- 监护人注册与儿童建档
- 医生扫码绑定儿童
- 儿童口腔检查信息录入与查看
- 儿童宣教内容浏览
- 云函数与云存储配套能力

## 技术栈

- 微信小程序原生开发
- 微信云开发
- 云函数
- 云数据库
- 云存储

## 目录结构

- `miniprogram/`：小程序前端源码
- `cloudfunctions/`：云函数源码
- `project.config.json`：微信开发者工具项目配置

## 当前状态

仓库已经同步当前本地代码基线，并补充了问卷子系统设计文档，后续将在此基础上继续推进问卷功能实施。

问卷设计文档位置：

- `docs/superpowers/specs/2026-06-09-questionnaire-system-design.md`

## 云开发提示

本项目依赖微信云开发环境。使用前请确认：

- 已在微信开发者工具中导入项目
- 已配置可用的云开发环境
- 已按需上传和部署 `cloudfunctions/` 下相关云函数

参考文档：

- [微信云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
