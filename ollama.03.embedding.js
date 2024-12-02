import { OllamaEmbeddings } from "@langchain/ollama";
import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

(async () => {

	console.clear();

	const splitter = new RecursiveCharacterTextSplitter({
		chunkSize: 1000,
		chunkOverlap: 200,
	});

	const docs = new Document({
		pageContent: "Hello, world! this is a test",
		metadata: { source: "example.com" }
	});

	const embeddings = await new OllamaEmbeddings({
		baseUrl: "http://localhost:11434",
		model: 'nomic-embed-text:latest',
	})

	const vectorstore = await MemoryVectorStore.fromDocuments(
		[docs],
		embeddings
	);
	console.log(vectorstore.memoryVectors);

	const retriever = vectorstore.asRetriever(1);
	console.log(retriever);

	const result = await retriever.invoke("hello");
	// console.log(result);
})();
