// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai';
import { Payload, TableRowProps } from '..';
import Mixpanel from 'mixpanel'
var mixpanel = Mixpanel.init('04ff0d092d6141a774c95ad8c2cf0d41');

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

export async function getChatCompletionStandalone( message: string, expected: string, model = "gpt-3.5-turbo", temperature = 0, example_tokens: number) {
  console.log('calling')
  const openai = cachedOpenAi ? cachedOpenAi : getOpenAi()
  const completion = await openai.createChatCompletion({
    model: model,
    messages: [{role: "user", content: message}],
    temperature,
    max_tokens: example_tokens * 2
  });

  if (!completion.data.choices[0].message) throw new Error("something fucked up")
  const result = completion.data.choices[0].message.content

  const completion2 = await openai.createChatCompletion({
    model: model,
    messages: [
      {
        role: "user",
        content: `Based on what was expected, and the result, determine whether the result was expected or not. Return \`expected\` if it was expected, and \`not expected\` if it wasn't with no punctuation.
        Expected: ${expected}
        Result: ${result}`
      }
    ],
    temperature: 0,
    max_tokens: 10
  });


  if (!completion2.data.choices[0].message) throw new Error("something fucked up")

  const expectedOrNot = completion2.data.choices[0].message.content

  console.log(expectedOrNot)

  if(expectedOrNot.toLowerCase() !== "expected" && expectedOrNot.toLowerCase() !== 'not expected') throw new Error()


  return {result, didPass: (expectedOrNot === "expected")}
}


export type JesterResp = {cases: TableRowProps[], passRate: number}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<JesterResp>
) {
  mixpanel.track('Usage', {
    'distinct_id': req.headers.host ?? req.headers.origin ?? req.headers.from ?? "anon :("
  })
  
  // console.log(req.body)
  // console.log(typeof req.body)
  const payload:Payload = (req.body)
  const {prompt, cases} = payload
  if(!prompt.includes('{{input}}')) throw new Error()

  let results:{input: string, result: Promise<{result: string, didPass: boolean}>}[] = []


  for(let example of cases) {
    let builtPrompt = prompt
    Object.keys(example).filter((key) => key !== "result" && key !== "expected" && key !== "passFail").map((exKey) => {
      const promptKey = `{{${exKey.toLowerCase()}}`
      if(!prompt.includes(promptKey)) throw new Error()
      builtPrompt = builtPrompt.replace(promptKey, example[exKey])
      
    })
    const result = getChatCompletionStandalone(builtPrompt, example.expected, "gpt-4", 0, example.expected.split(' ').length * 4)

    results.push({input: example.input, result})
  }


  await Promise.all(results.map(x => x.result))
  console.log('awaited')


  let newCases:TableRowProps[] = []

  let numPass = 0
  for(let i = 0; i < cases.length; i++) {
    let example = cases[i]
    if(results[i].input !== cases[i].input) throw new Error()
    const result = await results[i].result
    if(typeof result.result !== 'string') {
      console.log(results)
      console.log(results[i].result)
      throw new Error() 
    }

    example.result = result.result
    const didPass = (result.didPass)
    example.passFail = didPass
    if(didPass) numPass++
    newCases.push(example)
  }

  const passRate = numPass / cases.length
  
  console.log('returned')
  res.status(200).json({cases: newCases, passRate})
}
