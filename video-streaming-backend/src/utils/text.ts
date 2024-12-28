export const replaceWhitespaceWithUnderscore = (filename: string) => {
  return filename.replace(/\s/g, "_");
};

// Function to replace whitespaces with dashes in a filename
export const replaceWhitespaceWithDash = (filename: string) => {
  return filename.replace(/\s/g, "-");
};

// Function to remove whitespaces from a filename
export const removeWhitespace = (filename: string) => {
  return filename.replace(/\s/g, "");
};

export const sanitizeFilename = (filename: string) => {
  // Remove whitespaces, parentheses, and special characters using regex
  return filename.replace(/[\s(){}\[\]<>]/g, "").replace(/[^\w.-]/g, "");
};
