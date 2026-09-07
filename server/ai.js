
const OpenAI = require("openai");
const { PageSchema } = require("./schema");

// --------------------------------------------------
// OPENAI CLIENT
// --------------------------------------------------

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --------------------------------------------------
// GENERATE CONTENT WITH OPENAI
// --------------------------------------------------

async function generateWithOpenAI(
  businessDescription
) {
  console.log(
    "Generating content with OpenAI..."
  );

  const response =
    await openai.responses.create({
      model:
        process.env.OPENAI_MODEL ||
        "gpt-5.6-luna",

      // ------------------------------------------------
      // SYSTEM INSTRUCTIONS
      // ------------------------------------------------

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
- subheading may be a string

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

      // ------------------------------------------------
      // USER INPUT
      // ------------------------------------------------

      input: businessDescription,

      // ------------------------------------------------
      // STRUCTURED OUTPUT
      // ------------------------------------------------

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
                  // ------------------------------------
                  // HERO
                  // ------------------------------------

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

                  // ------------------------------------
                  // FEATURES
                  // ------------------------------------

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

                  // ------------------------------------
                  // FOOTER
                  // ------------------------------------

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

                // JSON Schema requires this when
                // prefixItems is used.
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

  // --------------------------------------------------
  // GET OPENAI OUTPUT
  // --------------------------------------------------

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

  // --------------------------------------------------
  // PARSE JSON
  // --------------------------------------------------

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

  // --------------------------------------------------
  // ZOD VALIDATION
  // --------------------------------------------------

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

// --------------------------------------------------
// EXPORT
// --------------------------------------------------

module.exports = {
  generateWithOpenAI,
};
