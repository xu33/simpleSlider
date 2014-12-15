function Slider(wrapper, prevBtn, nextBtn, ctrls) {
        var sliderWidth = wrapper.width()
        var slider = $(wrapper.children()[0]).css('position', 'absolute')
        var slides = slider.children()

        var total = slides.length
        var cloneAfter = $(slides[0]).clone(true)
        var cloneBefore = $(slides[slides.length - 1]).clone(true)

        slider.prepend(cloneBefore)
        slider.append(cloneAfter)

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

        function firstElementChildOf(el) {
            var child = el.firstChild
            while (child && child.nodeType != 1) {
                child = child.nextSibling
            }

            return child
        }

        function updateWrapper() {
            var height = 0
            var el = firstElementChildOf(wrapper[0])

            do {
                height = $(el).height()
                el = firstElementChildOf(el)
            } while (!height && el)

            if (height) {
                wrapper.css({
                    'height': height,
                    'overflow': 'hidden',
                    'position': 'relative'
                })
            }
        }

        updateWrapper()

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
            timer && clearTimeout(timer)
            timer = setTimeout(function() {
                slideNext()
            }, 4000)
        }

        function updatePointer() {
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
                    console.log('page:', page, currentPage)
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
        moveNextLater()
    }