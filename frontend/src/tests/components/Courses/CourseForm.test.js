import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import CourseForm from "main/components/Courses/CourseForm";
import { courseFixtures } from "fixtures/courseFixtures";
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


describe("CourseForm tests", () => {

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
                    <CourseForm />
                </Router>
            </QueryClientProvider>
        );
        await screen.findByText(/Name/);
        await screen.findByText(/Create/);
    });


    test("renders correctly when passing in a course", async () => {
        setup();
        axiosMock.onGet("/api/Schools/all").reply(200, SchoolsFixtures.threeSchools);

        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <CourseForm initialContents={courseFixtures.oneCourse}/>
                </Router>
            </QueryClientProvider>
        );

        await screen.findByTestId(/CourseForm-id/);
        
        await waitFor(() => {expect(screen.getByTestId("CourseForm-school")).toHaveValue("ucsb")});
        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });


        expect(screen.getByTestId("CourseForm-school")).toHaveValue("ucsb");

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

        expect(screen.getByText(/Id/)).toBeInTheDocument();
        await waitFor(() => expect(screen.getByTestId(/CourseForm-id/)).toHaveValue("1"));
        expect(screen.getByTestId("FormSelect-option-ucsb")).toBeInTheDocument();

    });


    test("Correct Error messsages on missing input", async () => {
        setup();

        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <CourseForm />
                </Router>
            </QueryClientProvider>
        );
        await screen.findByTestId("CourseForm-submit");

        const submitButton = screen.getByTestId("CourseForm-submit");

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
                    <CourseForm submitAction={mockSubmitAction}/>
                </Router>
            </QueryClientProvider>
        );
        await screen.findByTestId("FormSelect-option-ucsb");

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

        expect(screen.getByText("Term")).toBeInTheDocument();

        const nameField = screen.getByTestId("CourseForm-name");
        const schoolField = screen.getByTestId("CourseForm-school");
        const schoolSelect = screen.getByTestId("FormSelect");
        const termField = screen.getByTestId("CourseForm-term");
        const startDateField = screen.getByTestId("CourseForm-startDate");
        const endDateField = screen.getByTestId("CourseForm-endDate");
        const githubOrgField = screen.getByTestId("CourseForm-githubOrg")
        const submitButton = screen.getByTestId("CourseForm-submit");

        fireEvent.change(nameField, { target: { value: "CMPSC 156" } });
        fireEvent.change(schoolSelect, {target : { value : "umn"}});
        fireEvent.change(termField, { target: { value: 'f23' } });
        fireEvent.change(startDateField, { target: { value: '2022-01-02T12:00' } });
        fireEvent.change(endDateField, { target: { value: '2022-02-02T12:00' } });
        fireEvent.change(githubOrgField, { target: { value: 'cs156-f23'}})

        expect(schoolField).toHaveValue("umn");
        expect(screen.getByText("Enter quarter, e.g. F24, W25, S25, M25")).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/School is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/StartDate date is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/EndDate date is required./)).not.toBeInTheDocument();
    });

    test("preloads term info and changes info properly", async () => {
        setup();

        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <CourseForm initialContents={courseFixtures.oneCourse}/>
                </Router>
            </QueryClientProvider>
        );

        await screen.findByTestId("FormSelect-option-ucsb");

        expect(screen.getByText("Enter quarter, e.g. F23, W24, S24, M24")).toBeInTheDocument();

        const schoolSelect = screen.getByTestId("FormSelect");
        fireEvent.change(schoolSelect, {target : { value : "umn"}});

        expect(screen.getByText("Enter quarter, e.g. F24, W25, S25, M25")).toBeInTheDocument();

    });

    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <CourseForm />
                </Router>
            </QueryClientProvider>
        );
        await screen.findByTestId("CourseForm-cancel");
        const cancelButton = screen.getByTestId("CourseForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});
