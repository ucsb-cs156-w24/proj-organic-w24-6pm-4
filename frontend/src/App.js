import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useRef } from "react"
import { useBackendMutation } from "main/utils/useBackend";
import HomePage from "main/pages/HomePage";
import LoadingPage from "main/pages/LoadingPage";
import LoginPage from "main/pages/LoginPage";
import ProfilePage from "main/pages/ProfilePage";
import CourseEditPage from "main/pages/CourseEditPage";

import AdminUsersPage from "main/pages/AdminUsersPage";
import AdminJobsPage from "main/pages/AdminJobsPage";

import CourseCreatePage from "main/pages/CourseCreatePage";
import CourseIndexPage from "main/pages/CourseIndexPage";

import { hasRole, useCurrentUser } from "main/utils/currentUser";
import NotFoundPage from "main/pages/NotFoundPage";
import StaffCreatePage from "main/pages/StaffCreatePage";
import StaffIndexPage from "main/pages/StaffIndexPage";

import SchoolsCreatePage from "main/pages/Schools/SchoolsCreatePage";
import SchoolsIndexPage from "main/pages/Schools/SchoolsIndexPage";
import SchoolsEditPage from "main/pages/Schools/SchoolsEditPage";

function App() {
  const { data: currentUser } = useCurrentUser();

  const adminRoutes = hasRole(currentUser, "ROLE_ADMIN") ? (
    <>
      <Route path="/admin/users" element={<AdminUsersPage />} />
      <Route path="/admin/jobs" element={<AdminJobsPage />} />
    </>
  ) : null;

  const userRoutes = hasRole(currentUser, "ROLE_USER") ? (
    <>
      <Route path="/profile" element={<ProfilePage />} />
    </>
  ) : null;

  const courseRoutes = (hasRole(currentUser, "ROLE_ADMIN") || hasRole(currentUser, "ROLE_INSTRUCTOR")) ? (
    <>
      <Route path="/course/create" element={<CourseCreatePage />} />
      <Route path="/course" element={<CourseIndexPage />} />
      <Route path="/course/edit/:id" element={<CourseEditPage />} />
    </>
  ) : null;
  
  const schoolRoutes = (hasRole(currentUser, "ROLE_ADMIN")) ? (
    <>
      <Route path="/Schools/create" element={<SchoolsCreatePage />} />
      <Route path="/Schools" element={<SchoolsIndexPage />} />
      <Route path="/Schools/edit/:abbrev" element={<SchoolsEditPage />} />
    </>
  ) : null;

  const staffIndexPageRoute = (hasRole(currentUser, "ROLE_ADMIN") || hasRole(currentUser, "ROLE_INSTRUCTOR") || hasRole(currentUser, "ROLE_USER")) ? (
    <>
      <Route path="/course/:courseId/staff" element={<StaffIndexPage />} />
    </>
  ) : null;

  const staffCreatePageRoute = (hasRole(currentUser, "ROLE_ADMIN") || hasRole(currentUser, "ROLE_INSTRUCTOR")) ? (
    <>
      <Route path="/course/:courseId/staff/create" element={<StaffCreatePage />} />
    </>
  ) : null;

  const homeRoute = (hasRole(currentUser, "ROLE_ADMIN") || hasRole(currentUser, "ROLE_USER")) 
    ? <Route path="/" element={<HomePage />} /> 
    : <Route path="/" element={<LoginPage />} />;

  /*  Display the LoadingPage while awaiting currentUser 
      response to prevent the NotFoundPage from displaying */
      
  const updateLastOnlineMutation = useBackendMutation(
    () => ({ method: 'POST', url: '/api/currentUser/last-online' }),
    {}
  );

  const updatedOnlineOnMount = useRef(false);

  useEffect(() => {
    if (currentUser && currentUser.loggedIn) {
      if (!updatedOnlineOnMount.current) {
        updatedOnlineOnMount.current = true;
        updateLastOnlineMutation.mutate();
      }
      
      const interval = setInterval(() => {
        updateLastOnlineMutation.mutate();
      }, 60000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [currentUser, updateLastOnlineMutation]);

  return (
    <BrowserRouter>
      {currentUser?.initialData ? ( <LoadingPage /> ) : ( 
        <Routes>
          {homeRoute}
          {adminRoutes}
          {schoolRoutes}
          {userRoutes}
          {courseRoutes}
          {staffIndexPageRoute}
          {staffCreatePageRoute}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;