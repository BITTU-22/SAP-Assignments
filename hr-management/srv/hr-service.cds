using { com.hr as hr } from '../db/schema.cds';

service HRService {
    entity Departments    as projection on hr.Departments;
    entity Employees      as projection on hr.Employees;
    entity Projects       as projection on hr.Projects;
    entity Skills         as projection on hr.Skills;
    entity Assignments    as projection on hr.Assignments;
    entity EmployeeSkills as projection on hr.EmployeeSkills;
}

    @readonly entity TeamOverview     as projection on hr.TeamOverview;
    @readonly entity ProjectDashboard as projection on hr.ProjectDashboard;
    @readonly entity SkillsMatrix     as projection on hr.SkillsMatrix;
