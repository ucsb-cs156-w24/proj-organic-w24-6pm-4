import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CourseTable from 'main/components/Courses/CourseTable';
import { Button } from 'react-bootstrap';
import { useCurrentUser} from 'main/utils/currentUser';

export default function CourseIndexPage() {

  const { data: currentUser } = useCurrentUser();

  const createButton = () => {  
    
      return (
          <Button
              variant="primary"
              href="/course/create"
              style={{ float: "right" }}
          >
              Create Course 
          </Button>
      )
    
  }
  
  const { data: courses, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      ["/api/course/getAll"],
      // Stryker disable next-line all : GET is the default
      { method: "GET", url: "/api/course/getAll" },
      []
    );

    return (
      <BasicLayout>
        <div className="pt-2">
          {createButton()}
          <h1>Course</h1>
          <CourseTable courses={courses} currentUser={currentUser} />
        </div>
      </BasicLayout>
    )
}
