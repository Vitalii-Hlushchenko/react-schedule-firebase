import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    
    <Box  component="form" onSubmit={signUp}
    sx={{'& .MuiTextField-root': { m: 1, width: '25ch' },}} noValidate autoComplete="off">
      <div className="BoxElement">
       <h1>Create new account</h1>

      <TextField
          required
          id="outlined-required"
          label="Enter your email"
          defaultValue="email"
          value={email} onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          required
          id="outlined-required"
          label="Enter your password"
          defaultValue="password"
          value={password} onChange={(e) => setPassword(e.target.value)}        />

      <Button className="BoxBtn" variant="contained" type="submit" size="small">SignUp</Button>

      </div>


    </Box>
  );
};

export default SignUp;