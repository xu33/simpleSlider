function Slider(wrapper, prevBtn, nextBtn, ctrls) {
        var sliderWidth = wrapper.width()
        var slider = $(wrapper.children()[0])
        var slides = slider.children()

        slides.each(function(i, o) {
            $(o).addClass('page' + i)
        })

        if (slides.length <= 1) {
            prevBtn && prevBtn.hide()
            nextBtn && nextBtn.hide()
            ctrls && ctrls.hide()
            return
        }

        slider.css('position', 'absolute')
        var total = slides.length
        var cloneAfter = $(slides[0]).clone(true)
        var cloneBefore = $(slides[slides.length - 1]).clone(true)
        slider.prepend(cloneBefore)
        slider.append(cloneAfter)

        cloneBefore.addClass('page' + (slides.length - 1))
        cloneAfter.addClass('page0')

        slides = slider.children()

        slides.each(function(index, slideItem) {
            $(slideItem).css({
                position: 'absolute',
                left: sliderWidth * index,
                width: sliderWidth
            })
        })

        slider.css({
            width: sliderWidth * slides.length,
            left: -sliderWidth
        })

        var timer
        var currentPage = 0
        var move = false
        var startLeft = -sliderWidth
        var currentLeft = -sliderWidth
        var autoPlay = true
        var playInterval = 1000
        var eventEmitter = $({})

        function _slide(left, callback) {
            move = true
            timer && clearTimeout(timer)
            slider.animate({
                left: left
            }, {
                duration: 400,
                complete: function() {
                    callback && callback()
                    moveNextLater()
                    updatePointer()

                    move = false

                    eventEmitter.triggerHandler('change', currentPage)
                }
            })
        }

        function slidePrev() {
            if (move === true) {
                return false
            }

            currentPage = currentPage - 1
            currentLeft = currentLeft + sliderWidth

            _slide(currentLeft, function() {
                if (currentPage < 0) {
                    currentPage = total - 1
                    currentLeft = startLeft - currentPage * sliderWidth
                    slider.css({
                        left: currentLeft
                    })
                }
            })
        }

        function slideNext() {
            if (move === true) {
                return false
            }

            currentPage = currentPage + 1
            currentLeft = currentLeft - sliderWidth

            _slide(currentLeft, function() {
                if (currentPage > total - 1) {
                    currentPage = 0
                    currentLeft = startLeft
                    slider.css({
                        left: startLeft
                    })
                }
            })
        }

        function moveNextLater() {
            if (!autoPlay) {
                return
            }

            timer && clearTimeout(timer)
            timer = setTimeout(function() {
                if (!autoPlay) {
                    return
                }
                slideNext()
            }, playInterval)
        }

        function updatePointer() {
			if (!ctrls) {
				return
			}
            ctrls.each(function(i, o) {
                if (i === currentPage) {
                    $(o).addClass('active')
                } else {
                    $(o).removeClass('active')
                }
            })
        }

        wrapper.on('mouseenter', function() {
            clearTimeout(timer)
        })

        wrapper.on('mouseleave', function() {
            moveNextLater()
        })

        if (ctrls) {
            ctrls.each(function(index, ctrl) {
                $(ctrl).on('click', {page: index}, function(e) {
                    var page = e.data.page
                    if (page === currentPage) {
                        return
                    } else {
                        if (move) {
                            return
                        }
                        
                        currentLeft = currentLeft - (page - currentPage) * sliderWidth
                        currentPage = page
                        _slide(currentLeft)
                    }
                })
            })
        }

        if (prevBtn) {
            prevBtn.on('click', function(e) {
                slidePrev()
            })
        }

        if (nextBtn) {
            nextBtn.on('click', function(e) {
                slideNext()
            })
        }

        updatePointer()
        //moveNextLater()

        return {
            element: wrapper,
            getCurrentPage: function() {
                return currentPage
            },
            stopAutoPlay: function() {
                autoPlay = false
            },
            startAutoPlay: function() {
                autoPlay = true;
				moveNextLater();
            },
            setPlayInterval: function(n) {
                playInterval = n
            },
            onchange: function(fn) {
                eventEmitter.on('change', fn)
            }
        }
    }