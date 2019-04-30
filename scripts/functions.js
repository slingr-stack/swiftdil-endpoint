/////////////////////
// Public API
/////////////////////

endpoint.createCustomer = function(customerInfo) {
    return endpoint._post({
        path: '/customers',
        body: customerInfo
    });
};

endpoint.getCustomer = function(customerId) {
    return endpoint._get({
        path: '/customers/'+customerId
    });
};

endpoint.updateCustomer = function(customerId, customerInfo) {
    return endpoint._put({
        path: '/customers/'+customerId,
        body: customerInfo
    });
};

endpoint.partiallyUpdateCustomer = function(customerId, updateInfo) {
    return endpoint._patch({
        path: '/customers/'+customerId,
        body: updateInfo
    });
};

endpoint.deleteCustomer = function(customerId) {
    return endpoint._delete({
        path: '/customers/'+customerId
    });
};

endpoint.listCustomers = function(params) {
    return endpoint._get({
        path: '/customers',
        params: params
    });
};

endpoint.getRiskProfile = function(customerId) {
    return endpoint._get({
        path: '/customers/'+customerId+'/risk_profile'
    });
};

endpoint.createDocument = function(customerId, documentInfo) {
    var request = {
        path: '/customers/'+customerId+'/documents',
        multipart: true,
        parts: []
    };
    for (var key in documentInfo) {
        var part = {name: key};
        if (key == 'front_side' || key == 'back_side') {
            part.type = 'file';
            part.fileId = documentInfo[key];
        } else {
            part.type = 'other';
            part.content = documentInfo[key];
        }
        request.parts.push(part);
    }
    return endpoint._post(request);
};

endpoint.getDocument = function(customerId, documentId) {
    return endpoint._get({
        path: '/customers/'+customerId+'/documents/'+documentId
    });
};

endpoint.downloadDocument = function(customerId, documentId, side) {
    var doc = endpoint.getDocument(customerId, documentId);
    if (doc) {
        if (doc[side+'_side']) {
            var filename = doc[side+'_side'].filename;
            return endpoint._get({
                path: '/customers/'+customerId+'/documents/'+documentId+'/download',
                params: {
                    side: side
                },
                forceDownload: true,
                downloadSync: true,
                fileName: filename
            });
        } else {
            throw 'The document does not have a '+side+' side image uploaded';
        }
    } else {
        throw 'No document found with id ['+documentId+']';
    }
};

endpoint.updateDocument = function(customerId, documentId, documentInfo) {
    var request = {
        path: '/customers/'+customerId+'/documents/'+documentId,
        multipart: true,
        parts: []
    };
    for (var key in documentInfo) {
        var part = {name: key};
        if (key == 'front_side' || key == 'back_side') {
            part.type = 'file';
            part.fileId = documentInfo[key];
        } else {
            part.type = 'other';
            part.content = documentInfo[key];
        }
        request.parts.push(part);
    }
    return endpoint._put(request);
};

endpoint.partiallyUpdateDocument = function(customerId, documentId, updateInfo) {
    return endpoint._patch({
        path: '/customers/'+customerId+'/documents/'+documentId,
        body: updateInfo
    });
};

endpoint.listDocuments = function(customerId, params) {
    return endpoint._get({
        path: '/customers/'+customerId+'/documents',
        params: params
    });
};

endpoint.createScreening = function(customerId, scopes) {
    return endpoint._post({
        path: '/customers/'+customerId+'/screenings',
        body: scopes
    });
};

endpoint.getScreening = function(customerId, screeningId) {
    return endpoint._get({
        path: '/customers/'+customerId+'/screenings/'+screeningId
    });
};

endpoint.listScreenings = function(customerId, params) {
    return endpoint._get({
        path: '/customers/'+customerId+'/screenings',
        params: params
    });
};

endpoint.searchScreenings = function(params) {
    return endpoint._get({
        path: '/search/screenings',
        params: params
    });
};

endpoint.getMatch = function(customerId, screeningId, matchId) {
    return endpoint._get({
        path: '/customers/'+customerId+'/screenings/'+screeningId+'/matches/'+matchId
    });
};

endpoint.listMatches = function(customerId, screeningId, params) {
    return endpoint._get({
        path: '/customers/'+customerId+'/screenings/'+screeningId+'/matches',
        params: params
    });
};

endpoint.confirmMatch = function(customerId, screeningId, matchId) {
    return endpoint._post({
        path: '/customers/'+customerId+'/screenings/'+screeningId+'/matches/'+matchId+'/confirm'
    });
};

endpoint.dismissMatch = function(customerId, screeningId, matchId) {
    return endpoint._post({
        path: '/customers/'+customerId+'/screenings/'+screeningId+'/matches/'+matchId+'/dismiss'
    });
};

endpoint.confirmMultipleMatches = function(customerId, screeningId, matchIds) {
    return endpoint._post({
        path: '/customers/'+customerId+'/screenings/'+screeningId+'/matches/confirm',
        body: matchIds
    });
};

endpoint.dismissMultipleMatches = function(customerId, screeningId, matchIds) {
    return endpoint._post({
        path: '/customers/'+customerId+'/screenings/'+screeningId+'/matches/dismiss',
        body: matchIds
    });
};

