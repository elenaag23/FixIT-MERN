import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import React from 'react';
import { setUser } from "state";

const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    location: "",
    picture: "",
    isClient: true,
};

const Form = ({ userId }) => {
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width:600px)");

    const [user, setUser] = useState(null);
    const token = useSelector((state) => state.token);

    const getUser = async () => {
        const response = await fetch(`http://localhost:3001/users/${userId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUser(data);
    };

    useEffect(() => {
        getUser();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!user) {
        return null;
    }

    const {
        firstName,
        lastName,
        location,
    } = user;

    const handleFormSubmit = async (values) => {
      const { firstName, lastName, location } = values;
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("location", location);
      //formData.append("picturePath", picture);

      const response = await fetch(`http://localhost:3001/users/${userId}/edit`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const updatedUser = await response.json();
      dispatch(setUser({ user: updatedUser }));
      navigate(`/profile/${userId}`);
    }
  
  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValues}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            <TextField
                label="First Name"
                onBlur={handleBlur}
                defaultValue={ firstName }
                name="firstName"
                onChange={(event) => {
                    const value = event.target.value;
                    setUser({ ...user, firstName: value });
                }}
                error={
                 Boolean(touched.firstName) && Boolean(errors.firstName)
                }
                helpertext={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 2" }}
            />

            <TextField
                label="Last Name"
                onBlur={handleBlur}
                onChange={(event) => {
                    const value = event.target.value;
                    setUser({ ...user, lastName: value });
                }}
                defaultValue={ lastName }
                name="lastName"
                error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                helpertext={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 2" }}
            />

            <TextField
                label="Location"
                onBlur={handleBlur}
                onChange={(event) => {
                    const value = event.target.value;
                    setUser({ ...user, location: value });
                }}
                defaultValue={ location }
                name="location"
                error={Boolean(touched.location) && Boolean(errors.location)}
                helpertext={touched.location && errors.location}
                sx={{ gridColumn: "span 4" }}
            />

            {/*}
            <Box
                gridColumn="span 4"
                border={`1px solid ${palette.neutral.medium}`}
                borderRadius="5px"
                p="1rem"
            >
                <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) =>
                      setFieldValue("picture", acceptedFiles[0])
                    }
                >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                          <p>Add Picture Here</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                </Dropzone>
            </Box>
                        */}
          </Box>

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.login.button,
                color: palette.background.alt,
                "&:hover": { backgroundColor: palette.login.buttonHover,
                             color: palette.login.buttonTextHover },
              }}
            >
                Save
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;