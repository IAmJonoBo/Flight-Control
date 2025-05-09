import React from "react";

function diffLines(oldStr: string, newStr: string) {
  const oldLines = oldStr.split("\n");
  const newLines = newStr.split("\n");
  const maxLen = Math.max(oldLines.length, newLines.length);
  const result = [];
  for (let i = 0; i < maxLen; i++) {
    if (oldLines[i] === newLines[i]) {
      result.push({
        type: "unchanged",
        oldLine: oldLines[i] || "",
        newLine: newLines[i] || "",
        line: i + 1,
      });
    } else if (oldLines[i] === undefined) {
      result.push({
        type: "added",
        oldLine: "",
        newLine: newLines[i] || "",
        line: i + 1,
      });
    } else if (newLines[i] === undefined) {
      result.push({
        type: "removed",
        oldLine: oldLines[i] || "",
        newLine: "",
        line: i + 1,
      });
    } else {
      result.push({
        type: "changed",
        oldLine: oldLines[i] || "",
        newLine: newLines[i] || "",
        line: i + 1,
      });
    }
  }
  return result;
}

const DiffViewer = ({
  oldCode,
  newCode,
}: {
  oldCode: string;
  newCode: string;
}) => {
  const diff = diffLines(oldCode, newCode);
  return (
    <div className="border rounded p-4 bg-white shadow mt-4">
      <h3 className="font-bold text-lg mb-2">Diff Viewer</h3>
      <pre className="text-xs text-gray-700 bg-gray-100 p-2 rounded overflow-x-auto">
        {diff.map((d, idx) => {
          if (d.type === "unchanged") {
            return <div key={idx}>{d.oldLine}</div>;
          }
          if (d.type === "added") {
            return (
              <div key={`added-${idx}`} className="bg-green-100 text-green-800">
                + {d.newLine}
              </div>
            );
          }
          if (d.type === "removed") {
            return (
              <div key={`removed-${idx}`} className="bg-red-100 text-red-800">
                - {d.oldLine}
              </div>
            );
          }
          if (d.type === "changed") {
            return [
              <div
                key={`changed-old-${idx}`}
                className="bg-red-100 text-red-800"
              >
                - {d.oldLine}
              </div>,
              <div
                key={`changed-new-${idx}`}
                className="bg-green-100 text-green-800"
              >
                + {d.newLine}
              </div>,
            ];
          }
          return null;
        })}
      </pre>
    </div>
  );
};

export default DiffViewer;
