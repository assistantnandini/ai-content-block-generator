
// --------------------------------------------------
// LOAD ENVIRONMENT VARIABLES FIRST
// --------------------------------------------------

const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

// --------------------------------------------------
// IMPORT PACKAGES
// --------------------------------------------------

const express = require("express");
const cors = require("cors");

const { PageSchema } = require("./schema");
const { generateWithOpenAI } = require("./ai");

// --------------------------------------------------
// CREATE EXPRESS APP
// --------------------------------------------------

const app = express();

// --------------------------------------------------
// MIDDLEWARE
// --------------------------------------------------

app.use(cors());
app.use(express.json());

// --------------------------------------------------
// ENVIRONMENT INFORMATION
// --------------------------------------------------

console.log(
  "OpenAI API key loaded:",
  Boolean(process.env.OPENAI_API_KEY)
);

console.log(
  "AI mode:",
  process.env.AI_MODE || "mock"
);

console.log(
  "OpenAI model:",
  process.env.OPENAI_MODEL || "default"
);

// --------------------------------------------------
// TEST ROUTE
// --------------------------------------------------

app.get("/", (req, res) => {
  res.json({
    message:
      "AI Content Block Generator backend is running!",
  });
});

// --------------------------------------------------
// MOCK AI GENERATION
// --------------------------------------------------

function generateMockContent(
  businessDescription
) {
  console.log(
    "Generating mock content for:",
    businessDescription
  );

  const description =
    businessDescription.toLowerCase();

  // ------------------------------------------------
  // COFFEE SHOP
  // ------------------------------------------------

  if (
    description.includes("coffee") ||
    description.includes("cafe") ||
    description.includes("café")
  ) {
    return {
      blocks: [
        {
          type: "hero",
          heading:
            "Your Neighborhood Coffee Shop",
          subheading:
            "Fresh coffee, delicious treats, and a cozy place to relax.",
        },
        {
          type: "features",
          items: [
            {
              title: "Fresh Coffee",
              description:
                "Enjoy freshly brewed coffee made from quality beans.",
            },
            {
              title: "Homemade Pastries",
              description:
                "Treat yourself to fresh pastries made every day.",
            },
            {
              title: "Cozy Atmosphere",
              description:
                "Relax in a warm and welcoming neighborhood space.",
            },
          ],
        },
        {
          type: "footer",
          text:
            "Made with love for our neighborhood.",
        },
      ],
    };
  }

  // ------------------------------------------------
  // GYM / FITNESS
  // ------------------------------------------------

  if (
    description.includes("gym") ||
    description.includes("fitness") ||
    description.includes("workout")
  ) {
    return {
      blocks: [
        {
          type: "hero",
          heading:
            "Reach Your Fitness Goals",
          subheading:
            "Modern equipment, expert guidance, and a community that keeps you motivated.",
        },
        {
          type: "features",
          items: [
            {
              title: "Modern Equipment",
              description:
                "Train with quality equipment designed for every fitness level.",
            },
            {
              title: "Expert Trainers",
              description:
                "Get guidance from experienced trainers who help you train smarter.",
            },
            {
              title: "Flexible Memberships",
              description:
                "Choose a membership that fits your schedule and fitness goals.",
            },
          ],
        },
        {
          type: "footer",
          text:
            "Start your fitness journey today.",
        },
      ],
    };
  }

  // ------------------------------------------------
  // RESTAURANT / FOOD
  // ------------------------------------------------

  if (
    description.includes("restaurant") ||
    description.includes("food") ||
    description.includes("dining")
  ) {
    return {
      blocks: [
        {
          type: "hero",
          heading:
            "Great Food, Great Moments",
          subheading:
            "Fresh ingredients, delicious dishes, and a dining experience to remember.",
        },
        {
          type: "features",
          items: [
            {
              title: "Fresh Ingredients",
              description:
                "We use carefully selected ingredients to create delicious meals.",
            },
            {
              title: "Delicious Menu",
              description:
                "Enjoy a variety of dishes prepared fresh for every guest.",
            },
            {
              title: "Warm Hospitality",
              description:
                "Relax and enjoy friendly service in a welcoming atmosphere.",
            },
          ],
        },
        {
          type: "footer",
          text:
            "Good food brings people together.",
        },
      ],
    };
  }

  // ------------------------------------------------
  // SALON / BEAUTY / SPA
  // ------------------------------------------------

  if (
    description.includes("salon") ||
    description.includes("beauty") ||
    description.includes("spa")
  ) {
    return {
      blocks: [
        {
          type: "hero",
          heading:
            "Feel Your Best",
          subheading:
            "Professional beauty services in a relaxing and welcoming environment.",
        },
        {
          type: "features",
          items: [
            {
              title: "Expert Services",
              description:
                "Enjoy professional services tailored to your personal style.",
            },
            {
              title: "Relaxing Experience",
              description:
                "Take a break and enjoy a calm, comfortable atmosphere.",
            },
            {
              title: "Personal Care",
              description:
                "Every visit is designed around your individual needs.",
            },
          ],
        },
        {
          type: "footer",
          text:
            "Your time to relax and feel amazing.",
        },
      ],
    };
  }

  // ------------------------------------------------
  // DEFAULT BUSINESS
  // ------------------------------------------------

  return {
    blocks: [
      {
        type: "hero",
        heading:
          "Welcome to Our Business",
        subheading:
          "Quality products, great service, and an experience made for you.",
      },
      {
        type: "features",
        items: [
          {
            title: "Quality Service",
            description:
              "We focus on providing reliable and friendly service.",
          },
          {
            title: "Customer Focused",
            description:
              "Everything we do is designed with our customers in mind.",
          },
          {
            title: "Simple Experience",
            description:
              "Enjoy an easy and welcoming experience from start to finish.",
          },
        ],
      },
      {
        type: "footer",
        text:
          "Thank you for choosing our business.",
      },
    ],
  };
}

