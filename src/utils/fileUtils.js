export const getFileName = (filePath) => {
  if (!filePath) return '';

  // If it's already a simple filename with timestamp (e.g., "1735552024273-HisaabKaroTransparent.png")
  if (!filePath.includes('\\') && !filePath.includes('/')) {
    return filePath;
  }

  // If it's a full path (e.g., "D:\\expenseManagement\\apnakhata\\backend\\uploads\\self-transaction\\1735551881482-...")
  return filePath.split('\\').pop().split('/').pop();
};

export const getFileUrl = (filePath) => {
  const fileName = getFileName(filePath);
  return `${process.env.REACT_APP_URL}/uploads/self-transaction/${fileName}`;
};
