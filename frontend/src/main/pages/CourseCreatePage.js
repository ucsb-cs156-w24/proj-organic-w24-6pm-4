import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import CourseForm from "main/components/Courses/CourseForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function CourseCreatePage({storybook=false}) {

    const objectToAxiosParams = (course) => ({
        url: "/api/course/create",
        method: "POST",
        params: {
        name: course.name,
        school: course.school,
        term: course.term,
        startDate: course.startDate,
        endDate: course.endDate,
        githubOrg: course.githubOrg
        }
    });

    const onSuccess = (course) => {
        toast(`New course created - id: ${course.id}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosParams,
        { onSuccess }, 
        // Stryker disable next-line all : hard to set up test for caching
        ["/api/course/getAll"] // mutation makes this key stale so that pages relying on it reload
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
            <h1>Create New Course</h1>

            <CourseForm submitAction={onSubmit} />

        </div>
        </BasicLayout>
    )
}