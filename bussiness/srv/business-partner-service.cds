using { API_BUSINESS_PARTNER as external } from './external/API_BUSINESS_PARTNER';

service BusinessPartnerService @(requires: 'authenticated-user') {
    entity BusinessPartners
        as projection on external.A_BusinessPartner;
}