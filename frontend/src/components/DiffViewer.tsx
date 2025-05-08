// TODO: Implement real diff logic and styling
const DiffViewer = ({ oldCode, newCode }: { oldCode: string; newCode: string }) => (
  <div className="border rounded p-4 bg-white shadow mt-4">
    <h3 className="font-bold text-lg mb-2">Diff Viewer</h3>
    <pre className="text-xs text-gray-700 bg-gray-100 p-2 rounded overflow-x-auto">
      --- Old Code ---
      {oldCode}
      --- New Code ---
      {newCode}
    </pre>
  </div>
);

export default DiffViewer;