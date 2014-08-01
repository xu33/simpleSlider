(function() {
    // wrapper->slider->slides
    function Slider(wrapper, settings) {
        this.wrapper = wrapper
        this.settings = settings
        this.wrapper.css({
            overflow: 'hidden',
            position: 'relative'
        })
        this.muitl = 0
        this.page = 0
        this.lastPage = this.page
        this.slider = this.wrapper.children().first().css('position', 'absolute')
        this.ttl = this.slider.children().length

        this.step = this.wrapper.width()
        console.log(this.step)
        this.positionChilds()
        this.initPointers()

        this.startTicker()
    }

    Slider.prototype = $.extend(Slider.prototype, {
        positionChilds: function() {
            var childs = this.slider.children()
            for (var i = 0; i < childs.length; i++) {
                $(childs[i]).css({
                    position: 'absolute',
                    left: this.step * i,
                    width: this.wrapper.width()
                })

                if (i == 0) {
                    this.wrapper.css('height', $(childs[i]).height())
                }
            }

            this.childs = childs
        },
        initPointers: function() {
            var self = this
            this.currPoint = this.settings.pointers.first()
            this.settings.pointers.each(function(i, pointer) {
                $(pointer).on('click', {page: i}, function(e) {
                    var realPage = self.page % self.ttl
                    var clickedPage = e.data.page

                    self.page = self.page + (clickedPage - realPage)

                    console.log('self.page:', self.page)
                    self.slide(self.page)
                })
            })
        },
        slide: function(page) {
            var self = this
            if (page == self.lastPage) {
                return 
            }

            self.prepare(page, page - self.lastPage)
            self.lastPage = page
            setTimeout(function(){
                var cls = self.settings.currentPointClass || 'cur'
                self.stopTicker()
                self.slider.stop().animate({
                    left: -self.step * page
                }, {
                    duration: 400,
                    complete: function() {
                        var realPage = page % self.ttl

                        self.currPoint.removeClass(cls)
                        self.currPoint = $(self.settings.pointers[realPage])
                        self.currPoint.addClass(cls)
                        self.startTicker()
                    }
                })
            }, 17)
        },
        prepare: function(page, cross) {
            console.log('cross:', cross)
            var multi = Math.floor(page / this.ttl)
            if (multi > 0) {
                if (cross > 0) {
                    for (var i = 0; i < cross; i ++) {
                        var _page = page % this.ttl - i
                        var left = this.ttl * this.step * multi + this.step * _page

                        $(this.childs[_page]).css('left', left)
                    }
                } else {
                    for (var i = cross; i >= 0; i ++) {
                        var _page = page % this.ttl + i
                        var left = this.ttl * this.step * multi - this.step * _page

                        $(this.childs[_page]).css('left', left)
                    }
                }
            }
        },
        startTicker: function() {
            var self = this
            self.ticker = setInterval(function() {
                self.page++

                // if (self.page >= self.ttl) {
                //     self.page = 0
                // }

                self.slide(self.page)
            }, 2000)
        },
        stopTicker: function() {
            clearInterval(this.ticker)
        }
    })

    $.fn.slider = function(settings) {
        return new Slider($(this), settings)
    }
}())