// @<COPYRIGHT>@
// ==================================================
// Copyright 2023.
// Siemens Product Lifecycle Management Software Inc.
// All Rights Reserved.
// ==================================================
// @<COPYRIGHT>@

/*global
 define
 */
/**
 * @module js/dispatcherConsoleService
 */
import viewModelObjectSvc from 'js/viewModelObjectService';
import appCtxSvc from 'js/appCtxService';
import awSearchService from 'js/awSearchService';

'use strict';

var exports = {};

export let getUpdateRequestInput = function (nextState) {
    var requestInput = [];
    for( var i = 0; i < appCtxSvc.ctx.mselected.length; i++)
    {
        var req = {
            "requestToUpdate": appCtxSvc.ctx.mselected[i],
            "currentState":  appCtxSvc.ctx.mselected[i].props.currentState.dbValues[0],
            "nextState": nextState
        };

        requestInput.push(req);
    }
    return requestInput;
}

var exports = {};

export let getDispatcherRequestInput = function( data ) {

    var states = [
        "INITIAL", "SCHEDULED","PREPARING","TRANSLATING","LOADING", "COMPLETE","TERMINAL", "DUPLICATE","SUPERSEDED","NO_TRANS","TIMEOUT","SUPERSEDING"] ;

    var services = [];

    if(data.columnProviders.dispatcherReqColProvider.columnFilters && data.columnProviders.dispatcherReqColProvider.columnFilters.length > 0)
    {
        for( var i = 0; i < data.columnProviders.dispatcherReqColProvider.columnFilters.length; i++){
            if(data.columnProviders.dispatcherReqColProvider.columnFilters[i].columnName == 'serviceName')
            {
                services = data.columnProviders.dispatcherReqColProvider.columnFilters[i].values;
            }
            if(data.columnProviders.dispatcherReqColProvider.columnFilters[i].columnName == 'currentState')
            {
                states = data.columnProviders.dispatcherReqColProvider.columnFilters[i].values;
            }
        }
    }

    var response = [];
    var req = {
        "states": states,
        "services": services
    };
    response.push(req);
    return response;
};

export let getDispatcherRefreshInput = function() {

    var taskIDs = [];
    for( var i = 0; i < appCtxSvc.ctx.mselected.length; i++){
        taskIDs.push(appCtxSvc.ctx.mselected[i].props.taskID.dbValue);
    }

    var response = [];
    var req = {
        "taskID": taskIDs 
    };
    response.push(req);
    return response;

}

export let parseDispatcherRequests = function(dispatcherRequests) {
    
    var response = [];    
    
    for (var key in dispatcherRequests.ServiceData.modelObjects) {        
        if( dispatcherRequests.ServiceData.modelObjects[key].type == 'DispatcherRequest')
        {            
            response.push(viewModelObjectSvc.createViewModelObject( dispatcherRequests.ServiceData.modelObjects[key].uid, "EDIT" ));
        }
    }

    var outputData = {
        outputFilteredObjects: response,
        totalFound: response.length
    };
    // This is required to have the total results found in Subocation breadcumb.    
    //var contextSearchCtx = appCtxSvc.getCtx( 'search' );
    //appCtxSvc.getCtx('search').totalFound = response.length;

    return outputData;
};

export let getDeleteRequestInput = function () {
    return getUpdateRequestInput("DELETE");
}

export let getResubmitRequestInput = function () {
    return getUpdateRequestInput("INITIAL");
}

export let getFilterFacets = function (filterFacetInput, contextData) {
    if(filterFacetInput.column.field == 'currentState')
    {
        var states = [
            "INITIAL", "SCHEDULED","PREPARING","TRANSLATING","LOADING", "COMPLETE","TERMINAL", "DUPLICATE","SUPERSEDED","NO_TRANS","TIMEOUT","SUPERSEDING"] ;

        var facets = {
            "values": states,
            "totalFound": states.length
        }

        return facets;
    }
    if(filterFacetInput.column.field == 'serviceName')
    {
        var services = contextData.ctx.preferences["ETS.TRANSLATORS.SIEMENS"];

        if( services != undefined )
        {
            var facets = {
                "values": services.sort(),
                "totalFound": services.length
            }
            return facets;
        }else{
            var facets = {
                "values": [],
                "totalFound": 0
            }
        }        
    }
};

export let processOutput = function ( data, dataCtxNode, searchData ) {    
    let i = 0;
    for (var key in data.ServiceData.modelObjects) {        
        if( data.ServiceData.modelObjects[key].type == 'DispatcherRequest')
        {            
            i++;
        }
    }

    const newSearchData = { ...searchData.value };
    newSearchData.totalFound = i;    
    searchData.update( newSearchData );

};

/**
 * @memberof NgServices
 * @member dispatcherConsoleService
 */
/* app.factory('dispatcherConsoleService', //
    ['$q', 'uwPropertyService', 'awColumnService', 'awTableService', 'iconService', 'soa_kernel_soaService', 'soa_kernel_propertyPolicyService', 'appCtxService', 'viewModelObjectService',
        function($q, uwPropertySvc, awColumnSvc, awTableSvc, iconSvc, soaSvc, propertyPolicySvc, appCtxSvc, viewModelObjectService) {
            _$q = $q;
            _uwPropertySvc = uwPropertySvc;
            _awColumnSvc = awColumnSvc;
            _awTableSvc = awTableSvc;
            _iconSvc = iconSvc;
            _soaSvc = soaSvc;
            _propertyPolicySvc = propertyPolicySvc;
            _appCtxSvc = appCtxSvc;
            _viewModelObjectService  = viewModelObjectService;

            return exports;
        }
    ]); */

//export let moduleServiceNameToInject = 'dispatcherConsoleService';
//export default moduleServiceNameToInject;

export default exports = {
    getUpdateRequestInput,
    getDispatcherRequestInput,
    getDispatcherRefreshInput,
    parseDispatcherRequests,
    getDeleteRequestInput,
    getResubmitRequestInput,
    getFilterFacets,
    processOutput
};