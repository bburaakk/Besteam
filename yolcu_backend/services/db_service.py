import json
import logging
from sqlalchemy.orm import Session
import models

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_centralnode_titles(db: Session) -> list[str]:
    """
    Fetches all roadmaps from the database, parses the 'content' JSON field,
    and extracts the 'centralnodeTitle' from each node's data.
    """
    logger.info("Fetching centralnode titles from roadmaps.")
    try:
        # Query for the 'content' column of all roadmaps
        roadmap_contents = db.query(models.Roadmap.content).all()
        titles = []
        
        for content_tuple in roadmap_contents:
            content_str = content_tuple[0]
            if not content_str:
                continue

            try:
                data = json.loads(content_str)
                
                # Assumption: The content is a JSON object with a 'nodes' key,
                # which is a list of node objects.
                if isinstance(data, dict) and 'nodes' in data and isinstance(data['nodes'], list):
                    for node in data['nodes']:
                        # Assumption: Each node is a dict, and the title is in node['data']['centralnodeTitle']
                        if isinstance(node, dict) and 'data' in node and isinstance(node['data'], dict) and 'centralnodeTitle' in node['data']:
                            title = node['data']['centralnodeTitle']
                            if title and isinstance(title, str):
                                titles.append(title)
            except (json.JSONDecodeError, TypeError, KeyError) as e:
                logger.warning(f"Could not parse content or find titles in a roadmap: {e}")
                continue
                
        unique_titles = list(set(titles))
        logger.info(f"Found {len(unique_titles)} unique centralnode titles.")
        return unique_titles
        
    except Exception as e:
        logger.error(f"An error occurred while fetching roadmap titles: {e}")
        return []
