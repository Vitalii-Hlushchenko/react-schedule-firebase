
import React, { useState } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";


const SignIn = () => {
  const { signInWithFirebase } = useAuth();
  const { authUser } = useAuth();
  const navigate = useNavigate;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handlesignIn = (e) => {
    e.preventDefault();
    signInWithFirebase( email, password)
      .then((userCredential) => {
        console.log(userCredential)
        navigate ('/')
      })
      .catch((error) => {
        console.log(error);
      });






      




  };

  return (
    

    <Box  component="form" onSubmit={handlesignIn}
    sx={{'& .MuiTextField-root': { m: 1, width: '25ch' },}} noValidate autoComplete="off">
      <div className="BoxElement">
       <h1>Login</h1>

      <TextField
          required
          id="outlined-required"
          label="Enter your email"
          // defaultValue="email"
          value={email} onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          required
          id="outlined-required"
          label="Enter your password"
          // defaultValue="password"
          value={password} onChange={(e) => setPassword(e.target.value)}        />

      <Button className="BoxBtn" variant="contained" type="submit" size="small">Login</Button>

      </div>
      <div>
      {authUser ? (
        <p>Користувач увійшов у систему: {authUser.email}</p>
      ) : (
        <p>Користувач не увійшов у систему.</p>
      )}
    </div>

    </Box>
  );
};

export default SignIn;