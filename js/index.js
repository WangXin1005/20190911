/* 在移动端处理滑屏事件的时候，我们要把文档滑动的默认行为禁止掉 */
$(document).on('touchstart touchmove touchend', function (ev) {
	ev.preventDefault();
});

/* ==魔方模块== */
let cubeModule = (function () {
	let $cubeBox = $('.cubeBox'),
		$cube = $cubeBox.children('.cube');

	//=>记录手指的起始坐标和盒子的起始旋转角度
	function down(ev) {
		let point = ev.changedTouches[0];
		this.startX = point.clientX;
		this.startY = point.clientY;
		if (!this.rotateX) {
			//=>第一次按下设置初始值，以后再按下，按照上次旋转后的角度发生移动即可
			this.rotateX = -30;
			this.rotateY = 45;
		}
		this.isMove = false;
	}

	//=>记录手指在X/Y轴偏移的值，计算出是否发生移动
	function move(ev) {
		let point = ev.changedTouches[0];
		this.changeX = point.clientX - this.startX;
		this.changeY = point.clientY - this.startY;
		if (Math.abs(this.changeX) > 10 || Math.abs(this.changeY) > 10) {
			this.isMove = true;
		}
	}

	//=>如果发生过移动，我们让盒子在原始的旋转角度上继续旋转
	//changeX控制的是Y轴旋转的角度，changeY控制的是X轴旋转角度，并且changeY的值和沿着X轴旋转角度的值正好相反（例如：向上移动，changeY为负，按照X轴向上旋转确是正的角度）
	function up(ev) {
		let point = ev.changedTouches[0],
			$this = $(this);
		if (!this.isMove) return;
		this.rotateY = this.rotateY + this.changeX / 3;
		this.rotateX = this.rotateX - this.changeY / 3;
		$this.css(`transform`, `scale(.8) rotateX(${this.rotateX}deg) rotateY(${this.rotateY}deg)`);
	}

	return {
		init(isInit) {
			$cubeBox.css('display', 'block');
			if (isInit) return;
			$cube.css("transform", "scale(.8) rotateX(-30deg) rotateY(45deg)")
				.on('touchstart', down)
				.on('touchmove', move)
				.on('touchend', up);
			//=>魔方每一面的点击事件
			$cube.children('li').tap(function () {
				$cubeBox.css('display', 'none');
				swiperModule.init($(this).index() + 1);
			});
		}
	}
})();


/* ==滑屏模块== */
let swiperModule = (function () {
	let swiperExample = null,
		$baseInfo = null,
		$swiperBox = $('.swiperBox'),
		$returnBox = $('.returnBox');

	function pageMove() {
		$baseInfo = $('.baseInfo');

		//=>this:swiperExample
		let activeIndex = this.activeIndex,
			slides = this.slides;
		//=>第一页3D折叠菜单的处理
		if (activeIndex === 1 || activeIndex === 7) {
			$baseInfo.makisu({
				selector: 'dd',
				overlap: 0.6,
				speed: 0.8
			});
			$baseInfo.makisu('open');
		} else {
			$baseInfo.makisu({
				selector: 'dd',
				overlap: 0,
				speed: 0
			});
			$baseInfo.makisu('close');
		}

		//=>给当前页面设置ID，让其内容有动画效果
		[].forEach.call(slides, (item, index) => {
			if (index === activeIndex) {
				activeIndex === 0 ? activeIndex = 6 : null;
				activeIndex === 7 ? activeIndex = 1 : null;
				item.id = 'page' + activeIndex;
				return;
			}
			item.id = null;
		});
	}

	return {
		init(index = 1) {
			$swiperBox.css('display', 'block');
			if (swiperExample) {
				swiperExample.slideTo(index, 0);
				return;
			}
			swiperExample = new Swiper('.swiper-container', {
				direction: 'horizontal', //=>'vertical'
				loop: true,
				effect: 'coverflow', //=>"cube"、"fade"、"coverflow"、"flip"
				on: {
					init: pageMove,
					transitionEnd: pageMove
				}
			});
			swiperExample.slideTo(index, 0);
			//=>点击返回按钮
			$returnBox.tap(function () {
				$swiperBox.css('display', 'none');
				cubeModule.init(true);
			});
		}
	}
})();

cubeModule.init();

/* ==音乐的处理== */
function handleMusic() {
	let $musicAudio = $('.musicAudio'),
		musicAudio = $musicAudio[0],
		$musicIcon = $('.musicIcon');

	$musicAudio.on('canplay', function () {
		$musicIcon.css('display', 'block')
			.addClass('move');
	});

	$musicIcon.tap(function () {
		if (musicAudio.paused) {
			//=>当前暂停状态
			play();
			$musicIcon.addClass('move');
			return;
		}
		//=>当前播放状态
		musicAudio.pause();
		$musicIcon.removeClass('move');
	});

	function play() {
		musicAudio.play();
		document.removeEventListener("touchstart", play);
	}
	play();

	//=>兼容处理
	document.addEventListener("WeixinJSBridgeReady", play);
	document.addEventListener("YixinJSBridgeReady", play);
	document.addEventListener("touchstart", play);
}
setTimeout(handleMusic, 1000);