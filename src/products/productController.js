import Product from "../models/productModel.js";

export const addProduct = async (req, res) => {

    console.log("🔥 addProduct API hit");
    console.log("REQ BODY:", req.body);

  try {
    const {
      name,
      price,
      mainImage,
      subImages,
      description,
      quantity,
      weight,
      dimension,
      categories
    } = req.body;

    const newProduct = new Product({
      name,
      price,
      mainImage,
      subImages,
      description,
      quantity,
      weight,
      dimension,
      categories
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
export const getProductsInfinite = async (req, res) => {
  try {
    // Extract & sanitize query params
    const {
      skip = 0,
      limit = 20,
      search = "",
      categories = "",
      sort = "",
      minPrice = 0,
      maxPrice = 999999
    } = req.query;

    // -------------------------
    // 1. BUILD FILTER OBJECT
    // -------------------------
    let filter = {};

    // Search by name
    if (search && search.trim() !== "") {
      filter.name = { $regex: search.trim(), $options: "i" };
    }

    // Category filter
    if (categories && categories.trim() !== "") {
      const categoryArray = categories.split(",").map(c => c.trim());
      filter.categories = { $in: categoryArray };
    }

    // Price filter
    filter.price = {
      $gte: Number(minPrice) || 0,
      $lte: Number(maxPrice) || 999999
    };

    // -------------------------
    // 2. SORT LOGIC
    // -------------------------
    let sortOption = {};

    switch (sort) {
      case "price_low_high":
        sortOption.price = 1;
        break;

      case "price_high_low":
        sortOption.price = -1;
        break;

      case "newest":
        sortOption.createdAt = -1;
        break;

      case "oldest":
        sortOption.createdAt = 1;
        break;

      default:
        sortOption.createdAt = -1; // default newest first
        break;
    }

    // -------------------------
    // 3. FETCH PAGINATED PRODUCTS
    // -------------------------
    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(Number(skip))      // start index
      .limit(Number(limit));   // batch limit

    // Total count of all products matching filter
    const totalCount = await Product.countDocuments(filter);

    // -------------------------
    // 4. RETURN RESPONSE
    // -------------------------
    return res.status(200).json({
      success: true,
      total: totalCount,
      returned: products.length,
      hasMore: Number(skip) + Number(limit) < totalCount,
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
