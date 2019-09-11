/*
 * zepto 和 jquery 的区别？
 *   zepto专门为移动端开发准备的，所以没有考虑PC端IE的兼容问题，所以zepto要比jquery小的多；而且还有一方面，也导致了zepto比jquery小：zepto只实现了jquery中最常用的方法（例如slideDown/slideUp/slideToggle等快捷动画，在zepto中都没有）；
 *   1.JQ中设置样式和实现动画的时候，不支持CSS3中某些样式属性的设置，例如：transform，但是ZP中支持了这样的处理
 *   2.ZP中单独提供了一些移动端常用的事件方法：tap/singleTap/doubleTap/longTap/swipe/swipeLeft/swipeRight/swipeUp/swipeDown/pinchIn/pinchOut...，而这些JQ中都没有
 * 
 * 移动端能用click事件行为吗？
 *   PC端click是点击事件，移动端的click是单击事件（所以在移动端使用click会存在300ms延迟的问题，在第一次触发后，会等待300ms，看是否有第二次触发，存在则为双击，不存在才是单击） =>移动端的所有操作基本上都是基于touch/gesture事件模型模拟出来的
 * 
 * 移动端常用的事件库
 * - zepto
 * - fastclick：解决移动端click的300ms延迟问题的
 * - hammerjs：国际通用的移动端手势事件库
 * 
 * 移动端键盘事件和PC端的区别
 *   移动端是虚拟键盘，所以对于keydown/keyup/keypress兼容很差，想实现类似的需求，需要用input事件完成（input事件：移动端文本框内容输入事件）
 *   userInp.addEventListener('input',function(ev){  });
 */

$(document.body).tap(function (ev) {
	console.log('ZP:我是点击');
});

document.body.addEventListener('touchstart', function (ev) {
	//=>ev:TouchEvent
	//touches vs changedTouches：存储每根手指的操作信息（它是一个集合，对于TOUCH单手指事件来说，集合中只有一项），changedTouches存储的是手指发生改变操作的信息，但是最开始按下的时候和touches一样的，但是它可以在手机离开的事件中获取到手指离开瞬间的信息，而touches在离开的时候则没有，真实项目中一般用changedTouches
	let point = ev.changedTouches[0];
	this.startX = point.clientX;
	this.startY = point.clientY;
	this.isMove = false;
});

document.body.addEventListener('touchmove', function (ev) {
	let point = ev.changedTouches[0],
		changeX = point.clientX - this.startX,
		changeY = point.clientY - this.startY;
	if (Math.abs(changeX) >= 30 || Math.abs(changeY) >= 30) {
		this.isMove = true;
	}
});

document.body.addEventListener('touchend', function (ev) {
	if (this.isMove) {
		console.log('这是移动操作~');
		return;
	}
	console.log('这是点击操作~');
});