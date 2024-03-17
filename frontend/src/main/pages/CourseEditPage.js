import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import CourseForm from "main/components/Courses/CourseForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function CourseEditPage({storybook=false}) {
  let { id } = useParams();

  const { data: course, _error, _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/course?id=${id}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/course/get`,
        params: {
          id
        }
      }
    );


  const objectToAxiosPutParams = (course) => ({
    url: "/api/course/update",
    method: "PUT",
    params: {
      id: course.id,
      name: course.name,
      school: course.school,
      term: course.term,
      startDate: course.startDate,
      endDate: course.endDate,
      githubOrg: course.githubOrg
    },
  });

  const onSuccess = (course) => {
    toast(`Course Updated - id: ${course.id} name: ${course.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/course?id=${id}`]
  );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/course" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Course</h1>
        {
          course && <CourseForm initialContents={course} submitAction={onSubmit} buttonLabel="Update" />
        }
      </div>
    </BasicLayout>
  )
}

