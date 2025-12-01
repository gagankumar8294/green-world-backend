import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },

    mainImage: { type: String, required: true }, // URL

    subImages: [{ type: String }], // array of URLs

    description: { type: String, required: true },

    quantity: { type: Number, required: true },

    weight: { type: String, required: true },     // "200g" or "2kg"
    dimension: {
      length: { type: String, required: true },
      width: { type: String, required: true },
    },

    categories: {
      type: [String],
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);