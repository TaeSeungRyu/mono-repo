import { printer, parseDateSample } from "my-common-utils";
import { DEBUG } from "my-common-props";

console.log("Hello from App 1!");
printer(DEBUG, "This is a debug message.");
console.log(DEBUG, parseDateSample("2021-01-01"));
