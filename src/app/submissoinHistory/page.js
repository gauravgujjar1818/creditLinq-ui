"use client";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, TableHead, TableBody, TableRow, TableCell, Paper, Typography, TablePagination } from "@mui/material";
// import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  submissionSummaryContainer: {
    margin: theme.spacing(2),
  },
  tableHeaderCell: {
    fontWeight: "bold",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderBottom: `2px solid ${theme.palette.primary.dark}`,
  },
  tableCell: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  noDataMessage: {
    margin: theme.spacing(2),
    color: theme.palette.error.main,
  },
}));

export default function SubmissionSummary() {
  const classes = useStyles();
  const [submissionSummary, setSubmissionSummary] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    getSubmittedData();
  }, []);

  const getSubmittedData = async () => {
    let configGetData = {
      mode: "cors",
      withCredentials: false,
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await axios.get(
        `http://localhost:4000/api/getFormDetails`,
        configGetData
      );
      if (response.status === 200) {
        console.log(response.data);
        const sortedData = response.data.data.sort((a, b) => new Date(b.submissionDate) - new Date(a.submissionDate));
        setSubmissionSummary(sortedData);
        // setSubmissionSummary(response.data.data);
      } else {
        alert("No Data Found!");
      }
    } catch (error) {
      alert("Error fetching data!");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <div className={classes.submissionSummaryContainer}>
        <Typography variant="h2" gutterBottom>
          Submission Summary
        </Typography>
        {submissionSummary.length > 0 ? (
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableHeaderCell}>Id</TableCell>
                  <TableCell className={classes.tableHeaderCell}>Company UEN</TableCell>
                  <TableCell className={classes.tableHeaderCell}>Company Name</TableCell>
                  <TableCell className={classes.tableHeaderCell}>Full Name</TableCell>
                  <TableCell className={classes.tableHeaderCell}>Position with Company</TableCell>
                  <TableCell className={classes.tableHeaderCell}>Email</TableCell>
                  <TableCell className={classes.tableHeaderCell}>Mobile Number</TableCell>
                  <TableCell className={classes.tableHeaderCell}>Submission Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? submissionSummary.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : submissionSummary
                ).map((dataItem) => (
                  <TableRow key={dataItem.id}>
                    <TableCell className={classes.tableCell}>{dataItem.id}</TableCell>
                    <TableCell className={classes.tableCell}>{dataItem.companyUEN}</TableCell>
                    <TableCell className={classes.tableCell}>{dataItem.companyName}</TableCell>
                    <TableCell className={classes.tableCell}>{dataItem.fullName}</TableCell>
                    <TableCell className={classes.tableCell}>{dataItem.positionWithinComp}</TableCell>
                    <TableCell className={classes.tableCell}>{dataItem.email}</TableCell>
                    <TableCell className={classes.tableCell}>{dataItem.mobileNumber}</TableCell>
                    <TableCell className={classes.tableCell}>{formatDate(dataItem.submissionDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15, 20]}
              component="div"
              count={submissionSummary.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        ) : (
          <Typography variant="h5" className={classes.noDataMessage}>
            No data available
          </Typography>
        )}
      </div>
    </>
  );
}
