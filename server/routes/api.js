const express = require('express');
const router = express.Router();
var request = require('request');
var reqHeader = {
  'X-TRABBLE-APP-ID': '225e76270f0a4587948449453e043cc8',
  'X-TRABBLE-APP-SECRET': 'B4B757A1-65C3-43C0-AD0B-B75D55CE8430'
};

var apiDomain = 'https://trabble.azurewebsites.net';
// var apiDomain = 'http://localhost:55646';

var LoadSettingByPartnerAlliasName = (partnerName) => ({
  url: `${apiDomain}/api/partner/get-by-allias-name/` + partnerName,
  method: "GET",
  headers: reqHeader,
  json: true
});

var SearchPropertiesbyPartnerId = (partnerId, parentId = '') => ({
  url: `${apiDomain}/api/inventory-templates/search?partnerId=${partnerId}&parentId=${parentId}`,
  method: "GET",
  headers: reqHeader,
  json: true
});

var getInventoryTemplateDetail = (id) => ({
  url: `${apiDomain}/api/inventory-templates/${id}`,
  method: "GET",
  headers: reqHeader,
  json: true
});

var getInventoryTypes = {
  url: `${apiDomain}/api/inventory-types/search?isBookable=true`,
  method: "GET",
  headers: reqHeader,
  json: true
};

var getBookingEngineTypeByAlias = (partnerName) => ({
  url: `${apiDomain}/api/partner/${partnerName}/get-booking-engine-type`,
  method: "GET",
  headers: reqHeader,
  json: true
});

router.get('/', (req, res) => {
  res.send('api works');
});

router.get('/settings/:partnerAlliasName', (req, res) => {
  request(LoadSettingByPartnerAlliasName(req.params.partnerAlliasName), function (error, response, body) {
    res.status(200).json(response.body.result);
  })
})

router.get('/booking-engine-type/:partnerAlliasName', (req, res) => {
  request(getBookingEngineTypeByAlias(req.params.partnerAlliasName), function (error, response, body) {
    res.status(200).json(response.body);
  })
})

router.get('/search', (req, res) => {
  request(SearchPropertiesbyPartnerId(req.query.partner, req.query.parent), function (error, response, body) {
    res.status(200).json(response.body);
  })
});

router.get('/inventory-types', (req, res) => {
  request(getInventoryTypes, function (error, response, body) {
    res.status(200).json(response.body);
  })
});

router.get('/inventory-templates/:id', (req, res) => {
  request(getInventoryTemplateDetail(req.params.id), function (error, response, body) {
    res.status(200).json(response.body);
  })
});

router.get('/inventory-templates/:id', (req, res) => {
  request(getInventoryTemplateDetail(req.params.id), function (error, response, body) {
    res.status(200).json(response.body);
  })
});

module.exports = router;
