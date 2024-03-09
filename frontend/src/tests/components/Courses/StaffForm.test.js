import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import StaffForm from "main/components/Courses/StaffForm";
import { staffFixtures } from "fixtures/staffFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("StaffForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <StaffForm />
            </Router>
        );
        await screen.findByText(/Course ID/);
        await screen.findByText(/Github Login/);
        await screen.findByText(/Add/);
    });


    test("renders correctly when passing in a staff", async () => {

        render(
            <Router  >
                <StaffForm initialContents={staffFixtures.oneStaff} />
            </Router>
        );
        await screen.findByTestId(/StaffForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/StaffForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <StaffForm />
            </Router>
        );
        await screen.findByTestId("StaffForm-submit");
        const submitButton = screen.getByTestId("StaffForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/Github Login is required./);
        expect(screen.getByText(/Github Login is required./)).toBeInTheDocument();
    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <StaffForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("StaffForm-courseId");

        const courseIdField = screen.getByTestId("StaffForm-courseId");
        const githubLoginField = screen.getByTestId("StaffForm-githubLogin");
        const submitButton = screen.getByTestId("StaffForm-submit");

        fireEvent.change(courseIdField, { target: { value: "1" } });
        fireEvent.change(githubLoginField, { target: { value: 'cgaucho' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/Github Login is required./)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <StaffForm />
            </Router>
        );
        await screen.findByTestId("StaffForm-cancel");
        const cancelButton = screen.getByTestId("StaffForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});