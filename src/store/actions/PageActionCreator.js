import * as actionTypes from './ActionTypes';
// import request from '../../utils/request';
//
// const GET_UPLOAD_LINK = "https://myra-get-upload-link.azurewebsites.net/api/GetUploadLink";
// const PROCESS_IMAGE_URL = "https://myra-queue-process-image.azurewebsites.net/api/ProcessImageNow";

// action creators

// *************** synchronous action creators *************************

export const addPages = () => {
    return {type: actionTypes.ADD_PAGE};
};

export const removePages = () => {
    return {type: actionTypes.REMOVE_PAGE};
};

export const changeLayout = (payload) => {
    return {type: actionTypes.CHANGE_LAYOUT, payload: payload};
};

export const updatePageState = (payload) => {
    return {type: actionTypes.PAGE_STATE_UPDATE, payload: payload};
};

export const pageFileDrop = (payload) => {
    return {type: actionTypes.PAGE_FILE_DROP, payload: payload}
};

export const changePageText = (payload) => {
    return {type: actionTypes.CHANGE_PAGE_TEXT, payload: payload}
};
export const zoomPage = (payload) => {
    return {type: actionTypes.ZOOM_PAGE, payload: payload}
};
export const removePageImage = (payload) => {
    return {type: actionTypes.REMOVE_PAGE_IMAGE, payload: payload};
};
export const addPhotosPages = (payload) => {
    return {type: actionTypes.ADD_PHOTOS_PAGES, payload: payload}
};

export const repositionImage = (payload) => {
    return {type: actionTypes.REPOSITION_IMAGE, payload: payload}
};
export const lockPage = () => {
    return {type: actionTypes.LOCK_PAGE}
};
export const dropImageToAnother = (payload) => {
    return {type: actionTypes.DROP_IMAGE_TO_ANOTHER, payload: payload}
};
export const exitZoom = (payload) => {
    return {type: actionTypes.EXIT_ZOOM, payload: payload}
};
// ******************************* asynchronous action creators *****************************
