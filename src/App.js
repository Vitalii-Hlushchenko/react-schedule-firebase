import './App.css';
import { Routes, Route } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import NavBar from './components/NavBar';
import { AuthProvider } from "./context/authContext";

// import AuthOptions from './components/AuthOpt';
// import { SnackbarProvider } from 'notistack';

// function App() {
//   return (
//     <div className="App">
      
//       <SignIn />
//       <SignUp />
//       <AuthOptions />
//       <SnackbarProvider />
//     </div>
const App = () => {
  return (
  <>
  <AuthProvider>
    <NavBar />
      <Routes>
        
        <Route path="/signIn" element={ <SignIn />} />
        <Route path="/signUp" element={<SignUp />} />
      </Routes>
</AuthProvider>
</>
);
}


export default App;
