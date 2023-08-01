import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { enqueueSnackbar } from 'notistack'

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential)
        enqueueSnackbar('sign in successful');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    // <div className="sign-in-container">
    //   <form className="authForm" onSubmit={signIn}>
    //     <h1>Log In to your Account</h1>
    //     <input  type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
    //     <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
    //     <button onClick={() => enqueueSnackbar('sign in successful')} type="submit">Log In</button>
    //   </form>
    // </div>

    <Box  component="form" onSubmit={signIn}
    sx={{'& .MuiTextField-root': { m: 1, width: '25ch' },}} noValidate autoComplete="off">
      <div class="BoxElement">
       <h1>Login</h1>

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

      <Button className="BoxBtn" variant="contained" type="submit" size="small">Login</Button>

      </div>


    </Box>
  );
};

export default SignIn;