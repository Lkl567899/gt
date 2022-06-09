/*
 * fixedScroll.js 婊氬姩鍥哄畾鎻掍欢
 * @DH   
 * https://denghao.me
 * 
 * 绀轰緥锛�
 * $('.box').fixedScroll()
 */
;
(function () {
    let fixedScroll = function ($fixedEl, opts) {
        this.defaults = {
            navEls: '', //nav (娉ㄦ剰: navEls鍜宧ookEls涓や釜鍙傛暟蹇呴』鎴愬鍑虹幇)
            hookEls: '', //nav瑕佹粴鍔ㄥ埌鐨勫搴斿厓绱�
            hookOffset: 0, //hook鍖哄煙椤堕儴鍋忕Щ閲�
            offset: 0, //鍥哄畾鍏冪礌椤堕儴鍋忕Щ閲�
            stickEndEl: '', //鍥哄畾缁撴潫浣嶇疆鐨勫厓绱�
            callback: ''
        };
        $.extend(this, this.defaults, opts);
        this.flag = true;
        this.stickTop = 0; //鍥哄畾鍏冪礌鐨勫師濮嬩綅缃�
        this.init_stickTop = 0; //鐢ㄤ簬閲嶈绠楅珮搴�
        this.stickBottom = 9999999; //鍥哄畾鍏冪礌鐨勭粨鏉熶綅缃�
        this.fixedEl = $fixedEl; //鍥哄畾鍏冪礌
        this.fixedElH = $fixedEl.height();
        this.fixedElW = $fixedEl.width();
        this.fixedElL = $fixedEl.offset().left;
        this.winEl = $(window);
        this.offset = parseInt(this.offset || 0);
        this.hookArea = [];
        this.isClickSwitch = false;
    }
    fixedScroll.prototype = {
        init: function () {
            if (this.fixedEl.length > 0) {
                this.stickTop = this.fixedEl.offset().top;
                this.init_stickTop = this.stickTop;
            }

            if (this.stickEndEl.length > 0) {
                this.stickBottom = this.stickEndEl.offset().top;
            }
            // 闄愬畾璧峰浣嶇殑璺濋《楂樺害
            this.distance = this.stickBottom - this.stickTop - this.fixedElH - this.offset / 2;
            this.calcArea();
            this.flag && this.events();
            this.flag = false;
        },
        // 鍥哄畾
        stickHandle: function () {
            if (this.winEl.scrollTop() > this.stickTop - this.offset) {
                if (this.winEl.scrollTop() < this.stickBottom - this.fixedElH - this.offset) {
                    this.fixedEl.css({
                        "position": "fixed",
                        "top": this.offset,
                        "left": this.fixedElL,
                        "width": this.fixedElW,
                        "height": this.fixedElH,
                        "transform": "translateY(0)"
                    });
                    typeof this.callback == 'function' && this.callback(1);
                } else {
                    this.fixedEl.css({
                        "top": "auto",
                        "left": "auto",
                        "position": "static",
                        "transform": "translateY(" + this.distance + "px)"
                    });
                    typeof this.callback == 'function' && this.callback(0);
                }
            } else {
                this.fixedEl.css({
                    "top": "auto",
                    "position": "static"
                });
                typeof this.callback == 'function' && this.callback(0);
            }
        },

        // 鍔ㄦ€佽绠楅珮搴�
        resizeHeight: function (hasNewTop) {
            if (this.fixedEl.length > 0) {
                this.stickTop = hasNewTop ? this.fixedEl.offset().top : this.init_stickTop;
            }
            if (this.stickEndEl.length > 0) {
                this.stickBottom = this.stickEndEl.offset().top;
            }
            this.distance = this.stickBottom - this.stickTop - this.fixedElH - this.offset / 2;
            this.calcArea();
        },

        // 璁＄畻婊氬姩鍖�
        calcArea: function () {
            if (this.hookEls.length <= 0) return;
            let areas = [];
            this.hookEls.each(function (i, ele) {
                var start = $(this).offset().top;
                var end = start + $(this).height();
                areas.push([start, end]);
            })
            this.hookArea = areas;
        },

        // 鍖哄煙鍒ゆ柇
        hookScroll: function () {
            var t = this.winEl.scrollTop();
            for (var i in this.hookArea) {
                if ((t > this.hookArea[i][0] - this.hookOffset) && t < this.hookArea[i][1]) {
                    this.navStatus(i)
                } else {
                    this.navStatus()
                }
            }
        },

        // nav鐘舵€�
        navStatus: function (i) {
            if (i || +i === 0) {
                this.navEls.eq(i).addClass('active').siblings().removeClass('active');
            } else {
                this.navEls.eq(i).removeClass('active');
            }
        },

        // 婊氬姩鍒版寚瀹氫綅缃�
        refresh: function (i) {
            let top = this.hookArea[i][0] - this.hookOffset;
            this.calcArea();
            this.scrollTop(top, 120);
        },

        scrollTop: function (scrollTo, time) {
            var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            var scrollFrom = parseInt(scrollTop),
                i = 0,
                step = 5;
            scrollTo = parseInt(scrollTo);
            time /= step;
            var interval = setInterval(function () {
                i++;
                let top = (scrollTo - scrollFrom) / time * i + scrollFrom;
                document.body.scrollTop = top;
                document.documentElement.scrollTop = top;
                if (i >= time) {
                    clearInterval(interval);
                }
            }, step)
        },

        events: function () {
            let _this = this;
            // 鍒囨崲nav
            if (_this.navEls.length > 0) {
                this.navEls.on('click', function () {
                    let i = $(this).index();
                    _this.isClickSwitch = true;
                    _this.refresh(i);
                    _this.navStatus(i);
                    setTimeout(function () {
                        _this.isClickSwitch = false;
                    }, 300);
                })
            }
            // 婊氬姩鐩戝惉
            this.winEl.on("scroll", function () {
                (_this.fixedEl.length > 0) && _this.stickHandle();
                (_this.hookEls.length > 0 && !_this.isClickSwitch) && _this.hookScroll();
            });
        }
    }

    $.fn.fixedScroll = function (opts) {
        let drag = new fixedScroll(this, opts);
        drag.init();
        return drag;
    }

    //鍏煎妯″潡
    if (typeof module !== 'undefined' && typeof exports === 'object') {
        module.exports = fixedScroll;
    } else if (typeof define === 'function' && (define.amd || define.cmd)) {
        define(function () {
            return fixedScroll;
        })
    } else {
        window.fixedScroll = fixedScroll;
    }
}).call(function () {
    return (typeof window !== 'undefined' ? window : global)
}, $)