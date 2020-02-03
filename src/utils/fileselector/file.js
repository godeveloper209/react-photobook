export const COMMON_MIME_TYPES = new Map([
    ['avi', 'video/avi'],
    ['gif', 'image/gif'],
    ['ico', 'image/x-icon'],
    ['jpeg', 'image/jpeg'],
    ['jpg', 'image/jpeg'],
    ['mkv', 'video/x-matroska'],
    ['mov', 'video/quicktime'],
    ['mp4', 'video/mp4'],
    ['pdf', 'application/pdf'],
    ['png', 'image/png'],
    ['zip', 'application/zip']
]);
export function toFileWithPath(file, path) {
    const f = withMimeType(file);
    Object.defineProperty(f, 'path', {
        value: typeof path === 'string' ? path : file.name,
        writable: false,
        configurable: false
    });
    return f;
}
function withMimeType(file) {
    const { name } = file;
    const hasExtension = name && name.lastIndexOf('.') !== -1;
    if (name && hasExtension && !file.type) {
        const ext = name.split('.').pop();
        const type = COMMON_MIME_TYPES.get(ext);
        if (type) {
            return clone(file, type);
        }
    }
    return clone(file);
}
function clone(file, type) {
    const data = file.slice();
    return new Blob([data], {
        lastModified: file.lastModified,
        name: file.name,
        type: type || file.type
    });
}
