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
            <Router  >
                <CourseForm />
            </Router>
        );
        await screen.findByText(/Name/);
        await screen.findByText(/Create/);
    });


    test("renders correctly when passing in a Courses", async () => {

        render(
            <Router  >
                <CourseForm initialContents={courseFixtures.oneCourse} />
            </Router>
        );
        await screen.findByTestId(/CourseForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/CourseForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <CourseForm />
            </Router>
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

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <CourseForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("CourseForm-name");

        const nameField = screen.getByTestId("CourseForm-name");
        const schoolField = screen.getByTestId("CourseForm-school");
        const termField = screen.getByTestId("CourseForm-term");
        const startDateField = screen.getByTestId("CourseForm-startDate");
        const endDateField = screen.getByTestId("CourseForm-endDate");
        const githubOrgField = screen.getByTestId("CourseForm-githubOrg")
        const submitButton = screen.getByTestId("CourseForm-submit");

        fireEvent.change(nameField, { target: { value: "CMPSC 156" } });
        fireEvent.change(schoolField, { target: { value: 'ucsb' } });
        fireEvent.change(termField, { target: { value: 'f23' } });
        fireEvent.change(startDateField, { target: { value: '2022-01-02T12:00' } });
        fireEvent.change(endDateField, { target: { value: '2022-02-02T12:00' } });
        fireEvent.change(githubOrgField, { target: { value: 'cs156-f23'}})
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/StartDate date is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/EndDate date is required./)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <CourseForm />
            </Router>
        );
        await screen.findByTestId("CourseForm-cancel");
        const cancelButton = screen.getByTestId("CourseForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});
