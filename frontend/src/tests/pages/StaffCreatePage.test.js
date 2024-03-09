import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import StaffCreatePage from "main/pages/StaffCreatePage";

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

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            courseId: 1
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("StaffCreatePage tests", () => {

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
                    <StaffCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend", async () => {

        const queryClient = new QueryClient();
        const staff = {
            id: 1,
            courseId: 1,
            githubLogin: "cgaucho"
        };

        axiosMock.onPost(`/api/course/staff/create`).reply(202, staff);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <StaffCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("StaffForm-courseId")).toBeInTheDocument();
        });

        const courseIdField = screen.getByTestId("StaffForm-courseId");
        const githubLoginField = screen.getByTestId("StaffForm-githubLogin");
        const submitButton = screen.getByTestId("StaffForm-submit");

        fireEvent.change(courseIdField, { target: { value: '1' } });
        fireEvent.change(githubLoginField, { target: { value: 'cgaucho' } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
                "courseId": "1",
                "githubLogin": "cgaucho"
        });

        expect(mockToast).toBeCalledWith("New staff added - id: 1");
        expect(mockNavigate).toBeCalledWith({ "to": "/course/1/staff" });
    });


});

