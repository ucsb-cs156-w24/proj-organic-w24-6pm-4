import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable"
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/components/Utils/CourseUtils"
import { useNavigate } from "react-router-dom";

export default function CourseTable({ courses, currentUser }) {

    const navigate = useNavigate();

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/course/getAll"]
    );
    // Stryker restore all 


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


     columns.push(ButtonColumn("Join", "primary", null, "CourseTable"));
        /*Have to change from null to something else eventually.*/
     return <OurTable
         data={courses}
         columns={columns}
         testid={"CourseTable"} />;
    };
