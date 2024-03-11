import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/SchoolsUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function SchoolsTable({
    schools,
    currentUser,
    testIdPrefix = "SchoolsTable" }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/Schools/edit/${cell.row.values.abbrev}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/Schools/all"]
    );
    // Stryker restore all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }

    const columns = [
        {
            Header: 'Abbreviation',
            accessor: 'abbrev', // accessor is the "key" in the data
        },

        {
            Header: 'Name',
            accessor: 'name',
        },
        {
            Header: 'Term Regex',
            accessor: 'termRegex',
        },
        {
            Header: 'Term Description',
            accessor: 'termDescription',
        },
        {
            Header: 'Term Error',
            accessor: 'termError',
        }
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, testIdPrefix));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix));
    } 

    return <OurTable
        data={schools}
        columns={columns}
        testid={testIdPrefix}
    />;
};