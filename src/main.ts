function send(text, isDebug = false) {
    const url = isDebug ? "https://api.line.me/v2/bot/message/push" : "https://api.line.me/v2/bot/message/broadcast";

    const headers = {
        "Content-Type": "application/json; charset=UTF-8",
        'Authorization': 'Bearer ' + PropertiesService.getScriptProperties().getProperty('ACCESS_TOKEN'),
    };

    const postData = {
        "to": PropertiesService.getScriptProperties().getProperty('TO'),
        "messages": [{'type': 'text', 'text': text}]
    };

    const options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
        "method": "post",
        "headers": headers,
        "payload": JSON.stringify(postData)
    };

    return UrlFetchApp.fetch(url, options);
}

function createMessage() {
    setTrigger();
    const msg = getMsg(new Date());
    if (msg != null) return send(msg);
}

function debug() {
    const msg = getMsg(new Date());
    if (msg != null) return send(msg, true);
}

export function getMsg(today: Date): String {
    // 記念日
    const firstDay = new Date("2014/05/25");
    const diffDateString = getDiffYM(firstDay, today)
    if (diffDateString == null) return null;
    return `今日は${diffDateString}記念日です！`;
}

function getDiffYM(from: Date, to: Date): string | null {
    // 記念日と同日以外NG
    if (to.getDate() != from.getDate()) return null;

    // N年記念日
    if (to.getMonth() == from.getMonth()) return `${to.getFullYear() - from.getFullYear()}年`;

    // N年Nヶ月記念日
    const diffY = to.getFullYear() - from.getFullYear();
    const diffM = to.getMonth() - from.getMonth();

    const month = diffM < 0 ? `${12 + diffM}ヶ月` : `${diffM}ヶ月`
    if (diffY == 0 || (diffY == 1 && diffM < 0)) return `${month}`
    else return `${diffY}年${month}`;
}

/**
 * 翌日の0時に再実行するトリガーを生成する
 */
function setTrigger(): void {
    ScriptApp.newTrigger('createMessage')
        .timeBased()
        .at(getNextDay(new Date()))
        .create();
}

/**
 * 入力した日付の翌日のDateオブジェクトを返却します
 * @param origin
 * @returns
 */
export function getNextDay(origin: Date): Date {
    const setTime: Date = new Date(origin.getTime());
    setTime.setDate(setTime.getDate() + 1)
    setTime.setHours(0);
    setTime.setMinutes(0);
    return setTime
}