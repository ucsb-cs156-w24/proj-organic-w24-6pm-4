import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import SchoolsForm from "main/components/Schools/SchoolsForm";
import { SchoolsFixtures } from "fixtures/SchoolsFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("SchoolsForm tests", () => {

    test("renders correctly", async () => {
        render(
            <Router  >
                <SchoolsForm/>
            </Router>
        );
        await screen.findByText(/Abbreviation/);
        await screen.findByText(/Create/);
    });

    test("renders correctly when passing in a School", async () => {
        render(
            <Router  >
                <SchoolsForm initialContents={SchoolsFixtures.oneSchool} />
            </Router>
        );
        await screen.findByTestId(/SchoolsForm-abbrev/);
        expect(screen.getByText(/Abbreviation/)).toBeInTheDocument();
        expect(screen.getByTestId(/SchoolsForm-abbrev/)).toHaveValue("ucsb");
    });

    test("Correct Error messsages on bad input", async () => {
        render(
            <Router  >
                <SchoolsForm/>
            </Router>
        );
        await screen.findByTestId("SchoolsForm-abbrev");
        const abbrevField = screen.getByTestId("SchoolsForm-abbrev");
        const submitButton = screen.getByTestId("SchoolsForm-submit");

        fireEvent.change(abbrevField, { target: { value: 'Bad-Input' } });
        fireEvent.click(submitButton);

        await screen.findByText(/Abbreviation must be lowercase letters/);
    });

    test("Correct Error messsages on missing input", async () => {
        render(
            <Router  >
                <SchoolsForm/>
            </Router>
        );
        await screen.findByTestId("SchoolsForm-submit");
        const submitButton = screen.getByTestId("SchoolsForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/Abbreviation is required./);
        expect(screen.getByText(/Name is required./)).toBeInTheDocument();
        expect(screen.getByText(/Term Regex is required./)).toBeInTheDocument();
        expect(screen.getByText(/Term Description is required./)).toBeInTheDocument();
        expect(screen.getByText(/Term Error is required./)).toBeInTheDocument();
    });

    test("No Error messsages on good input", async () => {
        const mockSubmitAction = jest.fn();
        render(
            <Router  >
                <SchoolsForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("SchoolsForm-abbrev");

        const abbrevField = screen.getByTestId("SchoolsForm-abbrev");
        const nameField = screen.getByTestId("SchoolsForm-name");
        const termRegexField = screen.getByTestId("SchoolsForm-termRegex");
        const termDescriptionField = screen.getByTestId("SchoolsForm-termDescription");
        const termErrorField = screen.getByTestId("SchoolsForm-termError");
        const submitButton = screen.getByTestId("SchoolsForm-submit");

        fireEvent.change(abbrevField, { target: { value: 'ucsb' } });
        fireEvent.change(nameField, { target: { value: 'UC Santa Barbara' } });
        fireEvent.change(termRegexField, { target: { value: '[WSMF]\\d\\d' } });
        fireEvent.change(termDescriptionField, { target: { value: 'Enter quarter, e.g. F23, W24, S24, M24' } });
        fireEvent.change(termErrorField, { target: { value: 'Quarter must be entered in the correct format' } });
        fireEvent.click(submitButton);

        await screen.findByTestId(/SchoolsForm-abbrev/);
        expect(screen.queryByText(/Abbreviation is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Abbreviation must be lowercase letters (_ and . allowed), e.g. ucsb/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Name is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Term Regex is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Term Description is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/Term Error is required./)).not.toBeInTheDocument();
    });

    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <Router  >
                <SchoolsForm/>
            </Router>
        );
        await screen.findByTestId("SchoolsForm-cancel");
        const cancelButton = screen.getByTestId("SchoolsForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });
});


