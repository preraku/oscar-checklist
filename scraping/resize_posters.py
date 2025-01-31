import json
import os
import requests
from PIL import Image
from pathlib import Path
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def create_directories():
    """Create the necessary directories if they don't exist."""
    Path("movie_posters_full_size").mkdir(exist_ok=True)
    Path("movie_posters_reduced").mkdir(exist_ok=True)

def download_image(url, filepath):
    """Download an image from a URL and save it to filepath."""
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        return True
    except Exception as e:
        logging.error(f"Error downloading {url}: {str(e)}")
        return False

def resize_image(input_path, output_path, target_width=100):
    """Resize an image maintaining aspect ratio."""
    try:
        with Image.open(input_path) as img:
            # Calculate new height to maintain aspect ratio
            aspect_ratio = img.height / img.width
            target_height = int(target_width * aspect_ratio)
            
            # Resize image
            resized_img = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
            resized_img.save(output_path, quality=95, optimize=True)
        return True
    except Exception as e:
        logging.error(f"Error resizing {input_path}: {str(e)}")
        return False

def process_posters(data):
    """Process all posters in the data."""
    create_directories()
    
    success_count = 0
    total_count = len(data)
    
    for movie in data:
        title = movie['title']
        poster_url = movie['poster_url']
        
        # Create safe filenames
        safe_title = "".join(x for x in title if x.isalnum() or x in (' ', '-')).rstrip()
        filename = f"{safe_title}.jpg"
        
        full_size_path = os.path.join("movie_posters_full_size", filename)
        reduced_path = os.path.join("movie_posters_reduced", filename)
        
        logging.info(f"Processing: {title}")
        
        # Download full-size poster
        if download_image(poster_url, full_size_path):
            # Resize poster
            if resize_image(full_size_path, reduced_path):
                success_count += 1
                logging.info(f"Successfully processed: {title}")
            else:
                logging.warning(f"Failed to resize: {title}")
        else:
            logging.warning(f"Failed to download: {title}")
    
    logging.info(f"Processing complete. Successfully processed {success_count} out of {total_count} posters.")

# Load and parse the JSON data from file
try:
    with open('movies_data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    process_posters(data)
except FileNotFoundError:
    logging.error("movies_data.json file not found")
    exit(1)
except json.JSONDecodeError as e:
    logging.error(f"Error parsing JSON: {str(e)}")
    exit(1)
except Exception as e:
    logging.error(f"Unexpected error: {str(e)}")
    exit(1)

print("Done!")