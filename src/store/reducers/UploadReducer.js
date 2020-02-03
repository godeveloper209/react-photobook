import * as actionTypes from '../actions/ActionTypes';
import update from 'immutability-helper';
// passing the parameter initial state and an action
const initialState = {
    token: null,
    AccountName: null,
    CurrentFolder: null,
    files: {},
    uploaded_files: {},
    current_uploads: {},
    latest_uploaded: [],
    uploaded_count: 0,
    files_count: 0,
    sidebar_images: []
};
const UploadReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOGIN_SUCCESS: {
            const {TokenValue} = action.payload;
            //localStorage.setItem("token", TokenValue);
            return {
                ...state,
                token: TokenValue
            };
        }
        case actionTypes.UPLOAD_FILE_ATTEMPT: {
            const {path} = action.payload;
            return update(state, {
                current_uploads: {
                    [path]: {
                        status: {$set: "uploading"}
                    }
                }
            })
        }
        case actionTypes.UPLOAD_FILE_SUCCESS: {
            const {path} = action.payload;
            const file = state.current_uploads[path];
            if (!file) {
                return state
            }
            return update(state, {
                current_uploads: {
                    [path]: {
                        $merge: {
                            uploaded: true,
                            status: "process",
                            retries: 0
                        }
                    }
                }
            });
        }
        case actionTypes.UPLOAD_FILE_FAILURE: {
            const {path} = action.payload;
            const file = state.current_uploads[path];
            const retries = file && file.retries;
            return update(state, {
                current_uploads: {
                    [path]: {
                        $merge: {
                            uploaded: true,
                            status: "upload_file_failure",
                            retries: retries + 1,
                            last_attempt: Date.now()
                        }
                    }
                }
            });
        }
        case actionTypes.GET_UPLOAD_LINK_ATTEMPT: {
            const {path} = action.payload;
            return update(state, {
                current_uploads: {
                    [path]: {
                        status: {$set: "getting_link"}
                    }
                }
            });
        }
        case actionTypes.GET_UPLOAD_LINK_SUCCESS: {
            const {Link, path} = action.payload;
            const {current_uploads} = state;
            if (!current_uploads[path]) {
                return state
            }
            return update(state, {
                current_uploads: {
                    [path]: {
                        $merge: {
                            Link: Link,
                            status: "upload",
                            retries: 0
                        }
                    }
                }
            });
        }
        case actionTypes.GET_UPLOAD_LINK_FAILURE: {
            const {path} = action.payload;
            const retries = state.current_uploads[path].retries;
            return update(state, {
                current_uploads: {
                    [path]: {
                        $merge: {
                            status: "getting_link_failure",
                            retries: retries + 1,
                            last_attempt: Date.now()
                        }
                    }
                }
            });
        }
        case actionTypes.PROCESS_IMAGE_ATTEMPT: {
            const {path} = action.payload;
            return update(state, {
                current_uploads: {
                    [path]: {
                        $merge: {
                            status: 'processing'
                        }
                    }
                }
            });
        }
        case actionTypes.PROCESS_IMAGE_SUCCESS: {
            const {file_info} = action.payload;

            // here check if the local storage has sidebar_images or not
            // if no sidebar_images then create a sidebar_images array
            // push the image object in the sidebar_images array and save it into the localStorage

            // if sidebar_images then get that sidebar_images array and push this newly uploaded file object into that
            let image_info = action.payload;
            let image_object = {
                path: image_info.path,
                file_id: image_info.result.id,
                file_reference: image_info.result.FileReference,
                file_name: image_info.result.FileName,
                resolutions: image_info.result.Resolutions,
                date_taken: image_info.result.DateTaken,
                date_created: image_info.result.Created,
                top: 0,
                left: 0,
                currentX: 0,
                currentY: 0
            };
            const {files, latest_uploaded, uploaded_count} = state;
            const {path} = action.payload;
            const uploaded_file = files[path];
            const new_file = [path, uploaded_file.size];
            const updated_latest_uploaded = [new_file, ...latest_uploaded].splice(0, 20);

            if (typeof file_info.file === 'undefined' || file_info.file == null) {
                if (localStorage.getItem('sidebar_images')) {
                    let sidebar_images = JSON.parse(localStorage.getItem('sidebar_images'));
                    sidebar_images.push(image_object);
                    localStorage.setItem('sidebar_images', JSON.stringify(sidebar_images));
                } else {
                    let sidebar_images = [];
                    sidebar_images.push(image_object);
                    localStorage.setItem('sidebar_images', JSON.stringify(sidebar_images));
                }
            } else {
                if (localStorage.getItem('photo_book') && file_info.file.path === path) {
                    let photo_book = JSON.parse(localStorage.getItem('photo_book'));
                    let {pages} = photo_book;
                    pages[file_info.page_index][file_info.image] = image_object;
                    // update the photo_book pages front and back and set back to local storage
                    // we need to update the zoom page as well
                    photo_book.pages = pages;
                    localStorage.setItem('photo_book', JSON.stringify(photo_book));
                }
            }
            return update(state, {
                current_uploads: {$unset: [path]},
                uploaded_files: {$merge: {[path]: uploaded_file.size}},
                latest_uploaded: {$set: updated_latest_uploaded},
                uploaded_count: {$set: uploaded_count + 1}
            })
        }
        case actionTypes.PROCESS_IMAGE_FAILURE: {
            const {path} = action.payload;
            const {file} = state.current_uploads[path];
            const retries = file && file.retries;
            return update(state, {
                current_uploads: {
                    [path]: {
                        $merge: {
                            uploaded: true,
                            status: "process_image_failure",
                            retries: retries + 1,
                            last_attempt: Date.now()
                        }
                    }
                }
            });
        }
        case actionTypes.UPDATE_FILES_LIST: {
            const {files, files_count} = action.payload;
            return update(state, {
                files_count: {$set: files_count},
                files: {
                    $set: files
                },
            });
        }
        case actionTypes.UPDATE_STATE: {
            const {field, value} = action.payload;
            return update(state, {
                [field]: {
                    $set: value
                },
            });
        }
        case actionTypes.SET_CURRENT_UPLOAD: {
            const {uploaded_files, uploaded_count, current_uploads, files, files_count} = state;

            if (files_count === 0) {
                return state
            }
            if (files_count === Object.keys(current_uploads).length) {
                return state
            }
            if (files_count <= uploaded_count) {
                return state
            }

            const path = Object.keys(files).find(path => !current_uploads[path] && !uploaded_files[path]);
            if (current_uploads[path]) {
                return state
            }
            const file = files[path];
            if (!file) {
                return state
            }
            return update(state, {
                current_uploads: {
                    $merge: {
                        [path]: {
                            file: file,
                            Link: null,
                            retries: 0,
                            status: "get_link"
                        }
                    }
                }
            });
        }
        default:
            return state;
    }
};
export default UploadReducer;
