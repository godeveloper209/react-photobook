import * as actionTypes from '../actions/ActionTypes';
import update from 'immutability-helper';

const initialState = {
    pages: [],
    file_info: {},
    zoom: false,
    zoom_page: {},
    locked: false
};
// files and files_count will help to upload file
let image_object = {
    path: '',
    file_id: '',
    file_reference: '',
    file_name: '',
    resolutions: [],
    date_taken: '',
    date_created: '',
    top: 0,
    left: 0,
    currentX: 0,
    currentY: 0
};
const PageReducer = (state = initialState, action) => {
    let pages = [...state.pages];
    let zoom_page = { ...state.zoom_page };
    let locked = state.locked;

    switch (action.type) {
        case actionTypes.ADD_PAGE: {
            // get all the pages from the store
            // check the last page layout type
            // pages.length - 2 because pages.length - 1 is the back page
            let last_page_layout = pages[pages.length - 2].layout;
            let selected_layout = last_page_layout === '5' ? 1 : parseInt(last_page_layout) + 1;
            // if the last layout is 4 this means the new pages layout will start from 5
            let add_page_length = 4;
            for (let i = 1; i <= add_page_length; i++) {
                let page = {
                    layout: `${selected_layout}`,
                    image1: image_object,
                    image2: image_object,
                    image3: image_object,
                    text1: "",
                    text2: ""
                };
                // insert the page before the last page. since last page is the back page.
                pages.splice(pages.length - 1, 0, page);
                selected_layout = selected_layout === 5 ? 1 : selected_layout + 1;
            }
            // layout selection logic will be something like this parseInt(last_page.layout) if last_page.layout == 5 ? 1 : last_page.layout +1;
            // save the newly created pages in the local storage and update the state
            if (localStorage.getItem('photo_book')) {
                updateLocalStore({ pages });
            }
            return { ...state, pages: pages }
        }
        case actionTypes.REMOVE_PAGE: {
            // first check the numbers of pages. if pages is 20 then we can't remove page. else
            // remove the last 4 page
            // we should use slice because we should not remove the last page because last page is the back page
            for (let i = 1; i <= 4; i++) {
                pages.splice(pages.length - 2, 1);
            }
            if (localStorage.getItem('photo_book')) {
                updateLocalStore({ pages });
            }
            return { ...state, pages: pages }
        }
        case actionTypes.PAGE_STATE_UPDATE: {
            const { field, value } = action.payload;
            return update(state, {
                [field]: {
                    $set: value
                },
            });
        }
        case actionTypes.CHANGE_LAYOUT: {
            // ************************************************* LOGIC **************************************************
            // when 1 image layout change to 2 or 3 image layout then we need to do left shifting
            // when 3 image layout will change to 1 or 2 image layout then we need to do right shifting

            // left shifting logic. pages[i+1] images will shift to the pages[i] images and the process will continue until reach the last of the pages
            // right shifting logic. pages[i] images will shift to the pages[i+1] images and the process will continue until reach the last of the pages
            // for this shifting we need to know the page_index from where the shifting will happen

            // **************** right shifting ***************
            // layout 4,5 changes to layout 3
            // layout 4,5 changes to layout 1,2
            // layout 3 changes to layout 1,2

            // **************** left shifting ****************
            // layout 1,2 changes to layout 3
            // layout 1,2 changes to layout 4,5
            // layout 3 changes to layout 4,5

            let { layout, page_index, title } = action.payload;
            let previous_layout = 0;
            if (page_index === '0')
                page_index = 0;
            previous_layout = pages[page_index].layout;
            pages[page_index].layout = layout;
            let is_back_page = page_index === pages.length - 1;
            if (!locked && !is_back_page) {
                if (((previous_layout === '4' || previous_layout === '5') && layout === '3') ||
                    ((previous_layout === '4' || previous_layout === '5') && (layout === '1' || layout === '2')) ||
                    (previous_layout === '3' && (layout === '1' || layout === '2'))) {
                    pages = rightShifting({
                        pages,
                        start_index: page_index,
                        previous_layout,
                        current_layout: layout
                    });

                } else if (((previous_layout === '1' || previous_layout === '2') && layout === '3') ||
                    ((previous_layout === '1' || previous_layout === '2') && (layout === '4' || layout === '5')) ||
                    (previous_layout === '3' && (layout === '4' || layout === '5'))) {
                    pages = leftShifting({ pages, start_index: page_index, previous_layout, current_layout: layout });
                }
            }
            zoom_page = pages[page_index];
            zoom_page.title = title;
            zoom_page.page_index = page_index;
            // save the newly created pages in the local storage and update the state
            if (localStorage.getItem('photo_book')) {
                updateLocalStore({ pages });
            }
            return { ...state, pages: pages, zoom_page: zoom_page };
        }
        case actionTypes.PAGE_FILE_DROP: {
            let { file_id, image, page_index } = action.payload;
            if (page_index === '0')
                page_index = 0;
            const sidebar_images = [...action.payload.sidebar_images];
            // either file is dropped from the sidebar_images
            // or image is dropped from one page to another page. so we should find the file inside pages
            // or image is dropped from the front page. so we should find the file inside front
            // or image is dropped from the back page. so we should find the file inside back
            let image_to_drop = sidebar_images.find(s => s.file_id === file_id);
            let index = sidebar_images.findIndex(s => s.file_id === file_id);
            if (index > -1) {
                sidebar_images.splice(index, 1);
            }
            if (typeof image_to_drop === 'undefined') {
                // find inside the pages
                for (let i = 0; i < pages.length; i++) {
                    if (pages[i].image1.file_id === file_id) {
                        image_to_drop = pages[i].image1;
                        pages[i].image1 = image_object;
                        break;
                    } else if (pages[i].image2.file_id === file_id) {
                        image_to_drop = pages[i].image2;
                        pages[i].image2 = image_object;
                        break;
                    } else if (pages[i].image3.file_id === file_id) {
                        image_to_drop = pages[i].image3;
                        pages[i].image3 = image_object;
                        break;
                    }
                }
                // foreach pages check the image1, image2, image3
            }
            image_to_drop.left = 0;
            image_to_drop.top = 0;
            image_to_drop.currentX = 0;
            image_to_drop.currentY = 0;
            pages[page_index][image] = image_to_drop;

            // remove the dropped image from the left side bar and update the local store sidebar_images
            if (localStorage.getItem('photo_book')) {
                updateLocalStore({ pages });
                localStorage.setItem('sidebar_images', JSON.stringify(sidebar_images));
            }
            return { ...state, pages: pages }
        }
        case actionTypes.DROP_IMAGE_TO_ANOTHER: {
            let { page_index, image, from_page, from_image } = action.payload;

            from_page = parseInt(from_page);
            page_index = parseInt(page_index);

            // if from_page is greater than page_index we need to do a right shifting from which the image is dropping
            // ************* scenario1 ************
            // image5 drop to image3
            // -> image3 will be replaced with image5
            // -> image3 will go to image4
            // -> image4 will go to image5

            // ************* scenario2 ************
            // we need to do left shifting from which the image is dropping
            // image3 drop to image5
            // -> image5 will be replaced with image3
            // -> image5 will go to image4
            // -> image4 will go to image3

            // ************* scenario3 *************
            // image can be drop from same page from one image to another for page layout 3,4,5
            // shifting logic will be same as above

            // ********************************************* LOGIC *******************************************************
            // first we need to store the image where the image is dropping


            let image_to_shift = pages[page_index][image]; // this is the image which needs to be shift

            pages[page_index][image] = pages[from_page][from_image]; // changing the image with the new one


            pages[from_page][from_image] = image_object; // finally making the from image empty

            let new_image_to_shift = {};

            // do the first page_index processing here. so that we don't have any complex logic inside loop
            if (from_page > page_index) {
                // right shifting
                if (pages[page_index].layout === '3') {
                    if (image === 'image1') {
                        new_image_to_shift = pages[page_index].image2;
                        pages[page_index].image2 = image_to_shift;
                        image_to_shift = new_image_to_shift;
                    }
                } else if (pages[page_index].layout === '4' || pages[page_index].layout === '5') {
                    switch (image) {
                        case 'image1':
                            new_image_to_shift = pages[page_index].image2;
                            pages[page_index].image2 = image_to_shift;
                            image_to_shift = new_image_to_shift;

                            new_image_to_shift = pages[page_index].image3;
                            pages[page_index].image3 = image_to_shift;
                            image_to_shift = new_image_to_shift;
                            break;
                        case 'image2':
                            new_image_to_shift = pages[page_index].image3;
                            pages[page_index].image3 = image_to_shift;
                            image_to_shift = new_image_to_shift;
                            break;
                        default:
                            console.log('do nothing');

                    }
                }
                for (let i = page_index + 1; i <= from_page; i++) {
                    // debugger;

                    if (pages[i].layout === '1' || pages[i].layout === '2') {

                        if (image_to_shift.file_id !== '') {
                            new_image_to_shift = pages[i].image1;
                            pages[i].image1 = image_to_shift;
                            image_to_shift = new_image_to_shift;
                        }

                    } else if (pages[i].layout === '3') {

                        if (image_to_shift.file_id !== '') {
                            new_image_to_shift = pages[i].image1;
                            pages[i].image1 = image_to_shift;
                            image_to_shift = new_image_to_shift;
                        }

                        if (image_to_shift.file_id !== '') {
                            new_image_to_shift = pages[i].image2;
                            pages[i].image2 = image_to_shift;
                            image_to_shift = new_image_to_shift;
                        }

                    } else {
                        // layout 4 and layout 5
                        if (image_to_shift.file_id !== '') {
                            new_image_to_shift = pages[i].image1;
                            pages[i].image1 = image_to_shift;
                            image_to_shift = new_image_to_shift;
                        }

                        if (image_to_shift.file_id !== '') {
                            new_image_to_shift = pages[i].image2;
                            pages[i].image2 = image_to_shift;
                            image_to_shift = new_image_to_shift;
                        }

                        if (image_to_shift.file_id !== '') {
                            new_image_to_shift = pages[i].image3;
                            pages[i].image3 = image_to_shift;
                            image_to_shift = new_image_to_shift;
                        }


                    }

                }
            } else if (from_page === page_index) {

                if (pages[page_index].layout === '3') {
                    pages[from_page][from_image] = image_to_shift;
                } else if (pages[page_index].layout === '4' || pages[page_index].layout === '5') {

                    if (from_image === 'image3' && image === 'image1') {
                        new_image_to_shift = pages[page_index].image2;
                        pages[page_index].image2 = image_to_shift;
                        image_to_shift = new_image_to_shift;

                        pages[page_index].image3 = image_to_shift;

                    } else if (from_image === 'image1' && image === 'image3') {
                        new_image_to_shift = pages[page_index].image2;
                        pages[page_index].image2 = image_to_shift;
                        image_to_shift = new_image_to_shift;

                        pages[page_index].image1 = image_to_shift;
                    } else {
                        // just swap the image
                        pages[from_page][from_image] = image_to_shift;
                    }
                }
            } else {
                // from page is less than page_index

                // left shifting
                if (pages[page_index].layout === '3') {
                    if (image === 'image2') {
                        new_image_to_shift = pages[page_index].image1;
                        pages[page_index].image1 = image_to_shift;
                        image_to_shift = new_image_to_shift;
                    }
                } else if (pages[page_index].layout === '4' || pages[page_index].layout === '5') {
                    switch (image) {
                        case 'image3':
                            new_image_to_shift = pages[page_index].image2;
                            pages[page_index].image2 = image_to_shift;
                            image_to_shift = new_image_to_shift;

                            new_image_to_shift = pages[page_index].image1;
                            pages[page_index].image1 = image_to_shift;
                            image_to_shift = new_image_to_shift;
                            break;
                        case 'image2':
                            new_image_to_shift = pages[page_index].image1;
                            pages[page_index].image1 = image_to_shift;
                            image_to_shift = new_image_to_shift;
                            break;
                        default:
                            console.log('do nothing');

                    }
                }

                for (let i = page_index - 1; i >= from_page; i--) {
                    // debugger;

                    if (pages[i].layout === '1' || pages[i].layout === '2') {

                        if (image_to_shift.file_id !== '') {
                            new_image_to_shift = pages[i].image1;
                            pages[i].image1 = image_to_shift;
                            image_to_shift = new_image_to_shift;
                        }

                    } else if (pages[i].layout === '3') {

                        if (image_to_shift.file_id !== '') {
                            new_image_to_shift = pages[i].image2;
                            pages[i].image2 = image_to_shift;
                            image_to_shift = new_image_to_shift;
                        }

                        if (image_to_shift.file_id !== '') {
                            new_image_to_shift = pages[i].image1;
                            pages[i].image1 = image_to_shift;
                            image_to_shift = new_image_to_shift;
                        }

                    } else {
                        // layout 4 and layout 5

                        if (image_to_shift.file_id !== '') {
                            new_image_to_shift = pages[i].image3;
                            pages[i].image3 = image_to_shift;
                            image_to_shift = new_image_to_shift;
                        }

                        if (image_to_shift.file_id !== '') {
                            new_image_to_shift = pages[i].image2;
                            pages[i].image2 = image_to_shift;
                            image_to_shift = new_image_to_shift;
                        }

                        if (image_to_shift.file_id !== '') {
                            new_image_to_shift = pages[i].image1;
                            pages[i].image1 = image_to_shift;
                            image_to_shift = new_image_to_shift;
                        }


                    }

                }
            }
            if (localStorage.getItem('photo_book')) {
                updateLocalStore({ pages });
            }
            return { ...state, pages: pages }
        }
        case
            actionTypes.CHANGE_PAGE_TEXT
            : {
                let { page_index, text_no, text, title } = action.payload;
                if (page_index === '0')
                    page_index = 0;
                pages[page_index][text_no] = text;
                zoom_page = pages[page_index];
                zoom_page.title = title;
                zoom_page.page_index = page_index;
                // update the pages front and back and save it into the local storage
                if (localStorage.getItem('photo_book')) {
                    updateLocalStore({ pages });
                }
                return { ...state, pages: pages, zoom_page: zoom_page }
            }
        case
            actionTypes.ZOOM_PAGE
            : {
                let { page_index, title, clickedInput } = action.payload;
                if (page_index === '0')
                    page_index = 0;
                let zoom_page = {};
                pages = JSON.parse(localStorage.getItem('photo_book')).pages;
                zoom_page = pages[page_index];
                zoom_page.title = title;
                zoom_page.page_index = page_index;
                zoom_page.clickedInput = clickedInput;

                return { ...state, zoom: true, zoom_page: zoom_page, pages };
            }
        case actionTypes.EXIT_ZOOM: {
            let { page_index } = action.payload;
            if (page_index === '0')
                page_index = 0;
            pages = JSON.parse(localStorage.getItem('photo_book')).pages;
            return { ...state, zoom: false, zoom_page: {}, pages: pages };
        }
        case
            actionTypes.REMOVE_PAGE_IMAGE
            : {
                // payload should receive image_no,file_id, page_index
                let { image_no, page_index, sidebar_images } = action.payload;
                // first find the page by it's file_id
                if (page_index === '0')
                    page_index = 0;
                pages[page_index][image_no] = image_object;
                zoom_page[image_no] = image_object;
                if (localStorage.getItem('photo_book')) {
                    updateLocalStore({ pages });
                    localStorage.setItem('sidebar_images', JSON.stringify(sidebar_images));
                }
                return { ...state, pages, zoom_page };
            }
        case
            actionTypes.ADD_PHOTOS_PAGES
            : {
                let sidebar_images = [...action.payload.sidebar_images];
                // first check front page and then check the image1, image2, image3 file_id=='' then set the sidebar_images[0] and remove that
                // sidebar_images.splice(index, 1);
                // now loop through pages and check the above logic again
                // set images depending on page layout. so for example if layout is one and two then set only image1
                // if layout is three then set image1 and image2
                // if layout is four then set image1 and image2 and image3
                pages.forEach((page) => {
                    // check the page image
                    if (page.layout === '1' || page.layout === '2') {
                        page.image1 = sidebar_images.length > 0 ? sidebar_images[0] : image_object;
                        sidebar_images = sidebar_images.length > 0 ? remove_sidebar_image(sidebar_images) : sidebar_images;
                    } else if (page.layout === '3') {
                        page.image1 = sidebar_images.length > 0 ? sidebar_images[0] : image_object;
                        sidebar_images = sidebar_images.length > 0 ? remove_sidebar_image(sidebar_images) : sidebar_images;
                        page.image2 = sidebar_images.length > 0 ? sidebar_images[0] : image_object;
                        sidebar_images = sidebar_images.length > 0 ? remove_sidebar_image(sidebar_images) : sidebar_images;
                    } else {
                        // layout 4 and 5
                        page.image1 = sidebar_images.length > 0 ? sidebar_images[0] : image_object;
                        sidebar_images = sidebar_images.length > 0 ? remove_sidebar_image(sidebar_images) : sidebar_images;
                        page.image2 = sidebar_images.length > 0 ? sidebar_images[0] : image_object;
                        sidebar_images = sidebar_images.length > 0 ? remove_sidebar_image(sidebar_images) : sidebar_images;
                        page.image3 = sidebar_images.length > 0 ? sidebar_images[0] : image_object;
                        sidebar_images = sidebar_images.length > 0 ? remove_sidebar_image(sidebar_images) : sidebar_images;
                    }
                });
                // update the localStorage photo_book state
                if (localStorage.getItem('photo_book')) {
                    updateLocalStore({ pages });
                    localStorage.setItem('sidebar_images', JSON.stringify(sidebar_images));
                }
                return { ...state, pages };
            }
        case
            actionTypes.REPOSITION_IMAGE
            : {
                let { page_index, image_no, xPos, yPos, currentX, currentY } = action.payload;
                if (page_index === '0')
                    page_index = 0;

                // check if the top left currentX and currentY value is undefined or not.
                // if not undefined then update the value properly

                if (yPos != null && typeof yPos !== 'undefined')
                    pages[page_index][image_no].top = yPos;

                if (xPos != null && typeof xPos !== 'undefined')
                    pages[page_index][image_no].left = xPos;

                if (currentX != null && typeof currentX !== 'undefined')
                    pages[page_index][image_no].currentX = currentX;

                if (currentY != null && typeof currentY !== 'undefined')
                    pages[page_index][image_no].currentY = currentY;

                // finally update the pages
                // update the localStorage photo_book state
                if (localStorage.getItem('photo_book')) {
                    updateLocalStore({ pages });
                }
                return { ...state, pages };
            }
        case
            actionTypes.LOCK_PAGE
            : {
                let photo_book = JSON.parse(localStorage.getItem('photo_book'));
                if (photo_book) {
                    photo_book.locked = !photo_book.locked;
                    localStorage.setItem('photo_book', JSON.stringify(photo_book));
                }
                return { ...state, locked: photo_book.locked };
            }
        default:
            return state

    }
}
    ;
