import React from 'react';
import CoursesForm from 'main/components/Courses/CoursesForm';
import { coursesFixtures } from 'fixtures/coursesFixtures';
import { SchoolsFixtures } from 'fixtures/SchoolsFixtures';

import { rest } from "msw";

export default {
    title: 'components/Courses/CoursesForm',
    component: CoursesForm
};


const Template = (args) => {
    return (
        <CoursesForm {...args} />
    )
};

export const Create = Template.bind({});
Create.parameters = {
    msw: [
        rest.get('/api/Schools/all', (_req, res, ctx) => {
            return res(ctx.json(SchoolsFixtures.threeSchools));
        }),
    ]
}

Create.args = {
    buttonLabel: "Create",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data); 
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }
};

export const Update = Template.bind({});
Update.parameters = {
    msw: [
        rest.get('/api/Schools/all', (_req, res, ctx) => {
            return res(ctx.json(SchoolsFixtures.threeSchools));
        }),
    ]
}

Update.args = {
    initialContents: coursesFixtures.oneCourse,
    buttonLabel: "Update",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data); 
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }
};