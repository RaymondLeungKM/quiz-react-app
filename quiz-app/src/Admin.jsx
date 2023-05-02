import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const fetchQuizzes = () =>
  axios.get("http://localhost:3000/quiz").then((res) => res.data);

const deleteQuiz = () =>
  axios
    .post(`http://localhost:3000/quiz/delete/${selectedQuizId}`)
    .then((res) => res.data);

function Admin() {
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [deleteDialogVisible, setDeleteDiaglogVisible] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const queryClient = new QueryClient();
  const closeDialog = () => {
    setDeleteDiaglogVisible(false);
  };
  const deleteHandler = () =>
    useMutation(deleteQuiz, {
      onSuccess: () => {
        queryClient.invalidateQueries(["quiz"]);
      },
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
      headerName: "Actions",
      width: 200,
      sortable: false,
      cellClassName: "actions",
      renderCell: (params) => {
        const editHandler = (e) => {
          e.stopPropagation();
          navigate(`/quiz/${params.id}/edit`);
        };
        const deleteHandler = (e) => {
          e.stopPropagation();
          setDeleteDiaglogVisible(true);
          setSelectedQuizId(params.id);
        };
        return (
          <>
            <Button onClick={editHandler}>Edit</Button>
            <Button onClick={deleteHandler}>Delete</Button>
          </>
        );
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
      <Dialog
        fullScreen={fullScreen}
        open={deleteDialogVisible}
        onClose={closeDialog}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Warning"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to delete the selected quiz. Continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={closeDialog}>
            Cancel
          </Button>
          <Button onClick={deleteHandler.mutate} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Admin;
