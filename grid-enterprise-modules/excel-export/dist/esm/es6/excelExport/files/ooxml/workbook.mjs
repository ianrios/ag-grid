import sheetsFactory from './sheets.mjs';
const workbookFactory = {
    getTemplate(names) {
        return {
            name: "workbook",
            properties: {
                prefixedAttributes: [{
                        prefix: "xmlns:",
                        map: {
                            r: "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
                        },
                    }],
                rawMap: {
                    xmlns: "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
                }
            },
            children: [sheetsFactory.getTemplate(names)]
        };
    }
};
export default workbookFactory;
