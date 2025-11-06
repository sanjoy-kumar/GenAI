import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

dotenv.config();


const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  maxTokens: 500
})

const main = async () => {
  //---- single request--------
  /*
  const response = await model.invoke("What is the Capital of Bangladesh?");
  console.log(response.content);
  */

  // ---- Batch requests--------
  /* 
  // model.batch() returns an array of BaseMessage (specifically AIMessage) objects.
  const batchResponses = await model.batch(
    [
      "Hello",
      "What is the Capital of Canada?"
    ]
  );

  // 1. Extract the content: The map function is the correct approach.
  const extractedContent: string[] = batchResponses.map(message => message.text);

  // 2. Output the result
  console.log(extractedContent);
  */


  //---- Stream request--------

  /*

  const response = await model.stream("What is the Capital of Bangladesh?");
  for await (const chunk of response) {
    console.log(chunk.content);
  }
  
  */

  // --- Prompts

  const systemTemplate = "Translate the following from English to {language}";
  const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    ["user", "{text}"]
  ]);

  const promptValue = await promptTemplate.invoke({
    language: "bengali",
    text: "Hi, My name is Sanjoy Kumar Das."
  });

  console.log(`Prompt Value: ${promptValue}`);

  promptValue.toChatMessages();

  const response = await model.invoke(promptValue);
  console.log(response.content);

}

main();


