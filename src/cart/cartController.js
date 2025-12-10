import Cart from "../models/cartModel.js";

export const addToCart = async (req, res) => {

  const { userId, product, quantity } = req.body;
  
  if (!userId || !product) 
    return res.status(400).json({ success: false, msg: "User ID required" });

  let cart = await Cart.findOne({ userId });

  // USER HAS NO CART → CREATE NEW ONE
  if (!cart) {
    cart = await Cart.create({
      userId,
      items: [
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.mainImage,
          quantity: quantity || 1,
        },
      ],
    });
    return res.json({ success: true, cart });
  }

  // CHECK IF PRODUCT EXISTS
  const exists = cart.items.find(
    (i) => i.productId.toString() === product._id.toString()
  );

  // const exists = cart.items.find((i) => i.productId === product._id);


  if (exists) {
    exists.quantity += quantity || 1;
  } else {
    cart.items.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.mainImage,
      quantity: quantity || 1,
    });
  }

  await cart.save();
  res.json({ success: true, cart: cart.items });
};

export const getCart = async (req, res) => {
  const { userId } = req.query;

  if (!userId) return res.json({ success: true, items: [] });

  const cart = await Cart.findOne({ userId });

  res.json({ success: true, cart: cart ? cart.items : [] });
};

export const updateCart = async (req, res) => {
  const { userId, productId, qty } = req.body;

  const cart = await Cart.findOne({ userId });
  if (!cart) return res.json({ success: false, msg: "Cart not found" });

  const item = cart.items.find((i) => i.productId === productId);
  if (item) item.quantity = qty;

  await cart.save();
  res.json({ success: true, cart });
};

export const removeItem = async (req, res) => {
  const { userId, productId } = req.body;

  const cart = await Cart.findOne({ userId });
  if (!cart) return res.json({ success: false });

  cart.items = cart.items.filter((i) => i.productId !== productId);

  await cart.save();
  res.json({ success: true, cart });
};

export const mergeCart = async (req, res) => {
  const { userId, localCart } = req.body;

  let cart = await Cart.findOne({ userId });

  // user has no cart → save local cart
  if (!cart) {
    cart = await Cart.create({
      userId,
      items: localCart,
    });
    return res.json({ success: true, cart });
  }

  // merge algorithm
  localCart.forEach((localItem) => {
    const exists = cart.items.find((i) => i.productId === localItem.productId);

    if (exists) {
      exists.quantity += localItem.quantity;
    } else {
      cart.items.push(localItem);
    }
  });

  await cart.save();
  res.json({ success: true, cart });
};
