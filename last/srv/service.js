const cds = require("@sap/cds");
const axios = require("axios");

module.exports = cds.service.impl(async function () {

    this.on("triggerLeaveProcess", async (req) => {

        const {
            employeeID,
            employeeName,
            leaveDate,
            approvalEmail,
            leaveType,
            comments
        } = req.data;

        try {

            // ===== OAuth Details =====
            const clientId = "sb-fd9ffb66-b631-418d-8a19-8d265027b6ba!b651363|xsuaa!b49390";
            const clientSecret = "3a1c6f11-9b34-4909-83a2-8a8d1d6800a4$k_yRWrtnb-5KglYETDbm-eocb9-EEOfBjhc_UKoG004=";
            const tokenUrl = "https://b38cf66dtrial.authentication.us10.hana.ondemand.com/oauth/token";

            // ===== Generate Access Token =====
            const tokenResponse = await axios.post(
                tokenUrl,
                "grant_type=client_credentials",
                {
                    auth: {
                        username: clientId,
                        password: clientSecret
                    },
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            );

            const accessToken = tokenResponse.data.access_token;

            // ===== Trigger Workflow =====
            const workflowUrl =
                "https://spa-api-gateway-bpi-ap-prod.cfapps.ap21.hana.ondemand.com/workflow/rest/v1/workflow-instances";

            const payload = {
                definitionId: "us10.b38cf66dtrial.leaveprocess.holidayProcess",
                context: {
                    employeeID,
                    employeeName,
                    leaveDate,
                    approvalEmail,
                    leaveType,
                    comments
                }
            };

            const workflowResponse = await axios.post(
                workflowUrl,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            return workflowResponse.data;

        } catch (err) {

            console.error(err.response?.data || err.message);

            req.error({
                code: 500,
                message: JSON.stringify(err.response?.data || err.message)
            });

        }

    });

});