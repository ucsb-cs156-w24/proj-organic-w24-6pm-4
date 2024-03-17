import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import CourseEditPage from "main/pages/CourseEditPage";

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
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("CourseEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/course/get", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <CourseEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Course");
            expect(screen.queryByTestId("CourseForm-name")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/course/get", { params: { id: 17 } }).reply(200, {
                id: 17,
                name: "CS 156",
                school: "UCSB",
                term: "f23",
                startDate: "2023-09-29T00:00",
                endDate: "2023-12-15T00:00",
                githubOrg: "ucsb-cs156-f23"
            });
            axiosMock.onPut('/api/course/update').reply(200, {
                id: "17",
                name: "CS 148",
                school: "UCSB",
                term: "w23",
                startDate: "2024-01-10T00:00",
                endDate: "2023-03-12T00:00",
                githubOrg: "ucsb-cs156-w23"
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <CourseEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <CourseEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("CourseForm-name");

            const idField = screen.getByTestId("CourseForm-id");
            const nameField = screen.getByTestId("CourseForm-name");
            const schoolField = screen.getByTestId("CourseForm-school");
            const termField = screen.getByTestId("CourseForm-term");
            const startField = screen.getByTestId("CourseForm-startDate");
            const endField = screen.getByTestId("CourseForm-endDate");
            const githubOrgField = screen.getByTestId("CourseForm-githubOrg");
            const submitButton = screen.getByTestId("CourseForm-submit");

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("CS 156");
            expect(schoolField).toHaveValue("UCSB");
            expect(termField).toHaveValue("f23");
            expect(startField).toHaveValue("2023-09-29T00:00");
            expect(endField).toHaveValue("2023-12-15T00:00");
            expect(githubOrgField).toHaveValue("ucsb-cs156-f23");
            expect(submitButton).toBeInTheDocument();
        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <CourseEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("CourseForm-name");

            const idField = screen.getByTestId("CourseForm-id");
            const nameField = screen.getByTestId("CourseForm-name");
            const schoolField = screen.getByTestId("CourseForm-school");
            const termField = screen.getByTestId("CourseForm-term");
            const startField = screen.getByTestId("CourseForm-startDate");
            const endField = screen.getByTestId("CourseForm-endDate");
            const githubOrgField = screen.getByTestId("CourseForm-githubOrg");
            const submitButton = screen.getByTestId("CourseForm-submit");

            expect(idField).toHaveValue("17");
            expect(nameField).toHaveValue("CS 156");
            expect(schoolField).toHaveValue("UCSB");
            expect(termField).toHaveValue("f23");
            expect(startField).toHaveValue("2023-09-29T00:00");
            expect(endField).toHaveValue("2023-12-15T00:00");
            expect(githubOrgField).toHaveValue("ucsb-cs156-f23");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(nameField, { target: { value: "CS 148" } })
            fireEvent.change(schoolField, { target: { value: "UCSB" } })
            fireEvent.change(termField, { target: { value: "w23" } })
            fireEvent.change(startField, { target: { value: "2024-01-10T00:00" } })
            fireEvent.change(endField, { target: { value: "2023-03-12T00:00" } })
            fireEvent.change(githubOrgField, { target: { value: "ucsb-cs156-w23" } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Course Updated - id: 17 name: CS 148");
            expect(mockNavigate).toBeCalledWith({ "to": "/course" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17, name: "CS 148", endDate: "2023-03-12T00:00", startDate: "2024-01-10T00:00", school: "UCSB", term: "w23", githubOrg: "ucsb-cs156-w23" });

        });

       
    });
});


