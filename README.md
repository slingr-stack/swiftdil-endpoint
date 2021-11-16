---
title: SwiftDil endpoint
keywords: 
last_updated: August 22, 2018
tags: []
summary: "Detailed description of the API of the SwiftDil endpoint."
---

## Overview

The SwiftDil endpoint has the following features:
 
- Authentication through OAuth
- Access to the whole REST API
- Helpers for the API methods
- Uploading and downloading of files integrated with SLINGR's features

Please make sure you take a look at the documentation from SwiftDil as features are based on its API:

- [API Documentation](https://reference.swiftdil.com)

## Quick start

Once you configured the endpoint, you can create a new customer with this call:

```js
var customerInfo = {
  "type" : "INDIVIDUAL",
  "email" : "john.doe@example.com",
  "title" : "MR",
  "first_name" : "John",
  "middle_name": "A.",
  "last_name" : "Doe",
  "dob" : "1980-01-01",
  "gender": "MALE",
  "addresses" : [
    {
      "type": "PRIMARY",
      "property_name": "Custom House",
      "line": "Main Street",
      "extra_line": "City Square",
      "city": "Aldgate",
      "state_or_province": "London",
      "postal_code": "E99 0ZZ",
      "country": "GBR",
      "from_date": "2010-01-01"
    }
  ],
};
var customer = app.endpoints.swiftdil.createCustomer(customerInfo);
```

Then you can upload a document for this customer:

```js
var record = sys.data.findById('customers', '5b7d64ce4919520007d71dac');
var docInfo = {
  front_side: record.field('frontSide').id(),
  back_side: record.field('backSide').id(),
  type: 'NATIONAL_ID_CARD',
  document_number: '13847027'
};
var doc = app.endpoints.swiftdil.createDocument(record.field('swiftdilCustomerId').val(), docInfo);
```

Then you can verify the document:

```js
var verification = app.endpoints.swiftdil.createDocumentVerification(record.field('swiftdilCustomerId').val(), {
    document_id: doc.id,
    type: 'IMAGE'
});
```

## Configuration

Before configuring the endpoint you will need to have an account in SwiftDil. 

### Client ID

This is the `API Client ID` field found in the `Settings > API` in SwiftDil.

### Client Key

This is the `API Client Key` field found in the `Settings > API` in SwiftDil.

### Sandbox

Indicates if the sandbox will be use, which is useful for testing. Values can be `yes` or `no`.

## Javascript API

The Javascript API of the endpoint is based on the [REST API of SwiftDil](https://reference.swiftdil.com),
so you should see their documentation for details on parameters and data formats.

The format of request is the same as indicated in the SwiftDil's documentation. There are a few exceptions
with requests that work with files that will be explained below.

### API helpers

These are the helpers in the Javascript API:

```js
app.endpoints.swiftdil.createCustomer(customerInfo);
app.endpoints.swiftdil.getCustomer(customerId);
app.endpoints.swiftdil.updateCustomer(customerId, customerInfo);
app.endpoints.swiftdil.partiallyUpdateCustomer(customerId, updateInfo);
app.endpoints.swiftdil.deleteCustomer(customerId);
app.endpoints.swiftdil.listCustomers(params);
app.endpoints.swiftdil.getRiskProfile(customerId);
app.endpoints.swiftdil.createDocument(customerId, documentInfo);
app.endpoints.swiftdil.getDocument(customerId, documentId);
app.endpoints.swiftdil.downloadDocument(customerId, documentId, side);
app.endpoints.swiftdil.updateDocument(customerId, documentId, documentInfo);
app.endpoints.swiftdil.partiallyUpdateDocument(customerId, documentId, updateInfo);
app.endpoints.swiftdil.listDocuments(customerId, params);
app.endpoints.swiftdil.createScreening(customerId, scopes);
app.endpoints.swiftdil.getScreening(customerId, screeningId);
app.endpoints.swiftdil.listScreenings(customerId, params);
app.endpoints.swiftdil.searchScreenings(params);
app.endpoints.swiftdil.getMatch(customerId, screeningId, matchId);
app.endpoints.swiftdil.listMatches(customerId, screeningId, params);
app.endpoints.swiftdil.confirmMatch(customerId, screeningId, matchId);
app.endpoints.swiftdil.dismissMatch(customerId, screeningId, matchId);
app.endpoints.swiftdil.confirmMultipleMatches(customerId, screeningId, matchIds);
app.endpoints.swiftdil.dismissMultipleMatches(customerId, screeningId, matchIds);
app.endpoints.swiftdil.getAssociation(customerId, screeningId, matchId, associationId);
app.endpoints.swiftdil.listAssociations(customerId, screeningId, matchId, params);
app.endpoints.swiftdil.createOdd(customerId, oddInfo);
app.endpoints.swiftdil.getOdd(customerId, oddId);
app.endpoints.swiftdil.getOddResults(customerId, oddId);
app.endpoints.swiftdil.updateOdd(customerId, oddId, oddInfo);
app.endpoints.swiftdil.partiallyUpdateOdd(customerId, oddId, updateInfo);
app.endpoints.swiftdil.deleteOdd(customerId, oddId);
app.endpoints.swiftdil.listOdds(customerId, params);
app.endpoints.swiftdil.createDocumentVerification(customerId, verificationInfo);
app.endpoints.swiftdil.getDocumentVerification(customerId, verificationId);
app.endpoints.swiftdil.listDocumentVerifications(customerId, params);
app.endpoints.swiftdil.searchDocumentVerifications(params);
app.endpoints.swiftdil.createIdentityVerification(customerId, verificationInfo);
app.endpoints.swiftdil.getIdentityVerification(customerId, verificationId);
app.endpoints.swiftdil.listIdentityVerifications(customerId, params);
app.endpoints.swiftdil.searchIdentityVerifications(params);
app.endpoints.swiftdil.getReport(reportId);
app.endpoints.swiftdil.downloadReport(reportId, extension);
app.endpoints.swiftdil.listReports(params);
app.endpoints.swiftdil.getFile(fileId);
app.endpoints.swiftdil.downloadFile(fileId, output);
app.endpoints.swiftdil.updateFile(fileId, fileInfo);
app.endpoints.swiftdil.partiallyUpdateFile(fileId, updateInfo);
app.endpoints.swiftdil.deleteFile(fileId);
app.endpoints.swiftdil.listFiles(params);
```

In all cases first come the parameters in the path, then body or query parameters. Here are some sample requests:

```js
// create a customer

var customerInfo = {
  "type" : "INDIVIDUAL",
  "email" : "john.doe@example.com",
  "title" : "MR",
  "first_name" : "John",
  "middle_name": "A.",
  "last_name" : "Doe",
  "dob" : "1980-01-01",
  "gender": "MALE",
  "addresses" : [
    {
      "type": "PRIMARY",
      "property_name": "Custom House",
      "line": "Main Street",
      "extra_line": "City Square",
      "city": "Aldgate",
      "state_or_province": "London",
      "postal_code": "E99 0ZZ",
      "country": "GBR",
      "from_date": "2010-01-01"
    }
  ],
};
var customer = app.endpoints.swiftdil.createCustomer(customerInfo);
log('customer: '+JSON.stringify(customer));

// get a customer
var customerInfo = app.endpoints.swiftdil.getCustomer('914c022c-dd41-4921-8439-ac7923873071');
log('customer: '+JSON.stringify(customerInfo));
```

### Handling files

The endpoint provides some utilities to make it easy to work with files and the app. The following 
methods handle files:

```js
app.endpoints.swiftdil.createDocument(customerId, documentInfo);
app.endpoints.swiftdil.downloadDocument(customerId, documentId, side);
app.endpoints.swiftdil.updateDocument(customerId, documentId, documentInfo);
app.endpoints.swiftdil.createIdentityVerification(customerId, verificationInfo);
app.endpoints.swiftdil.downloadFile(fileId, output);
app.endpoints.swiftdil.updateFile(fileId, fileInfo);
```

In this methods, when sending a file, we allow to send a file ID from a file field in the app. The
endpoint will take care of downloading the endpoint from the app and send it to SwiftDil.

On the other hand, when SwiftDil returns a file, the endpoint automatically uploads the endpoint
to the app so you can easily assign it to a file field.

Here are some usage of the above methods:

```js
// create document

var record = sys.data.findById('customers', '5b7d64ce4919520007d71dac');
var doc = {
  front_side: record.field('frontSide').id(), // here you provide the ID of a file field
  back_side: record.field('backSide').id(), // here you provide the ID of a file field
  type: 'NATIONAL_ID_CARD',
  document_number: '15830614'
};
var res = app.endpoints.swiftdil.createDocument('8850fe45-0958-4443-9233-bbc8a185b10e', doc);
log('doc: '+JSON.stringify(res));

// download document

var record = sys.data.createRecord('customers');
record.field('firstName').val('Admin');
record.field('lastName').val('Test');
record.field('email').val('admin@test.com');
var front = app.endpoints.swiftdil.downloadDocument('8850fe45-0958-4443-9233-bbc8a185b10e', '2245efa5-0bf6-463e-9914-715d46d48519', 'front');
log('res: '+JSON.stringify(front));
record.field('frontSide').val(front.fileId); // you can assign the file to a file field
var back = app.endpoints.swiftdil.downloadDocument('8850fe45-0958-4443-9233-bbc8a185b10e', '2245efa5-0bf6-463e-9914-715d46d48519', 'back');
log('res: '+JSON.stringify(back));
record.field('backSide').val(back.fileId); // you can assign the file to a file field
sys.data.save(record);

// update document

var record = sys.data.findById('customers', '5b7d64ce4919520007d71dac');
var doc = {
  front_side: record.field('frontSide').id(), // here you provide the ID of a file field
  back_side: record.field('backSide').id(), // here you provide the ID of a file field
  type: 'NATIONAL_ID_CARD',
  document_number: '15830614'
};
var res = app.endpoints.swiftdil.updateDocument('8850fe45-0958-4443-9233-bbc8a185b10e', '2245efa5-0bf6-463e-9914-715d46d48519', doc);
log('doc: '+JSON.stringify(res));

// create identity verification

var record = sys.data.findById('customers', '5b7d64ce4919520007d71dac');
var verificationInfo = {
    document_id: '2245efa5-0bf6-463e-9914-715d46d48519',
    selfieFileId: record.field('selfie').id() // instead of passing the `selfie` field you pass the ID of a file in the field `selfieFileId`
};
var verification = app.endpoints.swiftdil.createIdentityVerification('8850fe45-0958-4443-9233-bbc8a185b10e', verificationInfo);
log('verification: '+JSON.stringify(verification));

// download file

var record = sys.data.findById('customers', '5b7d64ce4919520007d71dac');
var front = app.endpoints.swiftdil.downloadFile('2245efa5-0bf6-463e-9914-715d46d48519', 'STREAM');
log('res: '+JSON.stringify(front));
record.field('frontSide').val(front.fileId); // you can assign the file to a file field
sys.data.save(record);

// update file

var fileInfo = {
    content_type: 'image/jpeg',
    filename: 'passport copy',
    size: 1234,
    contentFileId: record.field('passport').id() // you pass the ID of the file instead of the base64 content
};
var file = app.endpoints.swiftdil.updateFile('2245efa5-0bf6-463e-9914-715d46d48519', fileInfo);

```

## Events

This endpoint does not provide any event.

## About SLINGR

SLINGR is a low-code rapid application development platform that accelerates development, with robust architecture for integrations and executing custom workflows and automation.

[More info about SLINGR](https://slingr.io)

## License

This endpoint is licensed under the Apache License 2.0. See the `LICENSE` file for more details.