// --------------------------------------------------
// AI GENERATION SELECTOR
// --------------------------------------------------

async function generateContent(
  businessDescription
) {
  const aiMode =
    process.env.AI_MODE || "mock";

  // Free development mode
  if (aiMode === "mock") {
    return generateMockContent(
      businessDescription
    );
  }

  // OpenAI mode
  if (aiMode === "openai") {
    return generateWithOpenAI(
      businessDescription
    );
  }

  throw new Error(
    `Unknown AI_MODE: ${aiMode}`
  );
}

// --------------------------------------------------
// GENERATE WEBPAGE CONTENT
// --------------------------------------------------

app.post(
  "/api/generate",
  async (req, res) => {
    try {
      const {
        businessDescription,
      } = req.body;

      // ----------------------------------------------
      // VALIDATE USER INPUT
      // ----------------------------------------------

      if (
        !businessDescription ||
        !businessDescription.trim()
      ) {
        return res.status(400).json({
          error:
            "Business description is required.",
        });
      }

      console.log(
        "Business description received:",
        businessDescription
      );

      // ----------------------------------------------
      // RETRY LOGIC
      // ----------------------------------------------

      const MAX_RETRIES = 3;

      for (
        let attempt = 1;
        attempt <= MAX_RETRIES;
        attempt++
      ) {
        console.log(
          `Generation attempt ${attempt}/${MAX_RETRIES}`
        );

        try {
          const generatedContent =
            await generateContent(
              businessDescription
            );

          // ------------------------------------------
          // ZOD VALIDATION
          // ------------------------------------------

          const validationResult =
            PageSchema.safeParse(
              generatedContent
            );

          if (
            validationResult.success
          ) {
            console.log(
              `Zod validation successful on attempt ${attempt}.`
            );

            return res.json({
              raw: JSON.stringify(
                validationResult.data
              ),
            });
          }

          console.error(
            `Zod validation failed on attempt ${attempt}:`,
            validationResult.error.issues
          );
        } catch (generationError) {
          console.error(
            `Generation failed on attempt ${attempt}:`,
            generationError.message
          );
        }

        if (attempt < MAX_RETRIES) {
          console.log(
            "Retrying generation..."
          );
        }
      }

      // ----------------------------------------------
      // ALL RETRIES FAILED
      // ----------------------------------------------

      return res.status(500).json({
        error:
          "Failed to generate valid webpage content after multiple attempts.",
      });
    } catch (error) {
      console.error(
        "GENERATE ERROR:",
        error
      );

      return res.status(500).json({
        error:
          error.message ||
          "Failed to generate webpage content.",
      });
    }
  }
);

// --------------------------------------------------
// FOLLOW-UP EDIT
// --------------------------------------------------

