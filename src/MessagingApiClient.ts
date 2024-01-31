import {
    MessageAPIResponseBase,
    TextMessage,
    WebhookEvent,
} from "@line/bot-sdk";

interface httpClientConfig {
    baseURL?: string;
    channelAccessToken: string;
    channelSecret?: string;
}

type SendMessageObject = { 
    type: string,
    text: string,
};
const SendMessageObjects: SendMessageObject[] = [];

export class MessagingApiClient {
    private HOST: string;
    private PATH: {
        REPLY: string;
        PUSH: string;
        GROUP: string;
    };
    private CH_SECRET: string;
    private CH_ACCESS_TOKEN: string;

    constructor(config: httpClientConfig){
        console.log('MessagingApiClient constructor!!!!!');
        this.HOST = `api.line.me`;
        this.PATH = {
            REPLY: `/v2/bot/message/reply`,
            PUSH: `/v2/bot/message/push`,
            GROUP: `/v2/bot/group`
        }

        this.CH_SECRET = config.channelAccessToken;
        this.CH_ACCESS_TOKEN = config.channelAccessToken;
    }


    // private httpClient: HTTPClient;

    // constructor(config: httpClientConfig) {
    //   if (!config.baseURL) {
    //     config.baseURL = "https://api.line.me";
    //   }
    //   this.httpClient = new HTTPClient({
    //     defaultHeaders: {
    //       Authorization: "Bearer " + config.channelAccessToken,
    //     },
    //     responseParser: this.parseHTTPResponse.bind(this),
    //     baseURL: config.baseURL,
    //   });
    // }

    async getGroupInfo(groupId: string, CH_ACCESS_TOKEN = this.CH_ACCESS_TOKEN): Promise<Response> {
        try {
            //サマリー
            const API_ENDPOINT = `https://${this.HOST}${this.PATH.GROUP}/${groupId}/summary`;
            const options = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CH_ACCESS_TOKEN}`,
                },
            };
            return fetch(API_ENDPOINT, options);
        } catch (error) {
            throw new Error(String(error));
        };
    }

    async replyMessage(replyToken: string, sendMessageObject: typeof SendMessageObjects, CH_SECRET = this.CH_SECRET, CH_ACCESS_TOKEN = this.CH_ACCESS_TOKEN): Promise<Response> {
        try {
            const API_ENDPOINT = `https://${this.HOST}${this.PATH.REPLY}`;
            const SIGNATURE = await crypto.subtle.importKey('raw', new TextEncoder().encode(CH_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
            const postDataStr = JSON.stringify({ replyToken: replyToken, messages: sendMessageObject });

            return fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'x-line-signature': await SIGNATURE.toString(), // Convert CryptoKey to string
                    'Authorization': `Bearer ${CH_ACCESS_TOKEN}`,
                    'Content-Length': String(new TextEncoder().encode(postDataStr).length) // Convert to string
                },
                body: postDataStr
            });

        } catch (error) {
            throw new Error(String(error));
        };
    }

    async pushMessage(to: string, sendMessageObject: typeof SendMessageObjects, CH_ACCESS_TOKEN = this.CH_ACCESS_TOKEN): Promise<Response> {
        try {
            const API_ENDPOINT = `https://${this.HOST}${this.PATH.PUSH}`;

            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CH_ACCESS_TOKEN}`,
                },
                body: JSON.stringify({ to: to, messages: sendMessageObject })
            };
    
            return fetch(API_ENDPOINT, options);
        } catch (error) {
            throw new Error(String(error));
        };
    }
}