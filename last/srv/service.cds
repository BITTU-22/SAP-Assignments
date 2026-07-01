using { cuid } from '@sap/cds/common';

service WorkflowService {

    action triggerLeaveProcess(
        employeeID : String,
        employeeName : String,
        leaveDate : String,
        approvalEmail : String,
        leaveType : String,
        comments : String
    ) returns String;

}