import requests
from bs4 import BeautifulSoup
import os
import re
import json
import time

def clean_text(text):
    """Clean and normalize text content"""
    if not text:
        return ""
    # Remove extra whitespace and normalize
    text = re.sub(r'\s+', ' ', text.strip())
    # Remove special characters but keep basic punctuation
    text = re.sub(r'[^\w\s\.\,\!\?\:\;\-\(\)]', '', text)
    return text

def scrape_page(url, session):
    """Scrape a single page"""
    try:
        print(f"Scraping: {url}")
        response = session.get(url, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Remove script and style elements
        for script in soup(["script", "style", "nav", "footer"]):
            script.decompose()
        
        # Extract title
        title = ""
        title_tag = soup.find('title')
        if title_tag:
            title = clean_text(title_tag.get_text())
        
        # Extract headings
        headings = []
        for tag in soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']):
            heading_text = clean_text(tag.get_text())
            if heading_text:
                headings.append(f"{tag.name.upper()}: {heading_text}")
        
        # Extract main content
        content = ""
        body = soup.find('body')
        if body:
            content = clean_text(body.get_text())
        
        # Extract meta description
        meta_desc = ""
        meta_tag = soup.find('meta', attrs={'name': 'description'})
        if meta_tag:
            meta_desc = clean_text(meta_tag.get('content', ''))
        
        # Combine all content
        full_content = f"Title: {title}\n"
        if meta_desc:
            full_content += f"Description: {meta_desc}\n"
        if headings:
            full_content += f"Headings: {' | '.join(headings)}\n"
        full_content += f"Content: {content}"
        
        return {
            'url': url,
            'title': title,
            'content': full_content,
            'meta_description': meta_desc
        }
        
    except Exception as e:
        print(f"Error scraping {url}: {str(e)}")
        return None

def main():
    """Main scraping function"""
    print("Starting to scrape IM Solutions website...")
    
    # Create session with headers
    session = requests.Session()
    session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    })
    
    # Main pages to scrape
    pages = [
        "https://www.imsolutions.co/",
        "https://www.imsolutions.co/about-us/",
        "https://www.imsolutions.co/services/",
        "https://www.imsolutions.co/digital-marketing-services/",
        "https://www.imsolutions.co/website-designing-company/",
        "https://www.imsolutions.co/mobile-app-development-company/",
        "https://www.imsolutions.co/seo-company-bangalore/",
        "https://www.imsolutions.co/social-media-marketing-company-bangalore/",
        "https://www.imsolutions.co/online-reputation-management/",
        "https://www.imsolutions.co/contact-us/",
        "https://www.imsolutions.co/our-clients/",
        "https://www.imsolutions.co/careers/",
        "https://www.imsolutions.co/blogs/",
        "https://www.imsolutions.co/bus-branding/",
        "https://www.imsolutions.co/rwa-activation/",
        "https://www.imsolutions.co/airport-advertising/",
        "https://www.imsolutions.co/creative-designing-services/",
        "https://www.imsolutions.co/email-marketing-services/",
        "https://www.imsolutions.co/software-development-company/",
        "https://www.imsolutions.co/orm-services/"
    ]
    
    scraped_data = []
    
    for url in pages:
        page_data = scrape_page(url, session)
        if page_data:
            scraped_data.append(page_data)
        time.sleep(1)  # Be respectful
    
    # Save to files
    output_dir = "data/website"
    os.makedirs(output_dir, exist_ok=True)
    
    for i, page_data in enumerate(scraped_data):
        # Create a safe filename
        title = page_data['title'] or f"page_{i}"
        safe_title = re.sub(r'[^\w\s-]', '', title).strip()
        safe_title = re.sub(r'[-\s]+', '-', safe_title)
        if not safe_title:
            safe_title = f"page_{i}"
        
        filename = f"{safe_title}.txt"
        filepath = os.path.join(output_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(f"URL: {page_data['url']}\n")
            f.write(f"Title: {page_data['title']}\n")
            if page_data['meta_description']:
                f.write(f"Description: {page_data['meta_description']}\n")
            f.write("\n" + "="*50 + "\n\n")
            f.write(page_data['content'])
    
    # Save metadata
    metadata = {
        'total_pages': len(scraped_data),
        'scraped_at': time.strftime('%Y-%m-%d %H:%M:%S'),
        'base_url': 'https://www.imsolutions.co/',
        'pages': [{'url': p['url'], 'title': p['title']} for p in scraped_data]
    }
    
    with open(os.path.join(output_dir, 'metadata.json'), 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"Scraped {len(scraped_data)} pages successfully!")
    print(f"Files saved to: {output_dir}")

if __name__ == "__main__":
    main() 