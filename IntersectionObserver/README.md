# IntersectionObserver

# 简介

Intersection Observer API 提供了一种异步检测目标元素与祖先元素或 viewport 相交情况变化的方法。它可以帮助我们检查一个元素是否可见，或者两个元素是否相交，在过去，我们想要达到这种目的，往往是需要通过监听scroll事件，通过调用[Element.getBoundingClientRect()](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect)来实现，一般情况下，我们会在如下场景使用到这种功能：

+ 图片懒加载——当图片滚动到可见时才进行加载
+ 内容无限滚动——也就是用户滚动到接近内容底部时直接加载更多，而无需用户操作翻页，给用户一种网页可以无限滚动的错觉
+ 检测广告的曝光情况——为了计算广告收益，需要知道广告元素的曝光情况
+ 在用户看见某个区域时执行任务或播放动画

# 简单使用

# 参考文档

[Intersection Observer API](https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API)
