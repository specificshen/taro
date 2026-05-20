import { isNumber, isString } from '@spcsn/taro-shared';

import { CONTEXT_ACTIONS } from '../constants';
import { Events } from '../emitter/emitter';
import env from '../env';
import { RuntimeCache } from '../utils/cache';

import type { TaroLocation } from './location';

export interface HistoryState {
  state: Record<string, any> | null;
  title: string;
  url: string;
}

type Options = {
  window: any;
};
type HistoryContext = {
  location: TaroLocation;
  stack: HistoryState[];
  cur: number;
};
const cache = new RuntimeCache<HistoryContext>('history');

class TaroHistory extends Events {
  /* private property */
  private _location: TaroLocation;
  private _stack: HistoryState[] = [];
  private _cur = 0;

  private _window: any;

  constructor(location: TaroLocation, options: Options) {
    super();

    this._window = options.window;
    this._location = location;

    this._location.on(
      '__record_history__',
      (href: string) => {
        this._cur++;
        this._stack = this._stack.slice(0, this._cur);
        this._stack.push({
          state: null,
          title: '',
          url: href,
        });
      },
      null,
    );

    this._location.on(
      '__reset_history__',
      (href: string) => {
        this._reset(href);
      },
      null,
    );

    // 切换上下文行为

    this.on(
      CONTEXT_ACTIONS.INIT,
      () => {
        this._reset();
      },
      null,
    );

    this.on(
      CONTEXT_ACTIONS.RESTORE,
      (pageId: string) => {
        cache.set(pageId, {
          location: this._location,
          stack: this._stack.slice(),
          cur: this._cur,
        });
      },
      null,
    );

    this.on(
      CONTEXT_ACTIONS.RECOVER,
      (pageId: string) => {
        if (cache.has(pageId)) {
          const ctx = cache.get(pageId)!;
          this._location = ctx.location;
          this._stack = ctx.stack;
          this._cur = ctx.cur;
        }
      },
      null,
    );

    this.on(
      CONTEXT_ACTIONS.DESTROY,
      (pageId: string) => {
        cache.delete(pageId);
      },
      null,
    );

    this._reset();
  }

  private _reset(href = '') {
    this._stack = [
      {
        state: null,
        title: '',
        url: href || this._location.href,
      },
    ];
    this._cur = 0;
  }

  /* public property */
  get length() {
    return this._stack.length;
  }

  get state() {
    return this._stack[this._cur].state;
  }

  /* public method */
  go(delta: number) {
    if (!isNumber(delta) || isNaN(delta)) return;

    let targetIdx = this._cur + delta;
    targetIdx = Math.min(Math.max(targetIdx, 0), this.length - 1);

    this._cur = targetIdx;

    this._location.trigger('__set_href_without_history__', this._stack[this._cur].url);
    this._window.trigger('popstate', this._stack[this._cur]);
  }

  back() {
    this.go(-1);
  }

  forward() {
    this.go(1);
  }

  pushState(state: any, title: string, url: string) {
    if (!url || !isString(url)) return;
    this._stack = this._stack.slice(0, this._cur + 1);
    this._stack.push({
      state,
      title,
      url,
    });
    this._cur = this.length - 1;

    this._location.trigger('__set_href_without_history__', url);
  }

  replaceState(state: any, title: string, url: string) {
    if (!url || !isString(url)) return;
    this._stack[this._cur] = {
      state,
      title,
      url,
    };

    this._location.trigger('__set_href_without_history__', url);
  }

  // For debug
  get cache() {
    return cache;
  }
}

export type { TaroHistory };
export const History: typeof TaroHistory = process.env.TARO_PLATFORM === 'web' ? env.window.History : TaroHistory;
