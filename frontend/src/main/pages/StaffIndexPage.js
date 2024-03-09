import React from 'react'
import { useBackend } from 'main/utils/useBackend';
import { useParams } from "react-router-dom";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { Button } from 'react-bootstrap';
import { useCurrentUser} from 'main/utils/currentUser';
import StaffTable from 'main/components/Courses/StaffTable';

export default function StaffIndexPage() {
  let { courseId } = useParams();

  const { data: currentUser } = useCurrentUser();

  const createButton = () => {  
    
      return (
          <Button
              variant="primary"
              href={`/course/${courseId}/staff/create`}
              style={{ float: "right" }}
          >
              Add Staff Member
          </Button>
      )
    
  }
  
  const { data: staffs, error: _error, status: _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/course/staff/all?courseId=${courseId}`],
      {   // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET", 
        url: `/api/course/staff/all`,
        params: {
          courseId: courseId
        } 
      },
      []
    );

    return (
      <BasicLayout>
        <div className="pt-2">
          {createButton()}
          <h1>Staff</h1>
          <StaffTable staffs={staffs} currentUser={currentUser} />
        </div>
      </BasicLayout>
    )
}
