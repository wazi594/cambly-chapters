# Cambly Chronicles 全站音乐与主页交互调整设计

日期：2026-08-25

## 目标

在不改变现有回忆录视觉方向的前提下，增加跨页面连续播放的背景音乐，更新首页核心文案，移除 01—04 屏多余统计数字，并重做故事入口、月份时间线和真实句子弹幕。

## 范围

本轮包含六项修改：

1. 使用合法公版的肖邦《Nocturne Op. 9 No. 2》录音作为全站背景音乐。
2. 更新首页主标题、副标题及对应页面元数据。
3. 删除首页 01—04 屏的 `09`、`6`、`03`、`∞` 统计区域，保留首屏 `86 CONVERSATIONS / 26 Teachers`。
4. 将 01 屏入口改为「进入回忆」，加入九位老师姓名卡片叠放组件。
5. 延后并拉长 02 屏月份时间线动画，加长并加粗递进横线。
6. 将 03 屏替换为五轨真实句子弹幕。

## 全站背景音乐

### 音频来源

从 Wikimedia Commons 下载 Musopen 提供、页面标记为公版的 Chopin《Nocturne Op. 9 No. 2》录音，保存到项目的 `public/media` 目录。不得使用截图中的 Arthur Rubinstein 录音。

### 播放架构

播放器组件挂载在 TanStack Router 的根组件内、`Outlet` 外层。站内路由切换时根组件不会卸载，因此同一个音频元素持续播放，播放位置不重置。

播放器初始为静音状态。用户第一次点击固定音乐按钮时调用 `play()` 并解除静音；后续点击仅切换静音/有声，不重新创建音频元素。按钮位于左下角，避免与右侧章节导航冲突。

播放器把当前播放位置写入 `sessionStorage`，刷新后恢复时间位置。由于浏览器自动播放规则，刷新后恢复为静音，用户需要再次点击才能恢复声音。按钮使用 `aria-pressed`、清晰的动态标签和键盘焦点样式。

## 首页文案与统计

- 主标题：`连进世界的半年`
- 副标题：`我在 Cambly 学英语的回忆录`
- 浏览器标题、描述及社交分享文案同步使用新标题。
- 首屏继续显示 `86 CONVERSATIONS / 26 Teachers`。
- 01—04 屏不渲染统计块，也不保留统计块原有的分隔线和垂直间距。

## 01 屏故事入口

入口文案改为「进入回忆」。入口旁加入九张姓名卡：

- Peter
- Susan Munro
- Connie N
- Ellie / BJ
- Ian Smith
- Olivia
- Kenneth D
- Sally HS
- Tutor Mark

桌面端默认以轻微旋转和位移叠放；悬停或键盘聚焦时展开成可读的扇形层次。移动端点击组件时在收拢与展开间切换。每张卡可进入 `/stories` 并定位到对应老师的标题锚点。整体入口仍保持足够留白，不加入照片或额外说明文字。

`MemoirArticle` 为标题生成稳定的锚点 ID，保证老师卡片的深链接可用，同时不改变其他文章的阅读结构。

## 02 屏月份时间线

现有动画从组件顶部到达视口 80% 时开始，调整为约 58% 时开始，使触发明显延后；结束位置从组件底部到达 45% 调整为约 5%，扩大滚动持续区间。

月份标签的 stagger 从 `0.18` 增加到约 `0.38`。递进线从当前文本列宽度延伸至桌面端约 140%，并将厚度从 1px 增加到 3px；移动端保持 100% 宽度以避免横向溢出。减少动态模式下直接显示完整终态。

## 03 屏五轨真实弹幕

保留无缝循环、交替方向和不同速度，但改为五条轨道并严格使用以下内容：

### 轨道一

`I am loved because I love.` · `Live well, see the world clearly.` · `We are same human being.` · `We are connected.` · `It's a new script.` · `A new stage for me.`

### 轨道二

`I was a lawyer.` · `But I am going to Australia.` · `From barrister to barista.` · `I worked five years as a lawyer.` · `I suspended my job.` · `I changed everything.`

### 轨道三

`No one is coming.` · `You must keep going.` · `I'm not a very confident person.` · `Have faith in yourself.` · `Face yourself.` · `Both are right.`

### 轨道四

`You are the boss of your life.` · `Spread your wings and fly.` · `That's a gift.` · `In your heart, you're saying Melbourne.` · `You have that option.` · `I admire you, Lou.`

### 轨道五

`Don't give up easily.` · `Give it a really good go.` · `Yes, I will. I promise you.` · `Forget everything. Forget my career.` · `I love technology more than humans.` · `my name is Lawrence Lawrence` · `I chat with the barista while waiting.`

每轨内容复制一次用于无缝循环。轨道交替运动方向，并按文本总长度设置不同的较慢持续时间，避免短轨明显重复。减少动态模式下停止动画并保持全部句子可读。

## 验证

自动化测试覆盖：

- 新标题和副标题出现，旧标题不再出现。
- 首屏指标保留，01—04 统计值和统计块消失。
- 根层背景音乐、按钮、音频来源及无障碍状态存在。
- 九位老师卡片和对应故事锚点存在。
- 五条弹幕轨道包含用户提供的全部句子。
- 现有四个内容入口和子页面继续工作。

浏览器验证覆盖：

- 点击音乐按钮后音频开始且解除静音。
- 从首页进入任一子页面时播放位置继续前进而不归零。
- 01 卡片可用鼠标、键盘和移动端操作。
- 02 时间线触发更晚、持续更长且无横向溢出。
- 03 五轨弹幕无明显跳帧或空白断层。
- 桌面和移动端布局均保持可读。
