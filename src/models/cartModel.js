import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },

  items: [
    {
      productId: { type: String, required: true },
      name: String,
      price: Number,
      image: String,
      quantity: { type: Number, default: 1 },
    },
  ]
}, { timestamps: true });

export default mongoose.model("Cart", cartSchema);
