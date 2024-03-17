import React from 'react';
import SchoolsDropdown from 'main/components/Schools/SchoolsDropdown';
import { SchoolsFixtures } from 'fixtures/SchoolsFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';

export default {
    title: 'components/Schools/SchoolsDropdown',
    component: SchoolsDropdown
};

const Template = (args) => {
    return (
        <SchoolsDropdown {...args} />
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
