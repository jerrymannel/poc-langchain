import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { StringOutputParser } from "@langchain/core/output_parsers";

const model = new ChatGoogleGenerativeAI({
	model: 'gemini-1.5-flash',
	maxOutputTokens: 2048,
});

const embeddings = new GoogleGenerativeAIEmbeddings({
	model: "text-embedding-004",
	taskType: TaskType.RETRIEVAL_DOCUMENT
});

const splitter = new RecursiveCharacterTextSplitter({
	chunkSize: 1000,
	chunkOverlap: 200,
});

const inMemoryVectorStorage = new MemoryVectorStore(embeddings);

const vectorStoreRetriver = inMemoryVectorStorage.asRetriever(1);

const pdfReport = './doc-01-depositLetter.pdf';

async function addDocument(documentPath) {
	const loader = new PDFLoader(documentPath);
	const docs = await loader.load();
	// console.log(`${documentPath} has ${docs.length} pages`);
	const chunks = await splitter.splitDocuments(docs);
	// console.log(`${documentPath} has ${chunks.length} chunks`);
	inMemoryVectorStorage.addDocuments(chunks);
	console.log(`${documentPath} added to vector store`);
}

(async () => {
	await addDocument(pdfReport);

	const question = "Tell me about the parking space?";
	const docs = await vectorStoreRetriver.invoke(question);
	console.log(docs);

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
