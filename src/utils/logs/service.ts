import { doFetch } from '../utils';
import { Log } from './domain';

export const log = (log: Log): Promise<void> =>
  doFetch<Log>({
    url: 'trace',
    method: 'POST',
    request: log
  });
