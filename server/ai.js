
const OpenAI = require("openai");
const { PageSchema } = require("./schema");

// OpenAI client is created only when OpenAI mode is used.
function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY is required when AI_MODE=openai."
    );
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

async function generateWithOpenAI(
  businessDescription
) {
  console.log(
    "Generating content with OpenAI..."
  );

  const openai = getOpenAIClient();

  const response =
    await openai.responses.create({
      model:
        process.env.OPENAI_MODEL ||
        "gpt-5.6-luna",

      instructions: `
You are an AI webpage content generator.

The user will provide a one-line description
of a business.

Generate content for a simple webpage.

The webpage MUST contain exactly 3 blocks
in this exact order:

1. Hero
2. Features
3. Footer

HERO:
- type must be "hero"
- heading must be a string
- subheading must be a string

FEATURES:
- type must be "features"
- items must contain between 2 and 4 items
- each item must have a title and description

FOOTER:
- type must be "footer"
- text must be a string

Do not create any additional blocks.
Do not add any additional fields.

Make the content relevant to the business
description.

Return only the requested structured JSON.
`,

      input: businessDescription,

      text: {
        format: {
          type: "json_schema",
          name: "webpage_content",
          strict: true,

          schema: {
            type: "object",

            properties: {
              blocks: {
                type: "array",
                minItems: 3,
                maxItems: 3,

                prefixItems: [
                  {
                    type: "object",

                    properties: {
                      type: {
                        type: "string",
                        enum: ["hero"],
                      },

                      heading: {
                        type: "string",
                      },

                      subheading: {
                        type: "string",
                      },
                    },

                    required: [
                      "type",
                      "heading",
                      "subheading",
                    ],

                    additionalProperties:
                      false,
                  },

                  {
                    type: "object",

                    properties: {
                      type: {
                        type: "string",
                        enum: ["features"],
                      },

                      items: {
                        type: "array",

                        minItems: 2,
                        maxItems: 4,

                        items: {
                          type: "object",

                          properties: {
                            title: {
                              type: "string",
                            },

                            description: {
                              type: "string",
                            },
                          },

                          required: [
                            "title",
                            "description",
                          ],

                          additionalProperties:
                            false,
                        },
                      },
                    },

                    required: [
                      "type",
                      "items",
                    ],

                    additionalProperties:
                      false,
                  },

                  {
                    type: "object",

                    properties: {
                      type: {
                        type: "string",
                        enum: ["footer"],
                      },

                      text: {
                        type: "string",
                      },
                    },

                    required: [
                      "type",
                      "text",
                    ],

                    additionalProperties:
                      false,
                  },
                ],

                items: false,
              },
            },

            required: ["blocks"],

            additionalProperties:
              false,
          },
        },
      },
    });

  const outputText =
    response.output_text;

  if (!outputText) {
    throw new Error(
      "OpenAI returned an empty response."
    );
  }

  console.log(
    "OpenAI response received."
  );

  let parsedContent;

  try {
    parsedContent =
      JSON.parse(outputText);
  } catch (error) {
    console.error(
      "OpenAI returned invalid JSON:"
    );

    console.error(outputText);

    throw new Error(
      "OpenAI returned invalid JSON."
    );
  }

  const validationResult =
    PageSchema.safeParse(
      parsedContent
    );

  if (!validationResult.success) {
    console.error(
      "OpenAI content failed Zod validation:"
    );

    console.error(
      validationResult.error.issues
    );

    throw new Error(
      "OpenAI generated content did not match the required schema."
    );
  }

  console.log(
    "OpenAI content passed Zod validation."
  );

  return validationResult.data;
}

module.exports = {
  generateWithOpenAI,
};
