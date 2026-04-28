import dbConnect from "../db/connection";
import Category from "../db/models/Category";
import { PipelineStage } from 'mongoose'

export async function getLeafCategories() {
  await dbConnect()

  const pipeline: PipelineStage[] = [
    { $match: { isActive: true } },

    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: 'parent',
        as: 'children',
      },
    },

    {
      $match: {
        children: { $size: 0 },
      },
    },

    {
      $project: {
        _id: { $toString: '$_id' },
        name: 1,
        parent: {
          $cond: [
            { $ifNull: ['$parent', false] },
            { $toString: '$parent' },
            null,
          ],
        },
        ancestors:
        {
          $map: {
            input: '$ancestors',
            as: 'ancestor',
            in: '$$ancestor.name'
          }
        },
      },
    },

    // Optional sorting
    { $sort: { sortOrder: 1, name: 1 } },
  ]

  return Category.aggregate(pipeline)
}
