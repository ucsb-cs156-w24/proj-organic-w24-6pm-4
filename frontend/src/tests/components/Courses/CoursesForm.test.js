import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import CoursesForm from "main/components/Courses/CoursesForm";
import { coursesFixtures } from "fixtures/coursesFixtures";
import { BrowserRouter as Router } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "react-query";
import { SchoolsFixtures } from "fixtures/SchoolsFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("CoursesForm tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const setup = () => {
        axiosMock.reset();
        axiosMock.resetHistory();

        axiosMock.onGet("/api/Schools/all").reply(200, SchoolsFixtures.threeSchools);
    }

    const queryClient = new QueryClient();

    test("renders correctly", async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <CoursesForm />
                </Router>
            </QueryClientProvider>
        );
        await screen.findByText(/Name/);
        await screen.findByText(/Create/);
    });


    test("renders correctly when passing in a Courses", async () => {
        setup();

        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <CoursesForm initialContents={coursesFixtures.oneCourse}/>
                </Router>
            </QueryClientProvider>
        );

        await screen.findByTestId(/CoursesForm-id/);
        
        await waitFor(() => {expect(screen.getByTestId("CoursesForm-school")).toHaveValue("ucsb")});
        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

        await waitFor(() => expect(screen.getByText(/Id/)).toBeInTheDocument());
        await waitFor(() => expect(screen.getByTestId(/CoursesForm-id/)).toHaveValue("1"));
        await waitFor(() => expect(screen.getByTestId("FormSelect-option-ucsb")).toBeInTheDocument());

    });


    test("Correct Error messsages on missing input", async () => {
        setup();

        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <CoursesForm />
                </Router>
            </QueryClientProvider>
        );
        await screen.findByTestId("CoursesForm-submit");

        const submitButton = screen.getByTestId("CoursesForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/Name is required./);
        expect(screen.getByText(/Name is required/)).toBeInTheDocument();
        expect(screen.getByText(/School is required./)).toBeInTheDocument();
        expect(screen.getByText(/Term is required./)).toBeInTheDocument();
        expect(screen.getByText(/StartDate date is required./)).toBeInTheDocument();
        expect(screen.getByText(/EndDate date is required./)).toBeInTheDocument();
        expect(screen.getByText(/GithubOrg is required./)).toBeInTheDocument();
    });

    test("No Error messsages on good input", async () => {
        setup();

        const mockSubmitAction = jest.fn();

        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <CoursesForm submitAction={mockSubmitAction}/>
                </Router>
            </QueryClientProvider>
        );
        await screen.findByTestId("FormSelect-option-ucsb");

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

        expect(screen.getByText("Term")).toBeInTheDocument();

        const nameField = screen.getByTestId("CoursesForm-name");
        const schoolField = screen.getByTestId("CoursesForm-school");
        const schoolSelect = screen.getByTestId("FormSelect");
        const termField = screen.getByTestId("CoursesForm-term");
        const startDateField = screen.getByTestId("CoursesForm-startDate");
        const endDateField = screen.getByTestId("CoursesForm-endDate");
        const githubOrgField = screen.getByTestId("CoursesForm-githubOrg")
        const submitButton = screen.getByTestId("CoursesForm-submit");

        fireEvent.change(nameField, { target: { value: "CMPSC 156" } });
        fireEvent.change(schoolSelect, {target : { value : "umn"}});
        fireEvent.change(termField, { target: { value: 'f23' } });
        fireEvent.change(startDateField, { target: { value: '2022-01-02T12:00' } });
        fireEvent.change(endDateField, { target: { value: '2022-02-02T12:00' } });
        fireEvent.change(githubOrgField, { target: { value: 'cs156-f23'}})

        expect(schoolField).toHaveValue("umn");
        expect(screen.getByText("Enter quarter, e.g. F24, W25, S25, M25")).toBeInTheDocument();

        fireEvent.click(submitButton);

        expect(screen.queryByText(/School is required./)).not.toBeInTheDocument();

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        // expect(screen.getByText(/School is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/StartDate date is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/EndDate date is required./)).not.toBeInTheDocument();
    });

    test("preloads term info", async () => {
        setup();

        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <CoursesForm initialContents={coursesFixtures.oneCourse}/>
                </Router>
            </QueryClientProvider>
        );

    });

    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <CoursesForm />
                </Router>
            </QueryClientProvider>
        );
        await screen.findByTestId("CoursesForm-cancel");
        const cancelButton = screen.getByTestId("CoursesForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});