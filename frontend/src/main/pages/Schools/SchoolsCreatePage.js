import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import SchoolsForm from "main/components/Schools/SchoolsForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function SchoolsCreatePage({storybook=false}) {

  const objectToAxiosParams = (schools) => ({
    url: "/api/Schools/post",
    method: "POST",
    params: {
     abbrev: schools.abbrev,
     name: schools.name,
     termRegex: schools.termRegex,
     termDescription: schools.termDescription,
     termError: schools.termError
    }
  });

  const onSuccess = (schools) => {
    toast(`New school created - abbrev: ${schools.abbrev}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/Schools/all"] // mutation makes this key stale so that pages relying on it reload
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
        <h1>Create New School</h1>
        <SchoolsForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}