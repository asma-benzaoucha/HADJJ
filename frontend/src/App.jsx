import Signup from "./Auth/Signup";
import Login from "./Auth/Login";
import RecoverPassword from "./Auth/RecoverPassword";
import LandingPage from "./Pages/LandingPage";
import CheckCode from "./Auth/CheckCode";
import Home from "./Pages/Home";
import PasswordReset from "./Auth/PasswordReset";
import Dashboard from "./content/Admin/Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminInterface from "./Pages/AdminInterface";
import Season from "./content/Admin/Season";
import NewSeason from "./content/Admin/NewSeason";
import Method from "./content/Admin/Method";
import Participation from "./content/Hajj-participation/Participation";
import Companion from "./content/Hajj-participation/Companion";
import Draw from "./content/Candidate/Draw";
import Members from "./content/Admin/Members";
import Doctors from "./content/Admin/Doctors";
import Message from "./content/Candidate/Message";
import Lottery from "./content/Admin/Lottery";
import Admins from "./content/Admin/Admins";
import DrawType from "./Components/DrawType";
import Grouping from "./Components/Grouping";
import VisitMed from "./content/Candidate/VisitMed";
import DoctorInterface from "./Pages/DoctorInterface";
import DashboardD from "./content/Doctor/DashboardD";
import Patients from "./content/Doctor/Patients";
import Payement from "./content/Candidate/Payement";
import PatientHealthReview from "./content/Doctor/PatientHealthReview";
import Bna from "./Banque/Bna";
import Reservation from "./content/Candidate/Reservation";
import HotelReservation from "./content/Candidate/HotelReservation";
import AboutUs from "./content/LandingPage/AboutUs";
import WinnersTable from "./Components/WinnersTable";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/BNA" element={<Bna />} />

          <Route
            path="/PatientHealthReview"
            element={<PatientHealthReview />}
          />
          <Route path="/Home" element={<Home />}>
            <Route path="Draw" element={<Draw />} />
            <Route path="Message" element={<Message />} />
            <Route path="VisitMed" element={<VisitMed />} />
            <Route path="Payement" element={<Payement />} />
            <Route path="Reservation" element={<Reservation />} />
            <Route path="Reservation/Hotel" element={<HotelReservation />} />
          </Route>
          <Route exact path="/Login" element={<Login />} />
          <Route path="/Register" element={<Signup />} />
          <Route path="/Forget-Password" element={<RecoverPassword />} />
          <Route path="/Check-Code" element={<CheckCode />} />
          <Route path="/Reset-Password" element={<PasswordReset />} />
          <Route path="/Admin" element={<AdminInterface />}>
            <Route index element={<Dashboard />} />
            <Route path="Season" element={<Season />} />
            <Route path="NewSeason" element={<NewSeason />} />
            <Route path="Method" element={<Method />} />
            <Route path="Members" element={<Members />} />
            <Route path="Doctors" element={<Doctors />} />
            <Route path="Lottery" element={<Lottery />} />
            <Route path="Admins" element={<Admins />} />
            <Route path="DrawType" element={<DrawType />} />
            <Route path="Grouping" element={<Grouping />} />
            <Route path="Winners" element={<WinnersTable />} />
          </Route>
          <Route path="/Doctor" element={<DoctorInterface />}>
            <Route index element={<DashboardD />} />
            <Route path="Patients" element={<Patients />} />
          </Route>
          <Route path="/Participate" element={<Participation />} />
          <Route path="/Participate/Companion" element={<Companion />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
