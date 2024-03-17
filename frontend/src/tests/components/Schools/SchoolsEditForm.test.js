import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import SchoolsEditForm from "main/components/Schools/SchoolsEditForm";
import { SchoolsFixtures } from "fixtures/SchoolsFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("SchoolsEditForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Name", "Term Regex", "Term Description", "Term Error"];
    const testId = "SchoolsForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <SchoolsEditForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <SchoolsEditForm initialContents={SchoolsFixtures.oneSchool} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-abbrev`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-name`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-termRegex`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-termDescription`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-termError`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-submit`)).toBeInTheDocument();
        expect(screen.getByText(`Abbreviation`)).toBeInTheDocument();
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <SchoolsEditForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("that the correct validations are performed", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <SchoolsEditForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);

        await screen.findByText(/Name is required./);
        expect(screen.getByText(/Term Regex is required./)).toBeInTheDocument();
        expect(screen.getByText(/Term Description is required./)).toBeInTheDocument();
        expect(screen.getByText(/Term Error is required./)).toBeInTheDocument();

    });
});