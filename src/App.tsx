import 'normalize.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {ForgotPasswordPage, LoginPage, RegisterPage} from "./pages/auth";
import {DashboardLayout} from "./layouts/DasbhoardLayout.tsx";
import {ErrorPage} from "./pages";
import {RequireAuth} from "./components/RequireAuth.tsx";
import {appPaths} from "./routes.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={appPaths.login} element={<LoginPage/>}/>
                <Route path={appPaths.register} element={<RegisterPage/>}/>
                <Route path={appPaths.forgotPassword}
                       element={<ForgotPasswordPage/>}/>

                <Route element={<RequireAuth/>}>
                    <Route path={appPaths.dashboard.root}
                           element={<DashboardLayout/>}>
                        <Route index element={<h1>Dashboard Home</h1>}/>

                        <Route path={appPaths.patients.root}
                               element={<h1>Patients</h1>}/>
                        <Route path={appPaths.patients.add}
                               element={<h1>Add patient</h1>}/>

                    </Route>
                </Route>

                <Route path={appPaths.notFound} element={<ErrorPage/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
