import { Injectable, WritableSignal, signal } from '@angular/core';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { environment } from 'src/environments/environment';

export type QuoteData = {
  charCurrentHp: string;
  monsterCurrentHp: string;
  charName: string;
  monsterName: string;
  lastRound: string;
};

@Injectable({
  providedIn: 'root',
})
export class ShakespeareQuoteService {
  loading: WritableSignal<boolean> = signal(false);
  shakespeareQuote: WritableSignal<QuoteData | null> = signal(null);
  shakespeareQuoteErr: WritableSignal<any | null> = signal(null);

  configuration = new Configuration({ apiKey: environment.openai_key });
  openai = new OpenAIApi(this.configuration);

  private shakespeareQuoteContext: WritableSignal<ChatCompletionRequestMessage[]> = signal([]);

  constructor() {
    console.log('OpenAI key: ' + environment.openai_key);
  }

  public async fetchShakespeareQuote(style: string) {
    this.loading.set(true);
    this.shakespeareQuoteErr.set(null);

    let messages: ChatCompletionRequestMessage[];
    if (this.shakespeareQuoteContext().length === 0) {
      messages = [
        {
          role: 'system',
          content: `You will simulate a Dungeons and Dragons battle, with a random named monster fighting a ${style}, starting with roll for initiative. Give a summary of the combat round, with dice rolls and modifiers.`,
        },
        { role: 'user', content: `Simulate a Dungeons and Dragons battle. Your response should be in JSON format {charCurrentHp: string, monsterCurrentHp: string, charName: string, monsterName: string, lastRound: string}` },
      ];
      this.shakespeareQuoteContext.set(messages);
    } else {
      const prompt: ChatCompletionRequestMessage = {role: 'user', content: 'Continue the fight.'};
      this.shakespeareQuoteContext.mutate(context => context.push(prompt));
      messages = this.shakespeareQuoteContext();
    }

    this.openai
      .createChatCompletion({
        model: 'gpt-4',
        messages: messages,
        temperature: 1,
        max_tokens: 5000,
      })
      .then((res) => {
        const content = res.data.choices[0].message?.content;
        if (content != null) {  
          const quoteData = JSON.parse(content) as QuoteData;        
          this.shakespeareQuote.set(quoteData);
          this.shakespeareQuoteContext.mutate((context) => context.push({role: 'assistant', content}));
        }
      })
      .catch((err) => this.shakespeareQuoteErr.set(err))
      .finally(() => this.loading.set(false));
  }
}
