import { MatchManager } from './match-manager';
import { EventEmitter } from 'events';
import { randomUUID } from 'crypto';
import { User } from './user';

describe('MatchManager', () => {
  test('can initialize', () => {
    expect(new MatchManager()).toBeInstanceOf(MatchManager);
  });
  test('compatible with EventListener', () => {
    expect(new MatchManager()).toBeInstanceOf(EventEmitter);
  });
});

describe('MatchManager algorithm', () => {
  let manager: MatchManager;

  beforeEach(() => {
    manager = new MatchManager();
  });

  test('matching with 1 users', () => {
    const u1: User = { id: randomUUID() };

    manager.request(u1);
    expect(manager.rooms).toHaveLength(1);
    for (const room of manager.rooms) {
      expect(room.members).toHaveLength(1);
      expect(room.members).toStrictEqual([u1]);
      expect(room.closed).toBe(false);
      expect(room.isCompleted).toBe(false);
    }
  });

  test('matching with 2 users', () => {
    const u1: User = { id: randomUUID() };
    const u2: User = { id: randomUUID() };

    manager.request(u1);
    manager.request(u2);
    expect(manager.rooms).toHaveLength(1);
    for (const room of manager.rooms) {
      expect(room.members).toHaveLength(2);
      expect(room.members).toStrictEqual([u1, u2]);
      expect(room.closed).toBe(true);
      expect(room.isCompleted).toBe(true);
    }
  });

  test('matching with 3 users', () => {
    const u1: User = { id: randomUUID() };
    const u2: User = { id: randomUUID() };
    const u3: User = { id: randomUUID() };

    manager.request(u1);
    manager.request(u2);
    manager.request(u3);
    expect(manager.rooms).toHaveLength(2);
    for (const room of manager.rooms) {
      const isFirstRoom = manager.rooms.indexOf(room) <= 0;

      expect(room.members).toHaveLength(isFirstRoom ? 2 : 1);
      expect(room.members).toStrictEqual(isFirstRoom ? [u1, u2] : [u3]);
      expect(room.closed).toBe(isFirstRoom ? true : false);
      expect(room.isCompleted).toBe(isFirstRoom ? true : false);
    }
  });
});
