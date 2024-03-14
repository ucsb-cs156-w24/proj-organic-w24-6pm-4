import React from "react";
 import OurTable, { ButtonColumn } from "main/components/OurTable"
 import { useBackendMutation } from "main/utils/useBackend";
 import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/components/Utils/CourseUtils"
 import { useNavigate } from "react-router-dom";
 import { hasRole } from "main/utils/currentUser";

 export default function CourseTable({ courses, currentUser }) {

     const navigate = useNavigate();

     const editCallback = (cell) => {
         navigate(`/course/edit/${cell.row.values.id}`);
     };

     // Stryker disable all : hard to test for query caching

     const deleteMutation = useBackendMutation(
         cellToAxiosParamsDelete,
         { onSuccess: onDeleteSuccess },
         ["/api/course/getAll"]
     );
     // Stryker restore all 

     // Stryker disable next-line all : TODO try to make a good test for this
     const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }

     const columns = [
         {
             Header: 'id',
             accessor: 'id',
         },
         {
             Header: 'Name',
             accessor: 'name',
         },
         {
             Header: 'School',
             accessor: 'school',
         },
         {
             Header: 'Term',
             accessor: 'term',
         },
         {
             Header: 'StartDate',
             accessor: 'startDate',
         },
         {
             Header: 'EndDate',
             accessor: 'endDate',
         },
         {
             Header: 'GitHub Org',
             accessor: 'githubOrg',
         },
     ];

     if (hasRole(currentUser, "ROLE_ADMIN") || hasRole(currentUser, "ROLE_INSTRUCTOR")) {
         columns.push(ButtonColumn("Edit", "primary", editCallback, "CourseTable"));
         columns.push(ButtonColumn("Delete", "danger", deleteCallback, "CourseTable"));
     }

     columns.push(ButtonColumn("Join", "primary", null, "CoursesTable"));
        /*Have to change from null to something else eventually.*/
     return <OurTable
         data={courses}
         columns={columns}
         testid={"CourseTable"} />;
    };