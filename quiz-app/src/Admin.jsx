import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

import { useQuery } from "react-query";
import axios from "axios";

const fetchQuizzes = () =>
  axios.get("http://localhost:3000/quiz").then((res) => res.data);

function Admin() {
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

  const [rows, setRows] = useState([]);

  //   if columns are actually fixed.. can be declared without using useState and outside of this component function
  const [columns, setColumns] = useState([
    { field: "id", headerName: "Quiz ID", width: 70 },
    { field: "quiz_name", headerName: "Quiz Name", width: 130 },
    { field: "category", headerName: "Category", width: 130 },
    { field: "duration", headerName: "Duration (minutes)", width: 130 },
    { field: "created_by", headerName: "Created By", width: 130 },
    { field: "created_date", headerName: "Created Date", width: 200 },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return <p>i am a button</p>
      },
    },
  ]);

  const { isLoading, error } = useQuery("allQuiz", fetchQuizzes, {
    onSuccess: (data) => {
      setRows(data);
    },
  });

  return (
    <>
      <p>This is the admin dashboard</p>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          columns={columns}
          rows={rows}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20]}
        />
      </div>
    </>
  );
}

export default Admin;
