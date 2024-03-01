import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { SchoolsFixtures } from "fixtures/SchoolsFixtures";
import { rest } from "msw";

import SchoolsIndexPage from 'main/pages/Schools/SchoolsIndexPage';

export default {
    title: 'pages/Schools/SchoolsIndexPage',
    component: SchoolsIndexPage
};

const Template = () => <SchoolsIndexPage storybook={true}/>;

export const Empty = Template.bind({});
Empty.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res(ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/Schools/all', (_req, res, ctx) => {
            return res(ctx.json([]));
        }),
    ]
}

export const ThreeSchoolsOrdinaryUser = Template.bind({});

ThreeSchoolsOrdinaryUser.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/Schools/all', (_req, res, ctx) => {
            return res(ctx.json(SchoolsFixtures.threeSchools));
        }),
    ],
}

export const ThreeSchoolsAdminUser = Template.bind({});

ThreeSchoolsAdminUser.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.adminUser));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/Schools/all', (_req, res, ctx) => {
            return res(ctx.json(SchoolsFixtures.threeSchools));
        }),
        rest.delete('/api/Schools', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}