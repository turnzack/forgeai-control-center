import React from "react";
import { CartItem } from "../types";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export const CartDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, q: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedCheckout: () => void;
}> = ({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, onProceedCheckout }) => {
  if (!isOpen) return null;
  const subtotal = items.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
  const total = subtotal;

  return (
    <div className="cart-backdrop" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <div className="cart-title"><ShoppingBag size={18} /><span>Mon Panier ({items.length})</span></div>
          <button className="close-btn" onClick={onClose}><X size={18} /></button>
        </div>
        {items.length === 0 ? (
          <div className="cart-empty"><p>Votre panier est vide.</p></div>
        ) : (
          <div className="cart-items-list">
            {items.map(item => (
              <div key={item.product.id} className="cart-item-row">
                <img src={item.product.images[0]} alt={item.product.name} className="cart-item-img" />
                <div className="cart-item-details">
                  <div className="cart-item-name">{item.product.name}</div>
                  <div className="cart-item-unit-price">{item.product.price.toFixed(2)} €</div>
                  <div className="qty-controls">
                    <button onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}>+</button>
                    <button onClick={() => onRemoveItem(item.product.id)}><Trash2 size={13} /></button>
                  </div>
                </div>
              </div>
            ))}
            <div className="cart-footer">
              <div className="cart-summary-total">Total : {total.toFixed(2)} €</div>
              <button className="checkout-btn" onClick={onProceedCheckout}>Commander <ArrowRight size={15} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};