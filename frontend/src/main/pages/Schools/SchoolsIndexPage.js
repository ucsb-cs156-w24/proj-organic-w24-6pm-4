import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import SchoolsTable from 'main/components/Schools/SchoolsTable';
import { useCurrentUser , hasRole} from 'main/utils/currentUser'
import { Button } from 'react-bootstrap';

export default function SchoolsIndexPage() {

    const currentUser = useCurrentUser();

    const { data: schools, error: _error, status: _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            ["/api/Schools/all"],
            { method: "GET", url: "/api/Schools/all" },
            // Stryker disable next-line all : don't test default value of empty list
            []
        );

    const createButton = () => {
        if (hasRole(currentUser, "ROLE_ADMIN")) {
            return (
                <Button
                    variant="primary"
                    href="/Schools/create"
                    style={{ float: "right" }}
                >
                    Create School
                </Button>
            )
        } 
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                {createButton()}
                <h1>Schools</h1>
                <SchoolsTable schools={schools} currentUser={currentUser} />
            </div>
        </BasicLayout>
    );
}