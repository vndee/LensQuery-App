/* eslint-disable @typescript-eslint/no-unused-vars */
export type EventType = 'open' | 'message' | 'error' | 'close';

export interface BaseEvent {
  type: string;
}

export interface MessageEvent {
  type: 'message';
  data: string | null;
  lastEventId: string | null;
  url: string;
}

export interface OpenEvent {
  type: 'open';
}

export interface CloseEvent {
  type: 'close';
}

export interface TimeoutEvent {
  type: 'timeout';
}

export interface ErrorEvent {
  type: 'error';
  message: string;
  xhrState: number;
  xhrStatus: number;
}

export interface CustomEvent<E extends string> {
  type: E;
  data: string | null;
  lastEventId: string | null;
  url: string;
}

export interface ExceptionEvent {
  type: 'exception';
  message: string;
  error: Error;
}

export interface EventSourceOptions {
  method?: string;
  timeout?: number;
  headers?: Record<string, any>;
  body?: any;
  debug?: boolean;
  pollingInterval?: number;
  timeoutBeforeConnection?: number;
}

export type EventSourceEvent =
  | MessageEvent
  | OpenEvent
  | CloseEvent
  | TimeoutEvent
  | ErrorEvent
  | ExceptionEvent;

export type EventSourceListener<E extends string = never> = (
  event: CustomEvent<E> | EventSourceEvent,
) => void;

declare class EventSourceType<E extends string = never> {
  constructor(url: URL | string, options?: EventSourceOptions);
  open(): void;
  close(): void;
  addEventListener(type: E | EventType, listener: EventSourceListener<E>): void;
  removeEventListener(
    type: E | EventType,
    listener: EventSourceListener<E>,
  ): void;
  removeAllEventListeners(type?: E | EventType): void;
  dispatch(type: E | EventType, data: E | EventSourceEvent): void;
}

class EventSource {
  ERROR = -1;
  CONNECTING = 0;
  OPEN = 1;
  CLOSED = 2;

  url: string;
  interval: number;
  lastEventId: string | null;
  lastIndexProcessed: number;
  eventType: string | undefined;
  status: number;

  eventHandlers: { [key: string]: Function[] };

  method: string;
  timeout: number;
  headers: { [key: string]: string };
  body?: {};
  debug: boolean;
  timeoutBeforeConnection: number;

  _xhr: XMLHttpRequest;
  _pollTimer: NodeJS.Timeout | null;

  constructor(url: string, options: EventSourceOptions = {}) {
    this.interval = options.pollingInterval || 5000;
    this.lastEventId = null;
    this.lastIndexProcessed = 0;
    this.eventType = undefined;
    this.status = this.CONNECTING;

    this.eventHandlers = {
      open: [],
      message: [],
      error: [],
      close: [],
    };

    this.method = options.method || 'GET';
    this.timeout = options.timeout || 0;
    this.headers = options.headers || {};
    this.body = options.body || undefined;
    this.debug = options.debug || false;
    this.timeoutBeforeConnection = options.timeoutBeforeConnection ?? 500;

    this._xhr = new XMLHttpRequest();
    this._pollTimer = null;

    if (
      !url ||
      (typeof url !== 'string' && typeof (url as any).toString !== 'function')
    ) {
      throw new SyntaxError('[EventSource] Invalid URL argument.');
    }

    if (typeof url.toString === 'function') {
      this.url = url.toString();
    } else {
      this.url = url;
    }

    this._pollAgain(this.timeoutBeforeConnection);
  }

  _pollAgain(time: number) {
    this._pollTimer = setTimeout(() => {
      this.open();
    }, time);
  }

  getResponseText(xhr: XMLHttpRequest) {
    let response = '';
    const resp = xhr?.responseText.trim().split('\n');
    for (let line of resp) {
      line = line.trim();
      if (line && line === 'data: [DONE]') {
        // close connection
        console.log('[EventSource][onreadystatechange] DONE', response);

        this.dispatch('done', { type: 'done', data: response });
        this.close();
        return;
      } else if (line && line.startsWith('data: ')) {
        const str = line.replace('data: ', '');
        // convert str to json object
        try {
          const data = JSON.parse(str).choices[0].delta;
          if ('content' in data) {
            response = response + data.content;
          }
        } catch (error) {
          console.error(
            '[EventSource][onreadystatechange] Error parsing json',
            error,
          );
        }
      }
    }
    return response;
  }

