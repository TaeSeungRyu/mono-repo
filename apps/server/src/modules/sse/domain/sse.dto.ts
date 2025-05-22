import { Observable, ReplaySubject } from 'rxjs';
import { Response } from 'express';

export interface MessageEvent {
  data: string | object;
  id?: string;
}

export type SseEvent = {
  event: string;
  data: string | object;
  id?: string;
};

export type SseUseCaseType = {
  result: boolean;
  data: {
    id?: string;
    isSignin?: string;
    subject?: ReplaySubject<SseClient>;
    observer?: Observable<SseClient>;
  };
};

export type SseClient = {
  id: string;
  subject: ReplaySubject<unknown>;
  observer: Observable<unknown>;
  response?: Response | null;
};
