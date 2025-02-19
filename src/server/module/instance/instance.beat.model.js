//@ts-check
import mongoose from "../../utils/mongoose";
import { toJSON, paginate } from "../../utils/mongoose/plugins";

const { ObjectId } = mongoose.Schema.Types;

const InstanceBeatSchema = new mongoose.Schema(
    {
        instance: {
            type: ObjectId,
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

InstanceBeatSchema.index(
    { createdAt: 1 },
    { expireAfterSeconds: 60 * 60 }
);
InstanceBeatSchema.index({ updatedAt: 1 });

// add plugin that converts mongoose to json
InstanceBeatSchema.plugin(toJSON);
InstanceBeatSchema.plugin(paginate);

export default mongoose.models.InstanceBeat ||
    mongoose.model("InstanceBeat", InstanceBeatSchema);
