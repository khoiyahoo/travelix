const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);
    const navActive = $('.nav-links.active');
    const navs = $$('.nav-links');
    const line = $('.line');
    line.style.left = navActive.offsetLeft + 'px'
    line.style.width = navActive.offsetWidth + 'px'
        navs.forEach((nav,index) => {
            nav.onclick = function() {
                $('.nav-links.active').classList.remove('active');
                this.classList.add('active');
                line.style.left = this.offsetLeft + 'px'
                line.style.width = this.offsetWidth + 'px'
               
            }
        })  