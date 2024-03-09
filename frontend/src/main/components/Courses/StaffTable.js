import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable"
import { useBackendMutation } from "main/utils/useBackend";
import { useQueryClient } from "react-query";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/components/Utils/StaffUtils"
import { hasRole } from "main/utils/currentUser";

export default function StaffTable({ staffs, currentUser }) {
    const queryClient = useQueryClient();

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess }
    );
    // Stryker restore all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => {
        deleteMutation.mutate(cell); 
        // Stryker disable next-line all: Hard to test for list refresh
        queryClient.invalidateQueries(`/api/course/staff/all?courseId=${cell.row.values.courseId}`);
    }

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
        {
            Header: 'Github Login',
            accessor: 'user.githubLogin',
        },
        {
            Header: 'Full Name',
            accessor: 'user.fullName',
        },
        {
            Header: 'Admin',
            accessor: 'user.admin',
            Cell: ({ value }) => value ? "Yes" : "No"
        },
        {
            Header: 'Instructor',
            accessor: 'user.instructor',
            Cell: ({ value }) => value ? "Yes" : "No"
        },
    ];

    if (hasRole(currentUser, "ROLE_ADMIN") || hasRole(currentUser, "ROLE_INSTRUCTOR")) {
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, "StaffTable"));
    }

    return <OurTable
        data={staffs}
        columns={columns}
        testid={"StaffTable"} />;
};