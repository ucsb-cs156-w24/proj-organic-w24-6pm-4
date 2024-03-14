import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SchoolsCreatePage from "main/pages/Schools/SchoolsCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

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
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("SchoolsCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

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
                    <SchoolsCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /Schools", async () => {

        const queryClient = new QueryClient();
        const school = {
            abbrev: "ucla",
            name: "UC Los Angeles",
            termRegex: "[WSMF]\\d\\d",
            termDescription: "Enter quarter, e.g. F23, W24, S24, M24",
            termError: "Quarter must be entered in the correct format"
        };

        axiosMock.onPost("/api/Schools/post").reply(202, school);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <SchoolsCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByLabelText("Abbreviation")).toBeInTheDocument();
        });

        const abbrevInput = screen.getByLabelText("Abbreviation");
        expect(abbrevInput).toBeInTheDocument();
        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();
        const termRegexInput = screen.getByLabelText("Term Regex");
        expect(termRegexInput).toBeInTheDocument();
        const termDescriptionInput = screen.getByLabelText("Term Description");
        expect(termDescriptionInput).toBeInTheDocument();
        const termErrorInput = screen.getByLabelText("Term Error");
        expect(termErrorInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        fireEvent.change(abbrevInput, { target: { value: 'ucla' } })
        fireEvent.change(nameInput, { target: { value: 'UC Los Angeles' } })
        fireEvent.change(termRegexInput, { target: { value: '[WSMF]\\d\\d' } })
        fireEvent.change(termDescriptionInput, { target: { value: 'Enter quarter, e.g. F23, W24, S24, M24' } })
        fireEvent.change(termErrorInput, { target: { value: 'Quarter must be entered in the correct format' } })
        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            abbrev: "ucla",
            name: "UC Los Angeles",
            termRegex: "[WSMF]\\d\\d",
            termDescription: "Enter quarter, e.g. F23, W24, S24, M24",
            termError: "Quarter must be entered in the correct format"

        });

        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New school created - abbrev: ucla");
        expect(mockNavigate).toBeCalledWith({ "to": "/Schools" });

    });
});