//[use case] Domain Layer
export class CashedItem {
  constructor(
    public title: string,
    public description: string,
    public number: number
  ) {}
}

export class Board {
  constructor(
    public idx: number | null,
    public title: string,
    public contents: string,
    public username: string,
    public reg_date: string
  ) {}
}
