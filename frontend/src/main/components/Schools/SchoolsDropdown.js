import { useState } from "react";
import { Form } from "react-bootstrap";

function SchoolsDropdown({ schools , initialContents}){
    // Stryker disable next-line all : don't test useState
    const [isActive, setIsActive] = useState();

    const testId = "FormSelect";

    let initialSchool = null;

    if(initialContents){
        initialSchool = initialContents.school;
    }

    let schoolOptions = null;

    if(schools){
        schoolOptions = schools.map((school) => 
            <option 
                key = {school.abbrev}
                data-testid={`${testId}-option-${school.abbrev}`}
            > 
                {school.abbrev} 
            </option>);
    }


    return(
        <Form.Select 
            id = "FormSelect"
            data-testid = "FormSelect"
            value = { isActive || initialSchool || "No school selected" } 
            onChange = { option => setIsActive(option.target.value)} 
            >
            <option 
                key = "No school selected"
                disabled = {true}
                data-testid={`${testId}-option-No school selected`}
            >
                No school selected
            </option>
            { schoolOptions }
        </Form.Select>
    )
}

export default SchoolsDropdown;