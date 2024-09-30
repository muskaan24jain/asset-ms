
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import Asset from "./Components/Asset";
import Employee from "./Components/Employee";
import Category from "./Components/Category";
import Role from "./Components/Role";
import AdminProfile from "./Components/AdminProfile";
import Home from "./Components/Home";
import GenerateReport from "./Components/GenerateReport";
import DownloadReport from "./Components/DownloadReport";
import AddCategory from "./Components/AddCategory";
import AddRole from "./Components/AddRole";
import AssetDetails from "./Components/AssetDetails";
import AddAsset from "./Components/AddAsset";
import EditAsset from "./Components/EditAsset";
import Start from "./Components/Start";
import EmployeeLogin from "./Components/EmployeeLogin";
import EmployeeDashboard from "./Components/EmployeeDashboard";
import EmployeeProfile from "./Components/EmployeeProfile";
import AddEditEmployeeAsset from "./Components/AddEditEmployeeAsset";
import EmployeeAssetDetails from "./Components/EmployeeAssetDetails";
import AddEmployee from "./Components/AddEmployee";
import EditEmployee from "./Components/EditEmployee";
import MapComponent from "./Components/MapComponent";
import EditMapComponent from "./Components/EditMapComponent";
import EmployeeGenerateReport from "./Components/EmployeeGenerateReport";
import RequestResetPassword from "./Components/RequestResetPassword";
import ResetPassword from "./Components/ResetPassword";
import ChangeHistory from "./Components/ChangeHistory"; 
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Start Page */}
          <Route path="/start" element={<Start />} />

          {/* Admin Routes */}
          <Route path="/adminlogin" element={<Login />} />
          <Route path="/employee_login" element={<EmployeeLogin />} />

          {/* Employee Dashboard */}
          <Route path="/employee/dashboard" element={<EmployeeDashboard />}>
            <Route path="profile" element={<EmployeeProfile />} />
            <Route path="add_asset" element={<AddEditEmployeeAsset />} />
            <Route path="edit_asset/:id" element={<AddEditEmployeeAsset />} />
            <Route
              path="employee_asset_details/:id"
              element={<EmployeeAssetDetails />}
            />
            <Route
              path="generate_report"
              element={<EmployeeGenerateReport />}
            />
          </Route>

          {/* Admin Dashboard */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="" element={<Home />} />
            <Route path="adminprofile" element={<AdminProfile />} />
            <Route path="asset" element={<Asset />} />
            <Route path="employee" element={<Employee />} />
            <Route path="category" element={<Category />} />
            <Route path="role" element={<Role />} />
            <Route path="change_history" element={<ChangeHistory />} />{" "}
            {/* Correctly add Change History Route */}
            <Route path="asset/:id" element={<AssetDetails />} />
            <Route path="generate_report" element={<GenerateReport />} />
            <Route path="download_report" element={<DownloadReport />} />
            <Route path="add_asset" element={<AddAsset />} />
            <Route path="edit_asset/:id" element={<EditAsset />} />
            <Route path="add_category" element={<AddCategory />} />
            <Route path="add_role" element={<AddRole />} />
            <Route path="add_employee" element={<AddEmployee />} />
            <Route path="edit_employee/:id" element={<EditEmployee />} />
          </Route>

          {/* Reset Password Routes */}
          <Route
            path="/request_reset_password"
            element={<RequestResetPassword />}
          />
          <Route path="/reset_password/:token" element={<ResetPassword />} />

          {/* Default Route */}
          <Route path="*" element={<Start />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
