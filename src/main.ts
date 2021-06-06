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
    const firstDay = new Date("2014/05/25");
    const diffY = dateDiff(firstDay, today, 'Y');
    const diffM = dateDiff(firstDay, today, 'YM');
    const diffD = dateDiff(firstDay, today, 'MD');
    if (diffM == 0 && diffD == 0) return `今日は${diffY}年記念日です！`;
    if (diffD == 0) return `今日は${diffY}年${diffM}ヶ月記念日です！`;
    return null;
}

/*
 *  経過年・月・日数の計算
 *
 *  dt1: 開始年月日の Date オブジェクト
 *  dt2: 終了年月日の Date オブジェクト
 *    u:  'Y': 経過年数を求める
 *        'M': 経過月数を求める
 *        'D': 経過日数を求める
 *       'YM': 1年に満たない月数
 *       'MD': 1ヶ月に満たない日数
 *       'YD': 1年に満たない日数
 *    f: true: 初日算入
 *      false: 初日不算入
 *
 */
function dateDiff(dt1, dt2, u, f = false): number {
    if (f) dt1 = dateAdd(dt1, -1, 'D');
    const y1 = dt1.getFullYear();
    const m1 = dt1.getMonth();
    const y2 = dt2.getFullYear();
    const m2 = dt2.getMonth();
    let dt3, r = 0;
    if (typeof u == 'undefined' || u == 'D') {
        r = (dt2 - dt1) / (24 * 3600 * 1000);
    } else if (u == 'M') {
        r = (y2 * 12 + m2) - (y1 * 12 + m1);
        dt3 = dateAdd(dt1, r, 'M');
        if (dateDiff(dt3, dt2, 'D') < 0) --r;
    } else if (u == 'Y') {
        r = dateDiff(dt1, dt2, 'M') / 12;
    } else if (u == 'YM') {
        r = dateDiff(dt1, dt2, 'M') % 12;
    } else if (u == 'MD') {
        r = dateDiff(dt1, dt2, 'M');
        dt3 = dateAdd(dt1, r, 'M');
        r = dateDiff(dt3, dt2, 'D');
    } else if (u == 'YD') {
        r = dateDiff(dt1, dt2, 'Y');
        dt3 = dateAdd(dt1, r * 12, 'M');
        r = dateDiff(dt3, dt2, 'D');
    }
    return Math.floor(r);
}

function dateAdd(dt, dd, u) {
    let y = dt.getFullYear();
    let m = dt.getMonth();
    const d = dt.getDate();
    const r = new Date(y, m, d);
    if (typeof u == 'undefined' || u == 'D') {
        r.setDate(d + dd);
    } else if (u == 'M') {
        m += dd;
        y += m / 12;
        m %= 12;
        const e = (new Date(y, m + 1, 0)).getDate();
        r.setFullYear(y, m, (d > e ? e : d));
    }
    return r;
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