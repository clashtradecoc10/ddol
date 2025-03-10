from datetime import datetime
import psycopg2
import json
from xml.etree.ElementTree import Element, SubElement, tostring
from xml.dom import minidom
import urllib.parse
from collections import defaultdict


# Connect to the PostgreSQL database
conn = psycopg2.connect("postgresql://freearchive_owner:Wm2U9vgeXich@ep-solitary-math-a4j0mp8t-pooler.us-east-1.aws.neon.tech/DailyDoseOfLeaks?sslmode=require")
cur = conn.cursor()

# Query to select data from the Leaks table, ordered by date
query = '''
SELECT id, name, redirect, date, image
FROM public."CleanLeaks"
ORDER BY date DESC;
'''

cur.execute(query)
rows = cur.fetchall()

def format_date(date):
    return f"{date.year}-{date.month:02d}"

def format_name_for_url(name):
    return urllib.parse.quote(name, safe='~()*!\'')

def prettify(element):
    rough_string = tostring(element, 'utf-8')
    reparsed = minidom.parseString(rough_string)
    return reparsed.toprettyxml(indent="  ")

def get_month_name(month_number):
    return datetime(1900, month_number, 1).strftime('%B')

def format_date2(date):
    # Convert to ISO format with milliseconds and append 'Z' for UTC
    return date.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

# Preparing JSON output
main_list = []
archive_list = []
archive_dict = defaultdict(lambda: defaultdict(list))

# XML sitemap generation
sitemap_index = Element('sitemapindex', xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")
count = 0
file_index = 1
url_set = Element('urlset', xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")

for row in rows:
    id, name, redirect, date, image = row
    year = date.year
    month_numeric = f"{date.month:02d}"
    month_textual = get_month_name(date.month)

    archive_dict[year][month_numeric].append(f"/{id}")
    
    # Check criteria for main.json
    if len(main_list) < 48:
        main_list.append({
            "id": id,
            "name": name,
            "date": date.isoformat(),
            "key": redirect
        })

    # Sitemap XML handling
    if count % 25000 == 0 and count != 0:
        with open(f'sitemap_{file_index}.xml', 'w') as f:
            f.write(prettify(url_set))
        sub_element = SubElement(sitemap_index, 'sitemap')
        SubElement(sub_element, 'loc').text = f'https://dailydoseofleak.com/sitemap_{file_index}.xml'
        file_index += 1
        url_set = Element('urlset', xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")

    formatted_date = format_date(date)
    formatted_date2 = format_date2(date)
    formatted_name = format_name_for_url(name)
    url_element = SubElement(url_set, 'url')
    SubElement(url_element, 'loc').text = f"https://dailydoseofleak.com/{id}/{formatted_date}/{formatted_name}"
    SubElement(url_element, 'lastmod').text = formatted_date2
    count += 1

archive = []

for year, months in archive_dict.items():
    for month_numeric, ids in months.items():
        month_textual = get_month_name(int(month_numeric))
        archive.append({
            'year': year,
            'month_numeric': month_numeric,
            'month_textual': month_textual,
            'count': len(ids),
            'image_paths': ids
        })

# Final sitemap and index file handling
if url_set is not None and len(url_set):
    with open(f'sitemap_{file_index}.xml', 'w') as f:
        f.write(prettify(url_set))
    sub_element = SubElement(sitemap_index, 'sitemap')
    SubElement(sub_element, 'loc').text = f'https://dailydoseofleak.com/sitemap_{file_index}.xml'

with open('sitemap.xml', 'w') as f:
    f.write(prettify(sitemap_index))

# Save JSON files
with open('archive.json', 'w') as file:
    json.dump(archive, file, indent=2)

with open('main.json', 'w') as file:
    json.dump(main_list, file, indent=2)

# Close the database connection
cur.close()
conn.close()

print("JSON and XML sitemap files have been created and saved.")