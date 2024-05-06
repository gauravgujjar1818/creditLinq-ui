"use client";
import React, { useState,useEffect } from "react";
import axios from 'axios';
import {
  Step,
  Stepper,
  StepLabel,
  TextField,
  Typography,
  Box,
  Grid,
  Container,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Checkbox,
  StepContent,
} from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@mui/material/InputAdornment";
import Image from "next/image";
import { useRouter } from "next/navigation";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

const steps = [
  "Company Information",
  "Applicant Information",
  "Upload Documents",
  "Terms & Conditions",
];

export default function Company_details() {
  const classes = useStyles();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [companyName, setCompanyName] = useState("");
  const [companyUEN, setCompanyUEN] = useState("");
  const [fullName, setFullName] = useState("");
  const [position, setPosition] = useState("");
  const [email, setEmail] = useState("");
  const [re_enterEmail, setRe_EnterEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const [terms_conditions, setTerms_conditions] = useState(false);
  const [draggingOver, setDraggingOver] = useState(false);
  let [submitDisable , setSubmitDisable] = useState(true)
  let [disable1, setDisable1] = useState(false);
  let [disable2, setDisable2] = useState(true);
  let [disable3, setDisable3] = useState(true);
  let [disable4, setDisable4] = useState(true);

  let [errStage, setErrStage] = useState({
    companyName : '', uen : '', position : '', 
    email : '' , re_email : '',
    fullName : '', mobile:'',
  })

  useEffect(() => {
    if (companyUEN || companyName) {
      console.log('company')
      handleNext(0);
    }
  }, [companyUEN,companyName])

  useEffect(() => {
    if (fullName || position || email || re_enterEmail || mobile) {
      console.log('applicant')
      handleNext(1);
    }
  }, [fullName,position,email,re_enterEmail,mobile])

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      console.log('file')
      handleNext(2);
    }
  }, [acceptedFiles])


  useEffect(() => {
    if (terms_conditions) {
      console.log('checkBox')
      handleNext(3);
    }
  }, [terms_conditions])

  const validateStep1 = async () => {
    let isValid = true;
    const errors = {
      companyUENErr:'',
      companyNameErr:''
    };
    const pattern = /^\d{8}[a-zA-Z]$/;
    if (!companyUEN || companyUEN.trim() === "") {
      errors.companyUENErr = "Company UEN is required";
      isValid = false;
    } else if (!pattern.test(companyUEN)) {
      errors.companyUENErr = "Company UEN is Invalid";
      isValid = false;
    }

    if (!companyName || companyName.trim() === "") {
      errors.companyNameErr = "Company Name is required";
      isValid = false;
    }
    if (!isValid) {
      setDisable2(true);
      setDisable3(true);
      setDisable4(true);
    } else {
      setDisable2(false);
    }
    setErrors(errors);

    await setErrStage((prevState) => {
      let newState = Object.assign({}, prevState)
      newState.companyName = errors.companyNameErr,
      newState.companyName = errors.companyUENErr
      return newState
  })
    return isValid;
  };

  const validateStep2 = async () => {
    let isValid = true;
    const errors = {
      fullNameErr:'',
      emailErr: '',
      re_enterEmailErr:'',
      phoneNoErr: '',
      positionErr: '',
    };

    if (!fullName || fullName.trim() === "") {
      errors.fullNameErr = "Full Name is required";
      isValid = false;
    }
    const emailRegex =/^[a-zA-Z0-9]+(?:[._-][a-zA-Z0-9]+)*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!email || email.trim() === "") {
      errors.emailErr = "Email Address is required";
      isValid = false;
    }
    else if(!emailRegex.test(email)){
      errors.emailErr = "Invalid Email Address";
      isValid = false;
    }

    if (!re_enterEmail || re_enterEmail.trim() === "") {
      errors.re_enterEmailErr = "Re-enter Email Address is required";
      isValid = false;
    }
    else if (re_enterEmail!=email){
      errors.re_enterEmailErr = "Email Address does not match";
      isValid = false;
    }
    const singaporeMobileRegex = /^[689]\d{7}$/;
    if (!mobile || mobile.trim() === "") {
      errors.phoneNoErr = "Phone Number is required";
      isValid = false;
    }
    else if(!singaporeMobileRegex.test(mobile)){
      errors.phoneNoErr = "Phone Number is not valid";
      isValid = false;
    }

    if (!position || position.trim() === "") {
      errors.positionErr = "Position within company is required";
      isValid = false;
    }

    if (!isValid) {
      setDisable1(true);
      setDisable3(true);
      setDisable4(true);
    } else {
      setDisable3(false);
    }
    await setErrStage((prevState) => {
      let newState = Object.assign({}, prevState)
      newState.fullName = errors.fullNameErr,
      newState.position = errors.positionErr,
      newState.email = errors.emailErr,
      newState.re_email = errors.re_enterEmailErr,
      newState.mobile = errors.phoneNoErr
      return newState
  })
    setErrors(errors);
    return isValid;
  };

  const validateStep3 = () => {
    let isValid = true;
    const errors = {};

    if (acceptedFiles.length === 0) {
      errors.fileUploadErr = "Please upload at least one file";
      isValid = false;
    }
    if (!isValid) {
      setDisable1(true);
      setDisable2(true);
      setDisable4(true);
    } else {
      setDisable4(false);
    }
    setErrors(errors);
    return isValid;
  };

  const validateStep4 = () => {
    let isValid = true;
    const errors = {};

    if (!terms_conditions) {
      errors.termsErr = "Please agree to the Terms & Conditions";
      isValid = false;
    }
    if (!isValid) {
      setDisable1(false);
      setDisable2(false);
      setDisable3(false);
    } else {
      setDisable4(false);
      setSubmitDisable(false)
    }

    setErrors(errors);
    return isValid;
  };

  const handleNext = (s) => {
    let isValid = true;
    console.log("handleNext", s);
    switch (s) {
      case 0:
        isValid = validateStep1();
        break;
      case 1:
        isValid = validateStep2();
        break;
      case 2:
        isValid = validateStep3();
        break;
      case 3:
        isValid = validateStep4();
        break;
      default:
        break;
    }

    if (isValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    setAcceptedFiles([...acceptedFiles, ...files]);
  };
  const handleDragOver = (event) => {
    event.preventDefault();
    setDraggingOver(true);
  };

  const handleDragLeave = () => {
    setDraggingOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    for (let index = 0; index < droppedFiles.length; index++) {
      if (
        droppedFiles[index] &&
        droppedFiles[index].type === "application/pdf"
      ) {
        // Process the PDF file

        setAcceptedFiles((prevFiles) => [...prevFiles, droppedFiles[index]]);
        console.log("Processing PDF file:", droppedFiles[index].name);
      } else {
        // Show an error message or alert indicating that only PDF files are accepted
        console.log("Only PDF files are accepted.");
      }
    }
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...acceptedFiles];
    updatedFiles.splice(index, 1);
    setAcceptedFiles(updatedFiles);
  };

  const handleRemoveAll = () => {
    setAcceptedFiles([]);
  };
