import json
import logging
from sqlalchemy.orm import Session
from ..models import Roadmap

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def get_centralnode_titles(db: Session, user_id: int) -> list[str]:
    """
    Fetches the most recent roadmap for a specific user, parses its content,
    and extracts all 'centralNodeTitle' values.
    """
    logger.info(f"Fetching centralnode titles from the latest roadmap for user_id: {user_id}")
    try:
        # Query for the most recent roadmap for the given user
        latest_roadmap = db.query(Roadmap).filter(Roadmap.user_id == user_id).order_by(Roadmap.created_at.desc()).first()

        if not latest_roadmap:
            logger.warning(f"No roadmaps found for user_id: {user_id}")
            return []

        content_data = latest_roadmap.content
        if not content_data:
            logger.warning(f"Latest roadmap for user_id: {user_id} has empty content.")
            return []

        titles = set()
        data = {}
        # If content is a string, parse it. If it's already a dict (from JSONB), use it directly.
        if isinstance(content_data, str):
            try:
                data = json.loads(content_data)
            except json.JSONDecodeError:
                logger.warning(f"Could not decode JSON from roadmap content for user_id: {user_id}")
                return []
        elif isinstance(content_data, dict):
            data = content_data
        else:
            logger.warning(f"Roadmap content is of unexpected type: {type(content_data)}")
            return []

        main_stages = data.get('mainStages')
        if not isinstance(main_stages, list):
            logger.warning(f"Could not find a 'mainStages' list in roadmap content for user_id: {user_id}")
            return []

        for stage in main_stages:
            sub_nodes = stage.get('subNodes')
            if not isinstance(sub_nodes, list):
                continue
            
            for sub_node in sub_nodes:
                title = sub_node.get('centralNodeTitle')
                if title and isinstance(title, str):
                    titles.add(title)

        unique_titles = list(titles)
        logger.info(f"Found {len(unique_titles)} unique titles in the latest roadmap for user_id: {user_id}")
        return unique_titles

    except Exception as e:
        logger.error(f"An unexpected error occurred while fetching roadmap titles for user_id {user_id}: {e}", exc_info=True)
        return []
