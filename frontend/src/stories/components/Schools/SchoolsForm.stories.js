import React from 'react';
import SchoolsForm from "main/components/Schools/SchoolsForm"
import { SchoolsFixtures } from 'fixtures/SchoolsFixtures';

export default {
    title: 'components/Schools/SchoolsForm',
    component: SchoolsForm
};


const Template = (args) => {
    return (
        <SchoolsForm {...args} />
    )
};

export const Create = Template.bind({});

Create.args = {
    buttonLabel: "Create",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data); 
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }
};

export const Update = Template.bind({});

Update.args = {
    initialContents: SchoolsFixtures.oneSchool,
    buttonLabel: "Update",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data); 
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }
};