import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { SchoolsFixtures } from "fixtures/SchoolsFixtures";
import SchoolsTable from "main/components/Schools/SchoolsTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

describe("SchoolsTable tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = ["Abbreviation", "Name", "Term Regex", "Term Description", "Term Error"];
  const expectedFields = ["abbrev", "name", "termRegex", "termDescription", "termError"];
  const testId = "SchoolsTable";

  test("renders empty table correctly", () => {
    
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SchoolsTable schools = {[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const fieldElement = screen.queryByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(fieldElement).not.toBeInTheDocument();
    });
  });

  test("Has the expected column headers, content and buttons for admin user", () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SchoolsTable schools ={SchoolsFixtures.threeSchools} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-abbrev`)).toHaveTextContent("ucsb");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("UC Santa Barbara");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-termRegex`)).toHaveTextContent("[WSMF]\\d\\d");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-termDescription`)).toHaveTextContent("Enter quarter, e.g. F23, W24, S24, M24");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-termError`)).toHaveTextContent("Quarter must be entered in the correct format");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-abbrev`)).toHaveTextContent("umn");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-name`)).toHaveTextContent("University of Minnesota");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-termRegex`)).toHaveTextContent("[WSMF]\\d\\d");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-termDescription`)).toHaveTextContent("Enter quarter, e.g. F23, W24, S24, M24");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-termError`)).toHaveTextContent("Quarter must be entered in the correct format");

    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");

  });

  test("Has the expected column headers, content for ordinary user", () => {
    // arrange
    const currentUser = currentUserFixtures.userOnly;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SchoolsTable schools ={SchoolsFixtures.threeSchools} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-abbrev`)).toHaveTextContent("ucsb");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("UC Santa Barbara");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-termRegex`)).toHaveTextContent("[WSMF]\\d\\d");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-termDescription`)).toHaveTextContent("Enter quarter, e.g. F23, W24, S24, M24");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-termError`)).toHaveTextContent("Quarter must be entered in the correct format");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-abbrev`)).toHaveTextContent("umn");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-name`)).toHaveTextContent("University of Minnesota");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-termRegex`)).toHaveTextContent("[WSMF]\\d\\d");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-termDescription`)).toHaveTextContent("Enter quarter, e.g. F23, W24, S24, M24");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-termError`)).toHaveTextContent("Quarter must be entered in the correct format");

    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });


  test("Edit button navigates to the edit page", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SchoolsTable schools ={SchoolsFixtures.threeSchools} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert - check that the expected content is rendered
    expect(screen.getByTestId(`${testId}-cell-row-0-col-abbrev`)).toHaveTextContent("ucsb");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("UC Santa Barbara");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-termRegex`)).toHaveTextContent("[WSMF]\\d\\d");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-termDescription`)).toHaveTextContent("Enter quarter, e.g. F23, W24, S24, M24");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-termError`)).toHaveTextContent("Quarter must be entered in the correct format");

    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();

    // act - click the edit button
    fireEvent.click(editButton);

    // assert - check that the navigate function was called with the expected path
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/Schools/edit/ucsb'));

  });

  test("Delete button calls delete callback", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SchoolsTable schools ={SchoolsFixtures.threeSchools} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert - check that the expected content is rendered
    expect(screen.getByTestId(`${testId}-cell-row-0-col-abbrev`)).toHaveTextContent("ucsb");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("UC Santa Barbara");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-termRegex`)).toHaveTextContent("[WSMF]\\d\\d");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-termDescription`)).toHaveTextContent("Enter quarter, e.g. F23, W24, S24, M24");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-termError`)).toHaveTextContent("Quarter must be entered in the correct format");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();

    // act - click the delete button
    fireEvent.click(deleteButton);
  });
});