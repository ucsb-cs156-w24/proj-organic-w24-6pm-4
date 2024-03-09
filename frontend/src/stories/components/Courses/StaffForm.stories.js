import React from 'react';
import StaffForm from 'main/components/Courses/StaffForm';
import { staffFixtures } from 'fixtures/staffFixtures';

export default {
    title: 'components/Courses/StaffForm',
    component: StaffForm
};


const Template = (args) => {
    return (
        <StaffForm {...args} />
    )
};

export const Create = Template.bind({});

Create.args = {
    courseId: staffFixtures.oneStaff.courseId,
    buttonLabel: "Add",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data); 
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }
};