import json
import csv

# Define the input TSV file and the output JS file
input_tsv_file = "C:/Users/Florian/Desktop/wpp-openscoutmap/data/DataMap.txt"
output_js_file = "C:/Users/Florian/Desktop/wpp-openscoutmap/data/DataMap1.js"

# Initialize the GeoJSON structure
geojsonFeature = []

# Read data from the TSV file
with open(input_tsv_file, mode='r', encoding='ISO-8859-1') as tsv_file:
    reader = csv.DictReader(tsv_file, delimiter='\t')  # Read the TSV file with headers
    
    # Iterate through each row in the TSV file
    for row in reader:
        # Construct the GeoJSON feature for each row
        feature = {
            "type": "Feature",
            "properties": {
                "name": row["Gruppennummer"],
                "content": {
                    "subname": row["Name"],
                    "address": {
                        "street": row["Adresse"],
                        "postal_code": row["PLZ"]
                    },
                    "age_groups": row["Stufen"].split(", "),  # Convert the 'Stufen' to a list
                    "contact": {
                        "mail": row["E-Mail"],
                        "phone": "",  # Empty phone, as it is not provided in TSV
                        "web": row["Web"]
                    }
                },
                "category": "group",  # Assuming all are groups
                "id": len(geojsonFeature) + 1  # Unique ID based on index
            },
            "geometry": {
                "type": "Point",
                "coordinates": [row["Lon"], row["Lat"]]  # Convert to floats for GeoJSON
            }
        }
        
        # Append the feature to the GeoJSON list
        geojsonFeature.append(feature)

# Write the GeoJSON to a JS file
with open(output_js_file, mode='w', encoding='utf-8') as js_file:
    # Write the JavaScript variable definition with the JSON string
    js_file.write(f"var geojsonFeature = {json.dumps(geojsonFeature, indent=4)};")

print(f"Data successfully written to {output_js_file}")
