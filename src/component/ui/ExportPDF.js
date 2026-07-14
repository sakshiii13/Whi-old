import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportPDF = (columns, rows, title = "Data") => {
  const doc = new jsPDF();

  doc.text(title, 14, 15);

  autoTable(doc, {
    head: [columns.map((col) => col.headerName)],
    body: rows.map((row) =>
      columns.map((col) => row[col.field])
    ),
  });

  doc.save(`${title}.pdf`);
};