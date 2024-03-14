import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { rest } from "msw";

import SchoolsEditPage from 'main/pages/Schools/SchoolsEditPage';
import { SchoolsFixtures } from 'fixtures/SchoolsFixtures';

export default {
    title: 'pages/Schools/SchoolsEditPage',
    component: SchoolsEditPage
};

const Template = () => <SchoolsEditPage storybook={true}/>;

export const Default = Template.bind({});
Default.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/Schools', (_req, res, ctx) => {
            return res(ctx.json(SchoolsFixtures.threeSchools[0]));
        }),
        rest.put('/api/Schools', async (req, res, ctx) => {
            var reqBody = await req.text();
            window.alert("PUT: " + req.url + " and body: " + reqBody);
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}