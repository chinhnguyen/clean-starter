

export interface IContainer {
  resolve<T>(name: string): T
}

let sharedContainer: IContainer

export function setSharedContainer(container: IContainer): void {
  sharedContainer = container
}

export function resolve<T>(name: string): T {
  return sharedContainer.resolve(name)
} 