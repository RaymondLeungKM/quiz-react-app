import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  useMediaQuery,
  TextField,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import {
  fetchQuizzes,
  deleteQuiz,
  fetchCategories,
  deleteCategory,
  editCategory,
} from "./api/react-query-actions";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "./utils/axios";
import { enqueueSnackbar } from "notistack";
import { formatISODate } from "./utils/dateUtils";

function Admin() {
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 5,
    page: 0,
  });

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [deleteDialogContent, setDeleteDialogContent] = useState("");
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryDialogVisible, setCategoryDialogVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const closeDialog = () => {
    setDeleteDialogVisible(false);
  };
  const queryClient = useQueryClient();
  const { mutate } = useMutation(deleteQuiz, {
    onSuccess: (res) => {
      console.log(res);
      queryClient.invalidateQueries({ queryKey: ["allQuiz"] });
      setDeleteDialogVisible(false);
      enqueueSnackbar("Quiz deleted successfully!", { variant: "success" });
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
          setDeleteDialogContent(
            "You are about to delete the selected quiz. Continue?"
          );
          setDeleteDialogVisible(true);
          setSelectedId(params.id);
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

  const [catRows, setCatRows] = useState([]);
  const [catColumns, setCatColumns] = useState([
    { field: "id", headerName: "Category ID", width: 100 },
    { field: "name", headerName: "Category Name", width: 130 },
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
          setSelectedId(params.id);
          setNewCategoryName(params.row.name);
          setCategoryDialogVisible(true);
        };
        const deleteHandler = (e) => {
          e.stopPropagation();
          setDeleteDialogContent(
            "You are about to delete the selected category. Continue?"
          );
          setDeleteDialogVisible(true);
          setSelectedId(params.id);
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

  const { mutate: updateCategory } = useMutation(editCategory, {
    onSuccess: (res) => {
      console.log(res);
      queryClient.invalidateQueries({ queryKey: ["allCategory"] });
      setCategoryDialogVisible(false);
      enqueueSnackbar("Category updated successfully!", { variant: "success" });
    },
  });
  const handleEditCategory = () => {
    const newCategory = {
      id: selectedId,
      name: newCategoryName,
      createdBy: "Raymond",
    };
    updateCategory(newCategory);
  };

  const { mutate: removeCategory } = useMutation(deleteCategory, {
    onSuccess: (res) => {
      console.log(res);
      queryClient.invalidateQueries({ queryKey: ["allCategory"] });
      setDeleteDialogVisible(false);
      enqueueSnackbar("Category deleted successfully!", { variant: "success" });
    },
  });
  const handleDeleteCategory = () => {
    const newCategory = {
      id: selectedId,
      name: newCategoryName,
      createdBy: "Raymond",
    };
    removeCategory(newCategory);
  };

  const deleteDiaglogSubmit = () => {
    if (
      deleteDialogContent ==
      "You are about to delete the selected quiz. Continue?"
    ) {
      mutate(selectedId);
    } else {
      removeCategory(selectedId);
    }
  };

  const { data: quizData, isLoading, isFetching, isRefetching, error } = useQuery(["allQuiz"], fetchQuizzes, {
    onSuccess: (data) => {
      const formattedData = data.map((item) => {
        const category = item.category.reduce((allNames, cat) => {
          return allNames == "" ? cat.name : allNames + ", " + cat.name;
        }, "");
        const created_date = formatISODate(item.created_date);
        return {
          ...item,
          created_date: created_date,
          category: category,
        };
      });
      setRows(formattedData);
    },
  });

  const { data: categoryData, isCategoryLoading, isCatgegoryError } = useQuery(
    ["allCategory"],
    fetchCategories,
    {
      onSuccess: (data) => {
        const formattedData = data.map((item) => {
          const created_date = formatISODate(item.created_date);
          return {
            ...item,
            created_date: created_date,
          };
        });
        setCatRows(formattedData);
      },
    }
  );

  useEffect(() => {
    console.log("isLoading=", isLoading)
    console.log("isFetching=", isFetching)
    console.log("isRefetching=", isRefetching)
  }, [isLoading, isFetching, isRefetching])

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Typography variant="h3" mb={3}>
          All Quizzes
        </Typography>
        <DataGrid
          columns={columns}
          rows={rows}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20]}
        />
      </Box>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h3" mb={3}>
          All Categories
        </Typography>
        <DataGrid
          columns={catColumns}
          rows={catRows}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20]}
        />
      </Box>
      <Dialog
        fullScreen={fullScreen}
        open={deleteDialogVisible}
        onClose={closeDialog}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{"Warning"}</DialogTitle>
        <DialogContent>
          <DialogContentText>{deleteDialogContent}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={closeDialog}>
            Cancel
          </Button>
          <Button onClick={deleteDiaglogSubmit} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={categoryDialogVisible}
        onClose={() => setCategoryDialogVisible(false)}
      >
        <DialogTitle>Edit category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            value={newCategoryName}
            onChange={(event) => {
              setNewCategoryName(event.target.value);
            }}
            margin="dense"
            id="new-category-name"
            label="Name"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCategoryDialogVisible(false)}>
            Cancel
          </Button>
          <Button onClick={handleEditCategory}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Admin;
