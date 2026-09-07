
const { z } = require("zod");

// Hero block
const HeroSchema = z.object({
  type: z.literal("hero"),
  heading: z.string().min(1),
  subheading: z.string().optional(),
});

// Feature item
const FeatureItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

// Features block
const FeaturesSchema = z.object({
  type: z.literal("features"),
  items: z
    .array(FeatureItemSchema)
    .min(2)
    .max(4),
});

// Footer block
const FooterSchema = z.object({
  type: z.literal("footer"),
  text: z.string().min(1),
});

// Complete webpage schema
const PageSchema = z.object({
  blocks: z.tuple([
    HeroSchema,
    FeaturesSchema,
    FooterSchema,
  ]),
});

module.exports = {
  PageSchema,
};
