import uuid

from fastapi.testclient import TestClient


def _create(client: TestClient, content: str) -> dict:
    response = client.post("/api/v1/documents", json={"content": content})
    assert response.status_code == 201
    return response.json()


def test_create_returns_document_without_embedding(client: TestClient) -> None:
    document = _create(client, "Postgres stores vectors with pgvector")

    assert document["content"] == "Postgres stores vectors with pgvector"
    assert uuid.UUID(document["id"]).version == 7
    assert "embedding" not in document


def test_get_list_and_delete(client: TestClient) -> None:
    first = _create(client, "first document")
    second = _create(client, "second document")

    assert client.get(f"/api/v1/documents/{first['id']}").json()["id"] == first["id"]

    listing = client.get("/api/v1/documents").json()
    assert listing["total"] == 2
    assert [d["id"] for d in listing["items"]] == [second["id"], first["id"]]

    assert client.delete(f"/api/v1/documents/{first['id']}").status_code == 204
    assert client.get(f"/api/v1/documents/{first['id']}").status_code == 404


def test_search_ranks_most_similar_first(client: TestClient) -> None:
    _create(client, "Cats are small furry pets that purr")
    _create(client, "FastAPI is a Python web framework")
    _create(client, "Postgres with pgvector powers similarity search")

    response = client.post(
        "/api/v1/documents/search", json={"query": "similarity search in postgres", "limit": 2}
    )

    assert response.status_code == 200
    matches = response.json()["matches"]
    assert len(matches) == 2
    assert matches[0]["document"]["content"] == "Postgres with pgvector powers similarity search"
    assert matches[0]["similarity"] > matches[1]["similarity"]


def test_rejects_text_without_words(client: TestClient) -> None:
    assert client.post("/api/v1/documents", json={"content": "   !!!"}).status_code == 422
    assert client.post("/api/v1/documents/search", json={"query": "?"}).status_code == 422


def test_unknown_document_returns_404(client: TestClient) -> None:
    assert client.get(f"/api/v1/documents/{uuid.uuid7()}").status_code == 404
