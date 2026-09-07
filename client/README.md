# AI Content Block Generator

A small web application that generates a simple webpage from a one-line business description using structured JSON.

The generated content is rendered dynamically as:

* Hero section
* Features section
* Footer section

The application also supports a follow-up instruction to modify the existing generated content without regenerating the complete webpage.

---

## Features

* Generate webpage content from a business description
* Structured JSON output
* Fixed Hero → Features → Footer block order
* 2–4 feature items
* Schema validation using Zod
* Error handling and retry logic
* Follow-up editing of existing content
* Dynamic React rendering
* JSON preview
* Responsive UI
* Mock AI mode for development without API costs

---

## Tech Stack

### Frontend

* React
* Vite
* CSS

### Backend

* Node.js
* Express.js
* Zod
* OpenAI API integration

---

## Project Structure

```text
ai-content-block-generator/
│
├── .env
├── .gitignore
├── README.md
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Hero.jsx
│   │   │   ├── Features.jsx
│   │   │   └── Footer.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   └── package.json
│
└── server/
    ├── ai.js
    ├── schema.js
    ├── index.js
    └── package.json
```

---

## How It Works

The application follows this flow:

```text
User enters business description
            ↓
        React UI
            ↓
     Express API
            ↓
       AI / Mock AI
            ↓
     Structured JSON
            ↓
       Zod validation
            ↓
       React renderer
            ↓
      Generated webpage
```

The generated JSON always follows the required structure:

```json
{
  "blocks": [
    {
      "type": "hero",
      "heading": "Example Heading",
      "subheading": "Example Subheading"
    },
    {
      "type": "features",
      "items": [
        {
          "title": "Feature 1",
          "description": "Feature description."
        },
        {
          "title": "Feature 2",
          "description": "Feature description."
        }
      ]
    },
    {
      "type": "footer",
      "text": "Example footer text."
    }
  ]
}
```

---

## Schema Validation

The generated content is validated using Zod before it is used by the application.

The schema verifies:

* Hero is the first block
* Features is the second block
* Footer is the third block
* Hero has a heading
* Features contain 2–4 items
* Each feature has a title and description
* Footer contains text

Invalid content is rejected instead of being rendered.

---

## Error Handling and Retries

The backend validates generated content before returning it to the frontend.

If generation fails or the generated content does not match the expected schema, the backend retries the generation up to three times.

If all attempts fail, the API returns an error message to the frontend.

This prevents malformed content from being rendered.

---

## Follow-Up Editing

The application supports one follow-up instruction for modifying the existing webpage.

For example:

```text
Make the heading shorter
```

The backend receives the current page content and the instruction.

It modifies only the requested part while keeping the other blocks unchanged.

Other examples include:

```text
Change the subheading
```

```text
Update the footer
```

```text
Change a feature
```

This demonstrates editing existing structured content rather than generating an entirely new webpage.

---

## AI Modes

The project supports two modes.

### Mock Mode

The default mode is:

```env
AI_MODE=mock
```

Mock mode allows the complete application to run without spending money on API usage.

It returns predefined structured content based on the business description.

Examples include:

* Coffee shop
* Gym
* Restaurant
* Salon
* Generic business

### OpenAI Mode

The backend also contains an OpenAI integration.

To use it, change:

```env
AI_MODE=openai
```

and provide an API key in the environment variables.

The OpenAI response is parsed and validated using the same Zod schema before being returned to the frontend.

---

## Environment Variables

Create a `.env` file in the project root:

```env
OPENAI_API_KEY=your_api_key_here
AI_MODE=mock
OPENAI_MODEL=gpt-5.6-luna
```

For the free development/demo version, keep:

```env
AI_MODE=mock
```

Never commit the `.env` file to GitHub.

---

## Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Enter the project

```bash
cd ai-content-block-generator
```

### 3. Install backend dependencies

```bash
cd server
npm install
```

### 4. Start the backend

```bash
node index.js
```

The backend runs on:

```text
http://localhost:5000
```

### 5. Open another terminal

Go to the frontend:

```bash
cd client
npm install
```

### 6. Start the frontend

```bash
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

Open that address in your browser.

---

## Example

Enter:

```text
A cozy neighborhood coffee shop
```

The application generates a webpage containing:

### Hero

A heading and subheading describing the coffee shop.

### Features

Three feature cards describing things such as:

* Fresh coffee
* Homemade pastries
* Cozy atmosphere

### Footer

A short closing message.

The generated structured JSON is also displayed below the webpage.

---

## Design Decisions

### Structured Data

The webpage is represented as JSON instead of directly generating HTML.

This makes the generated content predictable and allows individual sections to be updated independently.

### Schema Validation

Zod is used as a second layer of validation after generation.

This ensures that the frontend receives content matching the expected structure.

### Component-Based Rendering

Each block type has its own React component:

```text
Hero.jsx
Features.jsx
Footer.jsx
```

This keeps rendering logic simple and organized.

### Mock Mode

Mock mode was included so the application can be developed and tested without requiring paid API usage.

The OpenAI integration remains available as a separate AI mode.

---

## Trade-offs

The project intentionally keeps the scope small to match the assignment requirements.

The current implementation does not include:

* Authentication
* Database
* User accounts
* Multiple pages
* Content persistence
* Additional block types
* Advanced design customization

The focus is on structured generation, validation, rendering, error handling, and follow-up editing.

---

## Future Improvements

Possible future improvements include:

* Streaming AI responses
* More intelligent natural-language editing
* Additional webpage block types
* Better retry strategies
* More detailed validation errors
* Page export to HTML
* Persistent saved pages
* Deployment with a production API
* Automated tests

---

## Assignment Requirements Covered

| Requirement                 | Implementation                                                 |
| --------------------------- | -------------------------------------------------------------- |
| Business description input  | React input                                                    |
| LLM integration             | OpenAI integration in backend                                  |
| Structured JSON             | Page schema                                                    |
| Hero block                  | Implemented                                                    |
| Features block              | Implemented                                                    |
| Footer block                | Implemented                                                    |
| Schema validation           | Zod                                                            |
| Error handling              | Implemented                                                    |
| Retry handling              | Up to 3 attempts                                               |
| Malformed response handling | Validation + error response                                    |
| Dynamic webpage rendering   | React components                                               |
| Follow-up editing           | `/api/edit`                                                    |
| Preserve unrelated content  | Existing page is copied and only requested section is modified |

---

## Author

Nandini Singh
