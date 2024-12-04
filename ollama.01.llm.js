import { Ollama } from "@langchain/ollama";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new Ollama({
	model: 'qwen:0.5b'
});

(async () => {
	const promptTemplate = ChatPromptTemplate.fromMessages([
		['system', 'You are a helpful assistant.'],
		['human', 'What is the capital of {input}?'],
	]);

	const parser = new StringOutputParser();

	const chain = promptTemplate.pipe(model).pipe(parser);

	let result = await chain.invoke({
		input: 'Italy',
	});
	console.log(result);
})();
