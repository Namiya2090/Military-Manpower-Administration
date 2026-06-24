$(function() {
    // 주요 누리집 바로가기 목록
    const $mainWebsiteList = $('#mainWebSiteList');

    // 매개 변수 data에 json 정보를 넣어 함수를 실행
    $.getJSON('js/주요누리집바로가기.json', function(data) {
        // 주요 누리집 항목들을 담을 변수
        const mainWebSiteMenu = data.menu.map(menu =>
            `<li><a href="#${menu.address}">${menu.text}</a></li>`
        ).join('');

        // 완성된 HTMl을 주요 누리집 바로가기 목록에 삽입
        $mainWebsiteList.html(mainWebSiteMenu);
    });

    // --------------------------

    // 만족도 조사 체크리스트 클릭
    const $radio = $('#radioList > label > input');

    $radio.on('click', function() {
        // 현재 클릭된 라디오 버튼의 이전 상태
        const wasChecked = $(this).data('was-checked');

        // 다른 형제 라디오 버튼들의 'was-checked' 값을 초기화
        $(this).parent().siblings().children().data('was-checked', false);

        // 이미 체크되어 있었다면 해제, 체크되어 있지 않았다면 체크
        if (wasChecked) $(this).prop('checked', false).data('was-checked', false);
        else $(this).prop('checked', true).data('was-checked', true);
    });
});