//   useEffect(() => {
//     getSubmitedData();
//   }, []);

// const getSubmitedData = async () =>{
//   let configGetData = {
//     mode: "cors",
//     withCredentials: false,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   };
//       try {
//         const response = await axios.get(`http://localhost:4000/api/getFormDetails`, configGetData);
//         if (response.status === 200) {
//           window.console.log(response.data)
//           return (
//             <>
//             <div>
//             <div>
//       <h2>Submission Summary</h2>
//       {response.data.data > 0 ? (
//         <table>
//           <thead>
//             <tr>
//             <th>Id</th>
//               <th>Company UEN</th>
//               <th>Company Name</th>
//               <th>Full Name</th>
//               <th>Position with <br />Company</th>
//               <th>Email</th>
//               <th>Mobile Number</th>
//               <th>Submission Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             {response.data.data.map((dataItem, index) => (
//               <tr key={index}>
//                 <td>{dataItem.id}</td>
//                 <td>{dataItem.companyUEN}</td>
//                 <td>{dataItem.companyName}</td>
//                 <td>{dataItem.fullName}</td>
//                 <td>{dataItem.positionWithinComp}</td>
//                 <td>{dataItem.email}</td>
//                 <td>{dataItem.mobileNumber}</td>
//                 <td>{dataItem.submissionDate}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>No data available</p>
//       )}
//     </div>
//     </div>
//             </>
//           )

