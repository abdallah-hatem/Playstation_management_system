import { useRef } from "react";
import CardComponent from "../../Components/CardComponent";
import MasterTable from "../../Components/MasterTable/MasterTable";
import useGetReceiptsHook from "../../CustomHooks/getReceiptsHook";
import { DELETE_RECEIPT_BY_ID } from "./Api";

export default function Stats() {
  const [data, loading] = useGetReceiptsHook();

  const columns = useRef([
    {
      field: "date",
      caption: "Date",
      dataType: "date",
      format: `d/M/yyyy`,
    },
    {
      field: "charge",
      caption: "Charge",
      dataType: "number",
      format: "currency",
    },
  ]);

  const summary = useRef([
    {
      column: "charge",
      summaryType: "sum",
      valueFormat: "currency",
    },
  ]);

  function handleDelete(id) {
    DELETE_RECEIPT_BY_ID(id);
  }

  return (
    <CardComponent title="Receipts" loading={loading} style={{ width: "100%" }}>
      <MasterTable
        filterRow
        allowDelete
        searchPanel={false}
        columnChooser={false}
        dataSource={data}
        colAttributes={columns.current}
        summaryItems={summary.current}
        onRowRemoved={(e) => handleDelete(e.data._id)}
      />
    </CardComponent>
  );
}
