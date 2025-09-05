import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";

export interface CartItem {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const dummyCartItems: CartItem[] = [
  {
    id: "1",
    name: "Christopher MM",
    price: "USD 3,950",
    image: "/black-pixel-pattern-backpack-louis-vuitton-style.png",
    quantity: 2,
  },
  {
    id: "2",
    name: "Christopher PM",
    price: "USD 6,700",
    image: "/black-pixel-pattern-backpack-louis-vuitton-style.png",
    quantity: 1,
  },
  {
    id: "3",
    name: "Christopher MM Mon Monogram",
    price: "USD 4,250",
    image: "/black-pixel-pattern-backpack-louis-vuitton-style.png",
    quantity: 3,
  },
  {
    id: "4",
    name: "Christopher Eclipse",
    price: "USD 4,780",
    image: "/black-pixel-pattern-backpack-louis-vuitton-style.png",
    quantity: 1,
  },
  {
    id: "5",
    name: "Christopher Damier",
    price: "USD 4,550",
    image: "/black-pixel-pattern-backpack-louis-vuitton-style.png",
    quantity: 2,
  },
];

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    loadCartFromStorage: (state) => {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        state.items = JSON.parse(savedCart);
      } else {
        // optional: preload dummy data on first run
        state.items = dummyCartItems;
      }
    },
    addToCart: (state, action: PayloadAction<Omit<CartItem, "quantity">>) => {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.id !== id);
      } else {
        const target = state.items.find((item) => item.id === id);
        if (target) target.quantity = quantity;
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cart");
    },
  },
});

export const {
  loadCartFromStorage,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

// 🔍 Selectors
export const selectCartItems = (state: RootState) => state.cart.items;

export const selectTotalItems = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const selectTotalPrice = (state: RootState) =>
  state.cart.items.reduce((total, item) => {
    const priceString = item.price.replace(/[^\d,]/g, "");
    const price = Number.parseFloat(priceString.replace(/,/g, ""));
    return total + (isNaN(price) ? 0 : price) * item.quantity;
  }, 0);
