# ChatGptApiDemo

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.0.1.

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code along:

### Implement service without JSON formatting

#### Environment

    export const environment = {
        openai_key: '<TOKEN>'
    };


#### Configuration

    configuration = new Configuration({ apiKey: environment.openai_key });
    openai = new OpenAIApi(this.configuration);

#### System Prompt

    const messages: ChatCompletionRequestMessage[] = [
      {
        role: 'system',
        content: `You will be asked for random quotes from the works of Shakespeare. You change the quote as if it was given by a ${style}. You don't use the quote 'To be or not to be'`,
      },
    ];

#### User prompt

Add to messages list:

      { role: 'user', content: `Give me a random shakespeare quote.` },

#### Run createChatCompletion

    this.openai
      .createChatCompletion({
        model: 'gpt-4',
        messages: messages,
        temperature: 1,
        max_tokens: 1000,
      })
      .then((res) => {
        const content = res.data.choices[0].message?.content;
        if (content != null) {
          const quoteData = JSON.parse(content) as QuoteData;
          this.shakespeareQuote.set(quoteData);
        }
      })
      .catch((err) => this.shakespeareQuoteErr.set(err))
      .finally(() => this.loading.set(false));

#### Edit prompt to not do <em>To be or not to be</em>

    const messages: ChatCompletionRequestMessage[] = [
      {
        role: 'system',
        content: `You will be asked for random quotes from the works of Shakespeare. You change the quote as if it was given by a ${style}. You don't use the quote 'To be or not to be'`,
      },
    ];

### Add JSON formatting

#### User prompt or system prompt

Add the following to the user or system prompt

      Your response should be in JSON format {styledQuote: string, originalQuote: string, play: string, act: string, scene: string}

#### Update HTML





