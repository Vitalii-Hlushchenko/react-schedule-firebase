import './App.css';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import AuthOptions from './components/AuthOpt';

function App() {
  return (
    <div className="App">
      <SignIn />
      <SignUp />
      <AuthOptions />
    </div>
  );
}

export default App;