//         }
//         else {
//           alert('No Data Found!');
//         }
//       } catch (error) {
//         alert('Your not get request!');
//       }
// }

  const submission = async ()=>{
console.log("Sending", process.env.NEXT_PUBLIC_API_URL)
let configsubmitForm = {
  mode: "cors",
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
};
let configupload = {
  mode: "cors",
  withCredentials: false,
  headers: {
    'Content-Type': 'multipart/form-data'
  },
};
    let body = {
      companyUEN : companyUEN,
      companyName:companyName,
      fullName:fullName,
      position:position,
      email:email,
      mobile:mobile? '+65' + mobile:null

    }
    try {
      const response = await axios.post(`http://localhost:4000/api/submitForm`, body,configsubmitForm);
      if (response.status === 200) {
        window.console.log(response)
        const formData = new FormData();
        for (const file of acceptedFiles){
          formData.append('files',file);
        }
        formData.append('id',response.data.id)
        // formData.append("files", acceptedFiles);
        const resp = await axios.post(`http://localhost:4000/api/uploadFiles`, formData,configupload);
        if(resp.status === 200){
          alert('Your application has been submitted successfully!')
          router.push('/submissoinHistory');
        }
        
      }
      else {
        alert('Your application not accepted!');
      }
    } catch (error) {
      alert('Your application not accepted!');
    }
  }
  return (
    <Paper className={classes.paper}>
      <Container maxWidth="xl">
        <Stepper orientation="vertical" activeStep={activeStep}>
          <Step expanded>
            <StepLabel>
              <Box sx={{ bgcolor: "rgb(96, 26, 121)", p: 2 }} borderRadius={2}>
                <Typography
                  variant="h6"
                  sx={{ color: "white", lineHeight: "1.2" }}
                >
                  Company Information
                </Typography>
              </Box>
            </StepLabel>
            <StepContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    disabled={disable1}
                    id="companyUEN"
                    label="Company UEN"
                    variant="outlined"
                    fullWidth
                    value={companyUEN}
                    onChange={async (e) => {
                      await setCompanyUEN(e.target.value)
                    }}

                    error={!!errors.companyUENErr}
                    helperText={errors.companyUENErr}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="companyName"
                    label="Company Name"
                    disabled={disable1}
                    variant="outlined"
                    fullWidth
                    value={companyName}
                    onChange={(e) => {
                      setCompanyName(e.target.value);
                      // handleNext(0);
                    }}
                    error={!!errors.companyNameErr}
                    helperText={errors.companyNameErr}
                  />
                </Grid>
              </Grid>
            </StepContent>
          </Step>
          <Step expanded>
            <StepLabel>
              <Box sx={{ bgcolor: "rgb(96, 26, 121)", p: 2 }} borderRadius={2}>
                <Typography
                  variant="h6"
                  sx={{ color: "white", lineHeight: "1.2" }}
                >
                  {/* {label} */}
                  Applicant Information
                </Typography>
              </Box>
            </StepLabel>
            <StepContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="FullName"
                    label="Full Name"
                    variant="outlined"
                    fullWidth
                    disabled={disable2}
                    error={!!errors.fullNameErr}
                    helperText={errors.fullNameErr}
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      // handleNext(1);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="position"
                    disabled={disable2}
                    label="Position within company"
                    variant="outlined"
                    fullWidth
                    error={!!errors.positionErr}
                    helperText={errors.positionErr}
                    value={position}
                    onChange={(e) => {
                      setPosition(e.target.value);
                      // handleNext(1);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="email"
                    disabled={disable2}
                    label="Email Address"
                    variant="outlined"
                    fullWidth
                    error={!!errors.emailErr}
                    helperText={errors.emailErr}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      // handleNext(1);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="reEmail"
                    label="Re-enter Email Address"
                    variant="outlined"
                    disabled={disable2}
                    fullWidth
                    error={!!errors.re_enterEmailErr}
                    helperText={errors.re_enterEmailErr}
                    value={re_enterEmail}
                    onChange={(e) => {
                      setRe_EnterEmail(e.target.value);
                      // handleNext(1);
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="phone"
                    label="Phone Number"
                    variant="outlined"
                    disabled={disable2}
                    fullWidth
                    
                    error={!!errors.phoneNoErr}
                    helperText={errors.phoneNoErr}
                    value={mobile}
                    onChange={(e) => {
                      setMobile(e.target.value);
                      // handleNext(1);
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Image
                            src="https://upload.wikimedia.org/wikipedia/commons/4/48/Flag_of_Singapore.svg"
                            alt="Logo"
                            width={30}
                            height={20}
                          />{" "}
                          +65
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </StepContent>
          </Step>
          <Step expanded>
            <StepLabel>
              <Box sx={{ bgcolor: "rgb(96, 26, 121)", p: 2 }} borderRadius={2}>
                <Typography
                  variant="h6"
                  sx={{ color: "white", lineHeight: "1.2" }}
                >
                  Upload Documents
                </Typography>
              </Box>
            </StepLabel>

            <StepContent>
              <Grid container spacing={2}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} sx={{ display: "block", p: 2 }}>
                    <Grid>
                      <input
                        type="file"
                        onChange={(e) => {
                          handleFileInputChange(e);
                          // handleNext(2);
                        }}
                        disabled={disable3}
                        style={{ display: "none" }}
                        accept=".pdf"
                        multiple
                      />
                      <Button
                        disabled={disable3}
                        onClick={() =>
                          document.querySelector('input[type="file"]').click()
                        }
                      >
                        <Box
                          border={2}
                          borderColor={
                            draggingOver ? "primary.main" : "grey.400"
                          }
                          disabled={disable3}
                          borderRadius={2}
                          p={2}
                          accept=".pdf"
                          mt={2}
                          fullWidth
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={() => {
                            handleDrop;
                            // handleNext(2);
                          }}
                          sx={{ mr: 1, ml: 4 }}
                        >
                          Click to upload or drag and drop Bank Statements
                        </Box>
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6} sx={{ display: "block", p: 2 }}>
                      {acceptedFiles.map((file, index) => (
                        <Box
                          key={index}
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          mb={1}
                          sx={{
                            mr: 1,
                            ml: 4,
                            border: 1,
                            borderRadius: "16px 16px 16px 16px", // Half-circle border on the right side
                            overflow: "hidden",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              flex: 1,
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {file.name}
                          </Typography>
                          <Button
                            onClick={() => {
                              handleRemoveFile(index);
                            }}
                          >
                            ✖
                          </Button>
                        </Box>
                      ))}
                      {acceptedFiles.length > 0 && (
                        <Button onClick={handleRemoveAll}>Remove All</Button>
                      )}
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ display: "flex", p: 2 }}>
                    <List>
                      {[
                        "PDFs (not scanned copies) of company's operating bank current account(s) statements for the past 6 months.",
                        "Example: If today is 04 May 24, then please upload bank statements from Nov 23 to Apr 24 (both months inclusive)",
                        "If your company is multi-banked, then please upload 6 months bank statements for each bank account",
                        "If your file is password protected, we request you to remove the password and upload the file to avoid submission failure",
                        "In case if you are facing any issue while uploading bank statements, Please contact us on support@credilinq.ai",
                      ].map((text, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                              focusable="false"
                            >
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          </ListItemIcon>
                          <ListItemText primary={text} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                </Grid>
              </Grid>
            </StepContent>
          </Step>
          <Step expanded>
            <StepLabel>
              <Box sx={{ bgcolor: "rgb(96, 26, 121)", p: 2 }} borderRadius={2}>
                <Typography
                  variant="h6"
                  sx={{ color: "white", lineHeight: "1.2" }}
                >
                  {/* {label} */}
                  Terms & Conditions
                </Typography>
              </Box>
            </StepLabel>

            <StepContent>
              <Grid container spacing={2}>
                <Grid item>
                  
                  <Typography variant="body1">
                  <Checkbox 
                    disabled={disable4}
                    checked={terms_conditions}
                    onChange={(e) => {
                      setTerms_conditions(e.target.checked);
                      // handleNext(3);
                    }}
                    color="primary"
                  />
                    By ticking, you are confirming that you have understood and
                    are agreeing to the details mentioned:
                  </Typography>
                </Grid>

                <List>
                  {[
                    "I confirm that I am the authorized person to upload bank statements on behalf of my company.",
                    "I assure you that uploaded bank statements and provided company information match and are of the same company, if there is a mismatch then my report will not be generated",
                    "I understand that this is a general report based on the bank statements and Credilinq is not providing a solution or guiding me for my business growth",
                    <span>
                      I have read and understand the{" "}
                      <u>
                        <a
                          href="https://smehealthcheck.credilinq.ai/terms-and-conditions"
                          target="_blank"
                        >
                          Terms & Conditions
                        </a>
                      </u>
                    </span>,
                  ].map((text, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                          focusable="false"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItem>
                  ))}
                </List>
                {errors.termsErr && (
                  <Typography variant="body2" color="error">
                    {errors.termsErr}
                  </Typography>
                )}
              </Grid>
            </StepContent>
          </Step>
        </Stepper>
        
      </Container>
      {/* disabled={submitDisable} */}
      <Button  alignItems={"right"} disabled={submitDisable} onClick={submission} className="btn btn-primary">
                    Submit
                  </Button>
    </Paper>
  );
}
