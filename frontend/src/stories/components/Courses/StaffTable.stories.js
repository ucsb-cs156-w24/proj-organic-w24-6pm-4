import React from 'react';
import StaffTable from "main/components/Courses/StaffTable";
import { staffFixtures } from 'fixtures/staffFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';
import { rest } from "msw";

export default {
    title: 'components/Courses/StaffTable',
    component: StaffTable
};

const Template = (args) => {
    return (
        <StaffTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    staffs: []
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
    staffs: staffFixtures.threeStaffs,
    currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
    staffs: staffFixtures.threeStaffs,
    currentUser: currentUserFixtures.adminUser,
}

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.delete('/api/course/staff', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};