import fs from "fs";
// example data geofences from https://your-traccar-domain/api/geofences or use fetch
const geofences = [
  {
    id: 546,
    name: "COP",
    description: null,
    area: "POLYGON ((-3.742736604580289 115.6425934049417, -3.742736555961199 115.64271185754588, -3.7429653968457814 115.64272080160285, -3.7431489320357323 115.64273111018622, -3.7433397536774486 115.6427447371434, -3.743498822259044 115.64274333982256, -3.743735606771379 115.64275138932655, -3.7439019269505334 115.64274322188884, -3.744028619378184 115.64273490408696, -3.744130866950302 115.6427328850462, -3.7441279198699284 115.64234113215413, -3.743228220340061 115.64235433098429, -3.7431187000700925 115.6423516891029, -3.7428161331079535 115.64236247030364, -3.7427377433026727 115.64236622574622, -3.742736604580289 115.6425934049417))",
    attributes: '{"StreetType":"COP","GroupName":"Line Hauling"}',
    calendarid: null,
    geotype: "Line Hauling",
    group_name: "KM 1",
  },
];

// Function to reverse the order of coordinates in a string
function reverseCoordinates(coordinatesString) {
  return coordinatesString
    .trim()
    .split(",")
    .map((coord) => coord.trim().split(" "))
    .map((pair) => pair.reverse().join(",")) // Reverse the order of coordinates
    .join(" "); // Combine the coordinates back into a string
}

// Helper function to parse the area into KML coordinates
function parseAreaToKML(area) {
  const coordinates = area
    .replace(/(LINESTRING|POLYGON|\(|\))/g, "") // Remove area type and parentheses
    .trim();

  return reverseCoordinates(coordinates); // Reverse the order of coordinates
}

// Function to convert geofences data to KML format
function convertToKML(geofences) {
  const kmlHeader = `<?xml version="1.0" encoding="UTF-8"?>\n<kml>\n  <Document>\n    <name>No Group</name>\n`;
  const kmlFooter = `  </Document>\n</kml>`;

  const placemarks = geofences
    .map((geofence) => {
      const coordinates = parseAreaToKML(geofence.area);
      return `
    <Placemark>
      <name>${geofence.name}</name>
      <description width="0.0" color="60DCDCDC" lineColor="FF027AFF"/>
      <Style>
        <PolyStyle>
          <color>60DCDCDC</color>
        </PolyStyle>
        <LineStyle>
          <color>FF027AFF</color>
        </LineStyle>
      </Style>
      <Polygon>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>${coordinates},0</coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>`;
    })
    .join("\n");

  return kmlHeader + placemarks + kmlFooter;
}

// Convert geofences data to KML format
const kmlData = convertToKML(geofences);

// Save the KML data to a file
fs.writeFileSync("geofences.kml", kmlData, "utf8"); // Write the KML data to a file
console.log("File KML has been created successfully.");

// how to run tools
// node /tools/geofences-to-kml.js
