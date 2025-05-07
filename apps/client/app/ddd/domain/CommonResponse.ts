export class CommonResponse {
  status: number = 200;
  message: string = "success";
  ok: boolean = true;
  data: Record<string, any> = {};
  details: string = "";

  constructor(arg: Record<string, any>) {
    if (arg.changes) {
      if (arg.changes > 0) {
        this.status = 200;
      } else if (arg.changes == 0) {
        this.status = 200;
        this.message = "No changes";
      } else {
        this.status = 500;
        this.message = "error";
        this.ok = false;
      }
    }
    if (arg.error) {
      this.status = 500;
      this.ok = false;
      this.message = arg.error;
    }
    if (arg.data) {
      this.data = arg.data;
    }
    if (arg.details) {
      this.details = arg.details;
    }
  }
}
