// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai';
import { Payload, TableRowProps } from '..';

type Data = any


let cachedOpenAi: OpenAIApi | null = null


function getOpenAi() {
  const configuration = new Configuration({
    apiKey: process.env.NEXT_SERVER_OPENAI_KEY,
  })
  const OpenAi = new OpenAIApi(configuration);
  cachedOpenAi = OpenAi
  return OpenAi
}

export async function getChatCompletionStandalone( message: string, model = "gpt-3.5-turbo", temperature = 0, example_tokens: number) {
  console.log('calling')
  const openai = cachedOpenAi ? cachedOpenAi : getOpenAi()
  const completion = await openai.createChatCompletion({
    model: model,
    messages: [{role: "user", content: message}],
    temperature,
    max_tokens: example_tokens * 2
  });

  if (!completion.data.choices[0].message) throw new Error("something fucked up")

  return completion.data.choices[0].message.content
}


export type JesterResp = {cases: TableRowProps[], passRate: number}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<JesterResp>
) {
  // console.log(req.body)
  // console.log(typeof req.body)
  const payload:Payload = (req.body)
  const {prompt, cases} = payload
  if(!prompt.includes('[[input]]')) throw new Error()

  let results:{input: string, result: Promise<string> | string}[] = []

  for(let example of cases) {
    const builtPrompt = prompt.replace('[[input]]', example.input)
    const p = getChatCompletionStandalone(builtPrompt, "gpt-4", 0, example.expectedResult.split(' ').length * 4)
    results.push({input: example.input, result:p})
  }


  await Promise.all(results.map(x => x.result))
  console.log('awaited')


  let newCases:TableRowProps[] = []

  let numPass = 0
  for(let i = 0; i < cases.length; i++) {
    let example = cases[i]
    if(results[i].input !== cases[i].input) throw new Error()
    if(typeof await results[i].result !== 'string') {
      console.log(results)
      console.log(results[i].result)
      throw new Error() 
    }

    example.result = await results[i].result
    const didPass = (await results[i].result === cases[i].expectedResult)
    example.passFail = didPass
    if(didPass) numPass++
    newCases.push(example)
  }

  const passRate = numPass / cases.length
  
  console.log('returned')
  res.status(200).json({cases: newCases, passRate})
}
