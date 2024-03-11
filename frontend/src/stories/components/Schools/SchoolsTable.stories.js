import React from 'react';
import SchoolsTable from 'main/components/Schools/SchoolsTable';
import { SchoolsFixtures } from 'fixtures/SchoolsFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';
import { rest } from "msw";

export default {
    title: 'components/Schools/SchoolsTable',
    component: SchoolsTable
};

const Template = (args) => {
    return (
        <SchoolsTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    schools: []
};

export const ThreeSchoolsOrdinaryUser = Template.bind({});

ThreeSchoolsOrdinaryUser.args = {
    schools: SchoolsFixtures.threeSchools,
    currentUser: currentUserFixtures.userOnly,
};

export const ThreeSchoolsAdminUser = Template.bind({});
ThreeSchoolsAdminUser.args = {
    schools: SchoolsFixtures.threeSchools,
    currentUser: currentUserFixtures.adminUser,
}

ThreeSchoolsAdminUser.parameters = {
    msw: [
        rest.delete('/api/Schools', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};