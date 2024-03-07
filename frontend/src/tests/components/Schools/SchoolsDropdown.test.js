import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import SchoolsDropdown from "main/components/Schools/SchoolsDropdown";
import { SchoolsFixtures } from "fixtures/SchoolsFixtures";

import { QueryClient, QueryClientProvider } from "react-query";
import { coursesFixtures } from "fixtures/coursesFixtures";

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("SchoolsDropdown tests", () => {
    const queryClient = new QueryClient();

    const testId = "FormSelect";

    test("renders correctly with no schools", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <SchoolsDropdown />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.getByTestId(`${testId}-option-No school selected`)).toBeInTheDocument();

    });

    test("renders correctly when passing in three schools", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <SchoolsDropdown schools={SchoolsFixtures.threeSchools} initialContents={coursesFixtures.oneCourse}/>
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.getByTestId(`${testId}-option-No school selected`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-option-ucsb`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-option-umn`)).toBeInTheDocument();
        expect(await screen.findByTestId(`${testId}-option-ucsd`)).toBeInTheDocument();

        expect(screen.getByTestId(`${testId}`)).toHaveValue("ucsb");

    });


    test("that you can select an option", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <SchoolsDropdown schools={SchoolsFixtures.threeSchools} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.getByTestId(`${testId}-option-No school selected`)).toBeInTheDocument();

        expect(screen.getByTestId(`${testId}`)).toHaveValue("No school selected");

        let dropdown = screen.getByTestId(`${testId}`);
        expect(dropdown).toBeInTheDocument();
        
        fireEvent.change(dropdown, { target: {value: "ucsb"}});
        expect(screen.getByTestId(`${testId}`)).toHaveValue("ucsb");
        fireEvent.change(dropdown, { target: {value: "umn"}});
        expect(dropdown).toHaveValue("umn");
        fireEvent.change(dropdown, { target: {value: "ucsd"}});
        expect(dropdown).toHaveValue("ucsd");

        expect(screen.getByTestId(`${testId}-option-No school selected`)).toBeDisabled();


    });
});