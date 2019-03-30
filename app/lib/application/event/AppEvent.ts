import { EventEmitter } from "events";

class AppEvent {
  private readonly event: EventEmitter = new EventEmitter()

  public emitOnServerStarting(): void {
    this.event.emit('serverStarting')
  }

  public onServerStarting(handler: () => void): void {
    this.event.on('serverStarting', handler)
  }
}

export const appEvent = new AppEvent()