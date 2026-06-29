'use client';
import React, { use, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { products, Product } from '#@/lib/data/products';
import styles from '#@/lib/styles/shop.module.css';
import { Route } from 'next';

// Mock Cart Interface
interface CartItem extends Product {
  quantity: number;
}

export default function ShopPage(
  {
    params,
  }: {
    params: Promise<{ slug?: string[] }>;
  }
) {
  const resolvedParams = use(
    params
  );
  const {
    slug
  } = resolvedParams;

  // State for search and cart
  const [
    searchTerm,
    setSearchTerm
  ] = useState(
    ''
  );
  const [
    cart,
    setCart
  ] = useState<CartItem[]>(
    []
  );
  const [
    isCartOpen,
    setIsCartOpen
  ] = useState(
    false
  );

  // Category from slug
  const activeCategory = slug?.[ 0 ] || 'all';

  // Filtered products
  const filteredProducts = useMemo(
    () => {
      return products.filter(
        (
          product
        ) => {
          const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
          const matchesSearch = product.title?.toLowerCase().includes(
            searchTerm.toLowerCase()
          )
                          || product.description?.toLowerCase().includes(
                            searchTerm.toLowerCase()
                          );

          return matchesCategory && matchesSearch;
        }
      );
    }, [
      activeCategory,
      searchTerm
    ]
  );

  // Cart functions
  const addToCart = (
    product: Product
  ) => {
    setCart(
      (
        prev
      ) => {
        const existing = prev.find(
          (
            item
          ) => {
            return item.id === product.id;
          }
        );

        if ( existing ) {
          return prev.map(
            (
              item
            ) => {
              return item.id === product.id
                ? {
                    ...item,
                    quantity: item.quantity + 1
                  }
                : item;
            }
          );
        }

        return [
          ...prev,
          {
            ...product,
            quantity: 1
          }
        ];
      }
    );
  };

  const cartCount = cart.reduce(
    (
      acc, item
    ) => {
      return acc + item.quantity;
    }, 0
  );

  return (
    <div className={styles.shopContainer}>
      {/* Cart Icon & Badge */}
      <div className={styles.cartOverlay}>
        <button
          className={styles.cartTrigger}
          onClick={() => {
            return setIsCartOpen(
              !isCartOpen
            );
          }}
          aria-label="Abrir carrito"
        >
          <span className="material-symbols-outlined">shopping_cart</span>
          {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
        </button>
      </div>

      <header className={styles.shopHeader}>
        <h1>Nuestra Tienda</h1>
        <p>Encuentra las mejores plantas y remedios naturales para tu bienestar.</p>
      </header>

      <section className={styles.shopControls}>
        <nav className={styles.categories}>
          <Link
            href={'/shop' as Route}
            className={activeCategory === 'all'
              ? styles.active
              : ''}
          >
            Todos
          </Link>
          <Link
            href={'/shop/plants' as Route}
            className={activeCategory === 'plants'
              ? styles.active
              : ''}
          >
            Plantas
          </Link>
          <Link
            href={'/shop/remedios' as Route}
            className={activeCategory === 'remedios'
              ? styles.active
              : ''}
          >
            Remedios
          </Link>
        </nav>

        <div className={styles.filters}>
          <span className="material-symbols-outlined">search</span>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(
              e
            ) => {
              return setSearchTerm(
                e.target.value
              );
            }}
          />
        </div>
      </section>

      <main className={styles.productGrid}>
        {filteredProducts.length > 0
          ? (
              filteredProducts.map(
                (
                  product
                ) => {
                  return (
                    <article key={product.id} className={styles.productCard}>
                      <div className={styles.imageWrapper}>
                        {product.image && (
                          <Image
                            src={product.image}
                            alt={product.title || 'Producto'}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={false}
                          />
                        )}
                      </div>
                      <div className={styles.content}>
                        <span className={styles.category}>{product.category}</span>
                        <h3>{product.title}</h3>
                        <p className={styles.description}>{product.description}</p>
                        <div className={styles.footer}>
                          <span className={styles.price}>
                            ${product.price.toFixed(
                              2
                            )}
                          </span>
                          <button onClick={() => {
                            return addToCart(
                              product
                            );
                          }}
                          >
                            <span className="material-symbols-outlined">
                              add_shopping_cart
                            </span>
                            Agregar
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                }
              )
            )
          : (
              <div
                style={{
                  textAlign : 'center',
                  gridColumn: '1 / -1',
                  padding   : '4rem',
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: '3rem',
                    color   : 'var(--primary)',
                  }}
                >
                  sentiment_dissatisfied
                </span>
                <h3>No se encontraron productos</h3>
                <p>Prueba con otra búsqueda o categoría.</p>
              </div>
            )}
      </main>

      {/* Cart Modal Simple (Conditional) */}
      {isCartOpen && cart.length > 0 && (
        <div style={{
          position    : 'fixed',
          top         : '5rem',
          right       : '1.5rem',
          background  : 'var(--surface)',
          padding     : '1.5rem',
          borderRadius: '16px',
          boxShadow   : '0 10px 40px rgba(0,0,0,0.2)',
          zIndex      : 999,
          width       : '300px',
          maxHeight   : '400px',
          overflowY   : 'auto'
        }}
        >
          <h3>Tu Carrito</h3>
          <ul style={{
            listStyle: 'none',
            padding  : 0
          }}
          >
            {cart.map(
              item => {
                return (
                  <li key={item.id} style={{
                    display       : 'flex',
                    justifyContent: 'space-between',
                    marginBottom  : '1rem'
                  }}
                  >
                    <span>{item.title} (x{item.quantity})</span>
                    <span>${( item.price * item.quantity ).toFixed(
                      2
                    )}</span>
                  </li>
                );
              }
            )}
          </ul>
          <hr />
          <div style={{
            display       : 'flex',
            justifyContent: 'space-between',
            fontWeight    : 'bold'
          }}
          >
            <span>Total</span>
            <span>${cart.reduce(
              (
                acc, item
              ) => {
                return acc + item.price * item.quantity;
              }, 0
            ).toFixed(
              2
            )}</span>
          </div>
          <button
            style={{
              width       : '100%',
              marginTop   : '1rem',
              padding     : '0.8rem',
              background  : 'var(--primary)',
              color       : 'var(--on-primary)',
              border      : 'none',
              borderRadius: '8px',
              cursor      : 'pointer'
            }}
            onClick={() => {
              alert(
                '¡Gracias por tu compra! (Funcionalidad de prueba)'
              );
              setCart(
                []
              );
              setIsCartOpen(
                false
              );
            }}
          >
            Pagar Ahora
          </button>
        </div>
      )}
    </div>
  );
}
