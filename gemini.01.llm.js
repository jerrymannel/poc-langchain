
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatGoogleGenerativeAI({
	model: 'gemini-1.5-flash',
	maxOutputTokens: 2048,
});

(async () => {
	const messages = [
		new SystemMessage('You are a helpful assistant.'),
		new HumanMessage('What is the capital of France?'),
	];

	const promptTemplate = ChatPromptTemplate.fromMessages([
		['system', 'Find the capital of {country}.'],
		['human', '{input}'],
	]);

	const parser = new StringOutputParser();

	const chain = promptTemplate.pipe(model).pipe(parser);

	const result = await chain.invoke({
		country: 'Italy',
		input: 'What is the capital?',
	});

	console.log(result);
})();
