export class Calendar {
  constructor(
    public id: string | null,
    public phonenumber: string,
    public content: string,
    public userid: string,
    public scheduleday: string,
    public createdday: string,
  ) {}
}
