function parseAndCategorizeFiles(
    filePaths1,
    filePaths2,
    validFirstFileTypes,
    validSecondFileTypes,
) {
    // Function to parse files based on given valid file types
    const parseFiles = (filePaths, validFileTypes) => {
        return filePaths.reduce((acc, filePath) => {
            const parts = filePath.split("\\");
            const fileName = parts[parts.length - 1];
            const fileNameParts = fileName.split("_");
            const fileType = fileNameParts[1];
            const fileID = fileNameParts[2];
            const datePart = fileNameParts[3];
            let relatedUACId = null;

            if (validFileTypes.includes(fileType)) {
                if (fileNameParts.length > 4) {
                    relatedUACId = fileNameParts[5].replace(".csv", "");
                }

                const date = new Date(
                    parseInt(datePart.substr(0, 4), 10),
                    parseInt(datePart.substr(4, 2), 10) - 1,
                    parseInt(datePart.substr(6, 2), 10),
                    parseInt(datePart.substr(8, 2), 10),
                    parseInt(datePart.substr(10, 2), 10),
                    parseInt(datePart.substr(12, 2), 10),
                );

                if (!acc[fileType]) acc[fileType] = [];
                acc[fileType].push({
                    fileType,
                    fileID,
                    date,
                    relatedUACId,
                    fullPath: filePath,
                });
            } /* else {
                // console.warn(
                //     `Unknown file name/type: ${fileType}. Consider updating or removing those files from the storage place.`,
                // );
            }*/
            return acc;
        }, {});
    };

    // Parse both lists with their respective valid file types
    const categorizedData1 = parseFiles(filePaths1, validFirstFileTypes);
    const categorizedData2 = parseFiles(filePaths2, validSecondFileTypes);

    return {
        ...categorizedData1,
        ...categorizedData2,
    };
}

export default parseAndCategorizeFiles;
