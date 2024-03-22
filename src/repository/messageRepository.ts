export class MessageRepository {
    private readonly headers = {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: 'Bearer ' + PropertiesService.getScriptProperties().getProperty('ACCESS_TOKEN')
    };

    broadcast(text: string) {
        const postData = this.createPostData(text);
        const options = this.createOptions(postData);
        return UrlFetchApp.fetch('https://api.line.me/v2/bot/message/broadcast', options);
    }

    push(text: string) {
        const postData = this.createPostData(text);
        const options = this.createOptions(postData);
        return UrlFetchApp.fetch('https://api.line.me/v2/bot/message/push', options);
    }

    private createPostData(text: string): object {
        return {
            to: PropertiesService.getScriptProperties().getProperty('TO'),
            messages: [{ type: 'text', text: text }]
        };
    }

    private createOptions(payload: object): GoogleAppsScript.URL_Fetch.URLFetchRequestOptions {
        return {
            method: 'post',
            headers: this.headers,
            payload: JSON.stringify(payload)
        };
    }
}
