/**
 *@NApiVersion 2.x
 *@NScriptType Restlet
 */
 define(['N/search', 'N/workflow', 'N/record'], function (search, workflow, record) {


    function _get(context) {
        try {
            var ButtonId = context.ButtonId;
            var recordId = context.recordId;
            var objRecord = record.load({
                type: record.Type.PURCHASE_REQUISITION,
                id: recordId,
                isDynamic: true
            })
            var employeeId = objRecord.getValue('nextapprover')
            log.debug('employeeId', employeeId)
            var nextApprovers = getNextApprover(employeeId);
          log.debug('nextApprover',nextApprovers)
          var nextApprover;
          for(var i=0;i<nextApprovers.length;i++){
            if(nextApprovers[i]=="1035"){
                nextApprover = nextApprovers[i]
            }
          }

            if (ButtonId == 1) {
                if (nextApprover != '1035') {
                    var rejectionReason = objRecord.setValue('custbody_nsts_gaw_rejection_reason', context.rejectionReason);
                    var workflowInstanceId = workflow.trigger({
                        recordId: recordId, // replace with an actual record id
                        recordType: record.Type.PURCHASE_REQUISITION,
                        workflowId: 'customworkflow36',
                        actionId: 'workflowaction88919'
                    });
                    return {
                        success: true,
                        message: 'Purchase Requisition has been Rejected'
                    }
                }
                else if (nextApprover == '1035') {
                    var rejectionReason = objRecord.setValue('custbody_nsts_gaw_rejection_reason', context.rejectionReason);
                    var workflowInstanceId = workflow.trigger({
                        recordId: recordId, // replace with an actual record id
                        recordType: record.Type.PURCHASE_REQUISITION,
                        workflowId: 'customworkflow36',
                        actionId: 'workflowaction88923'
                    });
                    return {
                        success: true,
                        message: 'Purchase Requisition has been Rejected by CFO'
                    }
                }


            }
            /////////////////Resubmit for approval button
            // else if (ButtonId == 2) {

            //     var workflowInstanceId = workflow.trigger({
            //         recordId: recordId, // replace with an actual record id
            //         recordType: record.Type.PURCHASE_REQUISITION,
            //         workflowId: 'customworkflow36',
            //         actionId: 'workflowaction88904'
            //     });
            //     return {
            //         success: true,
            //         message: 'Purchase requistion record is in Initiation state'
            //     }
            // }
            //////////////////Approved in state 2
            else if (ButtonId == 2) {
                if (nextApprover != '1035') {
                    var workflowInstanceId = workflow.trigger({
                        recordId: recordId, // replace with an actual record id
                        recordType: record.Type.PURCHASE_REQUISITION,
                        workflowId: 'customworkflow36',
                        actionId: 'workflowaction88918'
                    });
                    return {
                        success: true,
                        message: 'Purchase Requisition has been Approved'
                    }
                }
                else if (nextApprover == '1035') {
                    var workflowInstanceId = workflow.trigger({
                        recordId: recordId, // replace with an actual record id
                        recordType: record.Type.PURCHASE_REQUISITION,
                        workflowId: 'customworkflow36',
                        actionId: 'workflowaction88922'
                    });
                    return {
                        success: true,
                        message: 'Purchase Requisition has been Approved by CFO'
                    }
                }

            }


        }
        catch (e) {
            log.debug('error message', e)
            return {
                success: false,
                message: e.message
            }
        }

    }
    function getNextApprover(employeeId) {
        var employeeSearchObj = search.create({
            type: "employee",
            filters:
                [
                    ["internalid", "anyof", employeeId]
                ],
            columns:
                [
                    search.createColumn({ name: "role", label: "Role" })
                ]
        });
        var searchResultCount = employeeSearchObj.runPaged().count;
        log.debug("employeeSearchObj result count", searchResultCount);
        var role=[];
        employeeSearchObj.run().each(function (result) {
            var roles = result.getValue({ name: "role" })
            role.push(roles);
            return true;
        });
       

        return role;
    }

    function _post(context) {
        return {
            success: false,
            message: 'This method is not allowed'
        }
    }

    function _put(context) {
        return {
            success: false,
            message: 'This method is not allowed'
        }
    }

    function _delete(context) {
        return {
            success: false,
            message: 'This method is not allowed'
        }
    }

    return {
        get: _get,
        post: _post,
        put: _put,
        delete: _delete
    }
});
