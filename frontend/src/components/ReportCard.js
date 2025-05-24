function ReportCard({ report, isAdmin, onDelete, onEdit, onStatusChange }) {
  return (
    <div className="border p-4 rounded shadow bg-white mb-4">
      <h2 className="font-bold">{report.title}</h2>
      <p>{report.description}</p>
      <p className="text-sm text-gray-500">Status: {report.status}</p>

      {isAdmin ? (
        <div className="mt-2 flex gap-2">
          <select
            value={report.status}
            onChange={(e) => onStatusChange(report._id, e.target.value)}
            className="border px-2 py-1"
          >
            <option value="pending">Pending</option>
            <option value="proses">Proses</option>
            <option value="selesai">Selesai</option>
          </select>
          <button
            className="text-red-500 font-semibold"
            onClick={() => onDelete(report._id)}
          >
            Hapus
          </button>
        </div>
      ) : (
        <button
          className="text-blue-500 mt-2"
          onClick={() => onEdit(report)}
        >
          Edit
        </button>
      )}
    </div>
  );
}

export default ReportCard;
