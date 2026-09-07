
import { useState } from "react";
import "./App.css";

import Hero from "./components/Hero";
import Features from "./components/Features";
import Footer from "./components/Footer";

function App() {
  const [businessDescription, setBusinessDescription] =
    useState("");

  const [pageContent, setPageContent] = useState({
    blocks: [
      {
        type: "hero",
        heading: "Your Cozy Neighborhood Coffee Shop",
        subheading:
          "Fresh coffee, homemade pastries, and a welcoming place to relax.",
      },
      {
        type: "features",
        items: [
          {
            title: "Freshly Brewed Coffee",
            description:
              "Enjoy delicious coffee made from carefully selected beans.",
          },
          {
            title: "Homemade Pastries",
            description:
              "Start your morning with fresh pastries made every day.",
          },
          {
            title: "Cozy Atmosphere",
            description:
              "Relax and connect with friends in a warm neighborhood setting.",
          },
        ],
      },
      {
        type: "footer",
        text: "Made with love for our neighborhood.",
      },
    ],
  });

  const [instruction, setInstruction] =
    useState("");

  const [isGenerating, setIsGenerating] =
    useState(false);

  const [isEditing, setIsEditing] =
    useState(false);

  const [error, setError] =
    useState("");

  // ----------------------------------------------
  // GENERATE
  // ----------------------------------------------

  const handleGenerate = async () => {
    if (!businessDescription.trim()) {
      setError(
        "Please enter a business description."
      );
      return;
    }

    setError("");
    setIsGenerating(true);

    try {
      const response = await fetch(
        "https://ai-content-block-generator-1.onrender.com/api/generate",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            businessDescription,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to generate webpage."
        );
      }

      const generatedContent =
        JSON.parse(data.raw);

      setPageContent(
        generatedContent
      );
    } catch (error) {
      console.error(
        "Generation error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong while generating."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // ----------------------------------------------
  // EDIT
  // ----------------------------------------------

  const handleEdit = async () => {
    if (!instruction.trim()) {
      setError(
        "Please enter an edit instruction."
      );
      return;
    }

    setError("");
    setIsEditing(true);

    try {
      const response = await fetch(
        "https://ai-content-block-generator-1.onrender.com/api/edit",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            pageContent,
            instruction,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to update webpage."
        );
      }

      const updatedContent =
        JSON.parse(data.raw);

      setPageContent(
        updatedContent
      );

      setInstruction("");
    } catch (error) {
      console.error(
        "Edit error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong while updating."
      );
    } finally {
      setIsEditing(false);
    }
  };

  // ----------------------------------------------
  // RENDER
  // ----------------------------------------------

  return (
    <div className="app">

      {/* HEADER */}

      <div className="header">
        <h1>
          AI Content Block Generator
        </h1>

        <p>
          Describe your business and
          generate a structured webpage.
        </p>
      </div>

      {/* GENERATION INPUT */}

      <div className="input-card">

        <label>
          Business description
        </label>

        <div className="input-section">

          <input
            type="text"
            placeholder="Example: A cozy neighborhood coffee shop"
            value={businessDescription}
            onChange={(event) =>
              setBusinessDescription(
                event.target.value
              )
            }
          />

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating
              ? "Generating..."
              : "Generate"}
          </button>

        </div>

      </div>

      {/* ERROR */}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {/* GENERATED PAGE */}

      <div className="generated-page">

        {pageContent.blocks.map(
          (block, index) => {

            if (
              block.type === "hero"
            ) {
              return (
                <Hero
                  key={index}
                  heading={
                    block.heading
                  }
                  subheading={
                    block.subheading
                  }
                />
              );
            }

            if (
              block.type === "features"
            ) {
              return (
                <Features
                  key={index}
                  items={
                    block.items
                  }
                />
              );
            }

            if (
              block.type === "footer"
            ) {
              return (
                <Footer
                  key={index}
                  text={
                    block.text
                  }
                />
              );
            }

            return null;
          }
        )}

      </div>

      {/* EDIT */}

      <div className="edit-section">

        <h2>
          Make a change
        </h2>

        <p>
          Give one instruction to
          modify the existing webpage.
        </p>

        <div className="input-section">

          <input
            type="text"
            placeholder='Example: "Make the heading shorter"'
            value={instruction}
            onChange={(event) =>
              setInstruction(
                event.target.value
              )
            }
          />

          <button
            onClick={handleEdit}
            disabled={isEditing}
          >
            {isEditing
              ? "Updating..."
              : "Update"}
          </button>

        </div>

      </div>

      {/* JSON PREVIEW */}

      <div className="json-section">

        <h2>
          Structured JSON
        </h2>

        <pre>
          {JSON.stringify(
            pageContent,
            null,
            2
          )}
        </pre>

      </div>

    </div>
  );
}

export default App;