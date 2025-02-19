//@ts-check
import mongoose from "../../utils/mongoose";
import { toJSON, paginate } from "../../utils/mongoose/plugins";

const { ObjectId, String } = mongoose.Schema.Types;

const InstanceSchema = new mongoose.Schema(
    {
        project: {
            type: ObjectId,
            required: true,
            index: true,
        },
        service: {
            type: ObjectId,
            required: true,
            index: true,
        },
        slug: {
            type: String,
            required: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

InstanceSchema.index({ createdAt: 1 });
InstanceSchema.index({ updatedAt: 1 });
InstanceSchema.index({ project: 1, service: 1, slug: 1 }, { unique: true })

// add plugin that converts mongoose to json
InstanceSchema.plugin(toJSON);
InstanceSchema.plugin(paginate);

export default mongoose.models.Instance ||
    mongoose.model("Instance", InstanceSchema);
