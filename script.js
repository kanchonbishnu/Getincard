

const OBJECT_APP = '#app';
const ELEMENT_TEXTAREA = 'textarea';
const ELEMENT_INPUT = 'input';
const OBJECT_THEME = '.theme';
const ATTRIBUTE_COUNTER = 'counter';
const ATTRIBUTE_SELECTED = 'selected';





$(function () {



    /* FORM COUNTER FUNCTIONALITY */

    $(OBJECT_APP).on('input change cut paste', ELEMENT_INPUT + '.' + ATTRIBUTE_COUNTER + ', ' + ELEMENT_TEXTAREA + '.' + ATTRIBUTE_COUNTER, function () {

        set_counter($(this));

    });



    /* SHOW AND HIDE PASSWORD TEXT */

    $(OBJECT_APP).on('click', '.password-visible-toggle', function () {

        var type = $(this).parent().find('input').attr('type');
        var input = $(this).parent().find('input');
        input.attr('type', type === 'password' ? 'text' : 'password');
        $(this).attr('src', type === 'password' ? '/icons/visible-off.svg' : '/icons/visible.svg');
    });



    /* OPEN AND CLOSE ADDRESS FORM */

    $(OBJECT_APP).on('click', '#address-closed', function () {

        $(this).css('display', 'none');
        $('#address-wrap').css('display', 'block');
    });

    $(OBJECT_APP).on('click', '.address-expand-close', function () {

        var wrap = $('#address-wrap');
        var closed = $('#address-closed');
        var input = closed.find('input');
        var address = $('#number')[0].value.length > 0 || $('#street')[0].value.length > 0 || $('#postcode')[0].value.length > 0 || $('#city')[0].value.length > 0 || $('#country')[0].value.length > 0 ?
            $('#street')[0].value + ' ' + $('#number')[0].value + ' ' + $('#postcode')[0].value + ' ' + $('#city')[0].value + ', ' + $('#country')[0].value : 'Tap to expand';

        wrap.css('display', 'none');
        closed.css('display', 'block');
        input.attr('placeholder', address);
    });



    /* SHOW AND HIDE LINK SCROLL BUTTONS */

    $(OBJECT_APP).on('mouseenter', '.links-wrap', function () {

        var links = $('.links');
        var scroll_position = links.scrollLeft();
        var scroll_width = links.prop("scrollWidth");

        if (scroll_position > 0) {

            $('#button-links-left').show();

        }

        if (scroll_width - scroll_position - 10 > links.outerWidth()) {

            $('#button-links-right').show();

        }
    });

    $(OBJECT_APP).on('mouseleave', '.links-wrap', function () {

        var scroll_position = $('.links').prop("scrollWidth");

        $('#button-links-left, #button-links-right').hide();

    });



    /* THEME SELECTOR */

    $(OBJECT_APP).on('click', OBJECT_THEME, function () {

        $(OBJECT_THEME).removeClass(ATTRIBUTE_SELECTED);
        $(this).addClass(ATTRIBUTE_SELECTED);
        $('#theme')[0].value = $(this).attr('id');
    });



});





function link_up(id) {

    var link_container = $('#link_' + id + '_container');
    var link_position = $('#link_' + id + '_position');
    var position = link_position[0].value;

    if (position > 1) {

        var link_position_prev = link_container.prev().children().eq(2);
        link_position[0].value = parseInt(link_position[0].value) - 1;
        link_position_prev[0].value = parseInt(link_position_prev[0].value) + 1;
        link_container.prev().insertAfter(link_container);
    }
}



function link_down(id) {

    var link_container = $('#link_' + id + '_container');
    var link_position = $('#link_' + id + '_position');
    var position = link_position[0].value;
    var count = $('#links').children().length;

    if (position < count) {

        var link_position_next = link_container.next().children().eq(2);
        link_position[0].value = parseInt(link_position[0].value) + 1;
        link_position_next[0].value = parseInt(link_position_next[0].value) - 1;
        link_container.next().insertBefore(link_container);
    }
}



function link_visible(id) {

    var link_container = $('#link_' + id + '_container');
    var link_visible = $('#link_' + id + '_visible');
    var visible = link_visible[0].value == 1;
    link_visible[0].value = visible ? 0 : 1;

    var icon_visible = link_container.children().eq(4).children().eq(2);
    icon_visible.attr('src', '/icons/' + (visible ? 'visible-off.svg' : 'visible.svg'));
}



function link_delete(id) {

    var link_container = $('#link_' + id + '_container');
    var link_position = $('#link_' + id + '_position');
    var link_type = $('#link_' + id)[0].value;
    var position = link_position[0].value;
    var links = $('#links');
    var count = links.children().length;

    for (let i = position; i < count; i++) {

        var current_link_position = links.children().eq(i).children().eq(2);
        current_link_position[0].value = parseInt(current_link_position[0].value) - 1;
    }

    link_container.remove();
    $('.modal .link#' + link_type).removeClass("unavailable");
}



function link_add_open() {

    $("#modal-link").css("display", "block");

}



function link_add_close() {

    $("#modal-link").css("display", "none");

}



function link_add_pick(type) {

    var links = $('#links');
    var position = links.children().length + 1;

    $.ajax({
        url: '/load/link/' + type + '/' + position,
        success: function (data) { links.append(data); }
    });

    link_add_close();

    $('.modal .link#' + type).addClass("unavailable");
}



function links_left() {

    var links = $('.links');

    links.animate({ scrollLeft: 0 }, 300);
    $('#button-links-left').hide();
    $('#button-links-right').show();
}



function links_right() {

    var links = $('.links');

    links.animate({ scrollLeft: links.prop("scrollWidth") }, 600);
    $('#button-links-left').show();
    $('#button-links-right').hide();
}



function set_counter(input) {

    var counter = input.parent().parent().find('.input-counter')[0];
    var maxlength = input.attr('maxlength');
    counter.innerHTML = input[0].value.length + (maxlength ? '/' + maxlength : '');
}





/* Add CSRF token to Ajax POST: */

$.ajaxSetup({ headers: { "X-CSRF-TOKEN": $('meta[name="_token"]').attr('content') } });





/* Auto resize textarea elements */

$(OBJECT_APP).on('input change cut paste', ELEMENT_TEXTAREA, function () {

    $(this).css("height", "unset");

    let height = $(this).prop('scrollHeight');
    let height_min = 18;

    if (height > height_min) {

        $(this).css("height", height + "px");

    }
});
