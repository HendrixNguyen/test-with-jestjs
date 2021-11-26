import { MatchManager } from './match-manager';
import { EventEmitter } from 'events';

describe('MatchManager', () => {
  test('can initialize', () => {
    expect(new MatchManager()).toBeInstanceOf(MatchManager);
  });
  test('compatible with EventListener', () => {
    expect(new MatchManager()).toBeInstanceOf(EventEmitter);
  });
});
