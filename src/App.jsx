import './index.css';
import { Outlet } from "react-router-dom";
import Navbar from "./components/shared/Navbar";
import { Container } from "@mui/material";
import useUser from "./hooks/useUser";
import LoadingLogo from './components/utils/LoadingLogo';


function App() {
  const { userInfoLoading } = useUser();

  if(userInfoLoading) return <LoadingLogo />

  return (
    <div>
      <Navbar /> <br /> <br />
      <Container>
        <Outlet></Outlet>
      </Container>
      <br />
    </div>
  )
}

export default App
