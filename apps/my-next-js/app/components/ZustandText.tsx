"use client";
import { useZustandState } from "@/app/state/state";

export default function ZustandText() {
  const { sampleData, setSampleData } = useZustandState();
  return (
    <div>
      <div>desc : {sampleData.desc}</div>
      <div>text : {sampleData.text}</div>
      <input
        type="text"
        onChange={(e) => setSampleData({ text: e.target.value, desc: "desc" })}
      />
    </div>
  );
}
