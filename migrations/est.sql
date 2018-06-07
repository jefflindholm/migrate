SELECT
    ic_fields.date_created,
    ic_fields.ic_pkg_id,
    ic_fields.dcn,
    ic_fields.field_xpath,
    ic_fields.field_value,
    ic_fields.lender,
    ic_fields.confidence,
    vf.field_value,
    CASE
        WHEN vf.field_value = ic_fields.field_value then 'Pass'
        ELSE 'Fail'
    END as result,
    case
        when substring(ic_fields.field_xpath,1,49)='/contract_export_data/general_data/<document_type' then 'classification'
        else 'extraction'
    END as engine
FROM ic_fields
JOIN validated_fields vf on vf.DCN = ic_fields.dcn and vf.field_xpath = ic_fields.field_xpath
WHERE ic_fields.Lender LIKE lenderid
AND ic_fields.DCN LIKE DCNIn
AND ic_fields.date_created BETWEEN start_date AND end_date
AND ic_fields.field_value IS NOT NULL
-- WHERE ic_fields.Lender LIKE 'lender%'
-- AND ic_fields.DCN LIKE 'dcn%'
-- AND ic_fields.date_created BETWEEN '12/31/2017' AND '1/2/2018'
-- AND ic_fields.field_value IS NOT NULL
AND ic_fields.field_value <> ''
ORDER BY ic_fields.DCN, ic_fields.field_xpath;

UPDATE ic_fields
SET
result = CASE
        WHEN vf.field_value = ic_fields.field_value then 'Pass'
        ELSE 'Fail'
    END,
engine = case
        when substring(ic_fields.field_xpath,1,49)='/contract_export_data/general_data/<document_type' then 'classification'
        else 'extraction'
    END

FROM validated_fields vf
WHERE vf.DCN = ic_fields.dcn and vf.field_xpath = ic_fields.field_xpath
-- AND ic_fields.Lender LIKE lenderid
-- AND ic_fields.DCN LIKE DCNIn
-- AND ic_fields.date_created BETWEEN start_date AND end_date
-- AND ic_fields.field_value IS NOT NULL
AND ic_fields.Lender LIKE 'lender%'
AND ic_fields.DCN LIKE 'dcn%'
AND ic_fields.date_created BETWEEN '12/31/2017' AND '1/2/2018'
AND ic_fields.field_value IS NOT NULL
AND ic_fields.field_value <> ''
--ORDER BY ic_fields.DCN, ic_fields.field_xpath
;
