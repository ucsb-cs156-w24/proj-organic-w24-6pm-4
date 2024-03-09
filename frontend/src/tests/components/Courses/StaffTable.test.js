import StaffTable from "main/components/Courses/StaffTable";
import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { staffFixtures } from "fixtures/staffFixtures";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("UserTable tests", () => {
  const queryClient = new QueryClient();

  test("Has the expected column headers and content for ordinary user", () => {

    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <StaffTable staffs={staffFixtures.threeStaffs} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ["id", "Course ID", "Github ID", "Github Login", "Full Name", "Admin", "Instructor"];
    const expectedFields = ["id", "courseId", "githubId", "user.githubLogin", "user.fullName", "user.admin", "user.instructor"];
    const testId = "StaffTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-user.admin`)).toHaveTextContent("No");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-user.instructor`)).toHaveTextContent("Yes");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-user.admin`)).toHaveTextContent("Yes");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-user.instructor`)).toHaveTextContent("No");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("3");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-user.admin`)).toHaveTextContent("Yes");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-user.instructor`)).toHaveTextContent("Yes");

    const deleteButton = screen.queryByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).not.toBeInTheDocument();

  });

  test("renders empty table correctly", () => {

    // arrange
    const currentUser = currentUserFixtures.adminUser;

    const expectedHeaders = ["id", "Course ID", "Github ID", "Github Login", "Full Name", "Admin", "Instructor"];
    const expectedFields = ["id", "courseId", "githubId", "user.githubLogin", "user.fullName", "user.admin", "user.instructor"];
    const testId = "StaffTable";

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <StaffTable staffs={[]} currentUser={currentUser} />
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


  test("Has the expected colum headers and content for adminUser", () => {

    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
            <StaffTable staffs={staffFixtures.threeStaffs} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ["id", "Course ID", "Github ID", "Github Login", "Full Name", "Admin", "Instructor"];
    const expectedFields = ["id", "courseId", "githubId", "user.githubLogin", "user.fullName", "user.admin", "user.instructor"];
    const testId = "StaffTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-user.admin`)).toHaveTextContent("No");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-user.instructor`)).toHaveTextContent("Yes");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-user.admin`)).toHaveTextContent("Yes");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-user.instructor`)).toHaveTextContent("No");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("3");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-user.admin`)).toHaveTextContent("Yes");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-user.instructor`)).toHaveTextContent("Yes");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");

  });


  test("Delete button calls the callback", async () => {

    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
            <StaffTable staffs={staffFixtures.threeStaffs} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    await waitFor(() => { expect(screen.getByTestId(`StaffTable-cell-row-0-col-id`)).toHaveTextContent("1"); });

    const deleteButton = screen.getByTestId(`StaffTable-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);

  });

});