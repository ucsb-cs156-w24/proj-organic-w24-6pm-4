import React from "react";
 import OurTable, { ButtonColumn } from "main/components/OurTable"
 import { useBackendMutation } from "main/utils/useBackend";
 import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/components/Utils/StaffsUtils"
 import { useNavigate } from "react-router-dom";
 import { hasRole } from "main/utils/currentUser";

 export default function StaffsTable({ staffs, currentUser }) {

     const navigate = useNavigate();

     // Stryker disable all : hard to test for query caching

     const deleteMutation = useBackendMutation(
         cellToAxiosParamsDelete,
         { onSuccess: onDeleteSuccess },
         [`/api/courses/${cell.row.values.id}/staff`]
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
             Header: 'Course ID',
             accessor: 'courseId',
         },
         {
             Header: 'Github ID',
             accessor: 'githubId',
         },
     ];

     if (hasRole(currentUser, "ROLE_ADMIN") || hasRole(currentUser, "ROLE_INSTRUCTOR")) {
         columns.push(ButtonColumn("Delete", "danger", deleteCallback, "StaffsTable"));
     }

     return <OurTable
         data={staffs}
         columns={columns}
         testid={"StaffsTable"} />;
    };