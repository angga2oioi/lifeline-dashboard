//@ts-check

import { INVALID_INPUT_ERR_CODE, NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE } from "@/global/utils/constant";
import { createSlug, HttpError, num2Int } from "@/global/utils/functions";
import { Validator } from "node-input-validator";
import projectModel from "../project/project.model";
import serviceModel from "../service/service.model";
import instanceModel from "./instance.model";
import instanceBeatModel from "./instance.beat.model";
import mongoose from "mongoose";
import instanceMetricsModel from "./instance.metrics.model";
const { ObjectId } = mongoose.Types

export const createInstance = async (params) => {
  const v = new Validator(params, {
    project: "required|string",
    serviceId: "required|string",
    instanceId: "required|string"
  });

  let match = await v.check();
  if (!match) {
    throw HttpError(INVALID_INPUT_ERR_CODE, v.errors);
  }

  const payload = {
    project: new ObjectId(params?.project),
    service: new ObjectId(params?.serviceId),
    slug: createSlug(params?.instanceId),
  }

  const raw = await instanceModel.findOneAndUpdate(payload, { $set: payload }, { upsert: true })

  return raw?.toJSON()

}

export const removeInstance = async (id) => {

  const raw = await instanceModel.findById(id)
  if (!raw) {
    throw HttpError(NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE)
  }

  await instanceModel.findByIdAndDelete(raw?._id?.toString())

  return null

}

export const findInstanceById = async (id) => {

  const raw = await instanceModel.findById(id)
  if (!raw) {
    throw HttpError(NOT_FOUND_ERR_CODE, NOT_FOUND_ERR_MESSAGE)
  }

  return raw?.toJSON()

}

export const registerBeat = async (id) => {

  await instanceBeatModel.create({
    instance: new ObjectId(id?.toString())
  })

  return null

}

export const registerInstanceMetrics = async (params) => {
  if (!params?.slug) {
    return null
  }

  await instanceMetricsModel.findOneAndUpdate({
    slug: params?.slug
  }, {
    $set: { ...params }
  }, { upsert: true })

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

  if (params?.instance) {
    query._id = new ObjectId(params?.instance?.toString())
  }

  return query
}

export const listInstance = async (query) => {
  const queryParams = buildInstanceSearchQuery(query)
  let list = await instanceModel.find(queryParams)

  return list?.map((n) => {
    return {
      id: n?.id,
      slug: n?.slug,
      project: n?.project?.toString(),
      service: n?.service?.toString(),
      createdAt: n?.createdAt,
    }
  })
}

export const getInstanceStatuses = async (instance) => {
  const queryParams = buildInstanceSearchQuery({ instance })

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
              createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) } // Last 1 hour
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
              ],
              lastMinuteBeats: [
                {
                  $match: {
                    createdAt: { $gte: new Date(Date.now() - 60 * 1000) } // Last 1 minute
                  }
                },
                {
                  $group: {
                    _id: null,
                    beatsLastMinute: { $sum: 1 }
                  }
                }
              ]
            }
          },
          {
            $project: {
              beatsPerMinute: "$perMinute",
              lastBeatAt: { $arrayElemAt: ["$lastBeat.lastBeatAt", 0] },
              beatsLastMinute: { $ifNull: [{ $arrayElemAt: ["$lastMinuteBeats.beatsLastMinute", 0] }, 0] }
            }
          }
        ],
        as: "beatData"
      }
    },

    {
      $lookup: {
        from: "events",
        let: { instanceId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$instance", "$$instanceId"] }
            }
          },
          {
            $count: "totalEvents"
          }
        ],
        as: "eventData"
      }
    },
    {
      $addFields: {
        beatsPerMinute: { $arrayElemAt: ["$beatData.beatsPerMinute", 0] },
        lastBeatAt: { $arrayElemAt: ["$beatData.lastBeatAt", 0] },
        beatsLastMinute: { $arrayElemAt: ["$beatData.beatsLastMinute", 0] },
        totalBeats: {
          $sum: {
            $map: {
              input: { $arrayElemAt: ["$beatData.beatsPerMinute", 0] },
              as: "b",
              in: "$$b.beatCount"
            }
          }
        },
        averageBeatsPerMinute: {
          $cond: [
            { $gt: [{ $size: { $arrayElemAt: ["$beatData.beatsPerMinute", 0] } }, 0] },
            {
              $divide: [
                {
                  $sum: {
                    $map: {
                      input: { $arrayElemAt: ["$beatData.beatsPerMinute", 0] },
                      as: "b",
                      in: "$$b.beatCount"
                    }
                  }
                },
                { $size: { $arrayElemAt: ["$beatData.beatsPerMinute", 0] } }
              ]
            },
            0
          ]
        },
        totalEvents: { $ifNull: [{ $arrayElemAt: ["$eventData.totalEvents", 0] }, 0] }
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
        lastBeatAt: 1,
        beatsLastMinute: 1,
        totalEvents: 1
      }
    }
  ]
  )

  return list?.map((n) => {
    return {
      id: n?.instanceId?.toString(),
      slug: n?.instanceSlug,
      createdAt: n?.instanceCreatedAt,
      bpm: n?.beatsPerMinute?.map((n) => {
        return {
          time: n?._id,
          beats: n?.beatCount
        }
      }),
      avg: num2Int(n?.averageBeatsPerMinute),
      lastBeatAt: n?.lastBeatAt,
      lasMinuteBeat: n?.beatsLastMinute,
      totalEvents: n?.totalEvents
    }
  })?.[0]

}

export const listInstanceMetrics = async (slug) => {

  let logs = await instanceMetricsModel.find({ slug })

  return logs?.map((n) => {
    return n?.metrics
  })

}

export const getCurrentInstanceMetrics = async (slug) => {

  const current = await instanceMetricsModel.findOne({ slug }).sort({ createdAt: -1 }).exec();
  return current?.metrics;

}