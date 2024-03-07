import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import StaffForm from "main/components/Courses/StaffForm";
import { Navigate } from 'react-router-dom'
import { useParams } from "react-router-dom";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function CourseCreatePage({storybook=false}) {
    let { id } = useParams();

    const objectToAxiosParams = (staff) => ({
        url: "/api/course/staff/create",
        method: "POST",
        params: {
        courseId: staff.courseId,
        githubLogin: staff.githubLogin,
        }
    });

    const onSuccess = (staff) => {
        toast(`New staff created - id: ${staff.id}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosParams,
        { onSuccess }, 
        // Stryker disable next-line all : hard to set up test for caching
        ["/api/course/staff/all"] // mutation makes this key stale so that pages relying on it reload
        );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }

    if (isSuccess && !storybook) {
        return <Navigate to={`/course/${id}/staff`} />
    }

    return (
        <BasicLayout>
        <div className="pt-2">
            <h1>Add Staff Member</h1>

            <StaffForm submitAction={onSubmit} />

        </div>
        </BasicLayout>
    )
}