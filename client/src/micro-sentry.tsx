import { BrowserMicroSentryClient } from '@micro-sentry/browser';

const client = new BrowserMicroSentryClient({
  dsn: import.meta.env.VITE_SENTRY_DSN,
});

export default client;
