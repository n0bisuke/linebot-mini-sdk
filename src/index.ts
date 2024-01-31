import { MessagingApiClient } from './MessagingApiClient';
import { middleware } from './lineMiddleware';

const line = { MessagingApiClient, middleware };
export { line };