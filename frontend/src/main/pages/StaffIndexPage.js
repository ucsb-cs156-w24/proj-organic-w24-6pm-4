import React from 'react'
import { useBackend } from 'main/utils/useBackend';
import { useParams } from "react-router-dom";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CoursesTable from 'main/components/Courses/CoursesTable';
import { Button } from 'react-bootstrap';
import { useCurrentUser} from 'main/utils/currentUser';

export default function StaffIndexPage() {
  let { id } = useParams();

  const { data: currentUser } = useCurrentUser();

  const createButton = () => {  
    
      return (
          <Button
              variant="primary"
              href="/courses/:id/staff/create"
              style={{ float: "right" }}
          >
              Create Staff 
          </Button>
      )
    
  }
  
  const { data: courses, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/courses?courseId=${id}`],
      // Stryker disable next-line all : GET is the default
      { 
        method: "GET", 
        url: `/api/courses/getStaff`,
        params: {
          id
        } 
      },
      []
    );

    return (
      <BasicLayout>
        <div className="pt-2">
          {createButton()}
          <h1>Staff</h1>
          <CoursesTable courses={courses} currentUser={currentUser} />
        </div>
      </BasicLayout>
    )
}
