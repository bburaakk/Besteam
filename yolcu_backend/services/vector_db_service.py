import chromadb
from chromadb.utils import embedding_functions


class VectorDBService:
    def __init__(self, collection_name="roadmap_collection"):
        """
        Initializes the VectorDBService.
        """
        self.client = chromadb.Client()
        self.embedding_function = embedding_functions.DefaultEmbeddingFunction()
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            embedding_function=self.embedding_function
        )

    def add_documents(self, documents: list[str], metadatas: list[dict] = None, ids: list[str] = None):
        """
        Adds a list of documents to the ChromaDB collection.
        """
        if not documents:
            return
        if ids is None:
            # Simple ID generation, consider more robust methods for production
            import time
            ids = [f"doc_{int(time.time() * 1000)}_{i}" for i in range(len(documents))]

        self.collection.add(
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )
        print(f"Added {len(documents)} documents to the collection.")

    def query(self, query_text: str, n_results: int = 5, where: dict = None) -> list[dict]:
        """
        Queries the collection for documents similar to the query_text, with an optional metadata filter.

        Args:
            query_text: The text to search for.
            n_results: The number of results to return.
            where: A dictionary to filter results based on metadata (e.g., {"roadmap_id": 1}).

        Returns:
            A list of dictionaries containing the results.
        """
        results = self.collection.query(
            query_texts=[query_text],
            n_results=n_results,
            where=where
        )
        return results
