from langchain.prompts import ChatPromptTemplate
from langchain_chroma import Chroma
from langchain_ollama import OllamaLLM

from ..llm.init_embedding_function import init_embedding_function

CHROMA_PATH = "chroma"

PROMPT_TEMPLATE = """
Answer the question based only on the following context:

{context}

---

Answer the question based on the above context: {question}
"""


def search_docs(query_text: str):
    # Prepare the DB.
    embedding_function = init_embedding_function()
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)

    # Search the DB.
    db_results = db.similarity_search_with_score(query_text, k=5)
    return db_results


def get_sources(db_results):
    sources = [doc.metadata.get("id", None) for doc, _score in db_results]
    return sources


def get_context_list(db_results):
    context_list = [doc.page_content for doc, _score in db_results]
    return context_list


def get_context(db_results):
    context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in db_results])
    return context_text


def generate_response_from_context(query_text: str, context_text: str):
    # Prepare the prompt for the LLM.
    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    prompt = prompt_template.format(context=context_text, question=query_text)

    model = OllamaLLM(model="llama3.2")
    response_text = model.invoke(prompt)

    return response_text


def generate_response(query_text: str):
    # Search the DB for the query text
    db_results = search_docs(query_text)

    # Get the sources and context from the DB results.
    sources = get_sources(db_results)
    context_text = get_context(db_results)

    # Prepare the prompt for the LLM.
    response_text = generate_response_from_context(query_text, context_text)

    formatted_response = f"Response: {response_text}\nSources: {sources}"
    print(formatted_response)
    return response_text
