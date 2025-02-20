//@ts-check

import { INVALID_INPUT_ERR_CODE, NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE } from "@/global/utils/constant";
import { createSlug, HttpError } from "@/global/utils/functions";
import { Validator } from "node-input-validator";
import projectModel from "../project/project.model";
import serviceModel from "../service/service.model";
import instanceModel from "./instance.model";
import instanceBeatModel from "./instance.beat.model";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types

export const createInstance = async (params) => {
  const v = new Validator(params, {
    slug: "required|string",
    project: "require|string",
    service: "require|string"
  });

  let match = await v.check();
  if (!match) {
    throw HttpError(INVALID_INPUT_ERR_CODE, v.errors);
  }

  const testData = await instanceModel.findOne({
    project: new ObjectId(params?.project),
    service: new ObjectId(params?.service),
    slug: createSlug(params?.slug),
  })

  if (testData) {
    return testData?.toJSON()
  }

  const project = await projectModel.findById(params?.project)
  if (!project) {
    throw HttpError(NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE)
  }

  const service = await serviceModel.findById(params?.service)
  if (!service || (service?.project && service?.project?.toString() !== project?._id?.toString())) {
    throw HttpError(NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE)
  }

  const raw = await instanceModel.create({
    project: project?._id,
    service: service._id,
    slug: createSlug(params?.slug),
  })

  return raw?.toJSON()

}

export const removeInstance = async (slug) => {

  const raw = await instanceModel.findOne({ slug })
  if (!raw) {
    throw HttpError(NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE)
  }

  await instanceModel.findByIdAndDelete(raw?._id?.toString())

  return null

}

export const registerBeat = async (id) => {

  await instanceBeatModel.create({
    instance: new ObjectId(id?.toString())
  })

  return null

}

const buildInstanceSearchQuery = (params) => {

  let query = {}

  if (params?.project) {
    query.project = new ObjectId(params?.project?.toString())
  }

  if (params?.service) {
    query.service = new ObjectId(params?.service?.toString())
  }

  return query
}

export const listInstance = async (query) => {
  const queryParams = buildInstanceSearchQuery(query)

  const list = await instanceModel.aggregate([
    {
      $match: queryParams
    },
    {
      $lookup: {
        from: "instancebeats",
        let: { instanceId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$instance", "$$instanceId"] },
              createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) } // Only last 1 hour
            }
          },
          {
            $facet: {
              perMinute: [
                {
                  $project: {
                    minute: { $dateToString: { format: "%Y-%m-%d %H:%M", date: "$createdAt" } }
                  }
                },
                {
                  $group: {
                    _id: "$minute",
                    beatCount: { $sum: 1 }
                  }
                },
                { $sort: { "_id": 1 } }
              ],
              lastBeat: [
                { $sort: { createdAt: -1 } },
                { $limit: 1 },
                { $project: { lastBeatAt: "$createdAt" } }
              ]
            }
          },
          {
            $project: {
              beatsPerMinute: "$perMinute",
              lastBeatAt: { $arrayElemAt: ["$lastBeat.lastBeatAt", 0] }
            }
          }
        ],
        as: "beatData"
      }
    },
    {
      $addFields: {
        beatsPerMinute: { $arrayElemAt: ["$beatData.beatsPerMinute", 0] },
        lastBeatAt: { $arrayElemAt: ["$beatData.lastBeatAt", 0] },
        totalBeats: { $sum: { $map: { input: { $arrayElemAt: ["$beatData.beatsPerMinute", 0] }, as: "b", in: "$$b.beatCount" } } },
        averageBeatsPerMinute: {
          $cond: [
            { $gt: [{ $size: { $arrayElemAt: ["$beatData.beatsPerMinute", 0] } }, 0] },
            {
              $divide: [
                { $sum: { $map: { input: { $arrayElemAt: ["$beatData.beatsPerMinute", 0] }, as: "b", in: "$$b.beatCount" } } },
                { $size: { $arrayElemAt: ["$beatData.beatsPerMinute", 0] } }
              ]
            },
            0
          ]
        }
      }
    },
    {
      $project: {
        _id: 0,
        instanceId: "$_id",
        instanceSlug: "$slug",
        instanceCreatedAt: "$createdAt",
        beatsPerMinute: 1,
        totalBeats: 1,
        averageBeatsPerMinute: 1,
        lastBeatAt: 1
      }
    }

  ])

  return list?.map((n) => {
    return {
      id: n?.instanceId?.toString(),
      slug: n?.instanceSlug,
      createdAt: n?.instanceCreatedAt,
      bpm: n?.beatsPerMinute,
      avg: n?.averageBeatsPerMinute,
      lastBeatAt: n?.lastBeatAt
    }
  })

}