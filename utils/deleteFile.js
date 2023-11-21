const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const unlinkAsync = promisify(fs.unlink);

const deleteFile = async (dirpath, file) => {
    try {
        await unlinkAsync(path.join(__dirname, '../../../uploads/', dirpath) + file)
    } catch (error) {
        console.error(error)
    }
}

module.exports = deleteFile