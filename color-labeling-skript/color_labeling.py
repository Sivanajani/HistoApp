import json
import xml.etree.ElementTree as ET

# Pfad zur JSON-Datei
json_file = 'characteristic_colors_corrected.json'

# Laden der JSON-Datei
with open(json_file, 'r') as file:
    data = json.load(file)

# Filtere Bilder basierend auf Sättigung und Helligkeit
filtered_data = {
    filename: values
    for filename, values in data.items()
    if values['saturation'] > 30 and values['brightness'] > 30
}

# Definiere die Hue-Bereiche für jede Farbe
color_ranges = {
    'Rot': [(330, 360), (0, 19.5)],
    'Orange/Gelb': [(19.5, 69)],
    'Grün': [(69, 175)],
    'Blau/Türkis': [(175, 262.7)],
    'Rosa/Magenta': [(262.7, 330)]
}

# Farb-Label zuordnen
color_labels = {
    'Rot': 0,
    'Orange/Gelb': 1,
    'Grün': 2,
    'Blau/Türkis': 3,
    'Rosa/Magenta': 4,
    'Unbekannt': -1
}

# Funktion zur Bestimmung der Farbe für ein gegebenes Hue
def get_color_from_hue(hue):
    for color, ranges in color_ranges.items():
        for r in ranges:
            if r[0] <= hue <= r[1]:
                return color
    return 'Unbekannt'

# Neue Struktur: Nur filename → label
label_only_data = {}

for filename, values in filtered_data.items():
    hue = values['hue']
    dominant_color = get_color_from_hue(hue)
    label = color_labels.get(dominant_color, -1)

    # Nur label speichern
    label_only_data[filename] = label

# JSON-Ausgabe (nur label)
with open("colors.json", "w") as f_json:
    json.dump(label_only_data, f_json, indent=2)
print("JSON gespeichert: colors.json")

# XML-Ausgabe (nur label)
root = ET.Element("colors")

for filename, label in label_only_data.items():
    image_elem = ET.SubElement(root, "image")

    fn_elem = ET.SubElement(image_elem, "filename")
    fn_elem.text = filename

    label_elem = ET.SubElement(image_elem, "label")
    label_elem.text = str(label)

tree = ET.ElementTree(root)
tree.write("colors.xml", encoding="utf-8", xml_declaration=True)
print("XML gespeichert: colors.xml")
