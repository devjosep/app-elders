export class Ensure {
  public static that(condition: boolean, message: string): void {
    if (condition) throw new Error(message);
  }
}
