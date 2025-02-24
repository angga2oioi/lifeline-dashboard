//@ts-check
import mongoose from "../../utils/mongoose";
import { toJSON, paginate,aggregatePaginate } from "../../utils/mongoose/plugins";

const { String, ObjectId } = mongoose.Schema.Types;

const EventSchema = new mongoose.Schema(
    {
        instance: {
            type: ObjectId,
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

EventSchema.index(
    { createdAt: 1 },
    { expireAfterSeconds: 60 * 60 }
);
EventSchema.index({ updatedAt: 1 });

// add plugin that converts mongoose to json
EventSchema.plugin(toJSON);
EventSchema.plugin(paginate);
EventSchema.plugin(aggregatePaginate);

export default mongoose.models.Event ||
    mongoose.model("Event", EventSchema);
