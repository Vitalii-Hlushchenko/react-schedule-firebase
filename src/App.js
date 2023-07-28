import './App.css';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import AuthOptions from './components/AuthOpt';
import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <div className="App">
      <SignIn />
      <SignUp />
      <AuthOptions />
      <SnackbarProvider />
    </div>
  );
}

export default App;
