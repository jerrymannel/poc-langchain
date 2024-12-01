if (process.env.OPENAI_API_KEY === undefined) {
	console.log('OPENAI_API_KEY is not set');
	process.exit(1);
}

import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";

(async () => {
	const model = new ChatOpenAI({
		model: 'gpt-3.5-turbo-0125',
	});

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