endpoint.getAssociation = function(customerId, screeningId, matchId, associationId) {
    return endpoint._get({
        path: '/customers/'+customerId+'/screenings/'+screeningId+'/matches/'+matchId+'/associations/'+associationId
    });
};

endpoint.listAssociations = function(customerId, screeningId, matchId, params) {
    return endpoint._get({
        path: '/customers/'+customerId+'/screenings/'+screeningId+'/matches/'+matchId+'/associations',
        params: params
    });
};

endpoint.createOdd = function(customerId, oddInfo) {
    return endpoint._post({
        path: '/customers/'+customerId+'/odd',
        body: oddInfo
    });
};

endpoint.getOdd = function(customerId, oddId) {
    return endpoint._get({
        path: '/customers/'+customerId+'/odd/'+oddId
    });
};

endpoint.getOddResults = function(customerId, oddId) {
    return endpoint._get({
        path: '/customers/'+customerId+'/odd/'+oddId+'/results'
    });
};

endpoint.updateOdd = function(customerId, oddId, oddInfo) {
    return endpoint._put({
        path: '/customers/'+customerId+'/odd/'+oddId,
        body: oddInfo
    });
};

endpoint.partiallyUpdateOdd = function(customerId, oddId, updateInfo) {
    return endpoint._patch({
        path: '/customers/'+customerId+'/odd/'+oddId,
        body: updateInfo
    });
};

endpoint.deleteOdd = function(customerId, oddId) {
    return endpoint._delete({
        path: '/customers/'+customerId+'/odd/'+oddId
    });
};

endpoint.listOdds = function(customerId, params) {
    return endpoint._get({
        path: '/customers/'+customerId+'/odd',
        params: params
    });
};

endpoint.createDocumentVerification = function(customerId, verificationInfo) {
    return endpoint._post({
        path: '/customers/'+customerId+'/verifications',
        body: verificationInfo
    });
};

endpoint.getDocumentVerification = function(customerId, verificationId) {
    return endpoint._get({
        path: '/customers/'+customerId+'/verifications/'+verificationId
    });
};

endpoint.listDocumentVerifications = function(customerId, params) {
    return endpoint._get({
        path: '/customers/'+customerId+'/verifications',
        params: params
    });
};

endpoint.searchDocumentVerifications = function(params) {
    return endpoint._get({
        path: '/search/verifications',
        params: params
    });
};

endpoint.createIdentityVerification = function(customerId, verificationInfo) {
    if (verificationInfo.selfieFileId) {
        var res = endpoint._encodeFileInBase64({fileId: verificationInfo.selfieFileId});
        verificationInfo.selfie = res.encodedFile;
    }
    return endpoint._post({
        path: '/customers/'+customerId+'/identifications',
        body: verificationInfo
    });
};

endpoint.getIdentityVerification = function(customerId, verificationId) {
    return endpoint._get({
        path: '/customers/'+customerId+'/identifications/'+verificationId
    });
};

endpoint.listIdentityVerifications = function(customerId, params) {
    return endpoint._get({
        path: '/customers/'+customerId+'/identifications',
        params: params
    });
};

endpoint.searchIdentityVerifications = function(params) {
    return endpoint._get({
        path: '/search/identifications',
        params: params
    });
};

endpoint.getReport = function(reportId) {
    return endpoint._get({
        path: '/reports/'+reportId
    });
};

endpoint.downloadReport = function(reportId, extension) {
    return endpoint._get({
        path: '/reports/'+reportId+'/'+extension+'/download',
        forceDownload: true,
        downloadSync: true,
        fileName: 'report-'+reportId+'.'+extension
    });
};

endpoint.listReports = function(params) {
    return endpoint._get({
        path: '/reports',
        params: params
    });
};

endpoint.getFile = function(fileId) {
    return endpoint._get({
        path: '/files/'+fileId
    });
};

endpoint.downloadFile = function(fileId, output) {
    if (output == 'BASE64') {
        return endpoint._get({
            path: '/files/'+fileId,
            params: {
                output: 'BASE64'
            }
        });
    } else {
        var file = endpoint.getFile(fileId);
        if (file) {
            return endpoint._get({
                path: '/files/'+fileId,
                params: {
                    output: 'STREAM'
                },
                forceDownload: true,
                downloadSync: true,
                fileName: file.filename
            });
        } else {
            throw 'No file found with id ['+fileId+']';
        }
    }
};

endpoint.updateFile = function(fileId, fileInfo) {
    if (contentFileId) {
        var res = endpoint._encodeFileInBase64({fileId: fileInfo.contentFileId});
        fileInfo.content = res.encodedFile;
    }
    return endpoint._put({
        path: '/files/'+fileId,
        body: fileInfo
    });
};

endpoint.partiallyUpdateFile = function(fileId, updateInfo) {
    return endpoint._patch({
        path: '/files/'+fileId,
        body: updateInfo
    });
};

endpoint.deleteFile = function(fileId) {
    return endpoint._delete({
        path: '/files/'+fileId
    });
};

endpoint.listFiles = function(params) {
    return endpoint._get({
        path: '/files',
        params: params
    });
};