import os
import requests
import xml.etree.ElementTree as ET

BASE_URL = "http://localhost:3000/api"
KML_FILE_PATH = "geofences.kml"
ADMIN_EMAIL = "admin"
ADMIN_PASSWORD = "password"

session_cookie = ""

def login():
    """
    Login to the API and retrieve session cookie
    """
    global session_cookie
    login_data = {
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    }
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    try:
        response = requests.post(f"{BASE_URL}/session", headers=headers, data=login_data)
        response.raise_for_status()
        session_cookie = response.headers.get("set-cookie").split(";")[0]
        print("Login successful, session cookie acquired.")
    except requests.RequestException as error:
        print("Error during login:", error)
        raise

def fetch_geofences():
    """
    Fetch geofences from the API
    """
    headers = {
        "Content-Type": "application/json",
        "Cookie": session_cookie
    }
    try:
        response = requests.get(f"{BASE_URL}/geofences", headers=headers)
        response.raise_for_status()
        print("Fetched geofences successfully.")
        return response.json()
    except requests.RequestException as error:
        print("Error fetching geofences:", error)
        return []

def reverse_coordinates(coordinates_string):
    """
    Reverse coordinates from "lat lon" to "lon,lat"
    """
    return " ".join(",".join(reversed(coord.strip().split(" "))) for coord in coordinates_string.strip().split(","))

def parse_area_to_kml(area):
    """
    Parse area string to KML-compatible coordinates
    """
    coordinates = area.replace("LINESTRING", "").replace("POLYGON", "").replace("(", "").replace(")", "").strip()
    return reverse_coordinates(coordinates)

def convert_to_kml(geofences):
    """
    Convert geofences data to KML format
    """
    kml = ET.Element("kml")
    document = ET.SubElement(kml, "Document")
    ET.SubElement(document, "name").text = "No Group"

    for geofence in geofences:
        placemark = ET.SubElement(document, "Placemark")
        ET.SubElement(placemark, "name").text = geofence["name"]

        style = ET.SubElement(placemark, "Style")
        poly_style = ET.SubElement(style, "PolyStyle")
        ET.SubElement(poly_style, "color").text = "60DCDCDC"
        line_style = ET.SubElement(style, "LineStyle")
        ET.SubElement(line_style, "color").text = "FF027AFF"

        polygon = ET.SubElement(placemark, "Polygon")
        outer_boundary = ET.SubElement(polygon, "outerBoundaryIs")
        linear_ring = ET.SubElement(outer_boundary, "LinearRing")

        coordinates = parse_area_to_kml(geofence["area"]) + ",0"
        ET.SubElement(linear_ring, "coordinates").text = coordinates

    return ET.tostring(kml, encoding="utf-8").decode("utf-8")

def write_kml_file(kml_data):
    """
    Write KML data to a file
    """
    try:
        with open(KML_FILE_PATH, "w", encoding="utf-8") as file:
            file.write(kml_data)
        print("KML file created successfully.")
    except IOError as error:
        print("Error writing KML file:", error)

def create_geofences_kml_file():
    """
    Main function to create the geofences KML file
    """
    try:
        login()
        geofences = fetch_geofences()
        kml_data = convert_to_kml(geofences)
        write_kml_file(kml_data)
    except Exception as error:
        print("Error in creating KML file:", error)

# Run the main function
if __name__ == "__main__":
    create_geofences_kml_file()
