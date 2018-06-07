-- Up
insert into ic_fields (
    date_created,
    ic_pkg_id,
    dcn,
    field_xpath,
    field_value,
    lender,
    confidence)
Values
('1/1/2018', 1, 'dcn1', 'somepath1', '1h1', 'lender1', '100'),
('1/1/2018', 1, 'dcn1', 'somepath2', '1h2', 'lender1', '100'),
('1/1/2018', 1, 'dcn1', 'somepath3', '1h3', 'lender1', '100'),
('1/1/2018', 1, 'dcn1', 'somepath4', '1h4', 'lender1', '100'),
('1/1/2018', 1, 'dcn1', 'somepath5', '1h5', 'lender1', '100'),
('1/1/2018', 1, 'dcn1', 'somepath6', '1h6', 'lender1', '100'),
('1/1/2018', 1, 'dcn1', 'somepath7', '1h7', 'lender1', '100'),
('1/1/2018', 1, 'dcn1', 'somepath8', '1h8', 'lender1', '100'),
('1/1/2018', 1, 'dcn1', 'somepath9', '1h9', 'lender1', '100'),
('1/1/2018', 1, 'dcn1', 'somepat10', '110', 'lender1', '100'),
('1/1/2018', 1, 'dcn1', 'somepat11', '111', 'lender1', '100'),
('1/1/2018', 1, 'dcn1', 'somepat12', '112', 'lender1', '100'),
('1/1/2018', 1, 'dcn1', '/contract_export_data/general_data/<document_type>contract', 'contract', 'lender1', '100'),
('1/1/2018', 1, 'dcn1', '/contract_export_data/general_data/<document_type>title', 'title IN', 'lender1', '100');

insert into validated_fields (
    date_created,
    ic_pkg_id,
    dcn,
    field_xpath,
    field_value,
    lender,
    confidence)
Values
('1/1/2018', 1, 'dcn1', 'somepath1', '1h1', 'lender1', '100'),
('1/1/2018', 1, 'dcn1', 'somepath2', '1h2', 'lender1', '100'),
('1/1/2018', 1, 'dcn1', 'somepath3', '1h3', 'lender1', '100'),
('1/1/2018', 1, 'dcn1', 'somepath4', '1h4', 'lender1', '100'),
('1/1/2018', 1, 'dcn1', 'somepath5', '1h5', 'lender1', '100'),
('1/1/2018', 1, 'dcn1', 'somepath6', '1h6', 'lender1', '100'),
('1/1/2018', 1, 'dcn1', 'somepath7', '1h7', 'lender1', '100'),
('1/1/2018', 1, 'dcn1', 'somepath8', '1h8', 'lender1', '100'),
('1/1/2018', 1, 'dcn1', 'somepath9', '1h9', 'lender1', '100'),
('1/1/2018', 1, 'dcn1', 'somepat10', '10', 'lender1', '100'),
('1/1/2018', 1, 'dcn1', 'somepat11', '11', 'lender1', '100'),
('1/1/2018', 1, 'dcn1', 'somepat12', '12', 'lender1', '100'),
('1/1/2018', 1, 'dcn1', '/contract_export_data/general_data/<document_type>contract', 'contract', 'lender1', '100'),
('1/1/2018', 1, 'dcn1', '/contract_export_data/general_data/<document_type>title', 'title', 'lender1', '100');
-- Down
delete from ic_fields;
delete from validated_fields;
