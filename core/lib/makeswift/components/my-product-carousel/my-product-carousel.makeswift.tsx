import {
  ProductCarousel,
  ProductCarouselProps,
  ProductsCarouselSkeleton,
} from '@/vibes/soul/sections/product-carousel';
import { ComponentPropsWithoutRef } from 'react';
import { runtime } from '~/lib/makeswift/runtime';
import {
  Number,
  Combobox,
  Group,
  List,
  TextInput,
  Select,
  Style,
  Checkbox,
} from '@makeswift/runtime/controls';

import { useProducts } from '~/lib/makeswift/utils/use-products';
import { searchProducts } from '~/lib/makeswift/utils/search-products';

type MSMyProductCarouselProps = Omit<
  ComponentPropsWithoutRef<typeof ProductCarousel>,
  'products'
> & {
  collection: 'none' | 'featured' | 'best-selling' | 'newest';
  additionalProducts: Array<{ entityId?: string }>;
  limit: number;
};

runtime.registerComponent(
  function MSMyProductCarousel({
    className,
    collection,
    additionalProducts,
    limit,
    ...props
  }: MSMyProductCarouselProps) {
    const additionalProductIds = additionalProducts.map(({ entityId }) => entityId ?? '');
    const { products, isLoading } = useProducts({
      collection,
      collectionLimit: limit,
      additionalProductIds,
    });
    if (isLoading) return <ProductsCarouselSkeleton className={className} />;
    if (products == null || products.length == 0)
      return <ProductsCarouselSkeleton className={className} />;

    return <ProductCarousel {...props} className={className} products={products} />;
  },
  {
    type: 'my-product-carousel',
    label: 'Catalog / My Product Carousel',
    props: {
      className: Style(),
      collection: Select({
        label: 'Product Collection Type',
        options: [
          { value: 'none', label: 'None (static only)' },
          { value: 'newest', label: 'Newest' },
          { value: 'featured', label: 'Featured' },
          { value: 'best-selling', label: 'Best Selling' },
        ],
        defaultValue: 'featured',
      }),
      limit: Number({ label: 'Max number of Products to be shown', defaultValue: 3 }),
      additionalProducts: List({
        label: 'Additional products',
        type: Group({
          label: 'Product-group-label',
          props: {
            title: TextInput({ label: 'Title', defaultValue: 'Product Title' }),
            entityId: Combobox({
              label: 'Product-combobox-label',
              async getOptions(query) {
                const products = await searchProducts(query);

                return products.map((product) => ({
                  id: product.entityId.toString(),
                  label: product.name,
                  value: product.entityId.toString(),
                }));
              },
            }),
          },
        }),
        getItemLabel(product) {
          return product?.entityId.label || 'Product';
        },
      }),
      aspectRatio: Select({
        label: 'Aspect Ratio',
        options: [
          { label: 'Square', value: '1:1' },
          { label: '5:6', value: '5:6' },
          { label: '3:4', value: '3:4' },
        ],
        defaultValue: '5:6',
      }),
      colorScheme: Select({
        label: 'Text Color Scheme',
        options: [
          { label: 'Light', value: 'light' },
          { label: 'Dark', value: 'dark' },
        ],
        defaultValue: 'light',
      }),
      showScrollbar: Checkbox({ label: 'Show Scrollbar', defaultValue: true }),
      showButtons: Checkbox({ label: 'Show Buttons', defaultValue: true }),
      hideOverflow: Checkbox({ label: 'Hide Overflow', defaultValue: true }),
    },
  },
);