  open() {
    try {
      this.lastIndexProcessed = 0;
      this.status = this.CONNECTING;

      this._xhr = new XMLHttpRequest();
      this._xhr.open(this.method, this.url, true);

      if (this.headers) {
        for (const [key, value] of Object.entries(this.headers)) {
          this._xhr.setRequestHeader(key, value);
        }
      }

      this._xhr.setRequestHeader('Accept', 'text/event-stream');
      this._xhr.setRequestHeader('Cache-Control', 'no-cache');
      this._xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

      if (this.lastEventId !== null) {
        this._xhr.setRequestHeader('Last-Event-ID', this.lastEventId);
      }

      this._xhr.timeout = this.timeout;

      this._xhr.onreadystatechange = () => {
        const xhr = this._xhr;

        if (this.debug) {
          console.debug(
            `[EventSource][onreadystatechange] ReadyState: ${xhr.readyState}, status: ${xhr.status}, content: ${xhr.responseText}`,
          );
        }

        if (xhr.status === 200) {
          if (xhr?.responseText.trim() !== '') {
            const response = this.getResponseText(xhr);
            this.dispatch('message', { type: 'message', data: response });
          }
        }

        if (
          ![XMLHttpRequest.DONE, XMLHttpRequest.LOADING].includes(
            // @ts-ignore
            xhr.readyState,
          )
        ) {
          return;
        }

        if (xhr.status >= 200 && xhr.status < 400) {
          if (this.status === this.CONNECTING) {
            this.status = this.OPEN;
            this.dispatch('open', { type: 'open' });
          }

          // this._handleEvent(xhr.responseText || '');

          if (xhr.readyState === XMLHttpRequest.DONE) {
            if (this.debug) {
              console.debug(
                '[EventSource][onreadystatechange][DONE] Operation done. Closing...',
              );
            }
            const response = this.getResponseText(xhr);
            console.log(
              '[EventSource][onreadystatechange][DONE] response',
              response,
            );
            this.dispatch('done', { type: 'done', data: response });
            this.close();
            // this._pollAgain(this.interval);
          }
        } else if (this.status !== this.CLOSED) {
          if (this._xhr.status !== 0) {
            this.dispatch('error', {
              type: 'error',
              message: xhr.responseText,
              xhrStatus: xhr.status,
              xhrState: xhr.readyState,
            });
          }

          if (
            [XMLHttpRequest.DONE, XMLHttpRequest.UNSENT].includes(
              // @ts-ignore
              xhr.readyState,
            )
          ) {
            if (this.debug) {
              console.debug(
                '[EventSource][onreadystatechange][ERROR] Response status error. Reconnecting...',
              );
            }
            // this._pollAgain(this.interval);
          }
        }
      };

      this._xhr.onerror = () => {
        this.status === this.ERROR;

        this.dispatch('error', {
          type: 'error',
          message: this._xhr.responseText,
          xhrStatus: this._xhr.status,
          xhrState: this._xhr.readyState,
        });
      };

      if (this.body) {
        this._xhr.send(this.body);
      } else {
        this._xhr.send();
      }

      if (this.timeout > 0) {
        setTimeout(() => {
          if (this._xhr.readyState === XMLHttpRequest.LOADING) {
            this.dispatch('error', {
              type: 'timeout',
            });

            this.close();
          }
        }, this.timeout);
      }

      this._xhr.onabort = () => {
        this.status = this.CLOSED;
        this.dispatch('close', { type: 'close' });
        console.log('abort XHR');
      };
    } catch (e) {
      this.status = this.ERROR;
      this.dispatch('error', {
        type: 'exception',
        // @ts-ignore
        message: e.message,
        error: e,
      });
    }
  }

  _handleEvent(response: string) {
    const parts = response.substr(this.lastIndexProcessed).split('\n');
    this.lastIndexProcessed = response.lastIndexOf('\n\n') + 2;
    let data = [];
    let retry = 0;
    let line = '';

    for (let i = 0; i < parts.length; i++) {
      line = parts[i].replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, '');
      if (line.indexOf('event') === 0) {
        this.eventType = line.replace(/event:?\s*/, '');
      } else if (line.indexOf('retry') === 0) {
        retry = parseInt(line.replace(/retry:?\s*/, ''), 10);
        if (!isNaN(retry)) {
          this.interval = retry;
        }
      } else if (line.indexOf('data') === 0) {
        data.push(line.replace(/data:?\s*/, ''));
      } else if (line.indexOf('id:') === 0) {
        this.lastEventId = line.replace(/id:?\s*/, '');
      } else if (line.indexOf('id') === 0) {
        this.lastEventId = null;
      } else if (line === '') {
        if (data.length > 0) {
          const eventType = this.eventType || 'message';
          const event = {
            type: eventType,
            data: data.join('\n'),
            url: this.url,
            lastEventId: this.lastEventId,
          };

          // this.dispatch(eventType, event);

          data = [];
          this.eventType = undefined;
        }
      }
    }
  }

  addEventListener(type: any, listener: any) {
    if (this.eventHandlers[type] === undefined) {
      this.eventHandlers[type] = [];
    }

    this.eventHandlers[type].push(listener);
  }

  removeEventListener(type: any, listener: any) {
    if (this.eventHandlers[type] !== undefined) {
      this.eventHandlers[type] = this.eventHandlers[type].filter(
        handler => handler !== listener,
      );
    }
  }

  removeAllEventListeners(type: any | undefined) {
    const availableTypes = Object.keys(this.eventHandlers);

    if (type === undefined) {
      for (const eventType of availableTypes) {
        this.eventHandlers[eventType] = [];
      }
    } else {
      if (!availableTypes.includes(type)) {
        throw Error(
          `[EventSource] '${type}' type is not supported event type.`,
        );
      }

      this.eventHandlers[type] = [];
    }
  }

  dispatch(type: any, data: any) {
    const availableTypes = Object.keys(this.eventHandlers);

    if (!availableTypes.includes(type)) {
      return;
    }

    for (const handler of Object.values(this.eventHandlers[type])) {
      handler(data);
    }
  }

  close() {
    this.status = this.CLOSED;
    if (this._pollTimer) {
      clearTimeout(this._pollTimer);
    }
    if (this._xhr) {
      this._xhr.abort();
    }

    this.dispatch('close', { type: 'close' });
  }

  terminate() {
    this.close();
  }
}

export default EventSource;