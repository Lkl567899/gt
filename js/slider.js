/*
 * @Author: your name
 * @Date: 2021-12-29 14:07:15
 * @LastEditTime: 2021-12-29 15:07:49
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE//
 * @FilePath: \高途\js\slider.js
 */
/***
 * 
 * @param {容器的名字} containerName
 * @param {有效的图片的张数} picNumber
 * @param {图片的宽度} basicWidth
 */
function slider(containerName, picNumber, basicWidth) {
	var $slider = $(containerName);	//轮播图的容器
	var picNumber = picNumber;			// 有效的图片的张数
	var basicWidth = basicWidth;  //图片的宽度

	var currentIndex = 1; 	//当前显示的是第几张
	var timer;				//定时器
	var $sliderBody = $slider.find(".slider-body");//轮播图的中的ul
	var $idx = $slider.find(".idx");				//轮播图的中指示条
	var $btnLeft = $slider.find(".btnleft");		//轮播图的左右按钮
	var $btnRight = $slider.find(".btnright");	//轮播图的左右按钮

	goto(currentIndex);  	//给轮播图做一个初始化。
	autoPlay();				//启动定时播放
	//去到第yourIndex张图
	function goto(yourIndex) {
		//		1．更新slider-body的left值。这个过程一般用animate来实现。
		$sliderBody.stop(true).animate({ "left": yourIndex * -1 * basicWidth }, 500, function () {

			if (yourIndex == 0) {
				//alert("准备开始瞬间移动")
				//瞬间移动，把ul的位置移动到安全的状态。
				$sliderBody.css("left", picNumber * -1 * basicWidth);
				currentIndex = picNumber; //真实序列中有效图片的张数
				//console.info("瞬间移动结束！");
			}
			else if (yourIndex == (picNumber + 1)) { //6 是 真实有效图片的张数+1
				//console.info("到了最后一张，准备瞬间移动");
				//alert("准备开始瞬间移动")
				//瞬间移动，把ul的位置移动到安全的状态。
				$sliderBody.css("left", 1 * -1 * basicWidth);
				$idx.eq(0).addClass("on").siblings().removeClass("on");
				currentIndex = 1;
			}
			//console.info("动画结束:"+yourIndex);
		});
		//		2．更新指示条中的状态
		$idx.eq(yourIndex - 1).addClass("on").siblings().removeClass("on");
	}

	$btnLeft.click(function () {

		if ($sliderBody.is(":animated")) {
			console.info("不要点，还没有完！！！！！");
			return;
		}
		//上一张
		currentIndex = currentIndex - 1;
		goto(currentIndex);
	});

	$btnRight.click(function () {
		if ($sliderBody.is(":animated")) {
			console.info("不要点，还没有完！！！！！");
			return;
		}
		//下一张
		currentIndex = currentIndex + 1;
		goto(currentIndex);

	})

	$idx.hover(function () {

		var i = $(this).index();//当前是第几个指示灯被点中

		goto(i + 1);

		//console.info(   i )

	})
	//自动播放
	function autoPlay() {
		timer = setInterval(function () {
			//模拟向右的箭头被点击。

			$btnRight.trigger("click")

		}, 2000);
	}

	$slider.on("mouseenter", function () {
		//console.info("鼠标进入，停止自动播放");
		clearInterval(timer);
	});

	$slider.on("mouseleave", function () {
		//console.info("鼠标离开，继续自动播放");
		autoPlay();
	})
   
}
