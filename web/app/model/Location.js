Ext.define('Traccar.model.Location', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: "boundingbox",
            type: "string"
        },
        {
            name: "class",
            type: "string"
        },
        {
            name: "display_name",
            type: "string"
        },
        {name: "icon", type: "string"},
        {name: "type", type: "string"
        },
        {
            name: "importance",
            type: "string"
        },
        {
            name: "lat",
            type: "string"
        },
        {
            name: "licence",
            type: "string"
        },
        {
            name: "lon",
            type: "string"
        },
        {
            name: "osm_id",
            type: "string"
        },
        {
            name: "osm_type",
            type: "string"
        },
        {
            name: "place_id",
            type: "string"
        },
        {
            name: "type",
            type: "string"
        },
    ]
});
