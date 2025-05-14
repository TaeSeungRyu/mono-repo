import CalendarComponent from "../components/CalendarComponent";

//[use case] Presentation Layer
export default async function CalendarPage() {
  return (
    <div className="grid items-center justify-items-center">
      <CalendarComponent></CalendarComponent>
    </div>
  );
}
