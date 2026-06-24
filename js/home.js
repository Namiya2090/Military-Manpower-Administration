$(function() {
    // 애니메이션의 진행 시간
    const duration = 500;

    // 이전 슬라이드
    function slidePrev(list, ratio) {
        list.css({marginLeft: ratio}).prepend(list.children().last()).animate({marginLeft: 0}, duration, 'swing');
    }

    // 재생, 정지 함수
    function playState(type, button, timerId, list, ratio) {
        // 이미지 경로에 사용할 텍스트
        const imageType = 'ImageSlideRemote';
        const bannerType = 'BannerCollectionRemote';

        // 만약 현재 상태가 재생 중이면
        if(button.find('span').text() === 'Pause') {
            // 버튼의 후손 요소 중 span 요소의 텍스트를 'Play'로 변경
            // 버튼의 이미지를 변경
            button.find('span').text('Play').parent()
                .css({background: `url("../img/Home/${type === 'image' ? imageType : bannerType}/Play.svg") no-repeat center / cover`});

            // 반복되는 슬라이드 기능을 삭제
            clearInterval(timerId);
        }
        // 현재 상태가 정지 중이면
        else {
            // 버튼의 후손 요소 중 span 요소의 텍스트를 'Pause'로 변경
            // 버튼의 이미지를 변경
            button.find('span').text('Pause').parent()
                .css({background: `url("../img/Home/${type === 'image' ? imageType : bannerType}/Pause.svg") no-repeat center / cover`});
            
            // 반복되는 슬라이드 기능을 설정
            timerId = setInterval(() => slideNext(list, ratio), duration * 10);
        }
    }

    // 다음 슬라이드
    function slideNext(list, ratio) {
        list.animate({marginLeft: ratio}, duration, 'swing', function() { $(this).append($(this).children().first()).removeAttr('style'); });
    }

    // ------------------------------

    // 첫 페이지 이미지 슬라이드

    // 변수 선언
    const $slideImageList = $('#imageSlide > ul:first-child');          // 슬라이드 이미지 목록
    const $imageSlideRemote = $('#imageSlide > ul:last-child');         // 이미지 슬라이드 리모컨
    let slideImageOrder;                                                // 슬라이드 이미지의 순서를 나타내는 변수
    const $prevImage = $imageSlideRemote.children().eq(1);              // 이전 버튼
    const $imageSlidePlayState = $imageSlideRemote.children().eq(2);         // 재생, 정지 버튼
    const $nextImage = $imageSlideRemote.children().eq(3);              // 다음 버튼
    const $allImageOverlayButton = $imageSlideRemote.children().eq(4);  // 이미지 전체보기 오버레이 버튼
    const $allImageOverlay = $('#allView');                             // 이미지 전체보기 오버레이
    const $overlayImageBox = $('#imageBox');                            // 오버레이 이미지 박스
    const $closeOverlay = $overlayImageBox.children('button');          // 오버레이 닫기 버튼

    // 5초 마다 slideNext() 함수를 실행, 타이머 아이디를 slideImageTimerId에 대입
    let slideImageTimerId = setInterval(() => {
        slideNext($slideImageList, '-100%');

        // 현재 $slideImageList에서 진행 중인 애니메이션이 끝날 때까지 기다렸다가 이미지 순서 텍스트 업데이트
        $slideImageList.promise().done(function() { changeOrderNumber(); });
    }, duration * 10);

    // 슬라이드 이미지의 순서를 나타내는 함수
    function changeOrderNumber() {
        // 변수 선언
        const order = $slideImageList.children().first().attr('data-index');    // 현재 이미지의 순서를 나타내줄 변수
        const imageLength = $slideImageList.children().length;                  // 총 이미지 갯수

        // 슬라이드 이미지의 순서를 나타내는 변수에 현재 상태를 대입
        slideImageOrder = `${order}/0${imageLength}`;

        // 이미지 슬라이드 리모컨의 텍스트를 slideImageOrder 변수의 값으로 변경
        $imageSlideRemote.children().first().text(slideImageOrder);
    }

    // 이미지 슬라이드 기능
    function slideImage(direction) {
        // 만약 이미지 슬라이드가 애니메이션 진행 중이라면 함수를 종료
        if($slideImageList.is(':animated')) return;

        // 클릭 후 바로 자동적으로 이미지가 넘어가지 않게 반복되는 슬라이드 기능을 삭제
        clearInterval(slideImageTimerId);

        // 방향이 이전이라면 이전으로 슬라이드
        if(direction === 'Prev') slidePrev($slideImageList, '-100%');
        // 방향이 다음이라면 다음으로 슬라이드
        if(direction === 'Next')  slideNext($slideImageList, '-100%');

        // 현재 $slideImageList에서 진행 중인 애니메이션이 끝날 때까지 기다렸다가
        $slideImageList.promise().done(function() {
            // 슬라이드 종료 후 반복되는 슬라이드 기능을 설정
            slideImageTimerId = setInterval(() => slideNext($slideImageList, '-100%'), duration * 10);

            // 이미지 순서 텍스트 업데이트
            changeOrderNumber();
        });
    }

    // 이전 버튼 클릭 시 이전 슬라이드 이미지를 보여주는 함수를 실행
    $prevImage.on('click', function() { slideImage('Prev'); });
    // 재생, 정지 버튼 클릭 시 playState() 함수 실행
    $imageSlidePlayState.on('click', function() { playState('image', $(this), slideImageTimerId, $slideImageList, '-100%'); });
    // 다음 버튼 클릭 시 다음 슬라이드 이미지를 보여주는 함수를 실행
    $nextImage.on('click', function() { slideImage('Next'); });

    // 전체보기 버튼 클릭 시 오버레이 배경을 나타낸 후 이미지 박스를 나타낸다
    $allImageOverlayButton.on('click', function() { $allImageOverlay.fadeIn(duration, function() { $overlayImageBox.fadeIn(duration) }); });
    // 오버레이 닫기 버튼 클릭 시 이미지 박스를 사라지게 하고 오버레이 배경을 사라지게 한다
    $closeOverlay.on('click', function() { $overlayImageBox.fadeOut(duration, function() { $allImageOverlay.fadeOut(duration) }); });
    // 이미지 박스를 제외한 오버레이 배경 클릭 시 이미지 박스를 사라지게 하고 오버레이 배경을 사라지게 한다
    $allImageOverlay.on('click', function() { $overlayImageBox.fadeOut(duration, function() { $allImageOverlay.fadeOut(duration) }); });

    // 이미지 박스 클릭 시 오버레이 배경 클릭 이벤트 발생 방지
    $overlayImageBox.on('click', function(event) { event.stopPropagation(); });

    // ------------------------------

    // 자주찾는 서비스

    // 자주 찾는 서비스 메뉴 목록들
    const $serviceMenuList = $('.serviceMenuList');

    // 매개 변수 data에 json 정보를 넣어 함수를 실행
    $.getJSON('js/자주찾는서비스.json', function(data) {
        // 모든 서비스 메뉴 목록들에 대해 실행
        $serviceMenuList.each(function(index, list) {
            // 메뉴들을 담기 위한 serviceMenu 변수
            // 메뉴 목록들의 순서에 맞게 json의 객체를 순회하며 HTML 문자열을 생성
            const serviceMenu = data[index].menu.map(menu =>
                `<li><a href="#${menu.address}">
                    <div><img class="center" src="./img/Home/자주찾는 서비스/${data[index].tab}/${menu.address}.png" alt="${menu.address}"></div>
                    <p>${menu.name}</p>
                </a></li>`
            ).join(''); // 생성된 문자열을 공백 없이 하나의 문자열로 통합

            // 만들어진 HTML 문자열을 메뉴 목록에 추가
            $(list).html(serviceMenu);
        });

        // 변수 선언
        const $serviceTabMenu = $('#serviceTab > li');              // 탭 메뉴들
        const $firstServiceMenuList = $serviceMenuList.first();     // 첫 번째 서비스 메뉴 목록
        const $serviceButton = $('#serviceBox > button');           // 모든 버튼
        const $prevService = $('#serviceBox > button:first-child'); // 이전 버튼
        const $nextService = $('#serviceBox > button:last-child');  // 이전 버튼

        // 탭 메뉴 클릭 시
        $serviceTabMenu.on('click', function() {
            // 만약 클릭한 탭 메뉴가 on 클래스를 가지고 있다면 함수를 종료
            if($(this).hasClass('on')) return;

            // 클릭한 탭 메뉴의 인덱스를 저장
            const index = $(this).index();

            // 첫 번째 탭 클릭 시 이전, 다음 버튼을 보이게 하고
            // 두 번째, 세 번째 탭 클릭 시 이전, 다음 버튼을 보이지 않게 한다
            if(index === 0) $serviceButton.css('visibility', 'visible');
            else if(index === 1 || index === 2) $serviceButton.css('visibility', 'hidden');

            // 클릭한 탭 메뉴에 on 클래스를 추가, 클릭한 탭 메뉴의 형제 요소들의 on 클래스 제거
            $(this).addClass('on').siblings().removeClass('on');

            // 클릭한 탭 메뉴 인덱스에 맞는 서비스 메뉴 목록을 표시
            $serviceMenuList.eq(index).removeClass('none').siblings().addClass('none');
        });

        // 이전 버튼 클릭 시
        $prevService.on('click', function() {
            // 첫 번째 서비스 메뉴 목록이 애니메이션 중이라면 함수를 종료
            if($firstServiceMenuList.is(':animated')) return;

            // 이전 서비스 메뉴를 보여줌
            slidePrev($firstServiceMenuList, '-150px');
        });

        // 다음 버튼 클릭 시
        $nextService.on('click', function() {
            // 첫 번째 서비스 메뉴 목록이 애니메이션 중이라면 함수를 종료
            if($firstServiceMenuList.is(':animated')) return;

            // 다음 서비스 메뉴를 보여줌
            slideNext($firstServiceMenuList, '-150px');
        });
    });

    // ------------------------------

    // 알림판

    // 변수 선언
    const $firstPostBox = $('#firstPostBox');           // 첫 번째 게시글 박스의 전체 카테고리에 대한 게시글 목록
    const $secondPostBox = $('#secondPostBox');         // 두 번째 게시글 박스의 전체 카테고리에 대한 게시글 목록
    const $firstNotiTab = $('#firstNotiTab > li');      // 첫 번째 게시글 박스의 탭들
    const $secondNotiTab = $('#secondNotiTab > li');    // 두 번째 게시글 박스의 탭들

    // 매개 변수 data에 json 정보를 넣어 함수를 실행
    $.getJSON('js/Notification.json', function(data) {
        // 한 카테고리에 대한 게시글 목록을 만들어주는 함수
        function post(dataType) {
            return dataType.map(dataType =>
                `<li>
                    <ul class="postList flex fJustifyBetween fDirectionColumn">
                        ${dataType.title.map((title, i) =>
                            `<li><a class="flex fJustifyBetween" href="#게시글">
                                <p>${title}</p>
                                <p>${dataType.date[i]}</p>
                            </a></li>`
                        ).join('')}
                    </ul>
                </li>`
            ).join('');
        }

        // 탭 메뉴 클릭 시 해당 게시글들을 보여주는 함수
        function clickTab(data) {
            // on 클래스를 가진 탭 메뉴를 클릭하면 함수를 종료
            if(data.hasClass('on')) return;

            // 클릭한 항목의 인덱스를 저장
            const index = data.index();

            // 클릭한 항목에 on 클래스를 부여하고 다른 항목의 on 클래스를 제거
            // 클릭한 항목의 부모 요소의 다음 형제 요소의 자식 요소(게시글 목록)의 on 클래스를 제거 후
            // 클릭한 항목의 인덱스 번째의 자식 요소에 on 클래스 추가
            data.addClass('on').siblings().removeClass('on').parent().next()
                .children('li').removeClass('on').eq(index).addClass('on');
        }

        // 변수 선언
        const firstData = data.filter(item => item.order === "first");      // data의 객체의 order 속성 값이 "first"인 경우
        const secondData = data.filter(item => item.order === "second");    // data의 객체의 order 속성 값이 "second"인 경우
        const firstPost = post(firstData);                                  // post 함수로 첫 번째 박스에 있는 탭들에 대해 게시글 목록을 생성
        const secondPost = post(secondData);                                // post 함수로 두 번째 박스에 있는 탭들에 대해 게시글 목록을 생성

        // 완성된 HTML을 전체 카테고리에 대한 게시글 목록에 추가
        $firstPostBox.html(firstPost);
        $secondPostBox.html(secondPost);

        // 각 박스의 첫 번째 탭의 게시글 목록에 on 클래스 추가
        $firstNotiTab.parent().next().children('li').first().addClass('on');
        $secondNotiTab.parent().next().children('li').first().addClass('on');

        // 탭 메뉴를 클릭하면 clickTab() 함수를 실행
        $firstNotiTab.on('click', function() { clickTab($(this)) });
        $secondNotiTab.on('click', function() { clickTab($(this)) });
    });

    // ------------------------------

    // 배너모음
    
    // 배너모음의 배너 텍스트들을 담을 목록
    const $bannerTextList = $('#bannerTextList');

    // 매개 변수 data에 json 정보를 넣어 함수를 실행
    $.getJSON('js/배너모음.json', function(data) {
        // 배너 텍스트들을 담기 위한 변수 bannerText
        const bannerText = data.banner.map(text =>
            `<li class="flex fAlignCenter"><a href="#배너모음텍스트">${text}</a></li>`
        ).join('');

        // 완성된 HTML 문자열을 배너 텍스트 목록에 추가
        $bannerTextList.html(bannerText);

        // 변수 선언
        const $prevBanner = $('#bannerRemote > li:first-child');            // 이전 버튼
        const $BannerSlidePlayState = $('#bannerRemote > li:nth-child(2)'); // 재생, 정지 버튼
        const $nextBanner = $('#bannerRemote > li:last-child');             // 다음 버튼

        // 5초 마다 slideNext() 함수를 실행, 타이머 아이디를 slideImageTimerId에 대입
        let slideBannerTimerId = setInterval(() => slideNext($bannerTextList, '-204px'), duration * 10);

        // 배너 슬라이드 기능
        function slideBanner(direction) {
            // 만약 배너 슬라이드가 애니메이션 중이라면 함수를 종료
            if($bannerTextList.is(':animated')) return;

            // 클릭 후 바로 자동적으로 배너가 넘어가지 않게 반복되는 슬라이드 기능을 삭제
            clearInterval(slideBannerTimerId);

            // 방향이 이전이라면 이전으로 슬라이드
            if(direction === 'Prev') slidePrev($bannerTextList, '-204px');
            // 방향이 다음이라면 다음으로 슬라이드
            if(direction === 'Next')  slideNext($bannerTextList, '-204px');

            // 현재 $bannerTextList에서 진행 중인 애니메이션이 끝날 때까지 기다렸다가
            $bannerTextList.promise().done(function() {
                // 슬라이드 종료 후 반복되는 슬라이드 기능을 설정
                slideBannerTimerId = setInterval(() => slideNext($bannerTextList, '-204px'), duration * 10);
            });
        }

        // 이전 버튼 클릭 시 이전 배너를 보여주는 함수를 실행
        $prevBanner.on('click', function() { slideBanner('Prev'); });
        // 재생, 정지 버튼 클릭 시 playState() 함수 실행
        $BannerSlidePlayState.on('click', function() { playState('banner', $(this), slideBannerTimerId, $bannerTextList, '-204px'); });
        // 다음 버튼 클릭 시 다음 배너를 보여주는 함수를 실행
        $nextBanner.on('click', function() { slideBanner('Next'); });
    });
});