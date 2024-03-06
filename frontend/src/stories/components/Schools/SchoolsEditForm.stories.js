import React from 'react';
import SchoolsEditForm from "main/components/Schools/SchoolsEditForm"
import { SchoolsFixtures } from 'fixtures/SchoolsFixtures';

export default {
    title: 'components/Schools/SchoolsEditForm',
    component: SchoolsEditForm
};


const Template = (args) => {
    return (
        <SchoolsEditForm {...args} />
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