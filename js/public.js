$(function() {
    // 애니메이션의 진행 시간
    const duration = 500;

    // ------------------------------

    // 검색창
    const $searchForm = $('#search');

    // 검색 폼의 submit 이벤트를 비활성화
    $searchForm.on('submit', function(event) { event.preventDefault(); });

    // ------------------------------

    // 네비게이션

    // 메인 메뉴 목록
    const $navMainList = $('#navMainList');

    // 메인 메뉴 확장 및 닫기 화살표
    const navMainExpandArrow = '<path d="M.22.22C.52-.07,1.02-.07,1.32.22h0l8.68,8.06L18.68.22c.3-.3.8-.3,1.1,0,.3.3.3.7,0,1l-9.18,8.56c-.3.3-.8.3-1.1,0h0L.22,1.22C-.07.92-.07.52.22.22H.22"></path>';
    const navMainCloseArrow = '<path d="M.22,9.78H.22c-.3-.3-.3-.7,0-1L9.5.22h0c.3-.3.8-.3,1.1,0l9.18,8.56c.3.3.3.7,0,1s-.8.3-1.1,0L10,1.72,1.32,9.78h0c-.3.3-.8.3-1.1,0"></path>';

    // 매개 변수 data에 json 정보를 넣어 함수를 실행
    $.getJSON('js/Navigation.json', function(data) {
        // main, sub가 들어있는 객체를 순회하며 HTML 문자열을 생성,
        // 메인 메뉴 항목을 표현하는 변수 navMainMenu에 대입
        const navMainMenu = data.map(data => {
            // sub 객체 배열에 들어있는 객체를 순회하며 HTML 문자열을 생성,
            // 서브메뉴를 표현하는 변수 navSub에 대입
            const navSub = data.sub.map(sub => {
                // 3차 서브메뉴가 존재할때
                if(sub.third?.length > 0) {
                    // 2차, 3차 서브메뉴를 생성해서 반환
                    return `<li tabindex="0" class="flex fAlignCenter fJustifyBetween sidePadding_15">
                        <span>${sub.second}</span>
                        <svg class="navSubArrow" viewBox="0 0 8 16"><path d="M.18,15.82c-.24-.24-.24-.64,0-.88H.18l6.44-6.94L.18,1.06c-.24-.24-.24-.64,0-.88S.74-.06.98.18l6.84,7.34c.24.24.24.64,0,.88h0L.98,15.82c-.24.24-.56.24-.8,0H.18"/></svg>
                        <ul id="navThirdSubList">${sub.third.map(t => `<li class="flex fAlignCenter sidePadding_15"><a href="#third">${t}</a></li>`).join('')}</ul>
                    </li>`;
                }
                // 3차 서브메뉴가 존재하지 않을때
                else if(!sub.third?.length) {
                    // 2차 메뉴를 생성해서 반환
                    return `<li class="flex fAlignCenter sidePadding_15"><a class="flex fJustifyBetween" href="#second">
                        <span>${sub.second}</span>
                        <svg class="icon_15" viewBox="0 0 15 15"><path d="M1.29,2.3c0-.5.4-1,.99-1h5.17V0H2.28C.99,0,0,1,0,2.3v10.5c0,1.2.99,2.2,2.28,2.2h10.43c1.19,0,2.28-1,2.28-2.3v-5.2h-1.29v5.2c0,.5-.4,1-.99,1H2.28c-.5,0-.99-.4-.99-1V2.3ZM9.24.6c0,.4.3.6.6.6h2.88l-6.56,6.7c-.2.2-.2.6,0,.9.3.2.7.2.89,0l6.56-6.6v2.9c0,.4.3.6.6.6.4,0,.6-.3.6-.6V0h-4.97c-.3,0-.6.3-.6.6Z"/></svg>
                    </a></li>`;
                }
            }).join('');    // 생성된 문자열을 공백이 없는 하나의 문자열로 통합

            // 메인 메뉴 항목의 HTML을 만들어 반환
            return `<li tabindex="0" class="flex fAlignCenter fJustifyBetween sidePadding_15 underline">
                        <span class="fontM20">${data.main}</span>
                        <svg class="icon_20" viewBox="0 0 20 10">${navMainExpandArrow}</svg>
                        <ul id="navSecondSubList">${navSub}</ul>
                    </li>`;
        }).join('');

        // 메인 메뉴 항목을 메인 메뉴 목록에 삽입
        $navMainList.html(navMainMenu);

        // 변수 선언
        const $navMainMenu = $navMainList.children();               // 메인 메뉴 항목
        const $navSecondSubList = $navMainMenu.children('ul');      // 2차 서브 메뉴 목록
        const $navSecondSubMenu = $navSecondSubList.children();     // 2차 서브 메뉴 항목
        const $navThirdSubList = $navSecondSubMenu.children('ul');  // 3차 서브 메뉴 목록

        // 메인 메뉴 항목 클릭 시
        $navMainMenu.on('click', function(event) {
            // $('body')의 클릭 이벤트 발생 방지
            event.stopPropagation();

            // 클릭한 메인 메뉴 항목의 2차 서브 메뉴 목록이 애니메이션 중이라면 함수를 종료
            if($navSecondSubList.is(':animated')) return;

            // 변수 선언
            const $this = $(this);  // 클릭한 메인 메뉴 항목을 나타내는 변수

            // 클릭한 메인 메뉴 항목이 on 클래스를 가지지 않았다면(2차 서브 메뉴가 보이지 않는다면)
            if(!$this.hasClass('on')) {
                // 클릭한 메인 메뉴 항목에 on 클래스를 부여하고 화살표를 변경
                // 클릭한 메인 메뉴 항목의 2차 서브 메뉴 목록을 슬라이드 다운
                // 클릭한 메인 메뉴 항목의 형제 요소들의 on 클래스를 제거하고 화살표를 변경
                $this.addClass('on').children('svg').html(navMainCloseArrow).end()
                    .children('ul').slideDown(duration).end()
                    .siblings().removeClass('on').children('svg').html(navMainExpandArrow);
                
                // 클릭한 메인 메뉴 항목의 형제 요소들의 2차 서브 메뉴 목록을 슬라이드 업 하려는데 3차 서브 메뉴 목록이 보인다면
                if($navThirdSubList.is(function() { return $(this).css('display') === 'block' })) {
                    // 3차 서브 메뉴 목록을 왼쪽으로 슬라이드 시킨 후
                    $navThirdSubList.animate({ width: 0 }, duration, 'swing', function() {
                        $(this).css({ display: 'none' });

                        // 클릭한 메인 메뉴 항목의 형제 요소들의 2차 서브 메뉴 목록을 슬라이드 업
                        $this.siblings().children('ul').slideUp(duration);
                    });
                }
                // 하지만 3차 서브 메뉴 목록이 보이지 않는다면 바로 슬라이드 업
                else $this.siblings().children('ul').slideUp(duration);
            }
            // 클릭한 메인 메뉴 항목이 on 클래스를 가지고 있다면(자기 자신을 클릭했다면)
            else {
                // 클릭한 메인 메뉴 항목의 2차 서브 메뉴 목록을 슬라이드 업 하려는데 3차 서브 메뉴 목록이 보인다면
                if($navThirdSubList.is(function() { return $(this).css('display') === 'block' })) {
                    // 3차 서브 메뉴 목록을 왼쪽으로 슬라이드 시킨 후
                    $navThirdSubList.animate({ width: 0 }, duration, 'swing', function() {
                        $(this).css({ display: 'none' });

                        // 클릭한 메인 메뉴 항목의 on 클래스를 제거 후 화살표를 변경
                        // 클릭한 메인 메뉴 항목의 2차 서브 메뉴 목록을 슬라이드 업
                        $this.removeClass('on').children('svg').html(navMainExpandArrow).end()
                            .children('ul').slideUp(200);
                    });
                }
                // 하지만 3차 서브 메뉴 목록이 보이지 않는다면 바로 슬라이드 업
                else $this.removeClass('on').children('svg').html(navMainExpandArrow).end().children('ul').slideUp(200);
            }
        });

        // 2차 서브 메뉴 항목을 클릭 시
        $navSecondSubMenu.on('click', function(event) {
            // 변수 선언
            const $this = $(this);  // 클릭한 2차 서브메뉴 항목을 나타내는 변수

            // 메인 메뉴 항목의 클릭 이벤트 발생 방지
            event.stopPropagation();

            // 클릭한 2차 서브 메뉴 항목에 3차 서브 메뉴 목록이 없고
            // 3차 서브 메뉴 목록이 애니메이션 중이라면 함수를 종료 
            if(!$this.has('ul') || $navThirdSubList.is(':animated')) return;

            // 3차 서브 메뉴 목록이 보이지 않는다면
            if($this.children('ul').css('display') === 'none') {
                // 클릭한 2차 서브 메뉴 항목의 3차 서브 메뉴 목록을 오른쪽으로 슬라이드
                // 클릭한 2차 서브 메뉴 항목의 형제 요소들의 3차 서브 메뉴 목록을 왼쪽으로 슬라이드
                $this.children('ul').css({ display: 'block' }).animate({ width: '210px' }, duration, 'swing').end()
                    .siblings().children('ul').animate({ width: 0 }, duration, 'swing', function() { $(this).css({ display: 'none' }); });
            }
            // 3차 서브 메뉴 목록이 보인다면(자기 자신을 클릭했다면)
            // 클릭한 2차 서브 메뉴 항목의 3차 서브 메뉴 목록을 왼쪽으로 슬라이드
            else $this.children('ul').animate({ width: 0 }, duration, 'swing', function() { $(this).css({ display: 'none' }); });
        });

        // 3차 서브 메뉴 항목을 클릭 시 2차 서브 메뉴 항목의 클릭 이벤트 발생 방지
        $navThirdSubList.children().on('click', function(event) { event.stopPropagation(); });

        // 네비게이션 메뉴들을 제외한 아무 곳이나 클릭 시
        $('body').on('click', function() {
            // 2차 서브 메뉴 목록이 애니메이션 진행 중이거나 2차 서브 메뉴 목록이 보이지 않으면 함수를 종료
            if($navSecondSubList.is(':animated') || !$navSecondSubList.is(':visible')) return;

            // 메인 메뉴 항목의 on 클래스를 제거 후 화살표를 변경
            $navMainMenu.removeClass('on').children('svg').html(navMainExpandArrow);

            // 3차 서브 메뉴 목록이 보인다면
            if($navThirdSubList.is(function() { return $(this).css('display') === 'block'; })) {
                // 3차 서브 메뉴 목록을 왼쪽으로 슬라이드 후
                $navThirdSubList.animate({width: 0}, duration, 'swing', function() {
                    $(this).css('display', 'none');

                    // 2차 서브 메뉴 목록을 슬라이드업
                    $navSecondSubList.slideUp(duration);
                });
            }
            // 3차 서브 메뉴 목록이 보이지 않는다면 2차 서브 메뉴 목록을 슬라이드 업
            else $navSecondSubList.slideUp(duration);
        });
    });

    // ------------------------------

    // 패밀리 사이트

    // 패밀리 사이트 메인메뉴 목록
    const $familySiteList = $('#familySiteList');

    // 매개 변수 data에 json 정보를 넣어 함수를 실행
    $.getJSON('js/FamilySite.json', function(data) {
        // 패밀리 사이트 메뉴를 담을 변수 familySiteMenu
        const familySiteMenu = data.map(data =>
            `<li class="flex fAlignCenter fJustifyBetween sidePadding_15" tabindex="0">
                <span>${data.main}</span>
                <img class="familySiteArrow" src="./img/Icon/FamilySiteExpand.svg" alt="Family Site Expand">
                <ul class="sidePadding_15" >${data.sub.map(text => `<li><a href="#관련부처">${text}</a></li>`).join('')}</ul>
            </li>`
        );

        // 완성된 HTML 문자열을 패밀리 사이트 메뉴 목록에 추가
        $familySiteList.html(familySiteMenu);

        // 변수 선언
        const $familySiteMenu = $familySiteList.children();         // 메인 메뉴 항목
        const $familySiteSubList = $familySiteMenu.children('ul');  // 서브 목록

        // 메인 메뉴 항목 클릭 시
        $familySiteMenu.on('click', function(event) {
            // body의 클릭 이벤트 방지
            event.stopPropagation();

            // 클릭한 메인 메뉴 항목을 나타내는 변수
            const $this = $(this);

            // 클릭한 메인 메뉴 항목의 서브 메뉴가 애니메이션 중이라면 함수를 종료
            if($this.children('ul').is(':animated')) return;

            // 클릭한 메인 메뉴 항목의 서브 메뉴가 보이지 않는다면
            if($this.children('ul').css('display') === 'none') {
                // 클릭한 메인 메뉴 항목의 화살표를 변경하고 서브 메뉴를 슬라이드 업
                // 클릭한 메인 메뉴 항목의 형제 요소들의 화살표를 변경하고 서브 메뉴를 슬라이드 다운
                $this.children('img').attr('src', './img/Icon/FamilySiteClose.svg').end()
                    .children('ul').css('display', 'block').animate({height: '390px'}, duration, 'swing').end()
                    .siblings().children('img').attr('src', './img/Icon/FamilySiteExpand.svg').end()
                    .children('ul').animate({ height: 0 }, duration, 'swing', function() { $(this).css('display', 'none'); });
            }
            // 클릭한 항목의 서브메뉴가 보인다면(자기 자신을 클릭하면)
            else {
                // 클릭한 항목의 화살표를 변경하고 서브메뉴를 슬라이드 다운시킨다
                $this.children('img').attr('src', './img/Icon/FamilySiteExpand.svg').end()
                    .children('ul').animate({ height: 0 }, duration, function() { $(this).css('display', 'none'); });
            }
        });

        // 메인 메뉴 항목 클릭 이벤트 방지
        $familySiteSubList.on('click', function(event) { console.log('active'); event.stopPropagation(); });

        // 패밀리 사이트를 제외한 아무 곳이나 클릭 시 패밀리 사이트를 닫음
        $('body').on('click', function() {
            // 패밀리 사이트 서브 목록이 보이지 않고 서브 목록이 애니메이션 중이면 함수를 종료
            if(!$familySiteSubList.is(':visible') || $familySiteSubList.is(':animated')) return;

            // 현재 보이는 패밀리 사이트 서브 목록을 슬라이드 다운시키고
            // 메인 메뉴 항목의 화살표를 변경한다
            $familySiteSubList.filter(':visible').animate({ height: 0 }, duration, function() { $(this).css('display', 'none') })
                .siblings('img').attr('src', './img/Icon/FamilySiteExpand.svg');
        });
    });
});