


## sample

```
$ npm i hono linebot-mini-sdk
```

```ts
import { Hono } from 'hono'
import line from 'linebot-mini-sdk'
const app = new Hono()

let client: any;
let isAlreadyInited = false;

app.all('*', async(c:any, next) => {
	if(!isAlreadyInited){
		isAlreadyInited = true
    const config = {
      channelAccessToken: c.env.channelAccessToken || undefined,
      channelSecret: c.env.channelSecret || undefined ,
    }
    client = new line.MessagingApiClient(config);
	}
	await next()
})

app.get('/', (c) => c.text('Hello Hono!!!!'));

const handleEvent = async (event: any) => {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const message = [{
    type: 'text',
    text: event.message.text
  }];

  try {
    const res = await client.replyMessage(event.replyToken, message);
    const json = await res.json();
    console.log(json);
  } catch (error) {
    console.log(error)
  }
  return Promise.resolve(null);
}

app.post('/webhook', line.middleware, async (c) => {

    try {
      const body = await c.req.json();
      const events: any[] = body.events; // Explicitly define the type of 'events' as 'any[]'
      console.log(events);
      const responses = await Promise.all(events.map((event: any) => handleEvent(event))); // Explicitly define the type of 'event' as 'any'
      console.log(responses[0]);
      return c.json({ message: "ok" });

  } catch (error) {
      console.log(error)
  }

  return c.text('Hello Hono!')
})

export default app

```