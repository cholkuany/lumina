import mongoose, { Schema, Model } from 'mongoose';
import { slugify } from '@/lib/utils';

const ImageSchema = new Schema({
  secure_url: {
    type: String,
    required: [true, 'Image URL is required'],
  },
  public_id: {
    type: String,
    required: [true, 'Image public ID is required'],
  },
}, { _id: false });

const ProductVariantSchema = new Schema<IProductVariant>({
  attributes: {
    color: { type: String, required: true },
    size: { type: String, required: true },
    material: String,
    value: String
  },
  sku: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  originalPrice: {
    type: Number,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  images: {
    type: [ImageSchema],
    required: [true, 'At least one image is required'],
    validate: {
      validator: function (v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: 'Product must have at least one image',
    },
  },
});


const SpecificationSchema = new Schema(
  {
    key: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
)


export interface IImage {
  secure_url: string;
  public_id: string;
}
export interface Attributes {
  color: string;
  size: string;
  material?: string;
  value?: string
}

export interface IProductVariant {
  attributes: Attributes;
  price: number;
  originalPrice?: number;
  stock: number;
  sku: string;
  images: IImage[];
}

export interface IProduct {
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  originalPrice?: number;
  category: {
    name: string;
    parent?: string | null;
    ancestors?: string[] | null;
  }
  rating: number;
  reviewCount: number;
  ratingBreakdown?: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  stockCount?: number;
  variants: IProductVariant[];
  specifications?: [{
    key: string,
    value: string
  }];
  brand?: string;
  isNewArrival: boolean;
  isSale?: boolean;
  isFeatured?: boolean;
  slug: string;
  unitsSold?: number

  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
      maxlength: [150, 'Description cannot exceed 150 characters'],
    },
    longDescription: {
      type: String,
      maxlength: [1000, 'Long description cannot exceed 1000 characters'],
    },
    brand: {
      type: String,
      maxLength: [200, 'Brand cannot exceed 200 characters']
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price cannot be negative'],
      validate: {
        validator: function (this: IProduct, value: number) {
          return !value || value >= this.price
        },
        message: 'Original price must be greater than or equal to current price',
      },
    },
    category: {
      type: {
        name: { type: String, required: true },
        parent: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
          default: null,
        },
        ancestors: [String],
      },
      required: [true, 'Category is required'],
      index: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot exceed 5'],
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: [0, 'Review count cannot be negative'],
    },
    ratingBreakdown: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 },
    },
    stockCount: {
      type: Number,
      min: [0, 'Stock count cannot be negative'],
      default: 0,
    },
    unitsSold: {
      type: Number,
      min: [0, 'units sold cannot be negative'],
      default: 0,
    },
    variants: [ProductVariantSchema],
    specifications: {
      type: [SpecificationSchema],
      default: []
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isSale: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      unique: true,
    },

  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Middleware to generate slug
ProductSchema.pre('save', function () {
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name)
  }
});

// Indexes for better query performance
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ price: 1 });
ProductSchema.index({ rating: -1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ isFeatured: 1, isNewArrival: 1, isSale: 1 });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;