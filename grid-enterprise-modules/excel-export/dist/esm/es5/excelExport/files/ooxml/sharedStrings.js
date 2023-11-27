import { _ } from '@ag-grid-community/core';
var buildSharedString = function (strMap) {
    var ret = [];
    strMap.forEach(function (val, key) {
        var textNode = key.toString();
        var child = {
            name: 't',
            textNode: _.utf8_encode(_.escapeString(textNode))
        };
        // if we have leading or trailing spaces, instruct Excel not to trim them
        var preserveSpaces = textNode.trim().length !== textNode.length;
        if (preserveSpaces) {
            child.properties = {
                rawMap: {
                    "xml:space": "preserve"
                }
            };
        }
        ret.push({
            name: 'si',
            children: [child]
        });
    });
    return ret;
};
var sharedStrings = {
    getTemplate: function (strings) {
        return {
            name: "sst",
            properties: {
                rawMap: {
                    xmlns: 'http://schemas.openxmlformats.org/spreadsheetml/2006/main',
                    count: strings.size,
                    uniqueCount: strings.size
                }
            },
            children: buildSharedString(strings)
        };
    }
};
export default sharedStrings;
