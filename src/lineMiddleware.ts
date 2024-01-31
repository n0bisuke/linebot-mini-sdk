const signatureValidation = async (xLineSignature: string, channelSecret: string, body: string) => {
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(body);
        const key = await crypto.subtle.importKey('raw', encoder.encode(channelSecret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
        const signature = await crypto.subtle.sign('HMAC', key, data);
        return xLineSignature === btoa(String.fromCharCode(...new Uint8Array(signature)));
    } catch (error) {
        throw new Error(String(error));
    };
}

// export async function middleware(c: any, next: any) {
//     // console.log('line middleware');
//     const bodyStr = JSON.stringify(await c.req.json());
//     const channelSecret = c.env.channelSecret;

//     // console.log(bodyStr, c.req.header('x-line-signature'), channelSecret);

//     if (!await signatureValidation(await c.req.header('x-line-signature'), channelSecret, bodyStr)) {
//         return new Response('Invalid signature', { status: 401 });
//     }

//     // console.log(`OK`);
//     return next();    
// }
// export signatureValidation;

export async function middleware(c: any, next: any) {
    // console.log('line middleware');
    const bodyStr = JSON.stringify(await c.req.json());
    const channelSecret = c.env.channelSecret;

    // console.log(bodyStr, c.req.header('x-line-signature'), channelSecret);

    if (!await signatureValidation(await c.req.header('x-line-signature'), channelSecret, bodyStr)) {
        return new Response('Invalid signature', { status: 401 });
    }

    // console.log(`OK`);
    return next();    
}