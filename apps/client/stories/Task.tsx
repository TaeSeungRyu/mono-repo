export default function Task({
  task: { id, title, state },
  onCheckBoxChange,
  onButtonClick,
}: {
  task: {
    id: string;
    title: string;
    state: "TASK_INBOX" | "TASK_PINNED" | "TASK_ARCHIVED";
  };
  onCheckBoxChange: (id: string) => void;
  onButtonClick: (id: string) => void;
}) {
  return (
    <div className={`list-item ${state}`}>
      <label
        htmlFor={`archiveTask-${id}`}
        aria-label={`archiveTask-${id}`}
        className="checkbox"
      >
        <input
          type="checkbox"
          disabled={false}
          name="checked"
          id={`archiveTask-${id}`}
          defaultChecked={state === "TASK_ARCHIVED"}
          onChange={() => {
            // This function is called when the checkbox is clicked
            // It will call the onCheckBoxChange function with the task id
            onCheckBoxChange(id);
          }}
        />
        <span
          className="checkbox-custom"
          onClick={() => onCheckBoxChange(id)}
        />
      </label>

      <label htmlFor={`title-${id}`} aria-label={title} className="title">
        <input
          type="text"
          onChange={(event) => {
            title = event.target.value; // Update title with the input value
          }}
          readOnly={false}
          name="title"
          id={`title-${id}`}
          placeholder="Input title"
          className="text-[22px] text-gray-400 rounded-full font-semibold w-full bg-transparent border-none focus:outline-none focus:ring-0"
          defaultValue={title}
        />
      </label>
      {state !== "TASK_ARCHIVED" && (
        <button
          className="border-none text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-0 bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 rounded-full p-2"
          onClick={() => onButtonClick(id)}
          id={`pinTask-${id}`}
          aria-label={`pinTask-${id}`}
          key={`pinTask-${id}`}
        >
          121212
          <span className={`icon-star`} />
        </button>
      )}
    </div>
  );
}
