from services.ai_service import GeminiService
from prompts.suggestion_prompt import SUGGESTION_PROMPT

class ProjectSuggestionGenerator:
    def __init__(self, ai_service: GeminiService):
        self.ai_service = ai_service

    def generate_suggestions(self, titles: list[str]) -> str:
        """
        Generates project suggestions based on a list of titles.
        """
        # Format the titles into a comma-separated string
        titles_str = ", ".join(titles)
        
        # Create the prompt
        prompt = SUGGESTION_PROMPT.format(titles=titles_str)
        
        # Generate content using the AI service
        # Note: We are using the generic generate_content method here.
        suggestions = self.ai_service.generate_content(prompt)
        
        return suggestions
