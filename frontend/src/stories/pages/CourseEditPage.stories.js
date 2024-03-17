
import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { courseFixtures } from 'fixtures/courseFixtures';
import { SchoolsFixtures } from 'fixtures/SchoolsFixtures';
import { rest } from "msw";

import CourseEditPage from 'main/pages/CourseEditPage';

export default {
    title: 'pages/CourseEditPage',
    component: CourseEditPage
};

const Template = () => <CourseEditPage storybook={true}/>;

export const Default = Template.bind({});
Default.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.adminUser));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/course', (_req, res, ctx) => {
            return res(ctx.json(courseFixtures.threeCourses[0]));
        }),
        rest.get('/api/Schools', (_req, res, ctx) => {
            return res(ctx.json(SchoolsFixtures.threeSchools));
        }),
        rest.put('/api/course', async (req, res, ctx) => {
            var reqBody = await req.text();
            window.alert("PUT: " + req.url + " and body: " + reqBody);
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}
