import { Injectable, signal } from '@angular/core';

export type TestType = 'iq' | 'love' | 'mbti';

export type TestTimers = {
  iq: string;
  love: string;
  mbti: string;
};

const STORAGE_KEY = 'sq-timers';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  public storedTimers = signal<TestTimers>({ iq: '', love: '', mbti: '' });

  constructor() {
    this.loadTimers();
  }

  /** Save completion date for a given test */
  public storeTimer(type: TestType): void {
    const completed = new Date().toISOString();

    const current = { ...this.storedTimers() };
    current[type] = completed;

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    this.storedTimers.set(current);
  }

  /** Load from localStorage into signal */
  public loadTimers(): void {
    const data = window.localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        this.storedTimers.set(JSON.parse(data) as TestTimers);
      } catch {
        // corrupted data → reset
        this.clearTimers();
      }
    }
  }

  /** Get completion date for one test */
  public getTimer(type: TestType): string {
    return this.storedTimers()[type];
  }

  /** Clear all stored timers */
  public clearTimers(): void {
    const empty: TestTimers = { iq: '', love: '', mbti: '' };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(empty));
    this.storedTimers.set(empty);
  }
}
