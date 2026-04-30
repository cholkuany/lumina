import mongoose, { Schema, Model } from 'mongoose'
import { slugify } from '@/lib/utils'

const ancestorSchema = new Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    name: { type: String, required: true },
    slug: { type: String, required: true },
  },
  { _id: false }
)

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [100, 'Category name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    image: {
      type: String,
      trim: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    ancestors: {
      type: [ancestorSchema], default: []
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    productCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret): CategoryJSON => {
        const { _id, __v, ancestors, ...rest } = ret

        return {
          ...rest,
          id: _id.toString(),
          ancestors: ancestors.map(a => ({
            _id: a._id,
            name: a.name,
            slug: a.slug,
          })),
        }
      },
    },
    toObject: { virtuals: true },
  }
)


// Indexes
categorySchema.index({ parent: 1 })
categorySchema.index({ 'ancestors._id': 1 })
categorySchema.index({ isActive: 1, sortOrder: 1 })

// Generate slug before saving
categorySchema.pre('save', async function () {
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name)

    // Ensure unique slug
    const existingCategory = await mongoose.models.Category.findOne({
      slug: this.slug,
      _id: { $ne: this._id },
    })

    if (existingCategory) {
      this.slug = `${this.slug}-${Date.now()}`
    }
  }
})

// Build ancestors array before saving
categorySchema.pre('save', async function () {
  if (this.isModified('parent')) {
    if (this.parent) {
      // const parentCategory: ICategory | null = await mongoose.models.Category.findById(this.parent)
      const parentCategory = await mongoose.models.Category.findById(this.parent).lean()
      if (parentCategory) {
        this.set('ancestors', [
          ...(parentCategory.ancestors ?? []),
          {
            _id: parentCategory._id,
            name: parentCategory.name,
            slug: parentCategory.slug,
          },
        ])

      }
    } else {
      this.set('ancestors', [])
    }
  }
})

export interface ICategoryAncestor {
  _id: mongoose.Types.ObjectId
  name: string
  slug: string
}

export interface ICategory {
  name: string
  slug: string
  description?: string
  image?: string
  parent: mongoose.Types.ObjectId | ICategory | null
  ancestors: ICategoryAncestor[]
  isActive: boolean
  sortOrder: number
  productCount: number
  createdAt: Date
  updatedAt: Date
}

type CategoryJSON = {
  id: string
  name: string
  slug?: string | null
  description?: string | null
  image?: string | null
  parent?: mongoose.Types.ObjectId | null
  ancestors: ICategoryAncestor[]
  isActive: boolean
  sortOrder: number
  productCount: number
  createdAt?: Date
  updatedAt?: Date
}



const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema)

export default Category