import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import SchoolsEditForm from 'main/components/Schools/SchoolsEditForm';
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function SchoolsEditPage({storybook=false}) {
    let { abbrev } = useParams();

    const { data: schools, _error, _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            [`/api/Schools?abbrev=${abbrev}`],
            {  // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
                method: "GET",
                url: `/api/Schools`,
                params: {
                    abbrev
                }
            }
        );

    const objectToAxiosPutParams = (school) => ({
        url: "/api/Schools",
        method: "PUT",
        params: {
            abbrev: school.abbrev,
        },
        data: {
            name: school.name,
            termRegex: school.termRegex,
            termDescription: school.termDescription,
            termError: school.termError
        }
    });

    const onSuccess = (school) => {
        toast(`School Updated - abbrev: ${school.abbrev} name: ${school.name}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/School?abbrev=${abbrev}`]
    );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }

    if (isSuccess && !storybook) {
        return <Navigate to="/Schools" />
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit School</h1>
                {
                    schools && <SchoolsEditForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={schools} />
                }
            </div>
        </BasicLayout>
    )

}