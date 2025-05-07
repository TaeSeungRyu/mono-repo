//[use case] Domain Layer
export class User {
  constructor(
    public username: string | null,
    public password: string | null,
    public name: string | null
  ) {}
}
