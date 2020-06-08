let terminalOutput = '';
let userPrefix;
const commandInput = $('#command-input');
const prefixElem = $('.command-prefix');

const setActiveNavLink = () => {
    // remove active class and current tag
    $('.nav-link').removeClass('active');
    $('.nav-link:first').html('Simulacie');
    $('.nav-link:last').html('Octave terminal');

    let activeLink;
    const srCurrent = '<span class="sr-only">(current)</span>';
    if (window.location.pathname === '/terminal') {
        // todo remove if this is ever fixed
        showXSSWarning();
        activeLink = $('.nav-link:last');
    } else {
        activeLink = $('.nav-link:first');
    }
    activeLink.append(srCurrent);
    activeLink.addClass('active');
};

$(document).ready(() => {
    setActiveNavLink();
    createUserPrefix();
});

$('#command-form').on('submit', e => {
    e.preventDefault();
    if (isNotSafeInput()) {
        return;
    }
    $.ajax({
        url: `/api/cli?key=${sessionStorage.getItem('apiKey')}`,
        type: 'POST',
        contentType: "text/plain",
        data: commandInput.val(),
        success: (response) => logResponse(response),
        error: e => logResponse(e.responseText, true),
    });
});

$('.terminal-wrapper').on('click', () => {
    commandInput.focus();
});

function createUserPrefix() {
    $.get('/profile', response => {
        userPrefix = `${response.username}@octavia-terminal: $`;
        prefixElem.text(userPrefix);
        commandInput.attr('hidden', false);
        commandInput.focus();
        setUserEmail(response.email);
    })
}

function logResponse(response, isError) {
    saveCommand(commandInput.val());
    terminalOutput += prefixElem[0].outerHTML + ' ' + htmlEncode(commandInput.val()) + '<br/>';

    // to keep consistent line breaks, some commands return them, some don't
    if (!response.endsWith('\n')) {
        response += '\n';
    }
    if (isError) {
        terminalOutput += '> <span class="error-log">' + response + "</span>";
    } else {
        terminalOutput += '> ' + response;
    }
    $('.terminal-output').html(terminalOutput);
    commandInput.val('');
    commandInput[0].scrollIntoView();
}

function isNotSafeInput() {
    const input = commandInput.val();
    if (!input || input === '') {
        return true;
    }
    // todo add some XSS validation
    return false;
}

function htmlEncode(str) {
    return String(str).replace(/[^\w. ]/gi, function (c) {
        return '&#' + c.charCodeAt(0) + ';';
    });
}

let currentCommandPos = -1;
commandInput.on('keydown', e => {
    if (e.keyCode === 38) {
        e.preventDefault();
        commandInput.val(getCommand(++currentCommandPos));
    } else if (e.keyCode === 40) {
        e.preventDefault();
        commandInput.val(getCommand(--currentCommandPos));
    }
});

function saveCommand(command) {
    let current = JSON.parse(localStorage.getItem('usedCommands'));
    if (!current) {
        current = [];
    }
    current.push(command);
    localStorage.setItem('usedCommands', JSON.stringify(current));
}

function getCommand(position) {
    let saved = JSON.parse(localStorage.getItem('usedCommands'));
    if (saved) {
        if (position === saved.length) {
            position = saved.length - 1;
            currentCommandPos = saved.length - 1;
        } else if (position < 0) {
            currentCommandPos = -1;
            return '';
        }
        return saved[saved.length - 1 - position];
    }
    return '';
}

function showXSSWarning() {
    $("#dialog").dialog({
        autoOpen: false
    });
    $('#dialog').dialog('open');
}

function setUserEmail(email) {
    $('#user-email').val(email);
    resizeInput.call(input[0]);
}

$('#mail-form :checkbox').change(e => {
    const target = $(e.target);
    const targetLabel = target.parent();
    const type = target[0].id;
    if (target.is(':checked')) {
        targetLabel.removeClass(`btn-outline-${type === 'pdf' ? 'danger' : 'success'}`);
        targetLabel.addClass(`btn-${type === 'pdf' ? 'danger' : 'success'}`);
    } else {
        targetLabel.removeClass(`btn-${type === 'pdf' ? 'danger' : 'success'}`);
        targetLabel.addClass(`btn-outline-${type === 'pdf' ? 'danger' : 'success'}`);
    }
    if (!$('#pdf').is(':checked') && !$('#csv').is(':checked')) {
        $('#send-mail-btn').prop('disabled', true);
    } else {
        $('#send-mail-btn').prop('disabled', false);
    }
});

$('#mail-form').on('submit', e => {
    e.preventDefault();
    const data = {
        'pdf': $('#pdf').is(':checked'),
        'csv': $('#csv').is(':checked'),
        'email': $('#mail-form :input[type=email]').val()
    };
    $.get(`/mail?key=${sessionStorage.getItem('apiKey')}`, data, response => {
        console.log('success: ', response);
    }).fail(e => {
        console.log('error: ', e);
    })
});

// to scale user email input
let input = $('#user-email');
input.on('input', resizeInput); // bind the "resizeInput" callback on "input" event
resizeInput.call(input[0]); // immediately call the function

function resizeInput() {
    if (window.location.pathname === '/stats') {
        this.style.width = this.value.length + 1 + "ch";
    }
}