const remove_sidebar_image = (sidebar_images) => {
    if (sidebar_images.length > 0) {
        sidebar_images.splice(0, 1);
    }
    return sidebar_images;
};
const updateLocalStore = (payload) => {
    const { pages } = payload;
    // from payload extract pages
    let photo_book = JSON.parse(localStorage.getItem('photo_book'));
    photo_book.pages = pages;
    localStorage.setItem('photo_book', JSON.stringify(photo_book));
};
const rightShifting = (payload) => {
    const { pages, start_index, previous_layout, current_layout } = payload;
    let images_to_shift = [];
    if ((previous_layout === '4' || previous_layout === '5') && current_layout === '3') {
        if (pages[start_index].image3.file_id !== '') {
            images_to_shift.push(pages[start_index].image3);
            pages[start_index].image3 = image_object;
        }
    } else if ((previous_layout === '4' || previous_layout === '5') &&
        (current_layout === '1' || current_layout === '2')) {

        if (pages[start_index].image2.file_id !== '') {
            images_to_shift.push(pages[start_index].image2);
            pages[start_index].image2 = image_object;
        }
        if (pages[start_index].image3.file_id !== '') {
            images_to_shift.push(pages[start_index].image3);
            pages[start_index].image3 = image_object;
        }
    } else {
        // layout 3 changes to layout 1 or 2
        if (pages[start_index].image2.file_id !== '') {
            images_to_shift.push(pages[start_index].image2);
            pages[start_index].image2 = image_object;
        }
    }
    if (images_to_shift.length === 0)
        return pages;


    for (let i = start_index + 1; i < pages.length; i++) {
        // pages[i] extra images will shift to the pages[i+1]
        // before shifting the image to the pages[i+1] we need to checkout the layout first
        if (pages[i].layout === '1' || pages[i].layout === '2') {
            // check if there is any hidden image or not.
            // hidden image means when the page is locked then image2 and image3 was not visible but image was there
            // now we need to transfer that image as well

            // array.shift() this method remove the top item from the array and returns the removed item
            // unshift(): Add items to the beginning of an array
            // push(): Add items to the end of an array
            // pop(): Remove an item from the end of an array

            if (pages[i].image1.file_id !== '') {
                // then first add this image to the bottom of the images_to_shift array
                images_to_shift.push(pages[i].image1);

            }
            // set the images_to_shift top image to this pages[i].image1 pages[i].image1 = images_to_shift[0]
            // now remove that images_to_shift[0]
            if (images_to_shift.length > 0) {
                pages[i].image1 = images_to_shift.shift();
            }
            if (pages[i].image2.file_id !== '') {
                images_to_shift.push(pages[i].image2);
                pages[i].image2 = image_object;
            }
            if (pages[i].image3.file_id !== '') {
                images_to_shift.push(pages[i].image3);
                pages[i].image3 = image_object;

            }
        } else if (pages[i].layout === '3') {
            if (pages[i].image1.file_id !== '') {
                images_to_shift.push(pages[i].image1)
            }
            if (images_to_shift.length > 0) {
                pages[i].image1 = images_to_shift.shift();
            }
            if (pages[i].image2.file_id !== '') {
                images_to_shift.push(pages[i].image2)
            }
            if (images_to_shift.length > 0) {
                pages[i].image2 = images_to_shift.shift();
            }
            if (pages[i].image3.file_id !== '') {
                images_to_shift.push(pages[i].image3);
                pages[i].image3 = image_object;
            }
        } else {
            // layout 4 and 5
            if (pages[i].image1.file_id !== '') {
                images_to_shift.push(pages[i].image1)
            }
            if (images_to_shift.length > 0) {
                pages[i].image1 = images_to_shift.shift();
            }
            if (pages[i].image2.file_id !== '') {
                images_to_shift.push(pages[i].image2)
            }
            if (images_to_shift.length > 0) {
                pages[i].image2 = images_to_shift.shift();
            }
            if (pages[i].image3.file_id !== '') {
                images_to_shift.push(pages[i].image3)
            }
            if (images_to_shift.length > 0) {
                pages[i].image3 = images_to_shift.shift();
            }
        }

        // if there is no image to shift then we can break.
        if (images_to_shift.length === 0)
            break;
    }
    return pages;
};
const leftShifting = (payload) => {
    const { pages, start_index, previous_layout, current_layout } = payload;
    let images_to_shift = [];
    // we need to scan the pages from start_index + 1 and find out the images need to shift from right to left
    // second time we need to scan the pages and arrange the images accordingly
    // if no images in the images_to_shift array then we need to set empty image object in every page images image1, image2, image3
    for (let i = start_index + 1; i < pages.length; i++) {
        if (pages[i].image1.file_id !== '') {
            images_to_shift.push(pages[i].image1);
            pages[i].image1 = image_object;
        }
        if (pages[i].image2.file_id !== '') {
            images_to_shift.push(pages[i].image2);
            pages[i].image2 = image_object;
        }
        if (pages[i].image3.file_id !== '') {
            images_to_shift.push(pages[i].image3);
            pages[i].image3 = image_object;
        }
    }
    if (images_to_shift.length === 0)
        return pages;

    if ((previous_layout === '1' || previous_layout === '2') && current_layout === '3') {
        if (pages[start_index].image2.file_id === '')
            pages[start_index].image2 = images_to_shift.length > 0 ? images_to_shift.shift() : image_object;
    } else if ((previous_layout === '1' || previous_layout === '2') &&
        (current_layout === '4' || current_layout === '5')) {
        if (pages[start_index].image2.file_id === '')
            pages[start_index].image2 = images_to_shift.length > 0 ? images_to_shift.shift() : image_object;
        if (pages[start_index].image3.file_id === '')
            pages[start_index].image3 = images_to_shift.length > 0 ? images_to_shift.shift() : image_object;
    } else {
        // layout 3 changes to layout 4 or 5
        if (pages[start_index].image3.file_id === '')
            pages[start_index].image3 = images_to_shift.length > 0 ? images_to_shift.shift() : image_object;
    }

    for (let i = start_index + 1; i < pages.length; i++) {
        if (pages[i].layout === '1' || pages[i].layout === '2') {
            pages[i].image1 = images_to_shift.length > 0 ? images_to_shift.shift() : image_object;
            pages[i].image2 = image_object;
            pages[i].image3 = image_object;
        } else if (pages[i].layout === '3') {
            pages[i].image1 = images_to_shift.length > 0 ? images_to_shift.shift() : image_object;
            pages[i].image2 = images_to_shift.length > 0 ? images_to_shift.shift() : image_object;
            pages[i].image3 = image_object;
        } else {
            // layout 4 or 5
            pages[i].image1 = images_to_shift.length > 0 ? images_to_shift.shift() : image_object;
            pages[i].image2 = images_to_shift.length > 0 ? images_to_shift.shift() : image_object;
            pages[i].image3 = images_to_shift.length > 0 ? images_to_shift.shift() : image_object;
        }
    }

    return pages;
};
export default PageReducer
