from ..services.ai_service import GeminiService
from ..prompts.suggestion_prompt import SUGGESTION_PROMPT


class ProjectSuggestionGenerator:
    def __init__(self, ai_service: GeminiService):
        self.ai_service = ai_service

    def generate_suggestions(self, titles: list[str]) -> str:
        """
        Generates project suggestions based on a list of titles and cleans the output.
        """
        # Format the titles into a comma-separated string
        titles_str = ", ".join(titles)

        # Create the prompt
        prompt = SUGGESTION_PROMPT.format(titles=titles_str)

        # Generate content using the AI service
        raw_suggestions = self.ai_service.generate_content(prompt)

        # Clean the raw output from common markdown characters like '**' or '#'
        # The AI might still output markdown despite the prompt.
        cleaned_suggestions = raw_suggestions.replace('**', '').replace('#', '') # TODO: Burdaki temizleme işlemini ortak bir yere al ordan çek

        return cleaned_suggestions
