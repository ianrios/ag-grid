import numberFormatFactory from './numberFormat.mjs';
const numberFormatsFactory = {
    getTemplate(numberFormats) {
        return {
            name: "numFmts",
            properties: {
                rawMap: {
                    count: numberFormats.length
                }
            },
            children: numberFormats.map(numberFormat => numberFormatFactory.getTemplate(numberFormat))
        };
    }
};
export default numberFormatsFactory;
