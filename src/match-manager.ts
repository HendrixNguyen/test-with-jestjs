import { randomUUID } from 'crypto';
import { EventEmitter } from 'events';
import { Subject } from 'rxjs';
import { User } from './user';

export class Room extends Subject<User> {
  public readonly roomId: string = randomUUID();

  public readonly members: Array<User> = [];

  public constructor() {
    super();
    this.subscribe({
      next: this.onNext.bind(this),
      complete: this.onComplete.bind(this),
    })
  }

  protected onNext(user: User): void {
    // Khi có 1 người dùng mới được thêm vào phòng
    this.members.push(user);
  }

  protected onComplete(): void {
    // Khi phòng được đánh dấu là đã đủ thành viên
    this.closed = true;
    for (const user of this.members) {
      // Gửi tín hiệu matched kèm danh sách thành viên và id phòng
      // user.sendSignal('Matched', this.id, this.members);
    }
  }

  public get isCompleted(): boolean {
    return this.members.length == 2;
  }
}

export class MatchManager extends EventEmitter {
  public readonly rooms: Array<Room> = [];

  public request(user: User): Room {
    // Lặp qua các room đang có
    for (const room of this.rooms) {
      // Nếu có 1 room nào đó còn nhận thêm thành viên
      if (!room.closed) {
        // Thêm thành viên vào room
        room.next(user);

        // Nếu đã đủ thành viên
        if (room.isCompleted) {
          // Đánh dấu là không nhận thêm thành viên
          room.complete();

          return room;
        }
      }
    }

    // Ngược lại, nếu không có room nào thoả mãn thì tạo mới
    const room = new Room();
    this.rooms.push(room);

    // Thêm user như là thành viên đầu tiên
    room.next(user);

    return room;
  }

  public async requestAsync(user: User): Promise<Room> {
    return new Promise(done => {
      // Chờ
      setTimeout(() => {
        // Match phòng
        const room = this.request(user);

        // Nếu là thành viên cuối
        if (room.isCompleted) {
          return done(room);
        }

        // Chờ được match
        room.subscribe({ complete: () => done(room) });
      }, 3000 + 7000 * Math.random()); // Random trong khoảng từ 3 tới 10s
    });
  }
}
