import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import SchoolsIndexPage from "main/pages/Schools/SchoolsIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";
import { SchoolsFixtures } from "fixtures/SchoolsFixtures";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

describe("SchoolsIndexPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "SchoolsTable";

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };


    const queryClient = new QueryClient();

    test("renders empty table when backend unavailable", async () => {
        setupAdminUser();

        axiosMock.onGet("/api/Schools/all").timeout();

        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SchoolsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        restoreConsole();

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });
        
        expect(screen.queryByTestId(`${testId}-cell-row-0-col-abbrev`)).not.toBeInTheDocument();

    });

    test("Renders with Create Button for admin user", async () => {
        setupAdminUser();
        axiosMock.onGet("/api/Schools/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SchoolsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Create School/)).toBeInTheDocument();
        });
        const button = screen.getByText(/Create School/);
        expect(button).toHaveAttribute("href", "/Schools/create");
        expect(button).toHaveAttribute("style", "float: right;");
    });

    test("renders three schools correctly for regular user", async () => {
        setupUserOnly();
        axiosMock.onGet("/api/Schools/all").reply(200, SchoolsFixtures.threeSchools);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SchoolsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-abbrev`)).toHaveTextContent("ucsb"); });
        expect(screen.getByTestId(`${testId}-cell-row-1-col-abbrev`)).toHaveTextContent("umn");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-abbrev`)).toHaveTextContent("ucsd");

        const createOrganizationButton = screen.queryByText("Create School");
        expect(createOrganizationButton).not.toBeInTheDocument();

        const name = screen.getByText("UC Santa Barbara");
        expect(name).toBeInTheDocument;
        const termRegex = screen.getAllByText("[WSMF]\\\d\\\d")[0];
        expect(termRegex).toBeInTheDocument();
        const termDescription = screen.getAllByText("Enter quarter, e.g. F23, W24, S24, M24")[0];
        expect(termDescription).toBeInTheDocument();
        const termError = screen.getAllByText("Quarter must be entered in the correct format")[0];
        expect(termError).toBeInTheDocument();

        // for non-admin users, details button is visible, but the edit and delete buttons should not be visible
        expect(screen.queryByTestId(`${testId}-cell-row-0-col-Delete-button`)).not.toBeInTheDocument();
        expect(screen.queryByTestId(`${testId}-cell-row-0-col-Edit-button`)).not.toBeInTheDocument();
    });

    test("what happens when you click delete, admin", async () => {
        setupAdminUser();

        axiosMock.onGet("/api/Schools/all").reply(200, SchoolsFixtures.threeSchools);
        axiosMock.onDelete("/api/Schools").reply(200, "School with abbrev ucsb was deleted");


        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SchoolsIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-abbrev`)).toBeInTheDocument(); });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-abbrev`)).toHaveTextContent("ucsb");


        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();

        fireEvent.click(deleteButton);

        await waitFor(() => { expect(mockToast).toBeCalledWith("School with abbrev ucsb was deleted") });

        await waitFor(() => { expect(axiosMock.history.delete.length).toBe(1); });
        expect(axiosMock.history.delete[0].url).toBe("/api/Schools");
        expect(axiosMock.history.delete[0].url).toBe("/api/Schools");
        expect(axiosMock.history.delete[0].params).toEqual({ abbrev : "ucsb" });
    });

});