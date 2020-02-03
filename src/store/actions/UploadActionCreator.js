import * as actionTypes from './ActionTypes';
import request from '../../utils/request';

const GET_UPLOAD_LINK = "https://myra-get-upload-link.azurewebsites.net/api/GetUploadLink";
const PROCESS_IMAGE_URL = "https://myra-queue-process-image.azurewebsites.net/api/ProcessImageNow";

// action creators

//*************** synchronous action creators *************************

const getUploadLinkAttempt = (payload) => {
    return {type: actionTypes.GET_UPLOAD_LINK_ATTEMPT, payload: payload}
};
const getUploadLinkSuccess = (payload) => {
    return {type: actionTypes.GET_UPLOAD_LINK_SUCCESS, payload: payload}
};
const getUploadLinkFailure = (payload) => {
    return {type: actionTypes.GET_UPLOAD_LINK_FAILURE, payload: payload}
};

const processImageAttempt = (payload) => {
    return {type: actionTypes.PROCESS_IMAGE_ATTEMPT, payload: payload}
};
const processImageSuccess = (payload) => {
    return {type: actionTypes.PROCESS_IMAGE_SUCCESS, payload: payload}
};
const processImageFailure = (payload) => {
    return {type: actionTypes.PROCESS_IMAGE_FAILURE, payload: payload}
};

const uploadFileAttempt = (payload) => {
    return {type: actionTypes.UPLOAD_FILE_ATTEMPT, payload: payload}
};
const uploadFileSuccess = (payload) => {
    return {type: actionTypes.UPLOAD_FILE_SUCCESS, payload: payload}
};
const uploadFileFailure = (payload) => {
    return {type: actionTypes.UPLOAD_FILE_FAILURE, payload: payload}
};

export const setCurrentUpload = (payload) => {
    return {type: actionTypes.SET_CURRENT_UPLOAD, payload: payload}
};
export const updateFilesList = (payload) => {
    return {type: actionTypes.UPDATE_FILES_LIST, payload: payload}
};
export const updateState = (payload) => {
    return {type: actionTypes.UPDATE_STATE, payload: payload}
};

// ******************************* asynchronous action creators *****************************

export const uploadBlob = ({path}) => {
    return (dispatch, getState) => {
        const state = getState();
        const {current_uploads} = state.UploadReducer;
        const current_upload = current_uploads[path];
        const upload_link = current_upload && current_upload.Link;
        const file = current_upload && current_upload.file;
        dispatch(uploadFileAttempt({path}));
        return request({
            url: upload_link,
            method: "Put",
            headers: [["x-ms-blob-type", "BlockBlob"]],
            type: "form",
            file: file
        }).then(response => {
            if (response.status === 201) {
                dispatch(uploadFileSuccess({path}))
            } else {
                dispatch(uploadFileFailure({path}));
                setTimeout(() => dispatch(uploadBlob({path})), 2000)
            }
        })
    }
};

/*
 * curl --request GET --url 'https://myra-get-upload-link.azurewebsites.net/api/GetUploadLink?AccountName=username&FileName=%2Fmyra.jpg' --header 'Token: c7g2d976-b021-47ee-adbb-bd3fa7b41f48'
 * */
export const getUploadLink = ({AccountName, FileName, path}) => {
    return dispatch => {
        dispatch(getUploadLinkAttempt({path}));
        return request({
            url: GET_UPLOAD_LINK,
            method: "GET",
            type: "form",
            params: {AccountName, FileName}
        }).then(response => {
            let res = null;
            if (response.status === 200) {
                res = JSON.parse(response.responseText)
            }
            if (res && res.Link) {
                dispatch(getUploadLinkSuccess({...res, path}));
            } else {
                dispatch(getUploadLinkFailure({path}));
                setTimeout(() => dispatch(getUploadLink({AccountName, FileName, path})), 2000)
            }
        })
    };
};

export const processImage = ({path, file_info}) => {
    return (dispatch, getState) => {
        const state = getState();
        const {AccountName, current_uploads} = state.UploadReducer;
        const current_upload = current_uploads[path];
        const {Link} = current_upload;
        dispatch(processImageAttempt({path}));
        return request({
            url: PROCESS_IMAGE_URL,
            method: "POST",
            type: "json",
            params: {AccountName: AccountName, Url: Link.split("?")[0]}
        }).then(response => {
            let res = null;
            if (response.status === 200) {
                res = JSON.parse(response.responseText)
            }
            if (res) {
                console.log(file_info);
                dispatch(processImageSuccess({...res, path, file_info}))
            } else {
                dispatch(processImageFailure({path}));
                setTimeout(() => dispatch(processImage({path})), 2000)
            }
        })
    };
};
