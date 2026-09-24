import React from "react";
import { Product } from "../types";
import { ShoppingBag, Star, Eye } from "lucide-react";

export const ProductCard: React.FC<{
  product: Product;
  onAddToCart: (p: Product) => void;
  onViewDetail: (p: Product) => void;
}> = ({ product, onAddToCart, onViewDetail }) => (
  <div className="product-card">
    <div className="product-image-wrap" onClick={() => onViewDetail(product)}>
      <img src={product.images[0]} alt={product.name} className="product-image" loading="lazy" />
      {product.isPromo && <span className="promo-tag">PROMO</span>}
      <button className="quick-view-btn" onClick={(e) => { e.stopPropagation(); onViewDetail(product); }}>
        <Eye size={15} />
      </button>
    </div>
    <div className="product-info">
      <div className="product-category">{product.category} · {product.brand}</div>
      <h3 className="product-title" onClick={() => onViewDetail(product)}>{product.name}</h3>
      <div className="product-rating">
        <Star size={13} className="star-filled" />
        <span className="rating-val">{product.rating}</span>
        <span className="rating-count">({product.reviewCount})</span>
      </div>
      <div className="product-footer">
        <div className="product-price-box">
          <span className="product-price">{product.price.toFixed(2)} €</span>
          {product.compareAtPrice && <span className="product-compare-price">{product.compareAtPrice.toFixed(2)} €</span>}
        </div>
        <button className="add-to-cart-btn" onClick={() => onAddToCart(product)}>
          <ShoppingBag size={15} />
          <span>Ajouter</span>
        </button>
      </div>
    </div>
  </div>
);