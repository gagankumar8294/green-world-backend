import Product from "../models/productModel.js";

export const addProduct = async (req, res) => {

    console.log("🔥 addProduct API hit");
    console.log("REQ BODY:", req.body);

  try {
    const { name, price, mainImage, subImages,
            description, quantity, weight, 
            dimension, categories 
          } = req.body;

    const newProduct = new Product({
      name, price, mainImage, subImages, description,
      quantity, weight, dimension, categories
    });

    await newProduct.save();
    console.log('newPerodcut data = ', newProduct)

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// -------------------------------------------
// INFINITE LOADING + FILTER + SORT + SEARCH
// -------------------------------------------


// -------------------------------------------
// INFINITE LOADING + FILTER + SORT + SEARCH
// -------------------------------------------
export const getProducts = async (req, res) => {
  try {
    const {
      search = "",
      categories = "",
      sort = "",
      minPrice = 0,
      maxPrice = 999999
    } = req.query;

    let filter = {};

    // 🔍 SEARCH FILTER
    if (search.trim() !== "") {
      filter.name = { $regex: search.trim(), $options: "i" };
    }

    // 🏷 CATEGORY FILTER
    if (categories.trim() !== "") {
      const categoryArray = categories.split(",").map(c => c.trim());
      filter.categories = { $in: categoryArray };
    }

    // 💰 PRICE FILTER
    filter.price = {
      $gte: Number(minPrice),
      $lte: Number(maxPrice)
    };

    // 🔄 SORT
    let sortOption = {};
    if (sort === "price_low_high") sortOption.price = 1;
    else if (sort === "price_high_low") sortOption.price = -1;
    else if (sort === "oldest") sortOption.createdAt = 1;
    else sortOption.createdAt = -1; // default newest

    // 📦 FETCH ALL PRODUCTS (NO SKIP, NO LIMIT)
    const products = await Product.find(filter).sort(sortOption);

    return res.status(200).json({
      success: true,
      total: products.length,
      products,
    });

  } catch (error) {
    console.error("🔥 Error fetching products:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching products",
    });
  }
};
