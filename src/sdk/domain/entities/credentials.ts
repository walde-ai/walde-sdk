/**
 * User authentication credentials
 */
export class Credentials {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly idToken: string
  ) {}

  /**
   * Check if credentials are complete (at least access token is present)
   */
  public isComplete(): boolean {
    return !!this.accessToken;
  }
}
