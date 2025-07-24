import fs from 'fs';
import path from 'path';

/**
 * Delete a file from the local storage
 * @param {string} filePath - The path to the file to delete
 * @returns {Promise<boolean>} - True if file was deleted, false if file doesn't exist
 */
export const deleteLocalFile = async (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error deleting file:', error);
        return false;
    }
};

/**
 * Delete multiple files from local storage
 * @param {string[]} filePaths - Array of file paths to delete
 * @returns {Promise<boolean>} - True if all files were deleted successfully
 */
export const deleteMultipleFiles = async (filePaths) => {
    try {
        const deletePromises = filePaths.map(filePath => deleteLocalFile(filePath));
        await Promise.all(deletePromises);
        return true;
    } catch (error) {
        console.error('Error deleting multiple files:', error);
        return false;
    }
};

/**
 * Extract filename from URL
 * @param {string} url - The URL containing the filename
 * @returns {string} - The filename
 */
export const extractFilenameFromUrl = (url) => {
    if (!url) return null;
    
    // Handle both local URLs and external URLs
    if (url.includes('/uploads/products/')) {
        return url.split('/uploads/products/')[1];
    }
    
    // For external URLs, return null as we can't delete them
    return null;
};

/**
 * Get full file path from filename
 * @param {string} filename - The filename
 * @returns {string} - The full file path
 */
export const getFilePathFromFilename = (filename) => {
    if (!filename) return null;
    return path.join(process.cwd(), 'uploads', 'products', filename);
}; 