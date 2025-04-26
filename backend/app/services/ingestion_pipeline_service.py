# app/services/ingestion_pipeline_service.py
# Ingestion Pipeline (Splitting and Transforming)
from llama_index.core.extractors import TitleExtractor, QuestionsAnsweredExtractor
from llama_index.core.node_parser import SentenceSplitter
from llama_index.core.ingestion import IngestionPipeline
from app.services.embedding_service import get_llm_transformations

def process_documents(documents: list):
    llm_transformations = get_llm_transformations()

    text_splitter = SentenceSplitter(separator=" ", chunk_size=1024, chunk_overlap=128)
    title_extractor = TitleExtractor(llm=llm_transformations, nodes=5)
    qa_extractor = QuestionsAnsweredExtractor(llm=llm_transformations, questions=3)

    pipeline = IngestionPipeline(
        transformations=[
            text_splitter,
            title_extractor,
            qa_extractor
        ]
    )
    
    nodes = pipeline.run(
        documents=documents,
        in_place=True,
        show_progress=True,
    )
    return nodes
