const COMMENT_SHEET_NAME = 'Comments';

function doGet(e) {
    const page = getPageFromEvent(e);
    if (page === 'comment') {
        return renderTemplate('pages/comment');
    }

    return renderTemplate('pages/display');
}

function doPost(e) {
    const page = getPageFromEvent(e);
    if (page !== 'comment') {
        return HtmlService.createHtmlOutput('Unsupported POST route.');
    }

    // only /comment route can do POST

    const name = (e.parameter.name || '').trim();
    const comment = (e.parameter.comment || '').trim();

    if (!comment) return renderTemplate('pages/comment', {
        successMessage: '',
        errorMessage: 'Please enter a comment before submitting.'
    });

    saveComment(name || 'Anonymous', comment);

    return renderTemplate('pages/comment', {
        successMessage: 'Thank you! Your comment has been posted.',
        errorMessage: ''
    });
}

function getPageFromEvent(e) {
    if (!e) return 'display';

    var page = (e.parameter && e.parameter.page) || '';
    if (!page && e.pathInfo) {
        page = e.pathInfo.replace(/^\/+/, '');
    }
    return (page || 'display').toString().toLowerCase();
}

function renderTemplate(fileName, data) {
    var template = HtmlService.createTemplateFromFile(fileName);
    for (var key in data) {
        if (data.hasOwnProperty(key)) {
            template[key] = data[key];
        }
    }
    return template.evaluate()
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1')
        .setTitle('Fermata');
}

function getComments() {
    var sheet = getSheet();
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return [];

    var rows = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
    rows.reverse();

    return rows.map(row => ({
        timestamp: formatRelativeTime(row[0]),
        utc: getAbsoluteTime(row[0]),
        name: row[1] || 'Anonymous',
        comment: row[2] || ''
    }));
}

function saveComment(name, comment) {
    var sheet = getSheet();
    sheet.appendRow([new Date(), name, comment]);
}

function getSheet() {
    var properties = PropertiesService.getScriptProperties();
    var spreadsheetId = properties.getProperty('SPREADSHEET_ID');
    var spreadsheet;

    if (spreadsheetId) {
        try {
            spreadsheet = SpreadsheetApp.openById(spreadsheetId);
        } catch (error) {
            spreadsheetId = null;
        }
    }

    if (!spreadsheetId) {
        spreadsheet = SpreadsheetApp.create('Comment Wall Database');
        spreadsheetId = spreadsheet.getId();
        properties.setProperty('SPREADSHEET_ID', spreadsheetId);
    }

    var sheet = spreadsheet.getSheetByName(COMMENT_SHEET_NAME);
    if (!sheet) {
        sheet = spreadsheet.insertSheet(COMMENT_SHEET_NAME);
        sheet.appendRow(['Timestamp', 'Name', 'Comment']);
    }

    return sheet;
}

function formatTimestamp(value) {
    if (!(value instanceof Date)) return '';
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm');
}

function getAbsoluteTime(value) {
    if (!(value instanceof Date)) return '';
    return value.getUTCMilliseconds();
}

function formatRelativeTime(value) {
    if (!(value instanceof Date)) return '';
    const diff = Date.now() - value.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (seconds < 60) return "剛剛";
    if (minutes < 60) return `${minutes} 分鐘前`;
    if (hours < 24) return `${hours} 小時前`;
    if (days < 7) return `${days} 天前`;
    return `${weeks} 週前`;
}

function getWebAppUrl() {
    try {
        return ScriptApp.getService().getUrl();
    } catch (error) {
        return '';
    }
}
