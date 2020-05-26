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
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(commandInput.val()),
        success: logResponse,
        error: e => console.log('error: ', e),

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
    })
}

function logResponse(response) {
    console.log('what the fukk are those answers? ', response);
    saveCommand(commandInput.val());
    terminalOutput += prefixElem[0].outerHTML + ' ' + htmlEncode(commandInput.val()) + '<br/>';
    terminalOutput += '> ' + response + '<br/>';
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
        return saved[saved.length -1 - position];
    }
    return '';
}