import json
import csv

# Define the input .js file name and the output CSV file name
input_js_file = "C:/Users/Florian/Desktop/wpp-openscoutmap/data/OpenScoutMapData.js"
csv_file_name = "C:/Users/Florian/Desktop/wpp-openscoutmap/data/geojson_data.csv"

# Function to read and extract GeoJSON from the .js file
def read_geojson_from_js(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        # Read the contents of the file
        js_content = file.read()
        
        # Find the start of the GeoJSON array in the JS file
        start_index = js_content.find('[')
        end_index = js_content.rfind(']')
        
        # Extract the JSON part (assuming the structure is correct)
        geojson_str = js_content[start_index:end_index+1]
        
        # Parse the JSON string into Python objects
        geojson_data = json.loads(geojson_str)
        
    return geojson_data

# Read the GeoJSON data from the JS file
geojsonFeature = read_geojson_from_js(input_js_file)

# Specify the header for the CSV file
csv_header = [
    "name", "subname", "street", "postal_code", "age_groups",
    "mail", "phone", "web", "category", "id", "longitude", "latitude"
]

# Open the CSV file for writing
with open(csv_file_name, mode='w', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)
    writer.writerow(csv_header)  # Write the header

    # Iterate through each feature in the GeoJSON
    for feature in geojsonFeature:
        # Extract properties
        properties = feature['properties']
        content = properties['content']
        #address = content['address']
        contact = content['contact']
        geometry = feature['geometry']
        
        # Extract data for each row
        row = [
            properties['name'], 
            content['subname'], 
            #address['street'], 
            #address['postal_code'], 
            "; ".join(content['age_groups']),  # Convert list to a semicolon-separated string
            contact['mail'], 
            contact['phone'], 
            contact['web'], 
            properties['category'], 
            properties['id'],
            geometry['coordinates'][0],  # Longitude
            geometry['coordinates'][1]   # Latitude
        ]
        
        # Write the row to the CSV
        writer.writerow(row)

print(f"Data successfully written to {csv_file_name}")
