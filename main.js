var access_token = scriptProperties.getProperty('ACCESS_TOKEN');
var to = scriptProperties.getProperty('TO');

function doPost() {
  var reply = getMsg(true);
  if (reply != null) return send(getMsg(true));
}

function createMessage() {
  setTrigger();
  var msg = getMsg(false);
  if (msg != null) return send(getMsg(false));
}

function debug() {
  var msg = getMsg(false);
  if (msg != null) return send(getMsg(false), true);
}

function send(text, isDebug) {
  var url = isDebug ? "https://api.line.me/v2/bot/message/push" : "https://api.line.me/v2/bot/message/broadcast";
  var headers = {
    "Content-Type" : "application/json; charset=UTF-8",
    'Authorization': 'Bearer ' + access_token,
  };

  var postData = {
    "to" : to,
    "messages" : [
      {
        'type':'text',
        'text':text,
      }
    ]
  };

  var options = {
    "method" : "post",
    "headers" : headers,
    "payload" : JSON.stringify(postData)
  };

  return UrlFetchApp.fetch(url, options);
}

function getMsg(isReply){
  //indexファイルのオブジェクト
  var html = HtmlService.createTemplateFromFile('index');
  var firstDay = new Date(Date.parse("2014/05/25"));
  var tmp = new Date();
  var todayStr = tmp.getFullYear() + "/" + (tmp.getMonth()+1) + "/" + tmp.getDate();
  var today = new Date(Date.parse(todayStr));
    
  var diff = today - firstDay;
  var dayCount = diff / 86400000;
  var diffY = dateDiff(firstDay, today, 'Y', false); 
  var diffM = dateDiff(firstDay, today, 'YM', false);
  var diffD = dateDiff(firstDay, today, 'MD', false);
  if (diffM == 0 && diffD == 0) {
    var dayDisp = diffY + "年";
    return  "今日は" + dayDisp + "記念日です！";
  }
  if (diffD == 0) {
    var dayDisp = diffY + "年" + diffM + "ヶ月";
    return  "今日は" + dayDisp + "記念日です！";
  }
  if (isReply) {
    var dayDisp = diffY + "年" + diffM + "ヶ月" + diffD + "日";
    return  "今日は付き合ってから" + dayDisp + "日です！";
  } else return null;
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
function dateDiff(dt1, dt2, u, f) {
  if (typeof dt2 == 'undefined') dt2 = new Date;
  if (f) dt1 = dateAdd(dt1, -1, 'D');
  var y1 = dt1.getFullYear();
  var m1 = dt1.getMonth();
  var y2 = dt2.getFullYear();
  var m2 = dt2.getMonth();
  var dt3, r = 0;
  if (typeof u == 'undefined' || u == 'D') {
    r = parseInt((dt2-dt1)/(24*3600*1000));
  } else if (u == 'M') {
    r = (y2 * 12 + m2) - (y1 * 12 + m1);
    dt3 = dateAdd(dt1, r, 'M');
    if (dateDiff(dt3, dt2, 'D') < 0) --r;
  } else if (u == 'Y') {
    r = parseInt(dateDiff(dt1, dt2, 'M') / 12);
  } else if (u == 'YM') {
    r = dateDiff(dt1, dt2, 'M') % 12;
  } else if (u == 'MD') {
    r = dateDiff(dt1, dt2, 'M');
    dt3 = dateAdd(dt1, r, 'M');
    r = dateDiff(dt3, dt2, 'D');
  } else if (u == 'YD') {
    r = dateDiff(dt1, dt2, 'Y');
    dt3 = dateAdd(dt1, r*12, 'M');
    r = dateDiff(dt3, dt2, 'D');
  }
  return r;
};

function dateAdd(dt, dd, u) {
  var y = dt.getFullYear();
  var m = dt.getMonth();
  var d = dt.getDate();
  var r = new Date(y, m, d);
  if (typeof u == 'undefined' || u == 'D') {
    r.setDate(d + dd);
  } else if (u == 'M') {
    m += dd;
    y += parseInt(m/12);
    m %= 12;
    var e = (new Date(y, m+1, 0)).getDate();
    r.setFullYear(y, m, (d > e ? e : d));
  }
  return r;
};

function setTrigger() {
 var setTime = new Date();
  setTime.setDate(setTime.getDate() + 1)
  setTime.setHours(00);
  setTime.setMinutes(00); 
  ScriptApp.newTrigger('createMessage').timeBased().at(setTime).create();  
}