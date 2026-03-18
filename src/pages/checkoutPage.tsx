import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CreditCard, Truck, ShieldCheck, ChevronRight, Check } from "lucide-react";

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
  const { loading } = useAppSelector(s => s.order)
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    paymentMethod: "cod",
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
      navigate("/order-success");
    } catch (err: any) {
      alert("Failed to place order: " + (err.message || err));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const subtotal = items.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  return (
    <main className="min-h-screen bg-background text-foreground py-12 px-6 lg:px-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to cart
          </Link>
          <h1 className="text-4xl font-bold tracking-tight">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Form Area */}
          <div className="lg:col-span-12 xl:col-span-8 space-y-12">
            
            {/* Shipping Information */}
            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">1</div>
                <h2 className="text-xl font-bold">Shipping Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-card border rounded-2xl p-8">
                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1">First Name</label>
                  <Input
                    type="text"
                    name="firstName"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1">Last Name</label>
                  <Input
                    type="text"
                    name="lastName"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold ml-1">Address</label>
                  <Input
                    type="text"
                    name="address"
                    placeholder="Street address, city, state"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1">City</label>
                  <Input
                    type="text"
                    name="city"
                    placeholder="City name"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold ml-1">Postal Code</label>
                  <Input
                    type="text"
                    name="postalCode"
                    placeholder="Postal code"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-semibold ml-1">Phone Number</label>
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="Your contact number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">2</div>
                <h2 className="text-xl font-bold">Payment Method</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-card border rounded-2xl p-8">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, paymentMethod: 'cod'})}
                  className={`relative p-6 border rounded-2xl transition-all text-left flex items-start gap-4 ${formData.paymentMethod === 'cod' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-primary/50'}`}
                >
                  <div className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${formData.paymentMethod === 'cod' ? 'border-primary' : 'border-muted-foreground'}`}>
                    {formData.paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-bold">
                      <Truck className="w-5 h-5 text-primary" />
                      <span>Cash on Delivery</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Pay when your order is delivered to your door.</p>
                  </div>
                </button>

                <button 
                  type="button"
                  onClick={() => setFormData({...formData, paymentMethod: 'bank_transfer'})}
                  className={`relative p-6 border rounded-2xl transition-all text-left flex items-start gap-4 ${formData.paymentMethod === 'bank_transfer' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-primary/50'}`}
                >
                  <div className={`mt-1 w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${formData.paymentMethod === 'bank_transfer' ? 'border-primary' : 'border-muted-foreground'}`}>
                    {formData.paymentMethod === 'bank_transfer' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-bold">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <span>Bank Transfer</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Transfer assets via our secure banking nodes.</p>
                  </div>
                </button>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-12 xl:col-span-4 lg:sticky lg:top-24 h-fit">
            <div className="bg-card border rounded-2xl p-8 space-y-8 shadow-sm">
              <h2 className="text-xl font-bold border-b pb-6">Your Order</h2>
              
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-muted rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.product.image_url} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold truncate">{item.product.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
                      <p className="text-sm font-bold mt-1">USD {(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t font-medium">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>USD {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span>USD {tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex justify-between text-xl font-bold">
                  <span>Grand Total</span>
                  <span className="text-primary">USD {total.toLocaleString()}</span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-xl text-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/10 transition-all active:scale-95"
              >
                {loading ? "Processing..." : "Place Order"}
                <ChevronRight className="w-5 h-5" />
              </Button>

              <div className="flex flex-col items-center gap-3 pt-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                </div>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}
