import { setSharedContainer } from "../../../domain/container/Container";
import { Container } from "../../../interfaces/container/Container";

export function bootstrap(): void {
  setSharedContainer(new Container())
  // TODO - Any other bootstrap procedure should goes here
}