import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import CourseCreatePage from "main/pages/CourseCreatePage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { SchoolsFixtures } from "fixtures/SchoolsFixtures";

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

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("CourseCreatePage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CourseCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend", async () => {
        axiosMock.onGet("/api/Schools/all").reply(200, SchoolsFixtures.threeSchools);

        const queryClient = new QueryClient();
        const course = {
            id: 1,
            name: "CS156",
            school: "ucsb",
            term: "F23",
            startDate: "2023-09-24T12:00:00",
            endDate: "2023-12-15T12:00:00",
            githubOrg: "ucsb-cs156-f23"
        };

        axiosMock.onPost("/api/course/create").reply(202, course);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <CourseCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("FormSelect-option-ucsb")).toBeInTheDocument();
        });

        const nameField = screen.getByTestId("CourseForm-name");
        const schoolField = screen.getByTestId("FormSelect");
        const termField = screen.getByTestId("CourseForm-term");
        const startDateField = screen.getByTestId("CourseForm-startDate");
        const endDateField = screen.getByTestId("CourseForm-endDate");
        const githubOrgField = screen.getByTestId("CourseForm-githubOrg");
        const submitButton = screen.getByTestId("CourseForm-submit");

        fireEvent.change(nameField, { target: { value: 'CS156' } });
        fireEvent.change(schoolField, { target: { value: 'ucsb' } });
        fireEvent.change(termField, { target: { value: 'F23' } });
        fireEvent.change(startDateField, { target: { value: '2023-09-24T12:00:00' } });
        fireEvent.change(endDateField, { target: { value: '2023-12-15T12:00:00' } });
        fireEvent.change(githubOrgField, { target: { value: 'ucsb-cs156-f23' } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
                "name": "CS156",
                "school": "ucsb",
                "term": "F23",
                "startDate": "2023-09-24T12:00",
                "endDate": "2023-12-15T12:00",
                "githubOrg": "ucsb-cs156-f23"
        });

        expect(mockToast).toBeCalledWith("New course created - id: 1");
        expect(mockNavigate).toBeCalledWith({ "to": "/course" });
    });


});