app.post(
  "/api/edit",
  async (req, res) => {
    try {
      const {
        pageContent,
        instruction,
      } = req.body;

      // ----------------------------------------------
      // VALIDATE REQUEST
      // ----------------------------------------------

      if (!pageContent) {
        return res.status(400).json({
          error:
            "Page content is required.",
        });
      }

      if (
        !instruction ||
        !instruction.trim()
      ) {
        return res.status(400).json({
          error:
            "Edit instruction is required.",
        });
      }

      console.log(
        "Edit instruction received:",
        instruction
      );

      // ----------------------------------------------
      // VALIDATE EXISTING PAGE
      // ----------------------------------------------

      const existingValidation =
        PageSchema.safeParse(
          pageContent
        );

      if (!existingValidation.success) {
        console.error(
          "Existing page validation failed:",
          existingValidation.error.issues
        );

        return res.status(400).json({
          error:
            "Existing page content is invalid.",
        });
      }

      // ----------------------------------------------
      // COPY EXISTING PAGE
      // ----------------------------------------------

      const updatedPage = {
        blocks:
          existingValidation.data.blocks.map(
            (block) => ({
              ...block,

              ...(block.type ===
              "features"
                ? {
                    items:
                      block.items.map(
                        (item) => ({
                          ...item,
                        })
                      ),
                  }
                : {}),
            })
          ),
      };

      const lowerInstruction =
        instruction
          .toLowerCase()
          .trim();

      // ----------------------------------------------
      // SUBHEADING EDIT
      // ----------------------------------------------

      if (
        lowerInstruction.includes(
          "subheading"
        )
      ) {
        const currentSubheading =
          updatedPage.blocks[0]
            .subheading || "";

        updatedPage.blocks[0] = {
          ...updatedPage.blocks[0],

          subheading:
            shortenText(
              currentSubheading
            ),
        };

        console.log(
          "Subheading updated."
        );
      }

      // ----------------------------------------------
      // SHORT HEADING EDIT
      // ----------------------------------------------

      else if (
        lowerInstruction.includes(
          "heading"
        ) &&
        (
          lowerInstruction.includes(
            "short"
          ) ||
          lowerInstruction.includes(
            "shorter"
          )
        )
      ) {
        const currentHeading =
          updatedPage.blocks[0]
            .heading;

        updatedPage.blocks[0] = {
          ...updatedPage.blocks[0],

          heading:
            shortenText(
              currentHeading
            ),
        };

        console.log(
          "Heading shortened."
        );
      }

      // ----------------------------------------------
      // GENERAL HEADING EDIT
      // ----------------------------------------------

      else if (
        lowerInstruction.includes(
          "heading"
        )
      ) {
        const currentHeading =
          updatedPage.blocks[0]
            .heading;

        updatedPage.blocks[0] = {
          ...updatedPage.blocks[0],

          heading:
            makeHeadingMoreConcise(
              currentHeading
            ),
        };

        console.log(
          "Heading updated."
        );
      }

      // ----------------------------------------------
      // FOOTER EDIT
      // ----------------------------------------------

      else if (
        lowerInstruction.includes(
          "footer"
        )
      ) {
        const currentFooter =
          updatedPage.blocks[2]
            .text;

        updatedPage.blocks[2] = {
          ...updatedPage.blocks[2],

          text:
            makeFooterFriendly(
              currentFooter
            ),
        };

        console.log(
          "Footer updated."
        );
      }

      // ----------------------------------------------
      // FEATURE EDIT
      // ----------------------------------------------

      else if (
        lowerInstruction.includes(
          "feature"
        )
      ) {
        const featuresBlock =
          updatedPage.blocks[1];

        if (
          featuresBlock &&
          featuresBlock.type ===
            "features"
        ) {
          const firstFeature =
            featuresBlock.items[0];

          featuresBlock.items[0] = {
            ...firstFeature,

            description:
              makeFeatureDescriptionBetter(
                firstFeature.description
              ),
          };

          console.log(
            "First feature updated."
          );
        }
      }

      // ----------------------------------------------
      // UNKNOWN INSTRUCTION
      // ----------------------------------------------

      else {
        console.log(
          "Could not understand edit instruction."
        );

        return res.status(400).json({
          error:
            "I could not understand which part of the webpage you want to change. Try mentioning the heading, subheading, feature, or footer.",
        });
      }

      // ----------------------------------------------
      // VALIDATE UPDATED PAGE
      // ----------------------------------------------

      const updatedValidation =
        PageSchema.safeParse(
          updatedPage
        );

      if (!updatedValidation.success) {
        console.error(
          "Updated content failed validation:",
          updatedValidation.error.issues
        );

        return res.status(500).json({
          error:
            "Updated content failed schema validation.",
        });
      }

      console.log(
        "Updated content passed Zod validation."
      );

      // ----------------------------------------------
      // RETURN UPDATED CONTENT
      // ----------------------------------------------

      return res.json({
        raw: JSON.stringify(
          updatedValidation.data
        ),
      });
    } catch (error) {
      console.error(
        "EDIT ERROR:",
        error
      );

      return res.status(500).json({
        error:
          error.message ||
          "Failed to update webpage content.",
      });
    }
  }
);

// --------------------------------------------------
// HELPER FUNCTIONS
// --------------------------------------------------

function shortenText(text) {
  if (!text) {
    return text;
  }

  const words =
    text.trim().split(/\s+/);

  if (words.length <= 4) {
    return text;
  }

  return words
    .slice(0, 4)
    .join(" ")
    .replace(/[,.!?]+$/, "");
}

function makeHeadingMoreConcise(
  heading
) {
  if (!heading) {
    return heading;
  }

  return shortenText(heading);
}

function makeFooterFriendly(
  footer
) {
  if (!footer) {
    return footer;
  }

  return footer.replace(
    /thank you for choosing/i,
    "Thanks for choosing"
  );
}

function makeFeatureDescriptionBetter(
  description
) {
  if (!description) {
    return description;
  }

  return `${description} We are committed to making every customer experience enjoyable.`;
}

// --------------------------------------------------
// START SERVER
// --------------------------------------------------

const PORT = 5000;

const server = app.listen(
  PORT,
  () => {
    console.log(
      `Server running on http://localhost:${PORT}`
    );

    console.log(
      "Server is now listening..."
    );
  }
);

// --------------------------------------------------
// SERVER ERROR
// --------------------------------------------------

server.on(
  "error",
  (error) => {
    console.error(
      "SERVER ERROR:"
    );

    console.error(error);
  }
);

console.log(
  "Node process started..."
);
