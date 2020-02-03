import * as tslib_1 from "tslib";
import {toFileWithPath} from './file';

const FILES_TO_IGNORE = [
    '.DS_Store',
    'Thumbs.db' // Windows
];

/**
 * Convert a DragEvent's DataTrasfer object to a list of File objects
 * NOTE: If some of the items are folders,
 * everything will be flattened and placed in the same list but the paths will be kept as a {path} property.
 * @param evt
 */
export function fromEvent(evt) {
    return tslib_1.__awaiter(this, void 0, void 0, function * () {
        if (isDragEvt(evt)) {
            const dt = evt.dataTransfer;
            if (dt.items && dt.items.length) {
                return getDataTransferFiles(dt, evt.type);
            } else if (dt.files && dt.files.length) {
                return fromFileList(dt.files);
            }
        } else if (evt.target instanceof HTMLInputElement && evt.target.files && evt.target.files) {
            return fromFileList(evt.target.files);
        }
        return [];
    });
}

function isDragEvt(value) {
    return !!value.dataTransfer;
}

function getDataTransferFiles(dt, type) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const items = Array.from(dt.items)
            .filter(item => item.kind === 'file');
        // According to https://html.spec.whatwg.org/multipage/dnd.html#dndevents,
        // only dragstart, and dragend (drop) has access to the data (source node),
        // hence return the DataTransferItem for other event types
        if (type === 'drop') {
            const files = yield Promise.all(items.map(item => toFilePromises(item)));
            return flatten(files)
                .filter(file => !FILES_TO_IGNORE.includes(file.name));
        }
        return items;
    });
}

// https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem
function toFilePromises(item) {
    if (typeof item.webkitGetAsEntry !== 'function') {
        return fromDataTransferItem(item);
    }
    const entry = item.webkitGetAsEntry();
    if (entry) {
        return fromEntry(entry);
    }
    return [];
}

function flatten(items) {
    return items.reduce((acc, files) => [
        ...acc,
        ...(Array.isArray(files) ? flatten(files) : [files])
    ], []);
}

function fromFileList(fileList) {
    return Array.from(fileList)
        .map(file => toFileWithPath(file));
}

function fromDataTransferItem(item) {
    const file = item.getAsFile();
    const fwp = toFileWithPath(file);
    return Promise.resolve(fwp);
}

// https://developer.mozilla.org/en-US/docs/Web/API/FileSystemEntry
function fromEntry(entry) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (entry.isDirectory) {
            return fromDirEntry(entry);
        } else {
            return fromFileEntry(entry);
        }
    });
}

// https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryEntry
function fromDirEntry(entry) {
    const reader = entry.createReader();
    return new Promise(resolve => {
        const entries = [];

        function readEntries() {
            // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryEntry/createReader
            // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryReader/readEntries
            reader.readEntries((batch) => {
                if (!batch.length) {
                    // Done reading directory
                    resolve(Promise.all(entries));
                } else {
                    const items = Promise.all(batch.map(fromEntry));
                    entries.push(items);
                    // Continue reading
                    readEntries();
                }
            }, noop);
        }

        readEntries();
    });
}

// https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileEntry
function fromFileEntry(entry) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return new Promise(resolve => {
            entry.file((file) => {
                const fwp = toFileWithPath(file, entry.fullPath);
                resolve(fwp);
            });
        });
    });
}

// tslint:disable-next-line: no-empty
function noop() {
}

//# sourceMappingURL=file-selector.js.map
