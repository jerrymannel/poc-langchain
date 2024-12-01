import { Ollama, OllamaEmbeddings } from "@langchain/ollama";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { StringOutputParser } from "@langchain/core/output_parsers";

const model = new Ollama({
	baseUrl: "http://localhost:11434",
	model: 'llama3.2',
	// model: 'qwen:0.5b',
	temperature: 0
});

const embeddings = new OllamaEmbeddings({
	baseUrl: "http://localhost:11434",
	model: 'nomic-embed-text:latest',
});

const splitter = new RecursiveCharacterTextSplitter({
	chunkSize: 1000,
	chunkOverlap: 200,
});

const inMemoryVectorStorage = new MemoryVectorStore(embeddings);

const vectorStoreRetriver = inMemoryVectorStorage.asRetriever({
	k: 6,
	searchType: 'similarity'
});

const pdfReport = './doc-01-depositLetter.pdf';
const pdfWhitepaper = './doc-02-whitepaper.pdf';


async function addDocument(documentPath) {
	const loader = new PDFLoader(documentPath);
	const docs = await loader.load();
	console.log(`${documentPath} has ${docs.length} pages`);
	const chunks = await splitter.splitDocuments(docs);
	console.log(`${documentPath} has ${chunks.length} chunks`);
	inMemoryVectorStorage.addDocuments(chunks);
}

(async () => {
	// await addDocument(pdfWhitepaper);
	await addDocument(pdfReport);

	const question = "What's the available parking space?";
	const docs = await vectorStoreRetriver.invoke(question);

	const promptTemplate = ChatPromptTemplate.fromMessages([
		['system', "Summarize the following context: {context}"],
	]);

	const chain = await createStuffDocumentsChain({
		llm: model,
		prompt: promptTemplate,
		outputParser: new StringOutputParser(),
		verbose: true,
	});

	const result = await chain.invoke({
		context: docs,
	});
	console.log(result);
	console.log('------------------------------------');
})();
