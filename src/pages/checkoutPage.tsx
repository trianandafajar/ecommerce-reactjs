import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/header";
import { ArrowLeft, CreditCard, Truck } from "lucide-react";

import { selectCartItems, resetCart } from "@/features/cart/cartSlice";
import { selectIsAuthenticated } from "@/features/auth/authSlice";
import { createOrder } from "@/features/order/orderThunks";
import type { OrderCreate } from "@/features/order/types/order";
import { Decimal } from "decimal.js";
import { clearCart } from "@/features/cart/cartThunks";

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const items = useAppSelector(selectCartItems);
  const { cart } = useAppSelector(s => s.cart)
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    paymentMethod: "cod", // default
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) return;

    // Build payload
    const orderItems = items.map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
      price: new Decimal(item.product.price),
    }));

    const payload: OrderCreate = {
      payment_method: formData.paymentMethod as "cod" | "bank_transfer",
      first_name: formData.firstName || undefined,
      last_name: formData.lastName || undefined,
      address: formData.address,
      city: formData.city || undefined,
      postal_code: formData.postalCode || undefined,
      phone: formData.phone || undefined,
      items: orderItems,
    };

    try {
      await dispatch(createOrder(payload)).unwrap();

      if (cart?.id) {
        await dispatch(clearCart(cart.id)).unwrap();
      }

      dispatch(resetCart());

      alert("Order placed successfully! Thank you for your purchase.");
      navigate("/");
    } catch (err: any) {
      alert("Failed to place order: " + (err.message || err));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white min-h-screen">
        <Header />
        <div className="flex items-center justify-center py-16">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white min-h-screen">
        <Header />
        <div className="py-8 px-4 text-center">
          <h1 className="text-2xl font-bold text-black mb-4">Checkout</h1>
          <p className="text-gray-600 mb-8">Your cart is empty</p>
          <Link to="/">
            <Button className="bg-black text-white hover:bg-gray-800 px-8 py-3">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="py-8 px-4">
        <div className="mb-8">
          <Link
            to="/cart"
            className="flex items-center gap-2 text-gray-600 hover:text-black mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </Link>
          <h1 className="text-2xl font-bold text-black">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Info */}
              <div>
                <h2 className="text-lg font-semibold mb-4">
                  Contact Information
                </h2>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="mb-4"
                />
              </div>

              {/* Shipping Address */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                  <Input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
                <Input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="mb-4"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <Input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                  <Input
                    type="text"
                    name="postalCode"
                    placeholder="Postal code"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                  />
                </div>
                <Input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              {/* Payment Method */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 border border-gray-200 rounded">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={handleInputChange}
                    />
                    <Truck className="w-5 h-5" />
                    <label htmlFor="cod" className="flex-1">
                      Cash on Delivery
                    </label>
                  </div>
                  <div className="flex items-center gap-3 p-4 border border-gray-200 rounded">
                    <input
                      type="radio"
                      id="bank-transfer"
                      name="paymentMethod"
                      value="bank-transfer"
                      checked={formData.paymentMethod === "bank-transfer"}
                      onChange={handleInputChange}
                    />
                    <CreditCard className="w-5 h-5" />
                    <label htmlFor="bank-transfer" className="flex-1">
                      Bank Transfer
                    </label>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-gray-800 py-4 text-lg"
              >
                Complete Order
              </Button>
            </form>
          </div>
          {/* Order Summary */}
          <div>
            <div className="bg-gray-50 p-6 rounded">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              {/* List Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-white rounded overflow-hidden">
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">
                        {item.product.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Qty: {item.quantity}
                      </p>
                      <p className="font-medium text-sm">
                        USD{" "}
                        {(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Totals */}
              <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                {/** Subtotal */}
                <div className="flex justify-between">
                  <span>Subtotal ({items.length} items)</span>
                  <span>
                    USD{" "}
                    {items
                      .reduce((acc, i) => acc + i.product.price * i.quantity, 0)
                      .toLocaleString()}
                  </span>
                </div>

                {/** Shipping */}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>

                {/** Tax 10% */}
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>
                    USD{" "}
                    {Math.round(
                      items.reduce(
                        (acc, i) => acc + i.product.price * i.quantity,
                        0
                      ) * 0.1
                    ).toLocaleString()}
                  </span>
                </div>

                {/** Total */}
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>
                      USD{" "}
                      {Math.round(
                        items.reduce(
                          (acc, i) => acc + i.product.price * i.quantity,
                          0
                        ) * 1.1
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  <span>Free shipping on all orders</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
