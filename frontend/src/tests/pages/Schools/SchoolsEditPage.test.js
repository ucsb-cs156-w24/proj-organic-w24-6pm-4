import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import SchoolsEditPage from "main/pages/Schools/SchoolsEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            abbrev: "ucsb"
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("SchoolsEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/Schools", { params: { abbrev: "ucsb" } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <SchoolsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit School");
            expect(screen.queryByTestId("SchoolsEditForm-abbrev")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/Schools", { params: { abbrev: "ucsb" } }).reply(200, {
                abbrev: "ucsb",
                name: "UC Santa Barbara",
                termRegex: "[WSMF]\\d\\d",
                termDescription: "Enter quarter, e.g. F23, W24, S24, M24",
                termError: "Quarter must be entered in the correct format"
            });
            axiosMock.onPut('/api/Schools').reply(200, {
                abbrev: "ucsb",
                name: "UC Santa Barbie",
                termRegex: "[FS]\\d\\d",
                termDescription: "Enter semester, e.g. F23, S24",
                termError: "Semester must be entered in the correct format"
            });
        });

        const queryClient = new QueryClient();
    
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <SchoolsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("SchoolsForm-abbrev");

            const abbrevField = screen.getByTestId("SchoolsForm-abbrev");
            const nameField = screen.getByTestId("SchoolsForm-name");
            const termRegexField = screen.getByTestId("SchoolsForm-termRegex");
            const termDescriptionField = screen.getByTestId("SchoolsForm-termDescription");
            const termErrorField = screen.getByTestId("SchoolsForm-termError");
            const submitButton = screen.getByTestId("SchoolsForm-submit");

            expect(abbrevField).toBeInTheDocument();
            expect(abbrevField).toHaveValue("ucsb");
            expect(nameField).toBeInTheDocument();
            expect(nameField).toHaveValue("UC Santa Barbara");
            expect(termRegexField).toBeInTheDocument();
            expect(termRegexField).toHaveValue("[WSMF]\\d\\d");
            expect(termDescriptionField).toBeInTheDocument();
            expect(termDescriptionField).toHaveValue("Enter quarter, e.g. F23, W24, S24, M24");
            expect(termErrorField).toBeInTheDocument();
            expect(termErrorField).toHaveValue("Quarter must be entered in the correct format");

            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(nameField, { target: { value: 'UC Santa Barbie' } });
            fireEvent.change(termRegexField, { target: { value: '[FS]\\d\\d' } });
            fireEvent.change(termDescriptionField, { target: { value: 'Enter semester, e.g. F23, S24' } });
            fireEvent.change(termErrorField, { target: { value: 'Semester must be entered in the correct format' } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("School Updated - abbrev: ucsb name: UC Santa Barbie");
            
            expect(mockNavigate).toBeCalledWith({ "to": "/Schools" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ abbrev: "ucsb" });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                name: "UC Santa Barbie",
                termRegex: "[FS]\\d\\d",
                termDescription: "Enter semester, e.g. F23, S24",
                termError: "Semester must be entered in the correct format"
            })); // posted object


        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <SchoolsEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("SchoolsForm-abbrev");

            const abbrevField = screen.getByTestId("SchoolsForm-abbrev");
            const nameField = screen.getByTestId("SchoolsForm-name");
            const termRegexField = screen.getByTestId("SchoolsForm-termRegex");
            const termDescriptionField = screen.getByTestId("SchoolsForm-termDescription");
            const termErrorField = screen.getByTestId("SchoolsForm-termError");
            const submitButton = screen.getByTestId("SchoolsForm-submit");

            expect(abbrevField).toHaveValue("ucsb");
            expect(nameField).toHaveValue("UC Santa Barbara");
            expect(termRegexField).toHaveValue("[WSMF]\\d\\d");
            expect(termDescriptionField).toHaveValue("Enter quarter, e.g. F23, W24, S24, M24");
            expect(termErrorField).toHaveValue("Quarter must be entered in the correct format");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(nameField, { target: { value: 'UC Santa Barbie' } });
            fireEvent.change(termRegexField, { target: { value: '[FS]\\d\\d' } });
            fireEvent.change(termDescriptionField, { target: { value: 'Enter semester, e.g. F23, S24' } });
            fireEvent.change(termErrorField, { target: { value: 'Semester must be entered in the correct format' } });

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("School Updated - abbrev: ucsb name: UC Santa Barbie");
            expect(mockNavigate).toBeCalledWith({ "to": "/Schools" });
        });

       
    });
});